alter table public.trips
  add column flexibility_type text not null default 'fixed' check (flexibility_type in ('fixed', 'flexible-time', 'flexible-date', 'flexible-date-time')),
  add column date_flexibility text check (date_flexibility is null or date_flexibility in ('1-day', '2-days', '3-days', '7-days', 'any-date')),
  add column time_flexibility text check (time_flexibility is null or time_flexibility in ('1-hour', '2-hours', '4-hours', 'morning', 'afternoon', 'evening', 'any-time'));

alter table public.transport_requests
  add column preferred_time time not null default '09:00',
  add column flexibility_type text not null default 'fixed' check (flexibility_type in ('fixed', 'flexible-time', 'flexible-date', 'flexible-date-time')),
  add column date_flexibility text check (date_flexibility is null or date_flexibility in ('1-day', '2-days', '3-days', '7-days', 'any-date')),
  add column time_flexibility text check (time_flexibility is null or time_flexibility in ('1-hour', '2-hours', '4-hours', 'morning', 'afternoon', 'evening', 'any-time'));
