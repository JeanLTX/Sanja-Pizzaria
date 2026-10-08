-- ==========================================
-- JEAN PRINT BRIDGE — AUTORIZAÇÃO DO BRIDGE
-- ==========================================

alter table public.bridges
    add column if not exists token_hash text;

create unique index if not exists idx_bridges_token_hash
    on public.bridges (token_hash)
    where token_hash is not null;


-- Bridge inicial da Sanja.
insert into public.bridges (
    establishment_id,
    device_name,
    version,
    status,
    token_hash
)
select
    id,
    'Sanja Print Bridge 01',
    '0.1.0',
    'offline',
    '9e5812bf9489e5813b83783acc5a2e287b86375f80f5ea392e5c577aa48dc6da'
from public.establishments
where slug = 'sanja-pizzaria'
  and not exists (
      select 1
      from public.bridges
      where token_hash = '9e5812bf9489e5813b83783acc5a2e287b86375f80f5ea392e5c577aa48dc6da'
  );


-- Vincular a impressora principal ao bridge.
update public.printers
set bridge_id = (
    select b.id
    from public.bridges b
    where b.token_hash = '9e5812bf9489e5813b83783acc5a2e287b86375f80f5ea392e5c577aa48dc6da'
    limit 1
)
where name = 'Impressora térmica principal'
  and establishment_id = (
      select id
      from public.establishments
      where slug = 'sanja-pizzaria'
      limit 1
  );


-- Claim atômico: encontra um pedido pendente e o reserva
-- para este bridge, mudando o status para "printing".
create or replace function public.claim_print_job(p_token text)
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
     and b.token_hash = encode(digest(p_token, 'sha256'), 'hex')
    where j.status = 'pending'
    order by j.created_at
    for update of j skip locked
    limit 1;

    update public.bridges
    set
        status = 'online',
        last_seen_at = now()
    where id = v_bridge_id;

    if v_job_id is null then
        return null;
    end if;

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


-- Finaliza uma impressão e atualiza o status do bridge.
create or replace function public.complete_print_job(
    p_token text,
    p_job_id uuid,
    p_success boolean,
    p_error_message text default null
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
    v_updated integer := 0;
begin
    update public.print_jobs j
    set
        status = case
            when p_success then 'printed'
            else 'failed'
        end,
        error_message = case
            when p_success then null
            else p_error_message
        end,
        printed_at = case
            when p_success then now()
            else null
        end
    where j.id = p_job_id
      and exists (
          select 1
          from public.printers p
          join public.bridges b
            on b.id = p.bridge_id
          where p.id = j.printer_id
            and b.token_hash = encode(digest(p_token, 'sha256'), 'hex')
      );

    get diagnostics v_updated = row_count;

    update public.bridges b
    set
        status = 'online',
        last_seen_at = now()
    where b.token_hash = encode(digest(p_token, 'sha256'), 'hex');

    return v_updated = 1;
end;
$$;


-- Heartbeat do bridge.
create or replace function public.heartbeat_bridge(
    p_token text,
    p_version text default null,
    p_device_name text default null
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
    v_updated integer := 0;
begin
    update public.bridges
    set
        status = 'online',
        last_seen_at = now(),
        version = coalesce(p_version, version),
        device_name = coalesce(nullif(p_device_name, ''), device_name)
    where token_hash = encode(digest(p_token, 'sha256'), 'hex');

    get diagnostics v_updated = row_count;

    return v_updated = 1;
end;
$$;


-- Acesso público somente às três funções acima.
revoke all on function public.claim_print_job(text) from public;
revoke all on function public.complete_print_job(text, uuid, boolean, text) from public;
revoke all on function public.heartbeat_bridge(text, text, text) from public;

grant execute on function public.claim_print_job(text) to anon;
grant execute on function public.complete_print_job(text, uuid, boolean, text) to anon;
grant execute on function public.heartbeat_bridge(text, text, text) to anon;
