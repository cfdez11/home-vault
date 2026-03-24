-- ============================================================
-- Fix: grants, triggers + RLS for all tables
-- Run this against your Supabase project if the initial schema
-- was not fully applied (e.g. triggers or policies are missing).
-- All statements are idempotent.
-- ============================================================

-- ─── API grants (required when tables are created via SQL, not the dashboard) ─
-- Without these, Supabase marks the table as "API Disabled".

grant usage on schema public to anon, authenticated;

grant select, insert, update, delete on public.users              to authenticated;
grant select, insert, update, delete on public.categories         to authenticated;
grant select, insert, update, delete on public.companies          to authenticated;
grant select, insert, update, delete on public.company_categories to authenticated;
grant select, insert, update, delete on public.properties         to authenticated;
grant select, insert, update, delete on public.incidents          to authenticated;
grant select, insert, update, delete on public.documents          to authenticated;
grant select, insert, update, delete on public.incident_files     to authenticated;

-- Sequences (needed for serial primary keys)
grant usage, select on all sequences in schema public to authenticated;

-- ─── Trigger functions ────────────────────────────────────────────────────────

create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.users (auth_id, email)
  values (new.id, new.email)
  on conflict (email) do update
    set auth_id = excluded.auth_id;
  return new;
end;
$$;

create or replace function public.set_company_user_id()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  new.user_id := (
    select id from public.users where auth_id = auth.uid()
  );
  return new;
end;
$$;

create or replace function public.set_property_user_id()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  new.user_id := (
    select id from public.users where auth_id = auth.uid()
  );
  return new;
end;
$$;

-- ─── Triggers ─────────────────────────────────────────────────────────────────

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_auth_user();

drop trigger if exists before_insert_company_set_user_id on public.companies;
create trigger before_insert_company_set_user_id
  before insert on public.companies
  for each row
  execute function public.set_company_user_id();

drop trigger if exists before_insert_property_set_user_id on public.properties;
create trigger before_insert_property_set_user_id
  before insert on public.properties
  for each row
  execute function public.set_property_user_id();

-- ─── RLS: make sure it is enabled ─────────────────────────────────────────────

alter table public.users              enable row level security;
alter table public.companies          enable row level security;
alter table public.company_categories enable row level security;
alter table public.properties         enable row level security;
alter table public.incidents          enable row level security;
alter table public.documents          enable row level security;
alter table public.incident_files     enable row level security;

-- ─── RLS policies: users ──────────────────────────────────────────────────────

drop policy if exists "users: read own row"   on public.users;
drop policy if exists "users: update own row" on public.users;

create policy "users: read own row"
  on public.users for select to authenticated
  using (auth_id = auth.uid());

create policy "users: update own row"
  on public.users for update to authenticated
  using (auth_id = auth.uid());

-- ─── RLS policies: companies ──────────────────────────────────────────────────

drop policy if exists "companies: select own" on public.companies;
drop policy if exists "companies: insert own" on public.companies;
drop policy if exists "companies: update own" on public.companies;
drop policy if exists "companies: delete own" on public.companies;

create policy "companies: select own"
  on public.companies for select to authenticated
  using (user_id = (select id from public.users where auth_id = auth.uid()));

create policy "companies: insert own"
  on public.companies for insert to authenticated
  with check (user_id = (select id from public.users where auth_id = auth.uid()));

create policy "companies: update own"
  on public.companies for update to authenticated
  using (user_id = (select id from public.users where auth_id = auth.uid()));

create policy "companies: delete own"
  on public.companies for delete to authenticated
  using (user_id = (select id from public.users where auth_id = auth.uid()));

-- ─── RLS policies: company_categories ────────────────────────────────────────

drop policy if exists "company_categories: select own" on public.company_categories;
drop policy if exists "company_categories: insert own" on public.company_categories;
drop policy if exists "company_categories: delete own" on public.company_categories;

create policy "company_categories: select own"
  on public.company_categories for select to authenticated
  using (
    company_id in (
      select id from public.companies
      where user_id = (select id from public.users where auth_id = auth.uid())
    )
  );

create policy "company_categories: insert own"
  on public.company_categories for insert to authenticated
  with check (
    company_id in (
      select id from public.companies
      where user_id = (select id from public.users where auth_id = auth.uid())
    )
  );

