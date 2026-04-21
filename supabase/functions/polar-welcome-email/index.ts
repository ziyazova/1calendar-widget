// Supabase Edge Function: polar-welcome-email
//
// Sends the transactional welcome email after a new Pro subscription is
// created. Invoked by `polar-webhook` immediately after it writes the
// profile row on `subscription.created`. Idempotent: re-invocations on
// webhook retry are no-ops because we stamp `welcome_email_sent_at`.
//
// Deploy: supabase functions deploy polar-welcome-email
//   (JWT verify stays on — caller must use the service-role key)
//
// Secrets needed:
//   RESEND_API_KEY            — from resend.com → API Keys
//   RESEND_FROM               — e.g. "Peachy Studio <no-reply@peachy.studio>"
//                               must be a Resend-verified sender
//   APP_BASE_URL              — public site URL (same value the checkout uses)
//   SUPABASE_URL              — auto-provided
//   SUPABASE_SERVICE_ROLE_KEY — auto-provided
//
// Request body:
//   { "userId": "<auth.users.id>" }
//
// Response:
//   200 { sent: true }              — email was sent
//   200 { skipped: "already_sent" } — idempotent no-op
//   4xx/5xx { error: "..." }

// @ts-expect-error — esm.sh imports are resolved by Supabase Edge Runtime.
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const Deno: any;

interface InvokeBody {
  userId?: string;
}

Deno.serve(async (req: Request) => {
  if (req.method !== 'POST') return json({ error: 'method_not_allowed' }, 405);

  const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
  const RESEND_FROM = Deno.env.get('RESEND_FROM');
  const APP_BASE_URL = Deno.env.get('APP_BASE_URL');
  if (!RESEND_API_KEY || !RESEND_FROM || !APP_BASE_URL) {
    return json({ error: 'missing_env' }, 500);
  }

  let body: InvokeBody;
  try {
    body = await req.json();
  } catch {
    return json({ error: 'bad_json' }, 400);
  }
  const userId = body.userId;
  if (!userId) return json({ error: 'missing_user_id' }, 400);

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  );

  // Pull profile first — gives us idempotency + the billing date for the copy.
  const { data: profile, error: profileErr } = await supabase
    .from('profiles')
    .select('welcome_email_sent_at, current_period_end, subscription_status')
    .eq('id', userId)
    .maybeSingle();

  if (profileErr) {
    console.error('[welcome-email] profile fetch failed', profileErr);
    return json({ error: 'profile_lookup_failed' }, 500);
  }
  if (!profile) return json({ error: 'profile_not_found' }, 404);
  if (profile.welcome_email_sent_at) {
    return json({ skipped: 'already_sent' });
  }

  const { data: userRes, error: userErr } = await supabase.auth.admin.getUserById(userId);
  if (userErr || !userRes?.user?.email) {
    console.error('[welcome-email] user lookup failed', userErr);
    return json({ error: 'user_not_found' }, 404);
  }
  const email = userRes.user.email;

  const renewalDate = formatDate(profile.current_period_end);
  const { subject, html, text } = renderWelcome({
    appBaseUrl: APP_BASE_URL,
    renewalDate,
    supportEmail: 'ziyazovaa@gmail.com',
  });

  const resendRes = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: RESEND_FROM,
      to: [email],
      reply_to: 'ziyazovaa@gmail.com',
      subject,
      html,
      text,
    }),
  });

  if (!resendRes.ok) {
    const detail = await resendRes.text();
    console.error('[welcome-email] resend failed', resendRes.status, detail);
    return json({ error: 'resend_failed', detail }, 502);
  }

  const { error: stampErr } = await supabase
    .from('profiles')
    .update({ welcome_email_sent_at: new Date().toISOString() })
    .eq('id', userId);
  if (stampErr) {
    // The email went out; losing the stamp just means we might retry next
    // webhook — Resend deduplicates less strictly than we'd like, so log it.
    console.warn('[welcome-email] failed to stamp welcome_email_sent_at', stampErr);
  }

  return json({ sent: true });
});

// ───────────────────── template ─────────────────────

interface WelcomeTemplateArgs {
  appBaseUrl: string;
  renewalDate: string; // already formatted or ''
  supportEmail: string;
}

