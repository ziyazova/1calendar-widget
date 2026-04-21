// Supabase Edge Function: polar-renewal-reminder
//
// Sweeps profiles for subscriptions whose `current_period_end` lands inside
// the next 2.5–3.5 day window and emails a renewal reminder. Designed to run
// once per day. Idempotent within a billing cycle via
// `last_renewal_reminder_sent_at`.
//
// Deploy: supabase functions deploy polar-renewal-reminder --no-verify-jwt=true
//   (the shared secret below replaces Supabase's JWT gate)
//
// Secrets needed:
//   RESEND_API_KEY            — from resend.com → API Keys
//   RESEND_FROM               — e.g. "Peachy Studio <no-reply@peachy.studio>"
//   APP_BASE_URL              — public site URL
//   CRON_SHARED_SECRET        — any long random string; scheduler must send it
//   SUPABASE_URL              — auto-provided
//   SUPABASE_SERVICE_ROLE_KEY — auto-provided
//
// Scheduler call:
//   POST /functions/v1/polar-renewal-reminder
//   Authorization: Bearer <CRON_SHARED_SECRET>
//
// Response:
//   200 { scanned: N, sent: M, errors: K }

// @ts-expect-error — esm.sh imports resolved by Supabase Edge Runtime.
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const Deno: any;

// Window we're looking for: subscriptions renewing in ~3 days.
// Symmetric half-day margin lets a daily cron catch each row exactly once
// even if its trigger time drifts slightly.
const WINDOW_START_HOURS = 60; // 2.5 days
const WINDOW_END_HOURS = 84;   // 3.5 days
// Dedup: once we've sent a reminder, wait this long before a new one is
// eligible. Longer than a monthly cycle means one reminder per renewal.
const DEDUP_WINDOW_DAYS = 20;

interface ProfileRow {
  id: string;
  current_period_end: string;
  last_renewal_reminder_sent_at: string | null;
}

Deno.serve(async (req: Request) => {
  if (req.method !== 'POST') return json({ error: 'method_not_allowed' }, 405);

  const secret = Deno.env.get('CRON_SHARED_SECRET');
  if (!secret) return json({ error: 'missing_env' }, 500);

  const auth = req.headers.get('Authorization') ?? '';
  const presented = auth.startsWith('Bearer ') ? auth.slice(7) : '';
  if (!presented || !timingSafeEqual(presented, secret)) {
    return json({ error: 'unauthorized' }, 401);
  }

  const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
  const RESEND_FROM = Deno.env.get('RESEND_FROM');
  const APP_BASE_URL = Deno.env.get('APP_BASE_URL');
  if (!RESEND_API_KEY || !RESEND_FROM || !APP_BASE_URL) {
    return json({ error: 'missing_env' }, 500);
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  );

  const windowStart = new Date(Date.now() + WINDOW_START_HOURS * 3600 * 1000).toISOString();
  const windowEnd = new Date(Date.now() + WINDOW_END_HOURS * 3600 * 1000).toISOString();
  const dedupCutoff = new Date(Date.now() - DEDUP_WINDOW_DAYS * 86400 * 1000).toISOString();

  // Pull candidates. We do the dedup filter in Postgres — one round-trip.
  const { data: rows, error } = await supabase
    .from('profiles')
    .select('id, current_period_end, last_renewal_reminder_sent_at')
    .eq('is_pro', true)
    .in('subscription_status', ['active', 'trialing'])
    .gte('current_period_end', windowStart)
    .lt('current_period_end', windowEnd)
    .or(`last_renewal_reminder_sent_at.is.null,last_renewal_reminder_sent_at.lt.${dedupCutoff}`);

  if (error) {
    console.error('[renewal-reminder] query failed', error);
    return json({ error: 'query_failed', detail: error.message }, 500);
  }

  const candidates: ProfileRow[] = rows ?? [];
  let sent = 0;
  let errors = 0;

  for (const row of candidates) {
    try {
      const { data: userRes, error: userErr } = await supabase.auth.admin.getUserById(row.id);
      if (userErr || !userRes?.user?.email) {
        console.warn('[renewal-reminder] user lookup failed', row.id, userErr);
        errors += 1;
        continue;
      }

      const { subject, html, text } = renderRenewal({
        appBaseUrl: APP_BASE_URL,
        renewalDate: formatDate(row.current_period_end),
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
          to: [userRes.user.email],
          reply_to: 'ziyazovaa@gmail.com',
          subject,
          html,
          text,
        }),
      });

      if (!resendRes.ok) {
        const detail = await resendRes.text();
        console.error('[renewal-reminder] resend failed', row.id, resendRes.status, detail);
        errors += 1;
        continue;
      }

      const { error: stampErr } = await supabase
        .from('profiles')
        .update({ last_renewal_reminder_sent_at: new Date().toISOString() })
        .eq('id', row.id);
      if (stampErr) {
        // Email sent but stamp failed — row stays eligible until dedup window
        // expires, so worst case a user gets a second reminder tomorrow.
        console.warn('[renewal-reminder] stamp failed', row.id, stampErr);
      }

      sent += 1;
    } catch (e) {
      console.error('[renewal-reminder] row failed', row.id, e);
      errors += 1;
    }
  }

  return json({ scanned: candidates.length, sent, errors });
});

