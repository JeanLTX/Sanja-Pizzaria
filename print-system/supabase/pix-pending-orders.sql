-- Persistência de pedidos Pix e bloqueio da impressão até a confirmação.
alter table public.orders
  add column if not exists pix_order_code text,
  add column if not exists payment_status text not null default 'not_required',
  add column if not exists payment_confirmed_at timestamptz;

alter table public.orders
  drop constraint if exists orders_payment_status_check;

alter table public.orders
  add constraint orders_payment_status_check
  check (payment_status in ('not_required', 'pending', 'paid', 'failed', 'cancelled'));

create unique index if not exists idx_orders_pix_order_code
  on public.orders (establishment_id, pix_order_code)
  where pix_order_code is not null;

create or replace function public.create_print_job_for_order()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_printer_id uuid;
begin
  -- Nunca colocar Pix não confirmado na fila.
  if lower(coalesce(new.payment_method, '')) = 'pix'
     and coalesce(new.payment_status, 'pending') <> 'paid' then
    return new;
  end if;

  -- Em atualizações, só criar a impressão quando o Pix mudar para pago.
  if tg_op = 'UPDATE'
     and not (
       lower(coalesce(old.payment_method, '')) = 'pix'
       and coalesce(old.payment_status, 'pending') <> 'paid'
       and new.payment_status = 'paid'
     ) then
    return new;
  end if;

  select id
    into v_printer_id
    from public.printers
   where establishment_id = new.establishment_id
     and active = true
   order by created_at
   limit 1;

  if v_printer_id is not null then
    insert into public.print_jobs (order_id, printer_id, copy_number, status)
    values (new.id, v_printer_id, 1, 'pending')
    on conflict (order_id, printer_id, copy_number) do nothing;
  end if;

  return new;
end;
$$;

drop trigger if exists trg_create_print_job_for_order on public.orders;
create trigger trg_create_print_job_for_order
after insert or update of payment_status on public.orders
for each row
execute function public.create_print_job_for_order();

create or replace function public.create_public_order_with_payment(
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
  p_pix_order_code text
)
returns uuid
language plpgsql
security definer
set search_path = public
as $function$
declare
  v_order_id uuid;
  v_order_number integer;
  v_item jsonb;
  v_payment_method text := nullif(trim(coalesce(p_payment_method, '')), '');
  v_pix_code text := nullif(trim(coalesce(p_pix_order_code, '')), '');
  v_payment_status text;
begin
  if not exists (
    select 1 from public.establishments
    where id = p_establishment_id and active = true
  ) then
    raise exception 'Estabelecimento não encontrado ou inativo.';
  end if;

  if nullif(trim(coalesce(p_customer_name, '')), '') is null then
    raise exception 'Informe o nome do cliente.';
  end if;

  if p_items is null or jsonb_typeof(p_items) <> 'array' or jsonb_array_length(p_items) = 0 then
    raise exception 'O pedido precisa ter pelo menos um item.';
  end if;

  if coalesce(p_subtotal, 0) < 0 or coalesce(p_delivery_fee, 0) < 0 or coalesce(p_total, 0) < 0 then
    raise exception 'Os valores do pedido são inválidos.';
  end if;

  if coalesce(p_order_type, '') not in ('delivery', 'pickup') then
    raise exception 'Tipo de pedido inválido.';
  end if;

  if p_order_type = 'pickup' and coalesce(p_delivery_fee, 0) <> 0 then
    raise exception 'Pedidos para retirada não podem cobrar taxa de entrega.';
  end if;

  if lower(coalesce(v_payment_method, '')) = 'pix' and v_pix_code is null then
    raise exception 'O código do pedido Pix é obrigatório.';
  end if;

  v_payment_status := case when lower(coalesce(v_payment_method, '')) = 'pix' then 'pending' else 'not_required' end;

  perform pg_advisory_xact_lock(hashtextextended(p_establishment_id::text, 0));

  select coalesce(max(order_number), 0) + 1
    into v_order_number
    from public.orders
   where establishment_id = p_establishment_id;

  insert into public.orders (
    establishment_id, order_number, customer_name, customer_phone,
    order_type, address, delivery_region, delivery_fee, payment_method,
    notes, subtotal, total, status, pix_order_code, payment_status
  )
  values (
    p_establishment_id, v_order_number, trim(p_customer_name),
    nullif(trim(p_customer_phone), ''),
    p_order_type,
    case when p_order_type = 'delivery' then nullif(trim(p_address), '') else null end,
    case when p_order_type = 'delivery' then nullif(trim(p_delivery_region), '') else null end,
    case when p_order_type = 'delivery' then round(coalesce(p_delivery_fee, 0), 2) else 0 end,
    v_payment_method, null,
    round(coalesce(p_subtotal, 0), 2),
    round(coalesce(p_total, 0), 2), 'received',
    v_pix_code, v_payment_status
  )
  returning id into v_order_id;

  for v_item in select value from jsonb_array_elements(p_items)
  loop
    if nullif(trim(v_item->>'product_name'), '') is null then
      raise exception 'Um dos itens do pedido está inválido.';
    end if;

    insert into public.order_items (
      order_id, product_id, product_name, quantity, unit_price, options, notes
    )
    values (
      v_order_id,
      nullif(v_item->>'product_id', ''),
      trim(v_item->>'product_name'),
      greatest(1, coalesce((v_item->>'quantity')::integer, 1)),
      round(coalesce((v_item->>'unit_price')::numeric, 0), 2),
      coalesce(v_item->'options', '{}'::jsonb),
      nullif(v_item->>'notes', '')
    );
  end loop;

  return v_order_id;
end;
$function$;

revoke all on function public.create_public_order_with_payment(uuid, text, text, text, text, numeric, text, numeric, numeric, jsonb, text, text) from public;
grant execute on function public.create_public_order_with_payment(uuid, text, text, text, text, numeric, text, numeric, numeric, jsonb, text, text) to anon, authenticated;
notify pgrst, 'reload schema';
