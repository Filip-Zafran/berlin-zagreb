alter table public.conversations alter column trip_id drop not null;
alter table public.conversations
  add column transport_request_id uuid references public.transport_requests(id) on delete cascade;

alter table public.conversations
  add constraint conversations_have_one_subject check (
    (trip_id is not null and transport_request_id is null)
    or (trip_id is null and transport_request_id is not null)
  );

alter table public.conversations drop constraint if exists conversations_trip_id_passenger_id_key;
create unique index conversations_trip_contact_unique on public.conversations (trip_id, passenger_id) where trip_id is not null;
create unique index conversations_request_contact_unique on public.conversations (transport_request_id, passenger_id) where transport_request_id is not null;

create or replace function public.add_conversation_members()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
declare subject_owner uuid;
begin
  if new.trip_id is not null then
    select driver_id into subject_owner from public.trips where id = new.trip_id;
  else
    select passenger_id into subject_owner from public.transport_requests where id = new.transport_request_id;
  end if;

  insert into public.conversation_members (conversation_id, user_id)
  values (new.id, subject_owner), (new.id, new.passenger_id)
  on conflict do nothing;
  return new;
end;
$$;

create or replace function public.start_request_conversation(target_request_id uuid)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_user_id uuid := auth.uid();
  conversation_id uuid;
  request_owner_id uuid;
begin
  if current_user_id is null then raise exception 'You must be logged in to start a conversation.'; end if;
  select passenger_id into request_owner_id from public.transport_requests where id = target_request_id;
  if request_owner_id is null then raise exception 'This transport request is no longer available.'; end if;
  if request_owner_id = current_user_id then raise exception 'You cannot message yourself about your own request.'; end if;

  insert into public.conversations (trip_id, transport_request_id, passenger_id)
  values (null, target_request_id, current_user_id)
  on conflict (transport_request_id, passenger_id) where transport_request_id is not null
  do update set transport_request_id = excluded.transport_request_id
  returning id into conversation_id;
  return conversation_id;
end;
$$;

revoke all on function public.start_request_conversation(uuid) from public;
grant execute on function public.start_request_conversation(uuid) to authenticated;
