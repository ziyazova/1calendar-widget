-- One-time template purchases from Polar.
--
-- Guests and registered users both buy: user_id is nullable so a purchase
-- can land in the table before we know which Supabase user (if any) owns it.
-- When the same email later signs up, AuthContext calls
-- `link_purchases_to_user(user_id, email)` to back-fill user_id — so the
-- Dashboard "My purchases" view shows everything the buyer has ever paid
-- for, not just purchases made while logged in.
--
-- Source of row: polar-webhook on `order.paid` / `order.updated` events.
-- idempotent by polar_order_id (unique constraint); webhook retries are
-- safe.

create table if not exists public.purchases (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid references auth.users(id) on delete set null,
  email             text not null,
  polar_order_id    text not null unique,
  polar_product_id  text not null,
  product_name      text,
  amount_cents      integer,
  currency          text default 'usd',
  status            text not null default 'paid',  -- paid / refunded
  created_at        timestamptz default now(),
  updated_at        timestamptz default now()
);

create index if not exists purchases_user_id_idx on public.purchases(user_id);
create index if not exists purchases_email_idx   on public.purchases(lower(email));

-- Touch updated_at on any update.
create or replace function public.purchases_touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists purchases_updated_at on public.purchases;
create trigger purchases_updated_at before update on public.purchases
  for each row execute function public.purchases_touch_updated_at();

-- ─────────────────────────── RLS ───────────────────────────
-- Users can SELECT their own purchases (matched by user_id). They cannot
-- write — the webhook (service-role) is the only writer.
alter table public.purchases enable row level security;

drop policy if exists "Users can read own purchases" on public.purchases;
create policy "Users can read own purchases"
  on public.purchases
  for select
  using (auth.uid() = user_id);

-- ─────────────────────── Email back-fill ───────────────────────
-- Called from AuthContext immediately after sign-up / sign-in to attach
-- any prior guest purchases (by email match) to this user.
--
-- SECURITY DEFINER so it can write across a table that has RLS restricting
-- regular users to their own rows. Caller can only touch rows matching
-- both their authed uid and their email (check inside the function).
create or replace function public.link_purchases_to_user(p_user_id uuid, p_email text)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  linked_count integer;
begin
  if p_user_id is null or p_email is null or p_email = '' then
    return 0;
  end if;
  -- Belt and braces: verify the caller is the user they claim to be.
  if auth.uid() is distinct from p_user_id then
    raise exception 'link_purchases_to_user: auth.uid() does not match p_user_id';
  end if;

  update public.purchases
     set user_id = p_user_id
   where user_id is null
     and lower(email) = lower(p_email);

  get diagnostics linked_count = row_count;
  return linked_count;
end;
$$;

-- authenticated role must be able to call it
grant execute on function public.link_purchases_to_user(uuid, text) to authenticated;
