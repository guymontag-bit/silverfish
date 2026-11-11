create table public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  constraint categories_slug_format
    check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$')
);

alter table public.categories enable row level security;