-- Impressão 0.3 — segurança, revogação de computadores e pedidos atômicos

-- =========================================================
-- 1. Controle de ativação da bridge
-- =========================================================

alter table public.bridges
  add column if not exists active boolean not null default true;

alter table public.bridges
  add column if not exists deactivated_at timestamptz;

create index if not exists idx_bridges_active
  on public.bridges (establishment_id, active, last_seen_at desc);


-- Heartbeat:
-- bridge desativada não pode voltar para online.
create or replace function public.heartbeat_bridge(
  p_token text,
  p_version text default null,
  p_device_name text default null
)
returns boolean
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  v_updated integer := 0;
begin
  perform public.recover_stale_print_jobs();

  update public.bridges
     set status = 'online',
         last_seen_at = now(),
         version = coalesce(p_version, version),
         device_name = coalesce(nullif(p_device_name, ''), device_name)
   where token_hash =
     encode(extensions.digest(convert_to(p_token, 'UTF8'), 'sha256'::text), 'hex')
     and active = true;

  get diagnostics v_updated = row_count;
  return v_updated = 1;
end;
$$;

revoke all on function public.heartbeat_bridge(text, text, text) from public;
grant execute on function public.heartbeat_bridge(text, text, text) to anon;


-- =========================================================
-- 2. Funções da fila passam a exigir bridge ativa
-- =========================================================

create or replace function public.list_recent_print_jobs(
  p_token text,
  p_limit integer default 60
)
returns jsonb
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  v_establishment_id uuid;
  v_limit integer := greatest(1, least(coalesce(p_limit, 60), 100));
  v_jobs jsonb;
begin
  select b.establishment_id
    into v_establishment_id
    from public.bridges b
   where b.token_hash =
     encode(extensions.digest(convert_to(p_token, 'UTF8'), 'sha256'::text), 'hex')
     and b.active = true
   limit 1;

  if v_establishment_id is null then
    raise exception 'Este computador foi desativado pelo administrador.';
  end if;

  select coalesce(
    jsonb_agg(row_to_json(x)::jsonb order by x.created_at desc),
    '[]'::jsonb
  )
  into v_jobs
  from (
    select
      j.id as job_id,
      j.order_id,
      j.printer_id,
      j.copy_number,
      j.status,
      j.attempts,
      j.error_message,
      j.created_at,
      j.printing_at,
      j.printed_at,
      o.order_number,
      o.customer_name,
      o.customer_phone,
      o.order_type,
      o.address,
      o.delivery_region,
      o.delivery_fee,
      o.payment_method,
      o.notes,
      o.subtotal,
      o.total,
      o.status as order_status,
      o.created_at as order_created_at,
      coalesce(
        (
          select jsonb_agg(
            jsonb_build_object(
              'id', oi.id,
              'product_name', oi.product_name,
              'quantity', oi.quantity,
              'unit_price', oi.unit_price,
              'options', oi.options,
              'notes', oi.notes
            )
            order by oi.created_at
          )
          from public.order_items oi
          where oi.order_id = o.id
        ),
        '[]'::jsonb
      ) as items
    from public.print_jobs j
    join public.orders o on o.id = j.order_id
    where o.establishment_id = v_establishment_id
    order by j.created_at desc
    limit v_limit
  ) x;

  return v_jobs;
end;
$$;


create or replace function public.claim_print_job(p_token text)
returns jsonb
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  v_job_id uuid;
  v_printer_id uuid;
  v_bridge_id uuid;
  v_establishment_id uuid;
  v_payload jsonb;
