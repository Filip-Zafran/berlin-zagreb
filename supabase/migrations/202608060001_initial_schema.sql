create extension if not exists "pgcrypto";

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  first_name text not null check (char_length(first_name) between 1 and 60),
  avatar_path text,
  bio text not null default '' check (char_length(bio) <= 500),
  languages text[] not null default '{}',
  car text check (car is null or char_length(car) <= 100),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.trips (
  id uuid primary key default gen_random_uuid(),
  driver_id uuid not null references public.profiles(id) on delete cascade,
  direction text not null check (direction in ('berlin-zagreb', 'zagreb-berlin')),
  departure_at timestamptz not null,
  car_model text not null check (char_length(car_model) between 1 and 100),
  starting_city text not null,
  destination_city text not null,
  notes text not null default '' check (char_length(notes) <= 1000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint supported_route check (
    (direction = 'berlin-zagreb' and starting_city = 'Berlin' and destination_city = 'Zagreb') or
    (direction = 'zagreb-berlin' and starting_city = 'Zagreb' and destination_city = 'Berlin')
  )
);

create index trips_departure_at_idx on public.trips (departure_at);
create index trips_driver_id_idx on public.trips (driver_id);

create table public.trip_stops (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references public.trips(id) on delete cascade,
  city text not null check (char_length(city) between 1 and 100),
  position integer not null check (position >= 0),
  unique (trip_id, position)
);

create table public.conversations (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references public.trips(id) on delete cascade,
  passenger_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (trip_id, passenger_id)
);

create table public.conversation_members (
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  joined_at timestamptz not null default now(),
  last_read_at timestamptz,
  primary key (conversation_id, user_id)
);

create index conversation_members_user_id_idx on public.conversation_members (user_id);

create table public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  sender_id uuid not null references public.profiles(id) on delete cascade,
  body text not null check (char_length(trim(body)) between 1 and 2000),
  created_at timestamptz not null default now(),
  read_at timestamptz
);

create index messages_conversation_created_idx on public.messages (conversation_id, created_at);

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at before update on public.profiles for each row execute function public.set_updated_at();
create trigger trips_set_updated_at before update on public.trips for each row execute function public.set_updated_at();
create trigger conversations_set_updated_at before update on public.conversations for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, first_name)
  values (new.id, coalesce(nullif(trim(new.raw_user_meta_data ->> 'first_name'), ''), 'Traveller'));
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create or replace function public.is_conversation_member(target_conversation uuid)
returns boolean
language sql
stable
security definer set search_path = ''
as $$
  select exists (
    select 1 from public.conversation_members
    where conversation_id = target_conversation and user_id = auth.uid()
  );
$$;

create or replace function public.add_conversation_members()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
declare trip_driver uuid;
begin
  select driver_id into trip_driver from public.trips where id = new.trip_id;
  insert into public.conversation_members (conversation_id, user_id)
  values (new.id, trip_driver), (new.id, new.passenger_id)
  on conflict do nothing;
  return new;
end;
$$;

create trigger on_conversation_created
  after insert on public.conversations
  for each row execute function public.add_conversation_members();

alter table public.profiles enable row level security;
alter table public.trips enable row level security;
alter table public.trip_stops enable row level security;
alter table public.conversations enable row level security;
alter table public.conversation_members enable row level security;
alter table public.messages enable row level security;

create policy "Profiles are publicly readable" on public.profiles for select using (true);
create policy "Users update their own profile" on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);

create policy "Trips are publicly readable" on public.trips for select using (true);
create policy "Drivers create their own trips" on public.trips for insert to authenticated with check (auth.uid() = driver_id);
create policy "Drivers update their own trips" on public.trips for update to authenticated using (auth.uid() = driver_id) with check (auth.uid() = driver_id);
create policy "Drivers delete their own trips" on public.trips for delete to authenticated using (auth.uid() = driver_id);

create policy "Stops are publicly readable" on public.trip_stops for select using (true);
create policy "Drivers create stops on their trips" on public.trip_stops for insert to authenticated with check (exists (select 1 from public.trips where trips.id = trip_id and trips.driver_id = auth.uid()));
create policy "Drivers update stops on their trips" on public.trip_stops for update to authenticated using (exists (select 1 from public.trips where trips.id = trip_id and trips.driver_id = auth.uid())) with check (exists (select 1 from public.trips where trips.id = trip_id and trips.driver_id = auth.uid()));
create policy "Drivers delete stops on their trips" on public.trip_stops for delete to authenticated using (exists (select 1 from public.trips where trips.id = trip_id and trips.driver_id = auth.uid()));

create policy "Members read conversations" on public.conversations for select to authenticated using (public.is_conversation_member(id));
create policy "Passengers start conversations" on public.conversations for insert to authenticated with check (
  auth.uid() = passenger_id and exists (select 1 from public.trips where trips.id = trip_id and trips.driver_id <> auth.uid())
);

create policy "Members read conversation membership" on public.conversation_members for select to authenticated using (public.is_conversation_member(conversation_id));
create policy "Members update their read time" on public.conversation_members for update to authenticated using (user_id = auth.uid() and public.is_conversation_member(conversation_id)) with check (user_id = auth.uid() and public.is_conversation_member(conversation_id));

create policy "Members read messages" on public.messages for select to authenticated using (public.is_conversation_member(conversation_id));
create policy "Members send messages" on public.messages for insert to authenticated with check (sender_id = auth.uid() and public.is_conversation_member(conversation_id));

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('avatars', 'avatars', true, 2097152, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do nothing;

create policy "Avatar images are publicly readable" on storage.objects for select using (bucket_id = 'avatars');
create policy "Users upload their own avatar" on storage.objects for insert to authenticated with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "Users update their own avatar" on storage.objects for update to authenticated using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text) with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "Users delete their own avatar" on storage.objects for delete to authenticated using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

alter publication supabase_realtime add table public.messages;
