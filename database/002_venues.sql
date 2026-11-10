create table public.venues (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  street_address text not null,
  city text not null,
  state text not null default 'NY',
  zip text,
  county text,
  phone text,
  website_url text,
  latitude numeric(9,6),
  longitude numeric(9,6),
  created_at timestamptz not null default now(),
  constraint venues_state_format
    check (state ~ '^[A-Z]{2}$'),
  constraint venues_zip_format
    check (zip is null or zip ~ '^[0-9]{5}(-[0-9]{4})?$'),
  constraint venues_latitude_range
    check (latitude is null or latitude between -90 and 90),
  constraint venues_longitude_range
    check (longitude is null or longitude between -180 and 180),
  constraint venues_coordinates_together
    check ((latitude is null) = (longitude is null)),
  constraint venues_name_address_unique
    unique (name, street_address)
);

alter table public.venues enable row level security;