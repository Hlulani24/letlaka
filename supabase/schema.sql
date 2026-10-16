-- LETLAKA — run ONCE in Supabase → SQL Editor. Safe to re-run.
-- Visitors: read visible products, submit forms. Admins only: everything else.

-- 1) Who is an admin ------------------------------------------------------
create table if not exists public.admins (
  email text primary key
);
alter table public.admins enable row level security;
-- (no policies: nobody can read/write this table from the browser)

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.admins
    where lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

-- >>> Add the owner(s) here, then create the same user under Authentication → Users:
-- insert into public.admins (email) values ('owner@example.com') on conflict do nothing;

-- 2) Products ---------------------------------------------------------------
create table if not exists public.products (
  id         text primary key,
  name       text not null check (char_length(name) between 1 and 120),
  category   text not null,
  blurb      text not null default '',
  status     text not null default 'core' check (status in ('core','concept')),
  featured   boolean not null default false,
  visible    boolean not null default true,
  price      numeric check (price is null or price >= 0),
  sale_price numeric check (sale_price is null or sale_price >= 0),
  images     jsonb not null default '[]'::jsonb,
  sort       integer not null default 0,
  sizes      jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);
alter table public.products add column if not exists sizes jsonb not null default '[]'::jsonb;
alter table public.products enable row level security;

drop policy if exists "public reads visible products" on public.products;
create policy "public reads visible products" on public.products
  for select to anon, authenticated using (visible or public.is_admin());

drop policy if exists "admins write products" on public.products;
create policy "admins write products" on public.products
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- 3) Leads (form submissions) ----------------------------------------------
create table if not exists public.custom_orders (
  id           uuid primary key default gen_random_uuid(),
  created_at   timestamptz not null default now(),
  status       text not null default 'new' check (status in ('new','contacted','quoted','done')),
  name         text not null check (char_length(name) between 1 and 120),
  organisation text check (char_length(organisation) <= 160),
  phone        text not null check (char_length(phone) between 5 and 40),
  email        text check (char_length(email) <= 160),
  garment      text check (char_length(garment) <= 160),
  quantity     text check (char_length(quantity) <= 80),
  colours      text check (char_length(colours) <= 300),
  needs        text check (char_length(needs) <= 300),
  deadline     text check (char_length(deadline) <= 80),
  notes        text check (char_length(notes) <= 2000)
);

create table if not exists public.basket_orders (
  id         uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  status     text not null default 'new' check (status in ('new','contacted','quoted','done')),
  name       text not null check (char_length(name) between 1 and 120),
  phone      text not null check (char_length(phone) between 5 and 40),
  email      text check (char_length(email) <= 160),
  deadline   text check (char_length(deadline) <= 80),
  notes      text check (char_length(notes) <= 2000),
  items      jsonb not null check (jsonb_typeof(items) = 'array' and jsonb_array_length(items) between 1 and 60),
  total      numeric check (total is null or total >= 0)
);

create table if not exists public.enquiries (
  id         uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  status     text not null default 'new' check (status in ('new','contacted','quoted','done')),
  name       text not null check (char_length(name) between 1 and 120),
  phone      text not null check (char_length(phone) between 5 and 40),
  message    text not null check (char_length(message) between 1 and 2000)
);

alter table public.basket_orders enable row level security;
alter table public.custom_orders enable row level security;
alter table public.enquiries     enable row level security;

do $$
declare t text;
begin
  foreach t in array array['basket_orders','custom_orders','enquiries'] loop
    execute format('drop policy if exists "anyone submits" on public.%I', t);
    execute format('create policy "anyone submits" on public.%I for insert to anon, authenticated with check (status = ''new'')', t);
    execute format('drop policy if exists "admins manage" on public.%I', t);
    execute format('create policy "admins manage" on public.%I for all to authenticated using (public.is_admin()) with check (public.is_admin())', t);
  end loop;
end $$;

-- Product photos are stored on Cloudinary (not Supabase) — nothing to set up here.
