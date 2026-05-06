-- Public widget IDs + soft-delete flag for live-syncing embeds.
--
-- Before this migration, widget settings lived entirely inside the embed URL
-- (?c=<base64>). Once a customer pasted that URL into Notion the widget was
-- frozen — owner edits in the studio didn't propagate, and a deleted widget
-- still rendered from cached config because the embed never hit the server.
--
-- This migration adds a short public_id used by embed pages to fetch live
-- settings from the database, plus an is_active flag so an owner-side delete
-- (or a future "pause" feature) can render a placeholder instead. The legacy
-- URL-only format (?c=...) keeps working — embed pages fall back to it when
-- public_id is absent or the RPC is unreachable.

-- ─────────────────────────────────────────────────────────────────────────
-- Schema: 8-char public_id + is_active flag.
-- ─────────────────────────────────────────────────────────────────────────

alter table public.widgets
  add column if not exists public_id text,
  add column if not exists is_active boolean not null default true;

-- ─────────────────────────────────────────────────────────────────────────
-- Backfill: every existing row gets a unique random public_id.
-- 8 chars × 62 alphabet ≈ 218T combinations → collisions vanishingly rare,
-- but we still loop on unique_violation as belt-and-braces.
-- ─────────────────────────────────────────────────────────────────────────

create or replace function public.gen_widget_public_id()
returns text
language sql
volatile
as $$
  select string_agg(
    substr(
      '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
      (get_byte(b, 0) % 62) + 1,
      1
    ),
    ''
  )
  from (select gen_random_bytes(1) as b from generate_series(1, 8)) g;
$$;

do $$
declare
  r record;
  candidate text;
begin
  for r in select id from public.widgets where public_id is null loop
    loop
      candidate := public.gen_widget_public_id();
      begin
        update public.widgets set public_id = candidate where id = r.id;
        exit;
      exception when unique_violation then
        continue;
      end;
    end loop;
  end loop;
end $$;

alter table public.widgets
  alter column public_id set not null;

create unique index if not exists widgets_public_id_key on public.widgets(public_id);
create index if not exists widgets_public_id_active_idx
  on public.widgets(public_id) where is_active = true;

-- ─────────────────────────────────────────────────────────────────────────
-- RPC: public read for embed pages.
--
-- Returns only the settings/type/style — no user_id, no timestamps, no name.
-- security definer so anonymous callers (Notion iframe loads have no Supabase
-- session) can read despite RLS. Returns empty when the widget is missing or
-- the owner has flipped is_active=false; the caller treats that as "show the
-- 'unavailable' placeholder."
-- ─────────────────────────────────────────────────────────────────────────

create or replace function public.get_public_widget(p_id text)
returns table(type text, style text, settings jsonb)
language sql
stable
security definer
set search_path = public
as $$
  select w.type, w.style, w.settings
  from public.widgets w
  where w.public_id = p_id
    and w.is_active = true;
$$;

grant execute on function public.get_public_widget(text) to anon, authenticated;

-- ─────────────────────────────────────────────────────────────────────────
-- Tier-enforcement update: count only active widgets toward the free quota.
-- Without this, a free user who soft-deletes a widget (future feature) would
-- still hit their cap. Hard delete via the API is unaffected.
-- ─────────────────────────────────────────────────────────────────────────

drop policy if exists "insert own widgets within tier" on public.widgets;
create policy "insert own widgets within tier"
  on public.widgets
  for insert
  with check (
    auth.uid() = user_id
    and (
      public.user_is_pro(auth.uid())
      or (
        (
          select count(*)
          from public.widgets
          where user_id = auth.uid()
            and is_active = true
        ) < 3
        and not public.is_pro_style(style)
      )
    )
  );
