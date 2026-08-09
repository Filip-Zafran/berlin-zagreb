create table public.registration_attempts (
  id bigint generated always as identity primary key,
  attempted_at timestamptz not null default now()
);

create index registration_attempts_attempted_at_idx
  on public.registration_attempts (attempted_at);

alter table public.registration_attempts enable row level security;

create or replace function public.registration_wait_seconds()
returns integer
language sql
stable
security definer
set search_path = ''
as $$
  select case
    when count(*) < 2 then 0
    else greatest(0, ceil(extract(epoch from (min(attempted_at) + interval '1 hour' - now())))::integer)
  end
  from public.registration_attempts
  where attempted_at > now() - interval '1 hour';
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

  delete from public.registration_attempts
  where attempted_at <= now() - interval '1 hour';

  select public.registration_wait_seconds() into wait_seconds;
  if wait_seconds > 0 then
    return wait_seconds;
  end if;

  insert into public.registration_attempts default values;
  return 0;
end;
$$;

revoke all on function public.registration_wait_seconds() from public;
revoke all on function public.reserve_registration_slot() from public;
grant execute on function public.registration_wait_seconds() to anon, authenticated;
grant execute on function public.reserve_registration_slot() to anon;
