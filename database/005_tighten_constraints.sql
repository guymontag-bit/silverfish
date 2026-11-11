begin;

-- categories: name can't be blank
alter table public.categories
  add constraint categories_name_not_blank
  check (length(trim(name)) > 0);

-- venues: required text fields can't be blank, and website must be a real link
alter table public.venues
  add constraint venues_name_not_blank
    check (length(trim(name)) > 0),
  add constraint venues_street_address_not_blank
    check (length(trim(street_address)) > 0),
  add constraint venues_city_not_blank
    check (length(trim(city)) > 0),
  add constraint venues_website_url_format
    check (website_url is null or website_url ~ '^https?://');

-- venues: replace the case-sensitive duplicate guard with a case-insensitive one
alter table public.venues
  drop constraint venues_name_address_unique;

create unique index venues_name_address_lower_unique
  on public.venues (lower(trim(name)), lower(trim(street_address)));

commit;