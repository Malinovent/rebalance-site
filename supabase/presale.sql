-- Pre-sale tables for the landing page (sprint 0).
-- Paste the whole file into the Supabase SQL Editor of the SAME project the app syncs to, and press Run.
-- Safe to run more than once: every statement is idempotent.
--
-- Access model: Row Level Security is on for every table and there are no policies for anon,
-- so the public anon key can neither read nor write these tables. Only the edge functions
-- (service role key, server-side) write them. The one exception: a signed-in app user may read
-- their own entitlement row (for the early-bird badge, sprint 1).

-- ------------------------------------------------------------------ purchases
create table if not exists public.purchases (
  id           bigint generated always as identity primary key,
  provider     text not null,                       -- 'paddle' | 'lemonsqueezy'
  order_id     text not null,
  email        text not null,                       -- lower-cased
  amount_cents integer not null check (amount_cents >= 0),
  currency     text not null,                       -- ISO 4217, e.g. 'CAD'
  lang         text not null check (lang in ('fr', 'en')),
  headline     text check (headline in ('a', 'b')),
  src          text,
  status       text not null default 'paid' check (status in ('paid', 'refunded')),
  created_at   timestamptz not null default now(),
  refunded_at  timestamptz,
  unique (provider, order_id)
);
alter table public.purchases enable row level security;

-- --------------------------------------------------------------- entitlements
create table if not exists public.entitlements (
  email           text primary key,                 -- lower-cased; the app matches the signed-in email
  early_bird      boolean not null default false,
  source_order_id text,
  updated_at      timestamptz not null default now()
);
-- `pro`: Pro (sync) given by hand, or kept by people who synced before Pro existed (the app's
-- supabase/schema.sql). Pro = pro or early_bird; a refund clears early_bird only.
alter table public.entitlements add column if not exists pro boolean not null default false;
alter table public.entitlements enable row level security;

drop policy if exists "entitlements: read own" on public.entitlements;
create policy "entitlements: read own"
  on public.entitlements
  for select
  to authenticated
  using (email = lower((select auth.jwt() ->> 'email')));

-- ------------------------------------------------------------------- waitlist
-- CASL: we keep when and how each person consented, and the exact wording version they saw.
create table if not exists public.waitlist (
  id                   bigint generated always as identity primary key,
  email                text not null unique,        -- lower-cased
  lang                 text not null check (lang in ('fr', 'en')),
  consent_at           timestamptz not null,
  consent_method       text not null,               -- 'web-form-checkbox'
  consent_text_version text not null,
  headline             text check (headline in ('a', 'b')),
  src                  text,
  unsubscribed_at      timestamptz,
  created_at           timestamptz not null default now()
);
alter table public.waitlist enable row level security;

-- ----------------------------------------------------------------------- hits
-- One counter per day x page x headline x source. Nothing about the visitor is stored.
create table if not exists public.hits (
  day      date not null,                           -- Montreal date
  page     text not null,
  headline text not null check (headline in ('a', 'b', '-')),
  src      text not null,
  count    integer not null default 0,
  primary key (day, page, headline, src)
);
alter table public.hits enable row level security;

-- Atomic increment, callable only with the service role (from the hit function).
create or replace function public.record_hit(p_day date, p_page text, p_headline text, p_src text)
returns void
language sql
security invoker
set search_path = ''
as $$
  insert into public.hits (day, page, headline, src, count)
  values (p_day, p_page, p_headline, p_src, 1)
  on conflict (day, page, headline, src) do update set count = public.hits.count + 1;
$$;
revoke all on function public.record_hit(date, text, text, text) from public, anon, authenticated;
grant execute on function public.record_hit(date, text, text, text) to service_role;