create policy "company_categories: delete own"
  on public.company_categories for delete to authenticated
  using (
    company_id in (
      select id from public.companies
      where user_id = (select id from public.users where auth_id = auth.uid())
    )
  );

-- ─── RLS policies: properties ─────────────────────────────────────────────────

drop policy if exists "properties: select own" on public.properties;
drop policy if exists "properties: insert own" on public.properties;
drop policy if exists "properties: update own" on public.properties;
drop policy if exists "properties: delete own" on public.properties;

create policy "properties: select own"
  on public.properties for select to authenticated
  using (user_id = (select id from public.users where auth_id = auth.uid()));

create policy "properties: insert own"
  on public.properties for insert to authenticated
  with check (user_id = (select id from public.users where auth_id = auth.uid()));

create policy "properties: update own"
  on public.properties for update to authenticated
  using (user_id = (select id from public.users where auth_id = auth.uid()));

create policy "properties: delete own"
  on public.properties for delete to authenticated
  using (user_id = (select id from public.users where auth_id = auth.uid()));

-- ─── RLS policies: incidents ──────────────────────────────────────────────────

drop policy if exists "incidents: select own" on public.incidents;
drop policy if exists "incidents: insert own" on public.incidents;
drop policy if exists "incidents: update own" on public.incidents;
drop policy if exists "incidents: delete own" on public.incidents;

create policy "incidents: select own"
  on public.incidents for select to authenticated
  using (
    property_id in (
      select id from public.properties
      where user_id = (select id from public.users where auth_id = auth.uid())
    )
  );

create policy "incidents: insert own"
  on public.incidents for insert to authenticated
  with check (
    property_id in (
      select id from public.properties
      where user_id = (select id from public.users where auth_id = auth.uid())
    )
  );

create policy "incidents: update own"
  on public.incidents for update to authenticated
  using (
    property_id in (
      select id from public.properties
      where user_id = (select id from public.users where auth_id = auth.uid())
    )
  );

create policy "incidents: delete own"
  on public.incidents for delete to authenticated
  using (
    property_id in (
      select id from public.properties
      where user_id = (select id from public.users where auth_id = auth.uid())
    )
  );

-- ─── RLS policies: documents ──────────────────────────────────────────────────

drop policy if exists "documents: select own" on public.documents;
drop policy if exists "documents: insert own" on public.documents;
drop policy if exists "documents: update own" on public.documents;
drop policy if exists "documents: delete own" on public.documents;

create policy "documents: select own"
  on public.documents for select to authenticated
  using (
    property_id in (
      select id from public.properties
      where user_id = (select id from public.users where auth_id = auth.uid())
    )
  );

create policy "documents: insert own"
  on public.documents for insert to authenticated
  with check (
    property_id in (
      select id from public.properties
      where user_id = (select id from public.users where auth_id = auth.uid())
    )
  );

create policy "documents: update own"
  on public.documents for update to authenticated
  using (
    property_id in (
      select id from public.properties
      where user_id = (select id from public.users where auth_id = auth.uid())
    )
  );

create policy "documents: delete own"
  on public.documents for delete to authenticated
  using (
    property_id in (
      select id from public.properties
      where user_id = (select id from public.users where auth_id = auth.uid())
    )
  );

-- ─── RLS policies: incident_files ────────────────────────────────────────────

drop policy if exists "incident_files: select own" on public.incident_files;
drop policy if exists "incident_files: insert own" on public.incident_files;
drop policy if exists "incident_files: delete own" on public.incident_files;

create policy "incident_files: select own"
  on public.incident_files for select to authenticated
  using (
    incident_id in (
      select i.id from public.incidents i
      join public.properties p on p.id = i.property_id
      where p.user_id = (select id from public.users where auth_id = auth.uid())
    )
  );

create policy "incident_files: insert own"
  on public.incident_files for insert to authenticated
  with check (
    incident_id in (
      select i.id from public.incidents i
      join public.properties p on p.id = i.property_id
      where p.user_id = (select id from public.users where auth_id = auth.uid())
    )
  );

create policy "incident_files: delete own"
  on public.incident_files for delete to authenticated
  using (
    incident_id in (
      select i.id from public.incidents i
      join public.properties p on p.id = i.property_id
      where p.user_id = (select id from public.users where auth_id = auth.uid())
    )
  );

-- ─── Make company_id nullable on incidents (if not already) ───────────────────

alter table public.incidents
  alter column company_id drop not null;
