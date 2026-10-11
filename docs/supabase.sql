-- Run once in the Supabase SQL editor (Project -> SQL Editor).
-- The contact form posts to /api/contact, which inserts here with the service-role key.

create table if not exists public.contact_messages (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  topic       text not null check (topic in ('project', 'early-access', 'general')),
  name        text not null check (char_length(name) between 1 and 120),
  email       text not null check (char_length(email) between 3 and 254),
  company     text check (company is null or char_length(company) <= 160),
  product     text check (product is null or char_length(product) <= 80),
  message     text not null check (char_length(message) between 10 and 4000),
  source      text,
  status      text not null default 'new' check (status in ('new', 'read', 'replied', 'spam'))
);

create index if not exists contact_messages_created_at_idx on public.contact_messages (created_at desc);

-- Row Level Security on, with no policies: the public (anon) and signed-in roles can neither read nor write.
-- Only the server, using the service-role key (which bypasses RLS), can insert. Read messages in the dashboard.
alter table public.contact_messages enable row level security;
