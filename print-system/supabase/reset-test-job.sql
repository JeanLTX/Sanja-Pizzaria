-- Corrige o pedido de teste que ficou preso em "printing".
update public.print_jobs
set
  status = 'pending',
  attempts = 0,
  error_message = null,
  printed_at = null
where status = 'printing'
  and order_id = (
    select id
    from public.orders
    order by created_at desc
    limit 1
  );

-- Confirma o estado da fila.
select id, order_id, status, attempts, created_at, printed_at
from public.print_jobs
order by created_at desc
limit 10;
