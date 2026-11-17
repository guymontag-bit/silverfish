create table public.events (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  summary text,
  description text not null,
  start_time timestamptz not null,
  end_time timestamptz,
  is_all_day boolean not null default false,
  price_type text not null default 'unknown',
  price_note text,
  image_url text,
  info_url text,
  source_url text,
  status text not null default 'pending',
  origin text not null,
  category_id uuid not null references public.categories (id) on delete restrict,
  venue_id uuid not null references public.venues (id) on delete restrict,
  organizer_id uuid references public.organizers (id) on delete restrict,
  series_id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint events_slug_format
    check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  constraint events_title_not_blank
    check (length(trim(title)) > 0),
  constraint events_description_not_blank
    check (length(trim(description)) > 0),
  constraint events_summary_length
    check (summary is null or length(summary) <= 200),
  constraint events_end_after_start
    check (end_time is null or end_time >= start_time),
  constraint events_price_type_allowed
    check (price_type in ('free', 'paid', 'unknown')),
  constraint events_status_allowed
    check (status in ('pending', 'published', 'rejected', 'canceled', 'hidden')),
  constraint events_origin_allowed
    check (origin in ('admin', 'organizer', 'scraper')),
  constraint events_image_url_format
    check (image_url is null or image_url ~ '^https?://'),
  constraint events_info_url_format
    check (info_url is null or info_url ~ '^https?://'),
  constraint events_source_url_format
    check (source_url is null or source_url ~ '^https?://')
);

create index events_status_start_time_idx
  on public.events (status, start_time);
create index events_category_id_idx on public.events (category_id);
create index events_venue_id_idx on public.events (venue_id);
create index events_organizer_id_idx on public.events (organizer_id);

create function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger events_set_updated_at
before update on public.events
for each row execute function public.set_updated_at();

alter table public.events enable row level security;