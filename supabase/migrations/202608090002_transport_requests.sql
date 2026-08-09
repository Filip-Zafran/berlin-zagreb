create table public.transport_requests (
  id uuid primary key default gen_random_uuid(),
  passenger_id uuid not null references public.profiles(id) on delete cascade,
  direction text not null check (direction in ('to-berlin', 'from-berlin')),
  travel_date date not null,
  pickup text not null check (char_length(trim(pickup)) between 1 and 100),
  dropoff text not null check (char_length(trim(dropoff)) between 1 and 100),
  notes text not null default '' check (char_length(notes) <= 1000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index transport_requests_travel_date_idx on public.transport_requests (travel_date);
create index transport_requests_passenger_id_idx on public.transport_requests (passenger_id);

create trigger transport_requests_set_updated_at
  before update on public.transport_requests
  for each row execute function public.set_updated_at();

alter table public.transport_requests enable row level security;

create policy "Transport requests are publicly readable"
  on public.transport_requests for select using (true);
create policy "Passengers create their own requests"
  on public.transport_requests for insert to authenticated
  with check (auth.uid() = passenger_id);
create policy "Passengers update their own requests"
  on public.transport_requests for update to authenticated
  using (auth.uid() = passenger_id) with check (auth.uid() = passenger_id);
create policy "Passengers delete their own requests"
  on public.transport_requests for delete to authenticated
  using (auth.uid() = passenger_id);
