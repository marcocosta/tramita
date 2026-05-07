-- Tramita core schema for the first Supabase-backed MVP foundation.
-- TODO: enable RLS after auth/workspaces are added.
-- TODO: add organization/workspace ownership before multi-user launch.

create extension if not exists pgcrypto;

create table if not exists properties (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  state text not null,
  city text not null,
  region text not null,
  address text,
  lat double precision not null,
  lng double precision not null,
  asset_type text not null,
  area_m2 numeric not null,
  estimated_value_range text,
  asking_price text,
  target_use text[] default '{}',
  source_label text,
  source_type text,
  data_availability text,
  status text default 'imported',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists property_evidence_documents (
  id uuid primary key default gen_random_uuid(),
  property_id text not null,
  title text not null,
  document_type text not null,
  source_type text not null,
  source_label text not null,
  status text not null,
  confidence text not null,
  file_name text,
  notes text,
  unlocks text[] default '{}',
  uploaded_at timestamptz default now(),
  created_at timestamptz default now()
);

create table if not exists dossier_requests (
  id uuid primary key default gen_random_uuid(),
  property_id text not null,
  property_title text,
  status text not null default 'requested',
  requested_at timestamptz default now(),
  commercial_model text default 'pay_per_use',
  notes text
);

create table if not exists dossier_request_items (
  id uuid primary key default gen_random_uuid(),
  dossier_request_id uuid references dossier_requests(id) on delete cascade,
  label text not null,
  source_type text,
  provider_label text,
  status text,
  eta text,
  confidence_impact text,
  unlocks text[] default '{}',
  created_at timestamptz default now()
);

create index if not exists properties_city_idx on properties(city);
create index if not exists properties_state_idx on properties(state);
create index if not exists properties_region_idx on properties(region);
create index if not exists properties_status_idx on properties(status);
create index if not exists property_evidence_documents_property_id_idx
  on property_evidence_documents(property_id);
create index if not exists dossier_requests_property_id_idx
  on dossier_requests(property_id);
create index if not exists dossier_request_items_dossier_request_id_idx
  on dossier_request_items(dossier_request_id);
