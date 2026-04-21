// Supabase Edge Function: polar-list-products
//
// One-shot helper: fetches every product from the Polar organisation tied
// to POLAR_ACCESS_TOKEN and returns a compact JSON array. Used by the
// template sync workflow — run this once, copy the ids, paste them into
// `src/presentation/data/templates.ts` so the Buy buttons can create
// checkouts for the right product.
//
// Deploy: supabase functions deploy polar-list-products
// Invoke: open the function URL in a browser while logged in (JWT auth)
//   or call via `supabase.functions.invoke('polar-list-products')`.
//
// Secrets needed:
//   POLAR_ACCESS_TOKEN — server-side API token (polar.sh → Settings → API tokens)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const Deno: any;

const CORS_HEADERS: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: CORS_HEADERS });
  }

  const POLAR_ACCESS_TOKEN = Deno.env.get('POLAR_ACCESS_TOKEN');
  if (!POLAR_ACCESS_TOKEN) {
    return json({ error: 'missing_env POLAR_ACCESS_TOKEN' }, 500);
  }

  try {
    const res = await fetch('https://api.polar.sh/v1/products/?limit=100', {
      headers: {
        Authorization: `Bearer ${POLAR_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });
    if (!res.ok) {
      const text = await res.text();
      return json({ error: 'polar_failed', status: res.status, detail: text }, 502);
    }
    const data = await res.json();
    // Polar paginates as { items, pagination }. Return a trimmed shape:
    // everything needed to map a card to a product without leaking internals.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const products = (data.items ?? []).map((p: any) => ({
      id: p.id,
      name: p.name,
      description: p.description,
      is_recurring: p.is_recurring,
      is_archived: p.is_archived,
      prices: (p.prices ?? []).map((pr: any) => ({
        id: pr.id,
        amount_type: pr.amount_type,
        price_amount: pr.price_amount,
        price_currency: pr.price_currency,
        recurring_interval: pr.recurring_interval,
      })),
    }));
    return json({ count: products.length, products });
  } catch (e) {
    return json({ error: 'fetch_failed', detail: String(e) }, 500);
  }
});

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body, null, 2), {
    status,
    headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
  });
}
