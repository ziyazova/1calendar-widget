// Supabase Edge Function: polar-customer-portal
//
// Returns a Polar customer-portal URL for the signed-in user, so the
// in-app "Cancel or manage subscription" button actually lands them on
// their own subscription (not the polar.sh marketing homepage).
//
// Deploy: supabase functions deploy polar-customer-portal
//
// Secrets reused from polar-checkout:
//   POLAR_ACCESS_TOKEN   — server-side API token
//   SUPABASE_URL         — auto-provided
//   SUPABASE_ANON_KEY    — auto-provided
//
// Invoke from the client:
//   const { data } = await supabase.functions.invoke('polar-customer-portal');
//   if (data?.url) window.open(data.url, '_blank', 'noopener,noreferrer');
//
// Response:
//   200 { url: "https://polar.sh/..." }
//   404 { error: "no_customer" } — user never checked out, so no portal exists

// @ts-expect-error — esm.sh imports resolved by Supabase Edge Runtime.
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const Deno: any;

const CORS_HEADERS: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS_HEADERS });
  if (req.method !== 'POST') return json({ error: 'method_not_allowed' }, 405);

  const POLAR_ACCESS_TOKEN = Deno.env.get('POLAR_ACCESS_TOKEN');
  if (!POLAR_ACCESS_TOKEN) return json({ error: 'missing_env' }, 500);

  // Verify the caller + find their Polar customer id on their profile row.
  const authHeader = req.headers.get('Authorization') ?? '';
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_ANON_KEY')!,
    { global: { headers: { Authorization: authHeader } } },
  );
  const { data: { user }, error: userErr } = await supabase.auth.getUser();
  if (userErr || !user) return json({ error: 'unauthorized' }, 401);

  const { data: profile, error: profileErr } = await supabase
    .from('profiles')
    .select('polar_customer_id')
    .eq('id', user.id)
    .maybeSingle();

  if (profileErr) return json({ error: 'profile_lookup_failed' }, 500);
  if (!profile?.polar_customer_id) return json({ error: 'no_customer' }, 404);

  // Ask Polar for a fresh customer session — the returned URL is a signed,
  // short-lived link straight to the user's portal (no extra login needed).
  const polarRes = await fetch('https://api.polar.sh/v1/customer-sessions/', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${POLAR_ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ customer_id: profile.polar_customer_id }),
  });

  if (!polarRes.ok) {
    const detail = await polarRes.text();
    console.error('[customer-portal] Polar error', polarRes.status, detail);
    return json({ error: 'polar_failed', detail }, 502);
  }

  const polarData = await polarRes.json();
  // Polar returns { customer_portal_url } or { url } depending on API version.
  const url = polarData.customer_portal_url ?? polarData.url;
  if (!url) {
    console.error('[customer-portal] Polar response missing url', polarData);
    return json({ error: 'polar_response_invalid' }, 502);
  }

  return json({ url });
});

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
  });
}
