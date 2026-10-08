-- Painel administrativo do Impressão
-- Execute depois que activation_codes e create_activation_code já existirem.

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_users
    where user_id = auth.uid()
      and active = true
  );
$$;

revoke all on function public.is_admin() from public;

create or replace function public.admin_list_establishments()
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

  select coalesce(jsonb_agg(x order by x.created_at desc), '[]'::jsonb)
    into v_data
    from (
      select
        e.id,
        e.slug,
        e.name,
        e.active,
        e.created_at,
        (
          select count(*)::integer
          from public.bridges b
          where b.establishment_id = e.id
        ) as bridge_count,
        (
          select count(*)::integer
          from public.bridges b
          where b.establishment_id = e.id
            and b.status = 'online'
        ) as online_bridge_count
      from public.establishments e
    ) x;

  return v_data;
end;
$$;

revoke all on function public.admin_list_establishments() from public;
grant execute on function public.admin_list_establishments() to authenticated;

create or replace function public.admin_create_establishment(
  p_name text,
  p_slug text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id uuid;
  v_slug text;
begin
  if not public.is_admin() then
    raise exception 'Acesso administrativo negado.';
  end if;

  if nullif(trim(p_name), '') is null then
    raise exception 'Informe o nome do estabelecimento.';
  end if;

  v_slug := lower(regexp_replace(trim(coalesce(p_slug, '')), '[^a-zA-Z0-9]+', '-', 'g'));
  v_slug := trim(both '-' from v_slug);

  if v_slug = '' then
    raise exception 'Informe um identificador válido para o estabelecimento.';
  end if;

  insert into public.establishments (name, slug, active)
  values (trim(p_name), v_slug, true)
  returning id into v_id;

  return jsonb_build_object(
    'id', v_id,
    'name', trim(p_name),
    'slug', v_slug,
    'active', true
  );
exception
  when unique_violation then
    raise exception 'Já existe um estabelecimento com esse identificador.';
end;
$$;

revoke all on function public.admin_create_establishment(text, text) from public;
grant execute on function public.admin_create_establishment(text, text) to authenticated;

create or replace function public.admin_generate_activation_code(
  p_establishment_id uuid,
  p_label text default null,
  p_hours integer default 24
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_code text;
  v_name text;
  v_expires_at timestamptz;
begin
  if not public.is_admin() then
    raise exception 'Acesso administrativo negado.';
  end if;

  select name
    into v_name
    from public.establishments
   where id = p_establishment_id
     and active = true;

  if v_name is null then
    raise exception 'Estabelecimento não encontrado ou inativo.';
  end if;

  v_code := public.create_activation_code(
    p_establishment_id,
    p_label,
    greatest(1, coalesce(p_hours, 24))
  );

  select expires_at
    into v_expires_at
    from public.activation_codes
   where establishment_id = p_establishment_id
     and code_hash =
       encode(extensions.digest(convert_to(replace(v_code, '-', ''), 'UTF8'), 'sha256'::text), 'hex')
   order by created_at desc
   limit 1;

  return jsonb_build_object(
    'code', v_code,
    'establishmentId', p_establishment_id,
    'establishmentName', v_name,
    'label', nullif(trim(p_label), ''),
    'expiresAt', v_expires_at
  );
end;
$$;

revoke all on function public.admin_generate_activation_code(uuid, text, integer) from public;
grant execute on function public.admin_generate_activation_code(uuid, text, integer) to authenticated;

create or replace function public.admin_list_activation_codes(
  p_establishment_id uuid,
  p_limit integer default 30
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

  select coalesce(jsonb_agg(row_to_json(x)::jsonb order by x.created_at desc), '[]'::jsonb)
    into v_data
    from (
      select
        a.id,
        a.label,
        a.expires_at as "expiresAt",
        a.used_at as "usedAt",
        a.created_at as "createdAt",
        case
          when a.used_at is not null then 'used'
          when a.expires_at is not null and a.expires_at <= now() then 'expired'
          else 'available'
        end as status
      from public.activation_codes a
      where a.establishment_id = p_establishment_id
      order by a.created_at desc
      limit greatest(1, least(coalesce(p_limit, 30), 100))
    ) x;

  return v_data;
end;
$$;

revoke all on function public.admin_list_activation_codes(uuid, integer) from public;
grant execute on function public.admin_list_activation_codes(uuid, integer) to authenticated;

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
      'lastSeenAt', b.last_seen_at,
      'createdAt', b.created_at
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

-- Depois de criar um usuário em Authentication > Users,
-- torne-o administrador executando, por exemplo:
--
-- insert into public.admin_users (user_id, email)
-- select id, email
-- from auth.users
-- where email = 'SEU_EMAIL_AQUI'
-- on conflict (user_id) do update
-- set active = true, email = excluded.email;