begin
  perform public.recover_stale_print_jobs();

  select
    j.id,
    j.printer_id,
    b.id,
    b.establishment_id
  into
    v_job_id,
    v_printer_id,
    v_bridge_id,
    v_establishment_id
  from public.print_jobs j
  join public.printers p
    on p.id = j.printer_id
   and p.active = true
  join public.bridges b
    on b.id = p.bridge_id
   and b.active = true
   and b.token_hash =
     encode(extensions.digest(convert_to(p_token, 'UTF8'), 'sha256'::text), 'hex')
  where j.status = 'pending'
  order by j.created_at
  for update of j skip locked
  limit 1;

  if v_bridge_id is null then
    if exists (
      select 1 from public.bridges b
       where b.token_hash =
         encode(extensions.digest(convert_to(p_token, 'UTF8'), 'sha256'::text), 'hex')
         and b.active = false
    ) then
      raise exception 'Este computador foi desativado pelo administrador.';
    end if;
    return null;
  end if;

  update public.bridges
     set status = 'online',
         last_seen_at = now()
   where id = v_bridge_id;

  update public.print_jobs
     set status = 'printing',
         attempts = attempts + 1,
         printing_at = now()
   where id = v_job_id;

  select jsonb_build_object(
    'job_id', j.id,
    'order_id', o.id,
    'printer_id', j.printer_id,
    'establishment_id', o.establishment_id,
    'order_number', o.order_number,
    'customer_name', o.customer_name,
    'customer_phone', o.customer_phone,
    'order_type', o.order_type,
    'address', o.address,
    'delivery_region', o.delivery_region,
    'delivery_fee', o.delivery_fee,
    'payment_method', o.payment_method,
    'notes', o.notes,
    'subtotal', o.subtotal,
    'total', o.total,
    'created_at', o.created_at,
    'items', coalesce(
      (
        select jsonb_agg(
          jsonb_build_object(
            'id', oi.id,
            'product_id', oi.product_id,
            'product_name', oi.product_name,
            'quantity', oi.quantity,
            'unit_price', oi.unit_price,
            'options', oi.options,
            'notes', oi.notes
          )
          order by oi.created_at
        )
        from public.order_items oi
        where oi.order_id = o.id
      ),
      '[]'::jsonb
    )
  )
  into v_payload
  from public.print_jobs j
  join public.orders o on o.id = j.order_id
  where j.id = v_job_id;

  return v_payload;
end;
$$;


create or replace function public.claim_specific_print_job(
  p_token text,
  p_job_id uuid
)
returns jsonb
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  v_job_id uuid;
  v_printer_id uuid;
  v_bridge_id uuid;
  v_establishment_id uuid;
  v_payload jsonb;
begin
  perform public.recover_stale_print_jobs();

  select
    j.id,
    j.printer_id,
    b.id,
    b.establishment_id
  into
    v_job_id,
    v_printer_id,
    v_bridge_id,
    v_establishment_id
  from public.print_jobs j
  join public.printers p
    on p.id = j.printer_id
   and p.active = true
  join public.bridges b
    on b.id = p.bridge_id
   and b.active = true
   and b.token_hash =
     encode(extensions.digest(convert_to(p_token, 'UTF8'), 'sha256'::text), 'hex')
  where j.id = p_job_id
    and j.status = 'pending'
  for update of j skip locked;

  if v_job_id is null then
    if exists (
      select 1 from public.bridges b
       where b.token_hash =
         encode(extensions.digest(convert_to(p_token, 'UTF8'), 'sha256'::text), 'hex')
         and b.active = false
    ) then
      raise exception 'Este computador foi desativado pelo administrador.';
    end if;
    return null;
  end if;

  update public.bridges
     set status = 'online',
         last_seen_at = now()
   where id = v_bridge_id;

  update public.print_jobs
     set status = 'printing',
         attempts = attempts + 1,
         printing_at = now()
   where id = v_job_id;

  select jsonb_build_object(
    'job_id', j.id,
    'order_id', o.id,
    'printer_id', j.printer_id,
    'establishment_id', o.establishment_id,
    'order_number', o.order_number,
    'customer_name', o.customer_name,
    'customer_phone', o.customer_phone,
    'order_type', o.order_type,
    'address', o.address,
    'delivery_region', o.delivery_region,
    'delivery_fee', o.delivery_fee,
    'payment_method', o.payment_method,
    'notes', o.notes,
    'subtotal', o.subtotal,
    'total', o.total,
    'created_at', o.created_at,
    'items', coalesce(
      (
        select jsonb_agg(
          jsonb_build_object(
            'id', oi.id,
            'product_id', oi.product_id,
            'product_name', oi.product_name,
            'quantity', oi.quantity,
            'unit_price', oi.unit_price,
            'options', oi.options,
            'notes', oi.notes
          )
          order by oi.created_at
        )
        from public.order_items oi
        where oi.order_id = o.id
      ),
      '[]'::jsonb
    )
  )
  into v_payload
  from public.print_jobs j
  join public.orders o on o.id = j.order_id
  where j.id = v_job_id;

  return v_payload;
end;
$$;


