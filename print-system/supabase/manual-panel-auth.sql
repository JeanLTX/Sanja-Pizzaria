-- Acesso restrito ao painel de atendimento manual da Sanja.
-- O usuário precisa existir em auth.users e ser explicitamente liberado nesta tabela.
create table if not exists public.manual_panel_access (
  user_id uuid not null references auth.users(id) on delete cascade,
  establishment_id uuid not null references public.establishments(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, establishment_id)
);
alter table public.manual_panel_access enable row level security;
revoke all on table public.manual_panel_access from public, anon, authenticated;

create or replace function public.has_manual_panel_access(p_establishment_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $function$
  select auth.uid() is not null
     and exists (
       select 1
       from public.manual_panel_access a
       join public.establishments e on e.id = a.establishment_id
       where a.user_id = auth.uid()
         and a.establishment_id = p_establishment_id
         and e.active = true
     );
$function$;
revoke all on function public.has_manual_panel_access(uuid) from public, anon;
grant execute on function public.has_manual_panel_access(uuid) to authenticated;
create or replace function public.create_manual_order(
  p_order_id uuid,
  p_establishment_id uuid,
  p_customer_name text,
  p_customer_phone text,
  p_address text,
  p_delivery_region text,
  p_delivery_fee numeric,
  p_payment_method text,
  p_subtotal numeric,
  p_total numeric,
  p_items jsonb,
  p_order_type text,
  p_notes text default null
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $function$
declare
  v_existing public.orders%rowtype;
  v_order_id uuid;
  v_order_number integer;
  v_item jsonb;
  v_printer_id uuid;
  v_print_queued boolean := false;
  v_already_registered boolean := false;
  v_payment_method text := nullif(trim(coalesce(p_payment_method, '')), '');
  v_notes text := nullif(trim(coalesce(p_notes, '')), '');
begin
  if auth.uid() is null or not exists (
    select 1
    from public.manual_panel_access a
    where a.user_id = auth.uid()
      and a.establishment_id = p_establishment_id
  ) then
    raise exception 'Acesso não autorizado ao painel de atendimento.';
  end if;

  if p_order_id is null then
    raise exception 'Identificador do pedido inválido.';
  end if;

  if not exists (
    select 1 from public.establishments
    where id = p_establishment_id and active = true
  ) then
    raise exception 'Estabelecimento não encontrado ou inativo.';
  end if;

  if nullif(trim(coalesce(p_customer_name, '')), '') is null then
    raise exception 'Informe o nome do cliente.';
  end if;

  if coalesce(p_order_type, '') not in ('delivery', 'pickup') then
    raise exception 'Tipo de pedido inválido.';
  end if;

  if p_order_type = 'delivery'
     and nullif(trim(coalesce(p_address, '')), '') is null then
    raise exception 'Informe o endereço de entrega.';
  end if;

  if p_order_type = 'pickup' and coalesce(p_delivery_fee, 0) <> 0 then
    raise exception 'Pedidos para retirada não podem cobrar taxa de entrega.';
  end if;

  if coalesce(p_subtotal, 0) < 0
     or coalesce(p_delivery_fee, 0) < 0
     or coalesce(p_total, 0) < 0
     or abs(coalesce(p_total, 0) - (coalesce(p_subtotal, 0) + coalesce(p_delivery_fee, 0))) > 0.02 then
    raise exception 'Os valores do pedido são inválidos.';
  end if;

  if p_items is null
     or jsonb_typeof(p_items) <> 'array'
     or jsonb_array_length(p_items) = 0 then
    raise exception 'O pedido precisa ter pelo menos um item.';
  end if;

  if exists (
    select 1
    from jsonb_array_elements(p_items) item
    where nullif(trim(coalesce(item->>'product_name', '')), '') is null
       or coalesce((item->>'quantity')::integer, 0) <= 0
       or coalesce((item->>'unit_price')::numeric, -1) < 0
  ) then
    raise exception 'Um dos itens do pedido está inválido.';
  end if;

  perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(p_establishment_id::text, 0));

  select * into v_existing
  from public.orders
  where id = p_order_id;

  if found then
    if v_existing.establishment_id <> p_establishment_id then
      raise exception 'Identificador do pedido já utilizado.';
    end if;
    v_order_id := v_existing.id;
    v_order_number := v_existing.order_number;
    v_already_registered := true;
  else
    select coalesce(max(order_number), 0) + 1
      into v_order_number
      from public.orders
     where establishment_id = p_establishment_id;

    insert into public.orders (
      id, establishment_id, order_number, customer_name, customer_phone,
      order_type, address, delivery_region, delivery_fee, payment_method,
      notes, subtotal, total, status, payment_status
    )
    values (
      p_order_id,
      p_establishment_id,
      v_order_number,
      trim(p_customer_name),
      nullif(trim(p_customer_phone), ''),
      p_order_type,
      case when p_order_type = 'delivery' then nullif(trim(p_address), '') else null end,
      case when p_order_type = 'delivery' then nullif(trim(p_delivery_region), '') else null end,
      case when p_order_type = 'delivery' then round(coalesce(p_delivery_fee, 0), 2) else 0 end,
      v_payment_method,
      v_notes,
      round(coalesce(p_subtotal, 0), 2),
      round(coalesce(p_total, 0), 2),
      'received',
      case when lower(coalesce(v_payment_method, '')) = 'pix' then 'pending' else 'not_required' end
    )
    returning id into v_order_id;

    for v_item in select value from jsonb_array_elements(p_items)
    loop
      insert into public.order_items (
        order_id, product_id, product_name, quantity, unit_price, options, notes
      )
      values (
        v_order_id,
        nullif(v_item->>'product_id', ''),
        trim(v_item->>'product_name'),
        (v_item->>'quantity')::integer,
        round((v_item->>'unit_price')::numeric, 2),
        coalesce(v_item->'options', '{}'::jsonb),
        nullif(trim(coalesce(v_item->>'notes', '')), '')
      );
    end loop;
  end if;

  if not exists (
    select 1 from public.print_jobs where order_id = v_order_id
  ) then
    select p.id into v_printer_id
    from public.printers p
    where p.establishment_id = p_establishment_id
      and p.active = true
    order by p.created_at
    limit 1;

    if v_printer_id is not null then
      insert into public.print_jobs (order_id, printer_id, copy_number, status)
      values (v_order_id, v_printer_id, 1, 'pending')
      on conflict (order_id, printer_id, copy_number) do nothing;
    end if;
  end if;

  select exists (
    select 1 from public.print_jobs where order_id = v_order_id
  ) into v_print_queued;

  return jsonb_build_object(
    'order_id', v_order_id,
    'order_number', v_order_number,
    'print_queued', v_print_queued,
    'already_registered', v_already_registered
  );
end;
$function$;

revoke all on function public.create_manual_order(uuid, uuid, text, text, text, text, numeric, text, numeric, numeric, jsonb, text, text) from public, anon;
grant execute on function public.create_manual_order(uuid, uuid, text, text, text, text, numeric, text, numeric, numeric, jsonb, text, text) to authenticated;

