-- Impressão 0.2 — ativação, simulação e recuperação da fila

alter table public.print_jobs
  add column if not exists printing_at timestamptz;

create table if not exists public.activation_codes (
  id uuid primary key default gen_random_uuid(),
  establishment_id uuid not null references public.establishments(id) on delete cascade,
  code_hash text not null unique,
  label text,
  expires_at timestamptz,
  used_at timestamptz,
  used_bridge_id uuid references public.bridges(id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists idx_activation_codes_establishment
  on public.activation_codes (establishment_id, created_at desc);

alter table public.activation_codes enable row level security;


-- Gera um código de ativação para uso pelo administrador no SQL Editor.
-- O código bruto nunca é salvo no banco.
create or replace function public.create_activation_code(
  p_establishment_id uuid,
  p_label text default null,
  p_hours integer default 24
)
returns text
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  v_code text;
begin
  if not exists (
    select 1
    from public.establishments
    where id = p_establishment_id
      and active = true
  ) then
    raise exception 'Estabelecimento não encontrado ou inativo.';
  end if;

  v_code := upper(substr(encode(extensions.gen_random_bytes(8), 'hex'), 1, 12));

  insert into public.activation_codes (
    establishment_id,
    code_hash,
    label,
    expires_at
  )
  values (
    p_establishment_id,
    encode(extensions.digest(convert_to(v_code, 'UTF8'), 'sha256'::text), 'hex'),
    nullif(trim(p_label), ''),
    case
      when p_hours is null then null
      else now() + make_interval(hours => greatest(1, p_hours))
    end
  );

  return substr(v_code, 1, 4) || '-' ||
         substr(v_code, 5, 4) || '-' ||
         substr(v_code, 9, 4);
end;
$$;

revoke all on function public.create_activation_code(uuid, text, integer) from public;


-- Ativa um novo computador com um código de uso único.
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

  select
    a.id,
    a.establishment_id
  into
    v_code_id,
    v_establishment_id
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
      last_seen_at,
      token_hash
    )
    values (
      v_establishment_id,
      v_device_name,
      coalesce(nullif(trim(p_version), ''), '0.2.0'),
      'online',
      now(),
      encode(extensions.digest(convert_to(v_token, 'UTF8'), 'sha256'::text), 'hex')
    )
    returning id into v_bridge_id;
  else
    update public.bridges
       set version = coalesce(nullif(trim(p_version), ''), version, '0.2.0'),
           status = 'online',
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


-- Cria um pedido de teste para validar a fila sem depender de uma impressora física.
create or replace function public.create_test_order(
  p_token text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_establishment_id uuid;
  v_order_id uuid;
  v_order_number integer;
  v_total numeric(10,2) := 39.90;
begin
  select b.establishment_id
    into v_establishment_id
    from public.bridges b
   where b.token_hash =
      encode(extensions.digest(convert_to(p_token, 'UTF8'), 'sha256'::text), 'hex')
   limit 1;

  if v_establishment_id is null then
    raise exception 'Dispositivo não autorizado.';
  end if;

  select coalesce(max(order_number), 0) + 1
    into v_order_number
    from public.orders
   where establishment_id = v_establishment_id;

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
    v_establishment_id,
    v_order_number,
    'Cliente de teste',
    '(00) 00000-0000',
    'delivery',
    'Rua de teste, 123 - Centro',
    'Centro',
    0,
    'Pix',
    'PEDIDO DE TESTE — não enviar ao cliente.',
    v_total,
    v_total,
    'received'
  )
  returning id into v_order_id;

  insert into public.order_items (
    order_id,
    product_name,
    quantity,
    unit_price,
    options,
    notes
  )
  values (
    v_order_id,
    'Pizza de teste',
    1,
    v_total,
    jsonb_build_object('details', 'Tamanho grande • simulação'),
    'Pedido criado pelo modo de teste.'
  );

  return jsonb_build_object(
    'orderId', v_order_id,
    'orderNumber', v_order_number
  );
end;
$$;

revoke all on function public.create_test_order(text) from public;
grant execute on function public.create_test_order(text) to anon;


-- Recuperação conservadora:
-- se o aplicativo morrer depois de reservar um pedido, ele não fica preso
-- indefinidamente em "printing". Após 90s vira falha e pode ser tentado novamente.
create or replace function public.recover_stale_print_jobs()
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  v_count integer;
begin
  update public.print_jobs
     set status = 'failed',
         error_message = coalesce(
           error_message,
           'A impressão foi interrompida antes da confirmação do aplicativo.'
         ),
         printing_at = null
   where status = 'printing'
     and printing_at is not null
     and printing_at < now() - interval '90 seconds';

  get diagnostics v_count = row_count;
  return v_count;
end;
$$;

revoke all on function public.recover_stale_print_jobs() from public;


-- Atualiza as funções existentes para registrar/limpar printing_at
-- e recuperar trabalhos abandonados antes de uma nova reserva.


-- Lista de pedidos protegida pelo token do dispositivo.
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
   limit 1;

  if v_establishment_id is null then
    return '[]'::jsonb;
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


-- Reserva automática. Trabalhos travados por mais de 90s viram falha
-- para evitar reimpressão silenciosa que possa gerar duplicidade.
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
   and b.token_hash =
     encode(extensions.digest(convert_to(p_token, 'UTF8'), 'sha256'::text), 'hex')
  where j.status = 'pending'
  order by j.created_at
  for update of j skip locked
  limit 1;

  update public.bridges
     set status = 'online',
         last_seen_at = now()
   where id = v_bridge_id;

  if v_job_id is null then
    return null;
  end if;

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


-- Reserva manual de um pedido específico pelo painel.
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
   and b.token_hash =
     encode(extensions.digest(convert_to(p_token, 'UTF8'), 'sha256'::text), 'hex')
  where j.id = p_job_id
    and j.status = 'pending'
  for update of j skip locked;

  if v_job_id is null then
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


-- Finaliza a impressão sem esconder uma falha.
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
         and b.token_hash =
           encode(extensions.digest(convert_to(p_token, 'UTF8'), 'sha256'::text), 'hex')
     );

  get diagnostics v_updated = row_count;

  update public.bridges b
     set status = 'online',
         last_seen_at = now()
   where b.token_hash =
     encode(extensions.digest(convert_to(p_token, 'UTF8'), 'sha256'::text), 'hex');

  return v_updated = 1;
