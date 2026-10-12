create extension if not exists "pgcrypto";

create table if not exists public.filing_returns (
  id uuid primary key default gen_random_uuid(),
  tenant_id text not null,
  assessment_year text not null check (assessment_year ~ '^[0-9]{4}-[0-9]{2}$'),
  status text not null default 'draft',
  selected_form text not null default 'auto',
  version integer not null default 1 check (version > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.filing_audit_events (
  id uuid primary key default gen_random_uuid(),
  tenant_id text not null,
  return_id uuid not null references public.filing_returns(id) on delete cascade,
  actor_kind text not null,
  actor_id text not null,
  action text not null,
  version integer not null,
  occurred_at timestamptz not null default now()
);

create index if not exists filing_returns_tenant_idx on public.filing_returns (tenant_id);
create index if not exists filing_audit_return_idx on public.filing_audit_events (return_id, occurred_at);

alter table public.filing_returns enable row level security;
alter table public.filing_audit_events enable row level security;

create policy "service role manages filing returns"
  on public.filing_returns for all
  to service_role
  using (true)
  with check (true);

create policy "service role manages filing audit"
  on public.filing_audit_events for all
  to service_role
  using (true)
  with check (true);
