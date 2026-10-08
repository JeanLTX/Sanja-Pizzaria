-- Jean Print System - estrutura inicial do Supabase
-- Execute este arquivo no SQL Editor do projeto Supabase.

create extension if not exists pgcrypto;

create table if not exists public.establishments (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.bridges (
  id uuid primary key default gen_random_uuid(),
  establishment_id uuid not null references public.establishments(id) on delete cascade,
  device_name text not null,
  version text,
  status text not null default 'offline'
    check (status in ('online', 'offline', 'error')),
  last_seen_at timestamptz,
  created_at timestamptz not null default now(),
  unique (establishment_id, device_name)
);

create table if not exists public.printers (
  id uuid primary key default gen_random_uuid(),
  establishment_id uuid not null references public.establishments(id) on delete cascade,
  bridge_id uuid references public.bridges(id) on delete set null,
  name text not null,
  model text,
  connection_type text not null default 'windows'
    check (connection_type in ('windows', 'network', 'usb')),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  unique (establishment_id, name)
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  establishment_id uuid not null references public.establishments(id) on delete cascade,
  order_number integer,
  customer_name text not null,
  customer_phone text,
  order_type text not null default 'delivery'
    check (order_type in ('delivery', 'pickup', 'local')),
  address text,
  delivery_region text,
  delivery_fee numeric(10,2) not null default 0,
  payment_method text,
  notes text,
  subtotal numeric(10,2) not null default 0,
  total numeric(10,2) not null default 0,
  status text not null default 'received'
    check (status in ('received', 'preparing', 'completed', 'cancelled')),
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id text,
  product_name text not null,
  quantity integer not null default 1 check (quantity > 0),
  unit_price numeric(10,2) not null default 0,
  options jsonb not null default '{}'::jsonb,
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.print_jobs (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  printer_id uuid not null references public.printers(id) on delete cascade,
  copy_number integer not null default 1 check (copy_number > 0),
  status text not null default 'pending'
    check (status in ('pending', 'printing', 'printed', 'failed', 'cancelled')),
  attempts integer not null default 0 check (attempts >= 0),
  error_message text,
  created_at timestamptz not null default now(),
  printed_at timestamptz,
  unique (order_id, printer_id, copy_number)
);

create index if not exists idx_orders_establishment_created
  on public.orders (establishment_id, created_at desc);

create index if not exists idx_print_jobs_queue
  on public.print_jobs (status, created_at);

create index if not exists idx_print_jobs_order
  on public.print_jobs (order_id);

create index if not exists idx_bridges_last_seen
  on public.bridges (establishment_id, last_seen_at desc);

alter table public.establishments enable row level security;
alter table public.bridges enable row level security;
alter table public.printers enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.print_jobs enable row level security;

insert into public.establishments (slug, name)
values ('sanja-pizzaria', 'Sanja Pizzaria')
on conflict (slug) do nothing;

-- Nenhuma policy pública é criada neste primeiro passo.
-- Isso é intencional: antes de liberar o cardápio para gravar pedidos,
-- vamos definir a autenticação/endpoint seguro e as policies corretas.