end;
$$;


-- Solicita uma nova cópia sem alterar o pedido original.
create or replace function public.request_reprint(
  p_token text,
  p_job_id uuid
)
returns boolean
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  v_establishment_id uuid;
  v_order_id uuid;
  v_printer_id uuid;
  v_next_copy integer;
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
  join public.printers p on p.bridge_id = b.id and p.active = true
  join public.print_jobs j on j.printer_id = p.id
  where b.token_hash =
      encode(extensions.digest(convert_to(p_token, 'UTF8'), 'sha256'::text), 'hex')
    and j.id = p_job_id
  limit 1;

  if v_establishment_id is null then
    return false;
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
    printing_at
  )
  values (
    v_order_id,
    v_printer_id,
    v_next_copy,
    'pending',
    null
  );

  return true;
end;
$$;


revoke all on function public.list_recent_print_jobs(text, integer) from public;
revoke all on function public.claim_print_job(text) from public;
revoke all on function public.claim_specific_print_job(text, uuid) from public;
revoke all on function public.complete_print_job(text, uuid, boolean, text) from public;
revoke all on function public.request_reprint(text, uuid) from public;

grant execute on function public.list_recent_print_jobs(text, integer) to anon;
grant execute on function public.claim_print_job(text) to anon;
grant execute on function public.claim_specific_print_job(text, uuid) to anon;
grant execute on function public.complete_print_job(text, uuid, boolean, text) to anon;
grant execute on function public.request_reprint(text, uuid) to anon;


-- Heartbeat também dispara a recuperação de trabalhos abandonados.
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
     encode(extensions.digest(convert_to(p_token, 'UTF8'), 'sha256'::text), 'hex');

  get diagnostics v_updated = row_count;
  return v_updated = 1;
end;
$$;

revoke all on function public.heartbeat_bridge(text, text, text) from public;
grant execute on function public.heartbeat_bridge(text, text, text) to anon;

-- Reimpressão imediata:
-- cria uma nova cópia e já a reserva para o computador que clicou em "Reimprimir".
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
  where b.token_hash =
      encode(extensions.digest(convert_to(p_token, 'UTF8'), 'sha256'::text), 'hex')
    and j.id = p_job_id
  limit 1;

  if v_establishment_id is null then
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

  update public.bridges b
     set status = 'online',
         last_seen_at = now()
   where b.establishment_id = v_establishment_id
     and b.token_hash =
       encode(extensions.digest(convert_to(p_token, 'UTF8'), 'sha256'::text), 'hex');

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
  join public.orders o
    on o.id = j.order_id
  where j.id = v_new_job_id;

  return v_payload;
end;
$$;

revoke all on function public.request_reprint_now(text, uuid) from public;
grant execute on function public.request_reprint_now(text, uuid) to anon;