// ───────────────────── template ─────────────────────

interface RenewalTemplateArgs {
  appBaseUrl: string;
  renewalDate: string;
  supportEmail: string;
}

function renderRenewal({ appBaseUrl, renewalDate, supportEmail }: RenewalTemplateArgs) {
  const subject = `Your Peachy Pro renews on ${renewalDate}`;
  const settingsUrl = `${appBaseUrl}/settings#subscription`;
  const termsUrl = `${appBaseUrl}/terms`;
  const refundUrl = `${appBaseUrl}/refund`;

  const html = `<!doctype html>
<html><body style="margin:0;padding:0;background:#F7F7F5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Inter,sans-serif;color:#1C1C1E;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F7F7F5;padding:32px 16px;">
    <tr><td align="center">
      <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;background:#FFFFFF;border-radius:16px;padding:40px 32px;">
        <tr><td>
          <h1 style="margin:0 0 16px;font-size:22px;font-weight:600;letter-spacing:-0.02em;">Your Peachy Pro renews in 3 days</h1>
          <p style="margin:0 0 16px;font-size:15px;line-height:1.55;color:#3C3C43;">Just a heads-up: your Peachy Pro subscription will renew on <strong>${renewalDate}</strong> for $4 (or local equivalent). Nothing to do if you want to stay subscribed.</p>
          <p style="margin:0 0 16px;font-size:15px;line-height:1.55;color:#3C3C43;">If you'd rather cancel, you can do it in under a minute from your Settings page. Cancellation stops future billing immediately; your Pro access continues until the end of the current period you've already paid for.</p>

          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0;"><tr><td>
            <a href="${settingsUrl}" style="display:inline-block;padding:12px 20px;background:#1C1C1E;color:#FFFFFF;text-decoration:none;border-radius:10px;font-size:14px;font-weight:500;">Manage subscription</a>
          </td></tr></table>

          <p style="margin:32px 0 8px;font-size:13px;line-height:1.55;color:#6E6E73;">Questions? Reply to this email or write to <a href="mailto:${supportEmail}" style="color:#6E7FF2;text-decoration:none;">${supportEmail}</a>.</p>
          <p style="margin:16px 0 0;font-size:12px;line-height:1.55;color:#8E8E93;">
            <a href="${termsUrl}" style="color:#8E8E93;text-decoration:none;">Terms</a> ·
            <a href="${refundUrl}" style="color:#8E8E93;text-decoration:none;">Refund</a>
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;

  const text = [
    `Your Peachy Pro renews on ${renewalDate}`,
    '',
    `Your Peachy Pro subscription will renew on ${renewalDate} for $4 (or local equivalent). Nothing to do if you want to stay subscribed.`,
    '',
    `To cancel, go to ${settingsUrl}. Cancellation stops future billing immediately; Pro access continues until the end of the current paid period.`,
    '',
    `Questions? Reply to this email or write to ${supportEmail}.`,
    '',
    `Terms: ${termsUrl}`,
    `Refund: ${refundUrl}`,
  ].join('\n');

  return { subject, html, text };
}

function formatDate(iso: string | null | undefined): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return mismatch === 0;
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
