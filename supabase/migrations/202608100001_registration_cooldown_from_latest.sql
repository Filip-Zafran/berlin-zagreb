create or replace function public.registration_wait_seconds()
returns integer
language sql
stable
security definer
set search_path = ''
as $$
  select case
    when count(*) < 2 then 0
    else greatest(
      0,
      ceil(extract(epoch from (max(attempted_at) + interval '1 hour' - now())))::integer
    )
  end
  from public.registration_attempts;
$$;

create or replace function public.reserve_registration_slot()
returns integer
language plpgsql
security definer
set search_path = ''
as $$
declare
  wait_seconds integer;
begin
  perform pg_advisory_xact_lock(8675309);

  select public.registration_wait_seconds() into wait_seconds;
  if wait_seconds > 0 then
    return wait_seconds;
  end if;

  -- Once a completed cooldown has expired, begin a fresh two-registration cycle.
  if (select count(*) >= 2 from public.registration_attempts) then
    delete from public.registration_attempts;
  else
    delete from public.registration_attempts
    where attempted_at <= now() - interval '1 hour';
  end if;

  insert into public.registration_attempts default values;
  return 0;
end;
$$;
