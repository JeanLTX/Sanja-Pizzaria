-- Jean Print System - painel do bridge

create or replace function public.list_recent_print_jobs(
    p_token text,
    p_limit integer default 20
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
    v_establishment_id uuid;
    v_limit integer := greatest(1, least(coalesce(p_limit, 20), 50));
    v_jobs jsonb;
begin
    select b.establishment_id
      into v_establishment_id
      from public.bridges b
     where b.token_hash = encode(extensions.digest(convert_to(p_token, 'UTF8'), 'sha256'::text), 'hex')
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
        join public.orders o
          on o.id = j.order_id
        join public.printers p
          on p.id = j.printer_id
        where o.establishment_id = v_establishment_id
        order by j.created_at desc
        limit v_limit
    ) x;

    return v_jobs;
end;
$$;


create or replace function public.claim_specific_print_job(
    p_token text,
    p_job_id uuid
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
    v_job_id uuid;
    v_printer_id uuid;
    v_bridge_id uuid;
    v_establishment_id uuid;
    v_payload jsonb;
begin
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
     and b.token_hash = encode(extensions.digest(convert_to(p_token, 'UTF8'), 'sha256'::text), 'hex')
    where j.id = p_job_id
      and j.status = 'pending'
    for update of j skip locked;

    if v_job_id is null then
        return null;
    end if;

    update public.bridges
    set
        status = 'online',
        last_seen_at = now()
    where id = v_bridge_id;

    update public.print_jobs
    set
        status = 'printing',
        attempts = attempts + 1
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
    join public.orders o
      on o.id = j.order_id
    where j.id = v_job_id;

    return v_payload;
end;
$$;


create or replace function public.request_reprint(
    p_token text,
    p_job_id uuid
)
returns boolean
language plpgsql
security definer
set search_path = public
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
    join public.printers p
      on p.bridge_id = b.id
     and p.active = true
    join public.print_jobs j
      on j.printer_id = p.id
    where b.token_hash = encode(extensions.digest(convert_to(p_token, 'UTF8'), 'sha256'::text), 'hex')
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
        status
    )
    values (
        v_order_id,
        v_printer_id,
        v_next_copy,
        'pending'
    );

    return true;
end;
$$;

revoke all on function public.list_recent_print_jobs(text, integer) from public;
revoke all on function public.claim_specific_print_job(text, uuid) from public;
revoke all on function public.request_reprint(text, uuid) from public;

grant execute on function public.list_recent_print_jobs(text, integer) to anon;
grant execute on function public.claim_specific_print_job(text, uuid) to anon;
grant execute on function public.request_reprint(text, uuid) to anon;