create or replace function public.complete_print_job(
  p_token text,
  p_job_id uuid,
  p_success boolean,
  p_error_message text default null
)
returns boolean
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  v_updated integer := 0;
begin
  update public.print_jobs j
     set status = case when p_success then 'printed' else 'failed' end,
         error_message = case when p_success then null else p_error_message end,
         printed_at = case when p_success then now() else null end,
         printing_at = null
   where j.id = p_job_id
     and exists (
       select 1
       from public.printers p
       join public.bridges b on b.id = p.bridge_id
       where p.id = j.printer_id
         and b.active = true
         and b.token_hash =
           encode(extensions.digest(convert_to(p_token, 'UTF8'), 'sha256'::text), 'hex')
     );

  get diagnostics v_updated = row_count;

  if v_updated = 0 and exists (
    select 1 from public.bridges b
     where b.active = false
       and b.token_hash =
         encode(extensions.digest(convert_to(p_token, 'UTF8'), 'sha256'::text), 'hex')
  ) then
    raise exception 'Este computador foi desativado pelo administrador.';
  end if;

  update public.bridges b
     set status = 'online',
         last_seen_at = now()
   where b.active = true
     and b.token_hash =
       encode(extensions.digest(convert_to(p_token, 'UTF8'), 'sha256'::text), 'hex');

  return v_updated = 1;
end;
$$;


-- Reimpressão direta
create or replace function public.request_reprint_now(
  p_token text,
  p_job_id uuid
)
returns jsonb
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  v_establishment_id uuid;
  v_order_id uuid;
  v_printer_id uuid;
  v_next_copy integer;
  v_new_job_id uuid;
  v_payload jsonb;
begin
  select
    b.establishment_id,
    j.order_id,
    j.printer_id
  into
    v_establishment_id,
    v_order_id,
    v_printer_id
  from public.bridges b
  join public.printers p
    on p.bridge_id = b.id
   and p.active = true
  join public.print_jobs j
    on j.printer_id = p.id
  where b.active = true
    and b.token_hash =
      encode(extensions.digest(convert_to(p_token, 'UTF8'), 'sha256'::text), 'hex')
    and j.id = p_job_id
  limit 1;

  if v_establishment_id is null then
    if exists (
      select 1 from public.bridges b
       where b.token_hash =
         encode(extensions.digest(convert_to(p_token, 'UTF8'), 'sha256'::text), 'hex')
         and b.active = false
    ) then
      raise exception 'Este computador foi desativado pelo administrador.';
    end if;
    return null;
  end if;

  select coalesce(max(copy_number), 0) + 1
    into v_next_copy
    from public.print_jobs
   where order_id = v_order_id
     and printer_id = v_printer_id;

  insert into public.print_jobs (
    order_id,
    printer_id,
    copy_number,
    status,
    attempts,
    printing_at
  )
  values (
    v_order_id,
    v_printer_id,
    v_next_copy,
    'printing',
    1,
    now()
  )
  returning id into v_new_job_id;

  select jsonb_build_object(
    'job_id', j.id,
    'order_id', o.id,
    'printer_id', j.printer_id,
    'establishment_id', o.establishment_id,
    'order_number', o.order_number,
    'customer_name', o.customer_name,
    'customer_phone', o.customer_phone,
    'order_type', o.order_type,
    'address', o.address,
    'delivery_region', o.delivery_region,
    'delivery_fee', o.delivery_fee,
    'payment_method', o.payment_method,
    'notes', o.notes,
    'subtotal', o.subtotal,
    'total', o.total,
    'created_at', o.created_at,
    'items', coalesce(
      (
        select jsonb_agg(
          jsonb_build_object(
            'id', oi.id,
            'product_id', oi.product_id,
            'product_name', oi.product_name,
            'quantity', oi.quantity,
            'unit_price', oi.unit_price,
            'options', oi.options,
            'notes', oi.notes
          )
          order by oi.created_at
        )
        from public.order_items oi
        where oi.order_id = o.id
      ),
      '[]'::jsonb
    )
  )
  into v_payload
  from public.print_jobs j
  join public.orders o on o.id = j.order_id
  where j.id = v_new_job_id;

  return v_payload;
end;
$$;

revoke all on function public.list_recent_print_jobs(text, integer) from public;
revoke all on function public.claim_print_job(text) from public;
revoke all on function public.claim_specific_print_job(text, uuid) from public;
revoke all on function public.complete_print_job(text, uuid, boolean, text) from public;
revoke all on function public.request_reprint_now(text, uuid) from public;

