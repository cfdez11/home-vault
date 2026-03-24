-- ============================================================
-- Home Vault — Full Database Migration
-- Generated: 2026-03-24
-- ============================================================
-- Run this script against a fresh Supabase project to
-- recreate the entire schema: types, tables, constraints,
-- functions, triggers, and RLS policies.
-- ============================================================

-- ------------------------------------------------------------
-- Extensions (Supabase enables uuid-ossp by default)
-- ------------------------------------------------------------
create extension if not exists "uuid-ossp";

-- ============================================================
-- ENUMS
-- ============================================================

create type public.document_type as enum (
  'contract',
  'insurance',
  'invoice',
  'certificate',
  'other'
);

create type public.incident_status as enum (
  'open',
  'in_progress',
  'resolved'
);

create type public.priority_level as enum (
  'low',
  'medium',
  'high',
  'critical'
);

create type public.property_type as enum (
  'apartment',
  'house',
  'commercial',
  'land',
  'other'
);

-- ============================================================
-- TABLES
-- ============================================================

-- ------------------------------------------------------------
-- users
-- Mirrors auth.users; created automatically via trigger.
-- ------------------------------------------------------------
create table public.users (
  id          serial      primary key,
  auth_id     uuid        unique,                      -- links to auth.users.id
  first_name  text,
  last_name   text,
  email       text        not null unique,
  password    text,                                    -- not used (auth is via Supabase Auth)
  phone       text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ------------------------------------------------------------
-- categories
-- ------------------------------------------------------------
create table public.categories (
  id            serial      primary key,
  category_name text        not null,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- ------------------------------------------------------------
-- companies
-- ------------------------------------------------------------
create table public.companies (
  id          serial      primary key,
  user_id     integer     not null references public.users(id) on delete cascade,
  name        text        not null,
  cif         text,
  email       text,
  phone       text,
  address     text,
  notes       text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ------------------------------------------------------------
-- company_categories  (many-to-many join)
-- ------------------------------------------------------------
create table public.company_categories (
  company_id  integer not null references public.companies(id)  on delete cascade,
  category_id integer not null references public.categories(id) on delete cascade,
  primary key (company_id, category_id)
);

-- ------------------------------------------------------------
-- properties
-- ------------------------------------------------------------
create table public.properties (
  id          serial              primary key,
  user_id     integer             not null references public.users(id) on delete cascade,
  name        text                not null,
  address     text                not null,
  type        public.property_type,
  size        numeric,
  year        integer,
  created_at  timestamptz         not null default now(),
  updated_at  timestamptz         not null default now()
);

-- ------------------------------------------------------------
-- incidents
-- Ownership is derived from property_id → properties.user_id
-- ------------------------------------------------------------
create table public.incidents (
  id           serial                  primary key,
  property_id  integer                 not null references public.properties(id) on delete cascade,
  company_id   integer                 references public.companies(id) on delete set null,
  title        text                    not null,
  description  text,
  status       public.incident_status  not null default 'open',
  priority     public.priority_level   not null default 'medium',
  date         date,
  cost         numeric,
  created_at   timestamptz             not null default now(),
  updated_at   timestamptz             not null default now()
);

-- ------------------------------------------------------------
-- documents
-- ------------------------------------------------------------
create table public.documents (
  id           serial               primary key,
  property_id  integer              not null references public.properties(id) on delete cascade,
  title        text                 not null,
  type         public.document_type not null,
  date         date,
  url          text,
  notes        text,
  created_at   timestamptz          not null default now(),
  updated_at   timestamptz          not null default now()
);

-- ------------------------------------------------------------
-- incident_files
-- ------------------------------------------------------------
create table public.incident_files (
  id           serial      primary key,
  incident_id  integer     not null references public.incidents(id) on delete cascade,
  url          text        not null,
  name         text,
  created_at   timestamptz not null default now()
);

-- ============================================================
-- FUNCTIONS
-- ============================================================

-- ------------------------------------------------------------
-- handle_new_auth_user
-- Called by trigger on auth.users INSERT.
-- Auto-creates a matching row in public.users.
-- ------------------------------------------------------------
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

-- ------------------------------------------------------------
-- set_company_user_id
-- Called by BEFORE INSERT trigger on companies.
-- Resolves the integer user_id from the current auth.uid().
-- ------------------------------------------------------------
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

-- ------------------------------------------------------------
-- set_property_user_id
-- Called by BEFORE INSERT trigger on properties.
-- Resolves the integer user_id from the current auth.uid().
-- ------------------------------------------------------------
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

-- ============================================================
-- TRIGGERS
-- ============================================================

-- After a new Supabase Auth user is created → insert into public.users
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_auth_user();

-- Before inserting a company → resolve and stamp user_id
create trigger before_insert_company_set_user_id
  before insert on public.companies
  for each row
  execute function public.set_company_user_id();

-- Before inserting a property → resolve and stamp user_id
create trigger before_insert_property_set_user_id
  before insert on public.properties
  for each row
  execute function public.set_property_user_id();

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table public.users            enable row level security;
alter table public.categories       enable row level security;
alter table public.companies        enable row level security;
alter table public.company_categories enable row level security;
alter table public.properties       enable row level security;
alter table public.incidents        enable row level security;
alter table public.documents        enable row level security;
alter table public.incident_files   enable row level security;

-- Helper: returns the integer public.users.id for the current session
-- Used inline in policies to avoid repeating the subquery.

-- ------------------------------------------------------------
-- users — each user can only see/edit their own row
-- ------------------------------------------------------------
create policy "users: read own row"
  on public.users for select
  to authenticated
  using (auth_id = auth.uid());

create policy "users: update own row"
  on public.users for update
  to authenticated
  using (auth_id = auth.uid());

-- ------------------------------------------------------------
-- categories — readable by all authenticated users (shared lookup)
-- ------------------------------------------------------------
create policy "categories: authenticated read"
  on public.categories for select
  to authenticated
  using (true);

-- ------------------------------------------------------------
-- companies — full CRUD restricted to the owning user
-- ------------------------------------------------------------
create policy "companies: select own"
  on public.companies for select
  to authenticated
  using (
    user_id = (select id from public.users where auth_id = auth.uid())
  );

create policy "companies: insert own"
  on public.companies for insert
  to authenticated
  with check (
    user_id = (select id from public.users where auth_id = auth.uid())
  );

create policy "companies: update own"
  on public.companies for update
  to authenticated
  using (
    user_id = (select id from public.users where auth_id = auth.uid())
  );

create policy "companies: delete own"
  on public.companies for delete
  to authenticated
  using (
    user_id = (select id from public.users where auth_id = auth.uid())
  );

-- ------------------------------------------------------------
-- company_categories — access follows company ownership
-- ------------------------------------------------------------
create policy "company_categories: select own"
  on public.company_categories for select
  to authenticated
  using (
    company_id in (
      select id from public.companies
      where user_id = (select id from public.users where auth_id = auth.uid())
    )
  );

create policy "company_categories: insert own"
  on public.company_categories for insert
  to authenticated
  with check (
    company_id in (
      select id from public.companies
      where user_id = (select id from public.users where auth_id = auth.uid())
    )
  );

create policy "company_categories: delete own"
  on public.company_categories for delete
  to authenticated
  using (
    company_id in (
      select id from public.companies
      where user_id = (select id from public.users where auth_id = auth.uid())
    )
  );

-- ------------------------------------------------------------
-- properties — full CRUD restricted to the owning user
-- ------------------------------------------------------------
create policy "properties: select own"
  on public.properties for select
  to authenticated
  using (
    user_id = (select id from public.users where auth_id = auth.uid())
  );

create policy "properties: insert own"
  on public.properties for insert
  to authenticated
  with check (
    user_id = (select id from public.users where auth_id = auth.uid())
  );

create policy "properties: update own"
  on public.properties for update
  to authenticated
  using (
    user_id = (select id from public.users where auth_id = auth.uid())
  );

create policy "properties: delete own"
  on public.properties for delete
  to authenticated
  using (
    user_id = (select id from public.users where auth_id = auth.uid())
  );

-- ------------------------------------------------------------
-- incidents — access follows property ownership
-- ------------------------------------------------------------
create policy "incidents: select own"
  on public.incidents for select
  to authenticated
  using (
    property_id in (
      select id from public.properties
      where user_id = (select id from public.users where auth_id = auth.uid())
    )
  );

create policy "incidents: insert own"
  on public.incidents for insert
  to authenticated
  with check (
    property_id in (
      select id from public.properties
      where user_id = (select id from public.users where auth_id = auth.uid())
    )
  );

create policy "incidents: update own"
  on public.incidents for update
  to authenticated
  using (
    property_id in (
      select id from public.properties
      where user_id = (select id from public.users where auth_id = auth.uid())
    )
  );

create policy "incidents: delete own"
  on public.incidents for delete
  to authenticated
  using (
    property_id in (
      select id from public.properties
      where user_id = (select id from public.users where auth_id = auth.uid())
    )
  );

-- ------------------------------------------------------------
-- documents — access follows property ownership
-- ------------------------------------------------------------
create policy "documents: select own"
  on public.documents for select
  to authenticated
  using (
    property_id in (
      select id from public.properties
      where user_id = (select id from public.users where auth_id = auth.uid())
    )
  );

create policy "documents: insert own"
  on public.documents for insert
  to authenticated
  with check (
    property_id in (
      select id from public.properties
      where user_id = (select id from public.users where auth_id = auth.uid())
    )
  );

create policy "documents: update own"
  on public.documents for update
  to authenticated
  using (
    property_id in (
      select id from public.properties
      where user_id = (select id from public.users where auth_id = auth.uid())
    )
  );

create policy "documents: delete own"
  on public.documents for delete
  to authenticated
  using (
    property_id in (
      select id from public.properties
      where user_id = (select id from public.users where auth_id = auth.uid())
    )
  );

-- ------------------------------------------------------------
-- incident_files — access follows incident → property ownership
-- ------------------------------------------------------------
create policy "incident_files: select own"
  on public.incident_files for select
  to authenticated
  using (
    incident_id in (
      select i.id from public.incidents i
      join public.properties p on p.id = i.property_id
      where p.user_id = (select id from public.users where auth_id = auth.uid())
    )
  );

create policy "incident_files: insert own"
  on public.incident_files for insert
  to authenticated
  with check (
    incident_id in (
      select i.id from public.incidents i
      join public.properties p on p.id = i.property_id
      where p.user_id = (select id from public.users where auth_id = auth.uid())
    )
  );

create policy "incident_files: delete own"
  on public.incident_files for delete
  to authenticated
  using (
    incident_id in (
      select i.id from public.incidents i
      join public.properties p on p.id = i.property_id
      where p.user_id = (select id from public.users where auth_id = auth.uid())
    )
  );
