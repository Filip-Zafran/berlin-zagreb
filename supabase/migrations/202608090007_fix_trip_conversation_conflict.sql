create or replace function public.start_conversation(target_trip_id uuid)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_user_id uuid := auth.uid();
  conversation_id uuid;
  trip_driver_id uuid;
begin
  if current_user_id is null then
    raise exception 'You must be logged in to start a conversation.';
  end if;

  select driver_id
  into trip_driver_id
  from public.trips
  where id = target_trip_id;

  if trip_driver_id is null then
    raise exception 'This trip is no longer available.';
  end if;

  if trip_driver_id = current_user_id then
    raise exception 'You cannot message yourself about your own trip.';
  end if;

  if not exists (
    select 1 from public.profiles where id = current_user_id
  ) then
    raise exception 'Your profile is missing. Please contact support.';
  end if;

  insert into public.conversations (trip_id, transport_request_id, passenger_id)
  values (target_trip_id, null, current_user_id)
  on conflict (trip_id, passenger_id) where trip_id is not null
  do update set trip_id = excluded.trip_id
  returning id into conversation_id;

  return conversation_id;
end;
$$;

revoke all on function public.start_conversation(uuid) from public;
grant execute on function public.start_conversation(uuid) to authenticated;