function renderWelcome({ appBaseUrl, renewalDate, supportEmail }: WelcomeTemplateArgs) {
  const subject = 'Welcome to Peachy Pro';
  const settingsUrl = `${appBaseUrl}/settings#subscription`;
  const termsUrl = `${appBaseUrl}/terms`;
  const refundUrl = `${appBaseUrl}/refund`;
  const privacyUrl = `${appBaseUrl}/privacy`;

  const nextBillingLine = renewalDate
    ? `Your next renewal is on <strong>${renewalDate}</strong> for $4 (or local equivalent). We'll email you a reminder three days before.`
    : `Your subscription renews monthly at $4 until you cancel. We'll email you a reminder three days before each renewal.`;

  const nextBillingText = renewalDate
    ? `Your next renewal is on ${renewalDate} for $4 (or local equivalent). We'll email you a reminder three days before.`
    : `Your subscription renews monthly at $4 until you cancel. We'll email you a reminder three days before each renewal.`;

  const html = `<!doctype html>
<html><body style="margin:0;padding:0;background:#F7F7F5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Inter,sans-serif;color:#1C1C1E;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F7F7F5;padding:32px 16px;">
    <tr><td align="center">
      <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;background:#FFFFFF;border-radius:16px;padding:40px 32px;">
        <tr><td>
          <h1 style="margin:0 0 16px;font-size:24px;font-weight:600;letter-spacing:-0.02em;">Welcome to Peachy Pro</h1>
          <p style="margin:0 0 16px;font-size:15px;line-height:1.55;color:#3C3C43;">Thanks for subscribing. Your account has been upgraded — unlimited widgets, all styles, and full customization are now unlocked.</p>
          <p style="margin:0 0 24px;font-size:15px;line-height:1.55;color:#3C3C43;">${nextBillingLine}</p>

          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0;"><tr><td>
            <a href="${appBaseUrl}/studio" style="display:inline-block;padding:12px 20px;background:#1C1C1E;color:#FFFFFF;text-decoration:none;border-radius:10px;font-size:14px;font-weight:500;">Open Studio</a>
          </td></tr></table>

          <h2 style="margin:32px 0 12px;font-size:14px;font-weight:600;letter-spacing:-0.01em;color:#1C1C1E;">Managing your subscription</h2>
          <p style="margin:0 0 8px;font-size:14px;line-height:1.55;color:#3C3C43;">You can cancel anytime from <a href="${settingsUrl}" style="color:#6E7FF2;text-decoration:none;">your Settings page</a>, which links you to the Polar customer portal. Cancellation stops future billing; your Pro access stays active until the end of the period you've already paid for.</p>

          <h2 style="margin:32px 0 12px;font-size:14px;font-weight:600;letter-spacing:-0.01em;color:#1C1C1E;">Receipts &amp; billing</h2>
          <p style="margin:0 0 8px;font-size:14px;line-height:1.55;color:#3C3C43;">Payments are processed by Polar Software Inc. (Merchant of Record). Your card statement will read <code style="font-family:ui-monospace,SFMono-Regular,monospace;font-size:13px;">POLAR*PEACHY</code> or similar. Polar emails each receipt directly.</p>

          <h2 style="margin:32px 0 12px;font-size:14px;font-weight:600;letter-spacing:-0.01em;color:#1C1C1E;">Right of withdrawal</h2>
          <p style="margin:0 0 8px;font-size:14px;line-height:1.55;color:#3C3C43;">At checkout you asked us to start Pro access immediately and consented to waive the 14-day EU withdrawal right. If you change your mind, see our <a href="${refundUrl}" style="color:#6E7FF2;text-decoration:none;">Refund policy</a> for the goodwill window and how to get in touch.</p>

          <p style="margin:32px 0 8px;font-size:13px;line-height:1.55;color:#6E6E73;">Need help? Reply to this email or write to <a href="mailto:${supportEmail}" style="color:#6E7FF2;text-decoration:none;">${supportEmail}</a>.</p>
          <p style="margin:16px 0 0;font-size:12px;line-height:1.55;color:#8E8E93;">
            <a href="${termsUrl}" style="color:#8E8E93;text-decoration:none;">Terms</a> ·
            <a href="${refundUrl}" style="color:#8E8E93;text-decoration:none;">Refund</a> ·
            <a href="${privacyUrl}" style="color:#8E8E93;text-decoration:none;">Privacy</a>
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;

  const text = [
    'Welcome to Peachy Pro',
    '',
    'Thanks for subscribing. Your account has been upgraded — unlimited widgets, all styles, and full customization are now unlocked.',
    '',
    nextBillingText,
    '',
    `Open Studio: ${appBaseUrl}/studio`,
    '',
    'Managing your subscription',
    `Cancel anytime from Settings: ${settingsUrl}. Cancellation stops future billing; Pro access continues until the end of the paid period.`,
    '',
    'Receipts & billing',
    'Payments are processed by Polar Software Inc. (Merchant of Record). Your card statement will read POLAR*PEACHY or similar. Polar emails each receipt directly.',
    '',
    'Right of withdrawal',
    `At checkout you asked us to start Pro access immediately and consented to waive the 14-day EU withdrawal right. Refund policy: ${refundUrl}`,
    '',
    `Need help? Reply to this email or write to ${supportEmail}.`,
    '',
    `Terms: ${termsUrl}`,
    `Refund: ${refundUrl}`,
    `Privacy: ${privacyUrl}`,
  ].join('\n');

  return { subject, html, text };
}

function formatDate(iso: string | null | undefined): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
