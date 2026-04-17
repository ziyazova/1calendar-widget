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

// @ts-expect-error
import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';
// @ts-expect-error
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const Deno: any;

serve(async (req: Request) => {
  if (req.method !== 'POST') return new Response('method_not_allowed', { status: 405 });

  const POLAR_WEBHOOK_SECRET = Deno.env.get('POLAR_WEBHOOK_SECRET');
  if (!POLAR_WEBHOOK_SECRET) return new Response('missing_env', { status: 500 });

  const rawBody = await req.text();

  // Polar signs the payload with HMAC-SHA256. Header name is "Polar-Signature".
  // If the name changes in Polar docs, update here.
  const sigHeader = req.headers.get('Polar-Signature') ?? req.headers.get('polar-signature');
  if (!sigHeader) return new Response('missing_signature', { status: 401 });

  const expected = await hmacSha256Hex(POLAR_WEBHOOK_SECRET, rawBody);
  if (!timingSafeEqual(sigHeader, expected)) {
    console.warn('[polar-webhook] bad signature');
    return new Response('bad_signature', { status: 401 });
  }

  let event: PolarEvent;
  try {
    event = JSON.parse(rawBody);
  } catch {
    return new Response('bad_json', { status: 400 });
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  );

  try {
    switch (event.type) {
      case 'subscription.created':
      case 'subscription.updated':
        await applySubscription(supabase, event.data);
        break;
      case 'subscription.canceled':
      case 'subscription.revoked':
        await cancelSubscription(supabase, event.data);
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
    console.warn('[polar-webhook] no supabase_user_id in metadata; ignoring');
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

// ───────────────────── crypto helpers ─────────────────────

async function hmacSha256Hex(secret: string, message: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const mac = await crypto.subtle.sign('HMAC', key, enc.encode(message));
  return Array.from(new Uint8Array(mac)).map(b => b.toString(16).padStart(2, '0')).join('');
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return mismatch === 0;
}
