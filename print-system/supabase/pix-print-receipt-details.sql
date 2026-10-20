-- Incluir código e estado do Pix no objeto consumido pela bridge,
-- para que a comanda impressa identifique pedidos que aguardam conferência.
create or replace function public.claim_print_job(p_token text)
returns jsonb
language plpgsql
security definer
set search_path to 'public', 'extensions'
as $function$
declare
  v_job_id uuid;
  v_printer_id uuid;
  v_bridge_id uuid;
  v_payload jsonb;
begin
  perform public.recover_stale_print_jobs();

  select j.id, j.printer_id, b.id
    into v_job_id, v_printer_id, v_bridge_id
    from public.print_jobs j
    join public.printers p on p.id = j.printer_id and p.active = true
    join public.bridges b on b.id = p.bridge_id and b.active = true
      and b.token_hash = encode(extensions.digest(convert_to(p_token, 'UTF8'), 'sha256'::text), 'hex')
   where j.status = 'pending'
   order by j.created_at, j.id
   for update of j skip locked
   limit 1;

  if v_job_id is null then return null; end if;

  update public.print_jobs
     set status = 'printing', attempts = attempts + 1, printing_at = now()
   where id = v_job_id;

  update public.bridges set status = 'online', last_seen_at = now()
   where id = v_bridge_id;

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
    'pix_order_code', o.pix_order_code,
    'payment_status', o.payment_status,
    'notes', o.notes,
    'subtotal', o.subtotal,
    'total', o.total,
    'created_at', o.created_at,
    'items', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', oi.id, 'product_id', oi.product_id, 'product_name', oi.product_name,
        'quantity', oi.quantity, 'unit_price', oi.unit_price,
        'options', oi.options, 'notes', oi.notes
      ) order by oi.created_at)
      from public.order_items oi where oi.order_id = o.id
    ), '[]'::jsonb)
  )
    into v_payload
    from public.print_jobs j
    join public.orders o on o.id = j.order_id
   where j.id = v_job_id;

  return v_payload;
end;
$function$;

create or replace function public.claim_specific_print_job(p_token text, p_job_id uuid)
returns jsonb
language plpgsql
security definer
set search_path to 'public', 'extensions'
as $function$
declare
  v_job_id uuid;
  v_printer_id uuid;
  v_bridge_id uuid;
  v_payload jsonb;
begin
  perform public.recover_stale_print_jobs();

  select j.id, j.printer_id, b.id
    into v_job_id, v_printer_id, v_bridge_id
    from public.print_jobs j
    join public.printers p on p.id = j.printer_id and p.active = true
    join public.bridges b on b.id = p.bridge_id and b.active = true
      and b.token_hash = encode(extensions.digest(convert_to(p_token, 'UTF8'), 'sha256'::text), 'hex')
   where j.id = p_job_id and j.status = 'pending'
   for update of j skip locked;

  if v_job_id is null then return null; end if;

  update public.print_jobs
     set status = 'printing', attempts = attempts + 1, printing_at = now()
   where id = v_job_id;

  update public.bridges set status = 'online', last_seen_at = now()
   where id = v_bridge_id;

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
    'pix_order_code', o.pix_order_code,
    'payment_status', o.payment_status,
    'notes', o.notes,
    'subtotal', o.subtotal,
    'total', o.total,
    'created_at', o.created_at,
    'items', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', oi.id, 'product_id', oi.product_id, 'product_name', oi.product_name,
        'quantity', oi.quantity, 'unit_price', oi.unit_price,
        'options', oi.options, 'notes', oi.notes
      ) order by oi.created_at)
      from public.order_items oi where oi.order_id = o.id
    ), '[]'::jsonb)
  )
    into v_payload
    from public.print_jobs j
    join public.orders o on o.id = j.order_id
   where j.id = v_job_id;

  return v_payload;
end;
$function$;

notify pgrst, 'reload schema';
