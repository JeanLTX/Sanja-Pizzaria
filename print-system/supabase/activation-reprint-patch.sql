-- PATCH LIMPO — Impressão 0.2
-- Corrige ativação em computador que já possui bridge
-- e habilita reimpressão imediata.

alter table public.print_jobs
  add column if not exists printing_at timestamptz;

-- Reativa o computador existente em vez de tentar criar uma segunda bridge
-- com o mesmo nome de dispositivo.
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


-- Reimpressão imediata: cria uma nova cópia já em estado "printing"
-- e devolve o pedido completo para o aplicativo imprimir na hora.
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
