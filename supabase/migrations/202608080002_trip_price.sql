alter table public.trips
add column price text not null default ''
check (char_length(price) <= 100);
