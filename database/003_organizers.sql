create table public.organizers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  website_url text,
  created_at timestamptz not null default now(),
  constraint organizers_name_not_blank
    check (length(trim(name)) > 0),
  constraint organizers_website_url_format
    check (website_url is null or website_url ~ '^https?://')
);

create unique index organizers_name_lower_unique
  on public.organizers (lower(name));

alter table public.organizers enable row level security;