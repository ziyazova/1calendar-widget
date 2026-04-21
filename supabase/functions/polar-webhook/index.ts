// Supabase Edge Function: polar-webhook
//
// Receives subscription events from Polar.sh and mirrors the subscription
// state into public.profiles (is_pro, polar_customer_id, polar_subscription_id,
// subscription_status, current_period_end).
//
// Deploy: supabase functions deploy polar-webhook --no-verify-jwt=true
//   (public — Polar hits this with its own HMAC, not a Supabase JWT)
//
// Secrets needed:
//   POLAR_WEBHOOK_SECRET      — generated in polar.sh → webhooks
//   SUPABASE_URL              — auto-provided
//   SUPABASE_SERVICE_ROLE_KEY — auto-provided; writes bypass RLS
//
// Point Polar webhooks at:
//   https://<project-ref>.supabase.co/functions/v1/polar-webhook
// Subscribe to at minimum: subscription.created, subscription.updated,
// subscription.canceled, subscription.revoked.

// @ts-expect-error — Deno edge function: esm.sh URL imports have no TS types
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
// @ts-expect-error — Deno edge function: esm.sh URL imports have no TS types
import { Webhook } from 'https://esm.sh/standardwebhooks@1.0.0';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const Deno: any;

Deno.serve(async (req: Request) => {
  if (req.method !== 'POST') return new Response('method_not_allowed', { status: 405 });

  const POLAR_WEBHOOK_SECRET = Deno.env.get('POLAR_WEBHOOK_SECRET');
  if (!POLAR_WEBHOOK_SECRET) return new Response('missing_env', { status: 500 });

  const rawBody = await req.text();

  // Polar uses the Standard Webhooks spec (webhook-id / webhook-timestamp /
  // webhook-signature). Polar dashboard issues secrets with a `polar_whs_`
  // prefix; the standardwebhooks library expects `whsec_<base64>`, so rewrite
  // the prefix before handing it to the verifier.
  const normalizedSecret = POLAR_WEBHOOK_SECRET.startsWith('polar_whs_')
    ? `whsec_${POLAR_WEBHOOK_SECRET.slice('polar_whs_'.length)}`
    : POLAR_WEBHOOK_SECRET;

  let event: PolarEvent;
  try {
    const wh = new Webhook(normalizedSecret);
    event = wh.verify(rawBody, {
      'webhook-id': req.headers.get('webhook-id') ?? '',
      'webhook-timestamp': req.headers.get('webhook-timestamp') ?? '',
      'webhook-signature': req.headers.get('webhook-signature') ?? '',
    }) as PolarEvent;
  } catch (e) {
    const headers: Record<string, string> = {};
    req.headers.forEach((v, k) => { headers[k] = v; });
    console.warn('[polar-webhook] signature verification failed', e, 'headers:', JSON.stringify(headers));
    return new Response('bad_signature', { status: 401 });
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  );

  try {
    switch (event.type) {
      case 'subscription.created':
        await applySubscription(supabase, event.data);
        // Fire-and-forget welcome email. Failures here must not fail the
        // webhook — Polar would retry and double-book the subscription
        // state. The welcome endpoint itself is idempotent via
        // `welcome_email_sent_at`, so a missed invoke is recoverable by a
        // retry on the next Polar event or a manual call.
        await sendWelcomeEmail(supabase, event.data);
        break;
      case 'subscription.updated':
        await applySubscription(supabase, event.data);
        break;
      case 'subscription.canceled':
      case 'subscription.revoked':
        await cancelSubscription(supabase, event.data);
        break;
      case 'order.created':
      case 'order.updated':
      case 'order.paid':
        // One-time template purchases land here. Subscription invoices
        // also produce order events — skip those (they carry a
        // subscription_id).
        await recordOrder(supabase, event.data as unknown as PolarOrder);
        break;
      default:
        // Ignore unknown event types — return 200 so Polar stops retrying.
        break;
    }
  } catch (e) {
    console.error('[polar-webhook] handler error', e);
    return new Response('handler_error', { status: 500 });
  }

  return new Response('ok', { status: 200 });
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function sendWelcomeEmail(supabase: any, sub: PolarSubscription) {
  const userId = extractUserId(sub);
  if (!userId) return;
  try {
    const { error } = await supabase.functions.invoke('polar-welcome-email', {
      body: { userId },
    });
    if (error) console.warn('[polar-webhook] welcome-email invoke error', error);
  } catch (e) {
    console.warn('[polar-webhook] welcome-email invoke threw', e);
  }
}

// ───────────────────── handlers ─────────────────────

interface PolarSubscription {
  id: string;
  status: string; // 'active' | 'trialing' | 'past_due' | 'canceled' | 'incomplete' | ...
  current_period_end?: string | null;
  customer_id?: string;
  metadata?: Record<string, string> | null;
  // Some Polar responses nest the supabase user id inside customer.metadata.
  customer?: { id?: string; metadata?: Record<string, string> | null };
}

interface PolarEvent {
  type: string;
  data: PolarSubscription;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function applySubscription(supabase: any, sub: PolarSubscription) {
  const userId = extractUserId(sub);
  if (!userId) {
    console.warn('[polar-webhook] no supabase_user_id in metadata; ignoring. Subscription payload:', JSON.stringify({
      id: sub.id,
      status: sub.status,
      customer_id: sub.customer_id,
      customer: sub.customer,
      metadata: sub.metadata,
    }));
    return;
  }
  const isActive = sub.status === 'active' || sub.status === 'trialing';
  const { error } = await supabase.from('profiles').update({
    is_pro: isActive,
    polar_customer_id: sub.customer_id ?? sub.customer?.id ?? null,
    polar_subscription_id: sub.id,
    subscription_status: sub.status,
    current_period_end: sub.current_period_end ?? null,
  }).eq('id', userId);
  if (error) throw error;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function cancelSubscription(supabase: any, sub: PolarSubscription) {
  const userId = extractUserId(sub);
  if (!userId) return;
  // Keep is_pro true until current_period_end (user paid for that time).
  // A daily cron could flip is_pro=false once the date passes; for now we
  // flip it immediately on 'revoked' and leave 'canceled' to ride out.
  const flip = sub.status === 'revoked';
  const { error } = await supabase.from('profiles').update({
    ...(flip ? { is_pro: false } : {}),
    subscription_status: sub.status,
    current_period_end: sub.current_period_end ?? null,
  }).eq('id', userId);
  if (error) throw error;
}

function extractUserId(sub: PolarSubscription): string | null {
  return (
    sub.metadata?.supabase_user_id
    ?? sub.customer?.metadata?.supabase_user_id
    ?? null
  );
}

// ───────────────────── one-time order handler ─────────────────────

interface PolarOrder {
  id: string;
  status?: string;                // 'paid' | 'refunded' | ...
  subscription_id?: string | null; // present for subscription invoice orders — skip those
  product_id?: string;
  amount?: number;                 // total amount in minor units (cents)
  currency?: string;
  customer_email?: string;
  customer?: { email?: string };
  metadata?: Record<string, string> | null;
  // Polar sometimes embeds the product inline:
  product?: { id?: string; name?: string };
  items?: Array<{ product_id?: string; product?: { id?: string; name?: string } }>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function recordOrder(supabase: any, order: PolarOrder) {
  // Skip subscription invoice orders — those are handled by the
  // `subscription.*` events and already update `profiles`.
  if (order.subscription_id) return;

  const email = order.customer_email ?? order.customer?.email;
  if (!email) {
    console.warn('[polar-webhook] order missing email, skipping', order.id);
    return;
  }

  const productId =
    order.metadata?.product_id
    ?? order.product_id
    ?? order.product?.id
    ?? order.items?.[0]?.product_id
    ?? order.items?.[0]?.product?.id
    ?? null;
  if (!productId) {
    console.warn('[polar-webhook] order missing product_id, skipping', order.id, order);
    return;
  }

  const productName = order.product?.name ?? order.items?.[0]?.product?.name ?? null;
  const userId = order.metadata?.supabase_user_id ?? null;
  const status = order.status === 'refunded' ? 'refunded' : 'paid';

  // Idempotent upsert on polar_order_id (unique constraint in the table).
  const { error } = await supabase.from('purchases').upsert({
    user_id: userId,
    email,
    polar_order_id: order.id,
    polar_product_id: productId,
    product_name: productName,
    amount_cents: order.amount ?? null,
    currency: order.currency ?? 'usd',
    status,
  }, { onConflict: 'polar_order_id' });

  if (error) {
    console.error('[polar-webhook] recordOrder upsert failed', error, order.id);
    throw error;
  }
}

