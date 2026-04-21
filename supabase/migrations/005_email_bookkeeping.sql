-- Transactional-email bookkeeping on profiles.
--
-- welcome_email_sent_at:
--   Stamped by `polar-welcome-email` after a successful Resend send so the
--   webhook can safely fire it on every `subscription.created` retry without
--   spamming the user. NULL → email still owed.
--
-- last_renewal_reminder_sent_at:
--   Stamped by `polar-renewal-reminder` after each Resend send. The cron
--   query only picks rows where this value is NULL or older than one full
--   billing cycle, so a user who cancels + re-subscribes can still get a
--   fresh reminder on their next period.

alter table public.profiles
  add column if not exists welcome_email_sent_at timestamptz,
  add column if not exists last_renewal_reminder_sent_at timestamptz;

-- Targeted partial index for the daily reminder sweep. Keeps the scan cheap
-- regardless of how many free users pile up alongside paying ones.
create index if not exists profiles_renewal_reminder_idx
  on public.profiles (current_period_end)
  where is_pro = true
    and subscription_status in ('active', 'trialing')
    and current_period_end is not null;
