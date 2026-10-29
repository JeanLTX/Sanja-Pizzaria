-- Short-lived Pix links for WhatsApp orders.
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS pix_short_code text;
CREATE UNIQUE INDEX IF NOT EXISTS orders_pix_short_code_unique ON public.orders (pix_short_code) WHERE pix_short_code IS NOT NULL;

CREATE OR REPLACE FUNCTION public.create_public_order_with_payment(p_establishment_id uuid, p_customer_name text, p_customer_phone text, p_address text, p_delivery_region text, p_delivery_fee numeric, p_payment_method text, p_subtotal numeric, p_total numeric, p_items jsonb, p_order_type text, p_pix_order_code text, p_pix_short_code text)
RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $function$
declare
  v_order_id uuid; v_order_number integer; v_item jsonb;
  v_payment_method text := nullif(trim(coalesce(p_payment_method,'')),'');
  v_pix_code text := nullif(trim(coalesce(p_pix_order_code,'')),'');
  v_pix_short_code text := nullif(trim(coalesce(p_pix_short_code,'')),'');
  v_payment_status text;
begin
  if not exists(select 1 from public.establishments where id=p_establishment_id and active=true) then raise exception 'Estabelecimento não encontrado ou inativo.'; end if;
  if nullif(trim(coalesce(p_customer_name,'')),'') is null then raise exception 'Customer name is required.'; end if;
  if p_items is null or jsonb_typeof(p_items)<>'array' or jsonb_array_length(p_items)=0 then raise exception 'Order must contain at least one item.'; end if;
  if coalesce(p_subtotal,0)<0 or coalesce(p_delivery_fee,0)<0 or coalesce(p_total,0)<0 then raise exception 'Os valores do pedido são inválidos.'; end if;
  if coalesce(p_order_type,'') not in ('delivery','pickup') then raise exception 'Tipo de pedido inválido.'; end if;
  if p_order_type='pickup' and coalesce(p_delivery_fee,0)<>0 then raise exception 'Pedidos para retirada não podem cobrar taxa de entrega.'; end if;
  if lower(coalesce(v_payment_method,''))='pix' and (v_pix_code is null or v_pix_short_code is null or v_pix_short_code !~ '^[A-Za-z0-9]{8}$') then raise exception 'Os códigos do pedido Pix são obrigatórios e inválidos.'; end if;
  v_payment_status := case when lower(coalesce(v_payment_method,''))='pix' then 'pending' else 'not_required' end;
  perform pg_advisory_xact_lock(hashtextextended(p_establishment_id::text,0));
  select coalesce(max(order_number),0)+1 into v_order_number from public.orders where establishment_id=p_establishment_id;
  insert into public.orders(establishment_id,order_number,customer_name,customer_phone,order_type,address,delivery_region,delivery_fee,payment_method,notes,subtotal,total,status,pix_order_code,pix_short_code,payment_status)
  values(p_establishment_id,v_order_number,trim(p_customer_name),nullif(trim(p_customer_phone),''),p_order_type,
    case when p_order_type='delivery' then nullif(trim(p_address),'') else null end,
    case when p_order_type='delivery' then nullif(trim(p_delivery_region),'') else null end,
    case when p_order_type='delivery' then round(coalesce(p_delivery_fee,0),2) else 0 end,
    v_payment_method,null,round(coalesce(p_subtotal,0),2),round(coalesce(p_total,0),2),'received',v_pix_code,
    case when lower(coalesce(v_payment_method,''))='pix' then v_pix_short_code else null end,v_payment_status)
  returning id into v_order_id;
  for v_item in select value from jsonb_array_elements(p_items) loop
    if nullif(trim(v_item->>'product_name'),'') is null then raise exception 'Um dos itens do pedido está inválido.'; end if;
    insert into public.order_items(order_id,product_id,product_name,quantity,unit_price,options,notes)
    values(v_order_id,nullif(v_item->>'product_id',''),trim(v_item->>'product_name'),greatest(1,coalesce((v_item->>'quantity')::integer,1)),round(coalesce((v_item->>'unit_price')::numeric,0),2),coalesce(v_item->'options','{}'::jsonb),nullif(v_item->>'notes',''));
  end loop;
  return v_order_id;
end; $function$;

CREATE OR REPLACE FUNCTION public.resolve_public_pix_link(p_code text)
RETURNS TABLE(amount numeric, reference text)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public' AS $function$
  SELECT o.total, o.pix_order_code
  FROM public.orders o
  WHERE o.pix_short_code = p_code
    AND o.payment_method ILIKE 'pix'
    AND o.payment_status = 'pending'
    AND o.created_at >= now() - interval '7 days'
  LIMIT 1;
$function$;
REVOKE ALL ON FUNCTION public.resolve_public_pix_link(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.resolve_public_pix_link(text) TO anon, authenticated;
REVOKE ALL ON FUNCTION public.create_public_order_with_payment(uuid,text,text,text,text,numeric,text,numeric,numeric,jsonb,text,text,text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.create_public_order_with_payment(uuid,text,text,text,text,numeric,text,numeric,numeric,jsonb,text,text,text) TO anon, authenticated;
