-- Criar a tarefa de impressão imediatamente para todos os pedidos,
-- inclusive Pix ainda pendente. O status de pagamento continua separado
-- e deve ser conferido manualmente pelo estabelecimento.
create or replace function public.create_print_job_for_order()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_printer_id uuid;
begin
  -- Em atualizações, imprimir apenas na transição de Pix pendente para pago.
  -- Pedidos Pix já terão sua tarefa criada no INSERT, sem aguardar pagamento.
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

notify pgrst, 'reload schema';
