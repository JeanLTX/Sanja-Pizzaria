-- Jean Print System - fila automática de impressão

-- 1. Impressora inicial da Sanja.
insert into public.printers (
    establishment_id,
    name,
    connection_type,
    active
)
select
    id,
    'Impressora térmica principal',
    'windows',
    true
from public.establishments
where slug = 'sanja-pizzaria'
  and not exists (
      select 1
      from public.printers p
      where p.establishment_id = public.establishments.id
  );

-- 2. Cria automaticamente um trabalho de impressão para cada novo pedido.
create or replace function public.create_print_job_for_order()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
    v_printer_id uuid;
begin
    select id
      into v_printer_id
      from public.printers
     where establishment_id = new.establishment_id
       and active = true
     order by created_at
     limit 1;

    if v_printer_id is not null then
        insert into public.print_jobs (
            order_id,
            printer_id,
            copy_number,
            status
        )
        values (
            new.id,
            v_printer_id,
            1,
            'pending'
        )
        on conflict (order_id, printer_id, copy_number) do nothing;
    end if;

    return new;
end;
$$;

drop trigger if exists trg_create_print_job_for_order on public.orders;

create trigger trg_create_print_job_for_order
after insert on public.orders
for each row
execute function public.create_print_job_for_order();

-- 3. Cria a fila para o pedido de teste que já existe.
insert into public.print_jobs (
    order_id,
    printer_id,
    copy_number,
    status
)
select
    o.id,
    p.id,
    1,
    'pending'
from public.orders o
join public.printers p
  on p.establishment_id = o.establishment_id
 and p.active = true
where o.establishment_id = (
    select id from public.establishments
    where slug = 'sanja-pizzaria'
)
and not exists (
    select 1
    from public.print_jobs j
    where j.order_id = o.id
);
