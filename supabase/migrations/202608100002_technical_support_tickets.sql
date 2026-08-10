create table public.technical_support_tickets (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid references auth.users(id) on delete set null,
  contact_email text not null check (char_length(trim(contact_email)) between 3 and 320),
  category text not null check (category in (
    'registration-login',
    'trips-requests',
    'messages',
    'profile-account',
    'other'
  )),
  description text not null check (char_length(trim(description)) between 10 and 2000),
  screenshot_path text not null,
  page_url text not null check (char_length(page_url) <= 2000),
  status text not null default 'open' check (status in ('open', 'in-progress', 'resolved')),
  created_at timestamptz not null default now()
);

create index technical_support_tickets_created_at_idx
  on public.technical_support_tickets (created_at desc);

alter table public.technical_support_tickets enable row level security;

create policy "Anyone can raise a technical support ticket"
  on public.technical_support_tickets
  for insert
  to anon, authenticated
  with check (
    (auth.uid() is null and reporter_id is null)
    or reporter_id = auth.uid()
  );

create policy "Users can read their own technical support tickets"
  on public.technical_support_tickets
  for select
  to authenticated
  using (reporter_id = auth.uid());

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'technical-ticket-screenshots',
  'technical-ticket-screenshots',
  false,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do nothing;

create policy "Anyone can upload a technical ticket screenshot"
  on storage.objects
  for insert
  to anon, authenticated
  with check (
    bucket_id = 'technical-ticket-screenshots'
    and (
      (auth.uid() is null and (storage.foldername(name))[1] = 'anonymous')
      or (auth.uid() is not null and (storage.foldername(name))[1] = auth.uid()::text)
    )
  );

create policy "Users can read their own technical ticket screenshots"
  on storage.objects
  for select
  to authenticated
  using (
    bucket_id = 'technical-ticket-screenshots'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
