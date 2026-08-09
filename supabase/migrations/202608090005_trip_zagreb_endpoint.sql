alter table public.trips
add column zagreb_side_endpoint text
check (
  zagreb_side_endpoint is null
  or char_length(trim(zagreb_side_endpoint)) between 1 and 100
);