grant execute on function public.list_recent_print_jobs(text, integer) to anon;
grant execute on function public.claim_print_job(text) to anon;
grant execute on function public.claim_specific_print_job(text, uuid) to anon;
grant execute on function public.complete_print_job(text, uuid, boolean, text) to anon;
grant execute on function public.request_reprint_now(text, uuid) to anon;


-- =========================================================
-- 3. Administração: revogar / reativar computador
-- =========================================================

create or replace function public.admin_set_bridge_active(
  p_bridge_id uuid,
  p_active boolean
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_bridge public.bridges;
begin
  if not public.is_admin() then
    raise exception 'Acesso administrativo negado.';
  end if;

  update public.bridges
     set active = p_active,
         deactivated_at = case when p_active then null else now() end,
         status = case when p_active then 'offline' else 'offline' end
   where id = p_bridge_id
  returning * into v_bridge;

  if v_bridge.id is null then
    raise exception 'Computador não encontrado.';
  end if;

  return jsonb_build_object(
    'id', v_bridge.id,
    'deviceName', v_bridge.device_name,
    'active', v_bridge.active,
    'status', v_bridge.status,
    'deactivatedAt', v_bridge.deactivated_at
  );
end;
$$;

revoke all on function public.admin_set_bridge_active(uuid, boolean) from public;
grant execute on function public.admin_set_bridge_active(uuid, boolean) to authenticated;


create or replace function public.admin_list_bridges(
  p_establishment_id uuid
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_data jsonb;
begin
  if not public.is_admin() then
    raise exception 'Acesso administrativo negado.';
  end if;

  select coalesce(jsonb_agg(
    jsonb_build_object(
      'id', b.id,
      'deviceName', b.device_name,
      'version', b.version,
      'status', b.status,
      'active', b.active,
      'lastSeenAt', b.last_seen_at,
      'createdAt', b.created_at,
      'deactivatedAt', b.deactivated_at
    )
    order by b.last_seen_at desc nulls last
  ), '[]'::jsonb)
    into v_data
    from public.bridges b
   where b.establishment_id = p_establishment_id;

  return v_data;
end;
$$;

revoke all on function public.admin_list_bridges(uuid) from public;
grant execute on function public.admin_list_bridges(uuid) to authenticated;


-- =========================================================
-- 4. Pedidos públicos: uma única RPC atômica
-- =========================================================

create or replace function public.create_public_order(
  p_establishment_id uuid,
  p_customer_name text,
  p_customer_phone text,
  p_address text,
  p_delivery_region text,
  p_delivery_fee numeric,
  p_payment_method text,
  p_subtotal numeric,
  p_total numeric,
  p_items jsonb
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_order_id uuid;
  v_order_number integer;
  v_item jsonb;
begin
  if not exists (
    select 1
    from public.establishments
    where id = p_establishment_id
      and active = true
  ) then
    raise exception 'Estabelecimento não encontrado ou inativo.';
  end if;

  if nullif(trim(coalesce(p_customer_name, '')), '') is null then
    raise exception 'Informe o nome do cliente.';
  end if;

  if p_items is null or jsonb_typeof(p_items) <> 'array' or jsonb_array_length(p_items) = 0 then
    raise exception 'O pedido precisa ter pelo menos um item.';
  end if;

  if coalesce(p_subtotal, 0) < 0
     or coalesce(p_delivery_fee, 0) < 0
     or coalesce(p_total, 0) < 0 then
    raise exception 'Os valores do pedido são inválidos.';
  end if;

  select coalesce(max(order_number), 0) + 1
    into v_order_number
    from public.orders
   where establishment_id = p_establishment_id;

  insert into public.orders (
    establishment_id,
    order_number,
    customer_name,
    customer_phone,
    order_type,
    address,
    delivery_region,
    delivery_fee,
    payment_method,
    notes,
    subtotal,
    total,
    status
  )
  values (
    p_establishment_id,
    v_order_number,
    trim(p_customer_name),
    nullif(trim(p_customer_phone), ''),
    'delivery',
    nullif(trim(p_address), ''),
    nullif(trim(p_delivery_region), ''),
    round(coalesce(p_delivery_fee, 0), 2),
    nullif(trim(p_payment_method), ''),
    null,
    round(coalesce(p_subtotal, 0), 2),
    round(coalesce(p_total, 0), 2),
    'received'
  )
  returning id into v_order_id;

  for v_item in select value from jsonb_array_elements(p_items)
  loop
    if nullif(trim(v_item->>'product_name'), '') is null then
      raise exception 'Um dos itens do pedido está inválido.';
    end if;

    insert into public.order_items (
      order_id,
      product_id,
      product_name,
      quantity,
      unit_price,
      options,
      notes
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
$$;

revoke all on function public.create_public_order(
  uuid, text, text, text, text, numeric, text, numeric, numeric, jsonb
) from public;

grant execute on function public.create_public_order(
  uuid, text, text, text, text, numeric, text, numeric, numeric, jsonb
) to anon;


-- Depois que o cardápio tiver sido migrado para create_public_order,
-- ninguém mais precisa inserir diretamente nessas tabelas como anon.
revoke insert on public.orders from anon;
revoke insert on public.order_items from anon;

-- Reativação segura:
-- um novo código também pode reativar uma bridge previamente desativada.
create or replace function public.activate_bridge(
  p_code text,
  p_device_name text default null,
  p_version text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  v_code text;
  v_code_id uuid;
  v_establishment_id uuid;
  v_bridge_id uuid;
  v_token text;
  v_printer_id uuid;
  v_establishment_name text;
  v_device_name text;
begin
  v_code := upper(replace(replace(trim(coalesce(p_code, '')), '-', ''), ' ', ''));

  if length(v_code) < 8 then
    raise exception 'Código de ativação inválido.';
  end if;

  select a.id, a.establishment_id
    into v_code_id, v_establishment_id
    from public.activation_codes a
   where a.code_hash =
     encode(extensions.digest(convert_to(v_code, 'UTF8'), 'sha256'::text), 'hex')
     and a.used_at is null
     and (a.expires_at is null or a.expires_at > now())
   limit 1
   for update;

  if v_code_id is null then
    raise exception 'Código de ativação inválido, expirado ou já utilizado.';
  end if;

  select e.name
    into v_establishment_name
    from public.establishments e
   where e.id = v_establishment_id
     and e.active = true;

  if v_establishment_name is null then
    raise exception 'Estabelecimento inativo.';
  end if;

  v_token := encode(extensions.gen_random_bytes(32), 'hex');
  v_device_name := coalesce(nullif(trim(p_device_name), ''), 'Computador');

  select b.id
    into v_bridge_id
    from public.bridges b
   where b.establishment_id = v_establishment_id
     and b.device_name = v_device_name
   limit 1;

  if v_bridge_id is null then
    insert into public.bridges (
      establishment_id,
      device_name,
      version,
      status,
      active,
      deactivated_at,
      last_seen_at,
      token_hash
    )
    values (
      v_establishment_id,
      v_device_name,
      coalesce(nullif(trim(p_version), ''), '0.2.0'),
      'online',
      true,
      null,
      now(),
      encode(extensions.digest(convert_to(v_token, 'UTF8'), 'sha256'::text), 'hex')
    )
    returning id into v_bridge_id;
  else
    update public.bridges
       set version = coalesce(nullif(trim(p_version), ''), version, '0.2.0'),
           status = 'online',
           active = true,
           deactivated_at = null,
           last_seen_at = now(),
           token_hash = encode(extensions.digest(convert_to(v_token, 'UTF8'), 'sha256'::text), 'hex')
     where id = v_bridge_id;
  end if;

  select p.id
    into v_printer_id
    from public.printers p
   where p.establishment_id = v_establishment_id
   order by p.created_at
   limit 1;

  if v_printer_id is null then
    insert into public.printers (
      establishment_id,
      bridge_id,
      name,
      connection_type,
      active
    )
    values (
      v_establishment_id,
      v_bridge_id,
      'Impressora principal',
      'windows',
      true
    )
    returning id into v_printer_id;
  else
    update public.printers
       set bridge_id = v_bridge_id
     where id = v_printer_id;
  end if;

  update public.activation_codes
     set used_at = now(),
         used_bridge_id = v_bridge_id
   where id = v_code_id;

  return jsonb_build_object(
    'bridgeToken', v_token,
    'bridgeId', v_bridge_id,
    'establishmentId', v_establishment_id,
    'establishmentName', v_establishment_name,
    'printerId', v_printer_id
  );
end;
$$;

revoke all on function public.activate_bridge(text, text, text) from public;
grant execute on function public.activate_bridge(text, text, text) to anon;


-- Least privilege: o cliente não escreve diretamente nas tabelas de pedidos.
revoke insert on public.orders from anon, authenticated;
revoke insert on public.order_items from anon, authenticated;
