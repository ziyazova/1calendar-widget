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
  const POLAR_PRO_PRICE_ID = Deno.env.get('POLAR_PRO_PRICE_ID');
  const APP_BASE_URL = Deno.env.get('APP_BASE_URL');
  if (!POLAR_ACCESS_TOKEN || !POLAR_PRO_PRICE_ID || !APP_BASE_URL) {
    return json({ error: 'missing_env' }, 500);
  }

  // Verify the caller is authenticated (JWT in Authorization: Bearer …).
  const authHeader = req.headers.get('Authorization') ?? '';
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_ANON_KEY')!,
    { global: { headers: { Authorization: authHeader } } },
  );
  const { data: { user }, error: userErr } = await supabase.auth.getUser();
  if (userErr || !user) return json({ error: 'unauthorized' }, 401);

  // Ask Polar to open a checkout session. The metadata field survives to the
  // webhook, which is how we link the Polar customer back to the Supabase user.
  const polarRes = await fetch('https://api.polar.sh/v1/checkouts/', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${POLAR_ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      product_price_id: POLAR_PRO_PRICE_ID,
      customer_email: user.email,
      success_url: `${APP_BASE_URL}/settings?upgraded=1`,
      metadata: {
        supabase_user_id: user.id,
      },
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
