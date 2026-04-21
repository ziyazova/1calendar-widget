// Supabase Edge Function: polar-checkout
//
// Creates a Polar checkout session for the signed-in user and returns the
// hosted checkout URL. The frontend then redirects the browser there.
//
// Deploy: supabase functions deploy polar-checkout --no-verify-jwt=false
// Secrets needed:
//   POLAR_ACCESS_TOKEN   — server-side API token (polar.sh → API tokens)
//   POLAR_PRO_PRICE_ID   — id of the $4/mo subscription price
//   APP_BASE_URL         — e.g. https://1calendar-widget-aliias-projects-37358320.vercel.app
//
// Invoke from the client:
//   const { data, error } = await supabase.functions.invoke('polar-checkout', { body: {} });
//   if (data?.url) window.location.href = data.url;

// @ts-expect-error — esm.sh imports resolved by Supabase Edge Runtime (Deno).
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const Deno: any;

const CORS_HEADERS: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: CORS_HEADERS });
  }
  if (req.method !== 'POST') {
    return json({ error: 'method_not_allowed' }, 405);
  }

  const POLAR_ACCESS_TOKEN = Deno.env.get('POLAR_ACCESS_TOKEN');
  // POLAR_PRO_PRICE_ID is the default product (Pro subscription) — used when
  // the caller doesn't pass an explicit productId. Template checkouts pass
  // their own id in the request body.
  const POLAR_PRO_ID = Deno.env.get('POLAR_PRO_PRICE_ID');
  const APP_BASE_URL = Deno.env.get('APP_BASE_URL');
  // POLAR_API_URL lets us swap between production and sandbox without a code
  // change. Defaults to prod. For sandbox testing set it to
  // `https://sandbox-api.polar.sh` and also swap to a sandbox access token.
  const POLAR_API_URL = (Deno.env.get('POLAR_API_URL') ?? 'https://api.polar.sh').replace(/\/$/, '');
  if (!POLAR_ACCESS_TOKEN || !APP_BASE_URL) {
    return json({ error: 'missing_env' }, 500);
  }

  // Optional productId + successPath override from the client body. Falls back
  // to the subscription product for backwards compat.
  let body: { productId?: string; successPath?: string } = {};
  try {
    const raw = await req.text();
    if (raw) body = JSON.parse(raw);
  } catch { /* empty body is fine */ }

  const productId = body.productId ?? POLAR_PRO_ID;
  if (!productId) return json({ error: 'missing_product_id' }, 400);

  const isSubscription = productId === POLAR_PRO_ID;

  // Subscriptions require auth (we need the Supabase user to bind the
  // plan to). One-time template purchases allow guests — Polar collects
  // an email on its checkout page, the webhook records the purchase by
  // email, and the account linkage happens later if the buyer signs up.
  const authHeader = req.headers.get('Authorization') ?? '';
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_ANON_KEY')!,
    { global: { headers: { Authorization: authHeader } } },
  );
  const { data: { user } } = await supabase.auth.getUser();
  if (isSubscription && !user) return json({ error: 'unauthorized' }, 401);

  // Default success path: subscription returns to Settings with ?upgraded=1;
  // template purchases return to /studio?purchased=<productId>.
  const defaultSuccessPath = isSubscription ? '/settings?upgraded=1' : `/studio?purchased=${productId}`;
  const successPath = body.successPath ?? defaultSuccessPath;

  // Build metadata conditionally — Polar copies this through to the
  // subscription / order, and our webhook pulls user id + product id
  // back out from here.
  const metadata: Record<string, string> = { product_id: productId };
  if (user) metadata.supabase_user_id = user.id;

  // Ask Polar to open a checkout session. Pre-fill the email when we know
  // the signed-in user; otherwise Polar's checkout page will collect it.
  const polarRes = await fetch(`${POLAR_API_URL}/v1/checkouts/`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${POLAR_ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      products: [productId],
      ...(user?.email ? { customer_email: user.email } : {}),
      success_url: `${APP_BASE_URL}${successPath}`,
      metadata,
    }),
  });

  if (!polarRes.ok) {
    const text = await polarRes.text();
    console.error('[polar-checkout] Polar error', polarRes.status, text);
    return json({ error: 'polar_failed', detail: text }, 502);
  }

  const polarData = await polarRes.json();
  return json({ url: polarData.url });
});

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
  });
}
