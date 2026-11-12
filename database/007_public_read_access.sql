begin;

-- Clean slate: remove any automatic grants for the public-facing roles
revoke all on table
  public.categories,
  public.venues,
  public.organizers,
  public.events,
  public.event_private
from anon, authenticated;

-- Door keys: read-only access on four tables (none on event_private)
grant select on table
  public.categories,
  public.venues,
  public.organizers,
  public.events
to anon, authenticated;

-- Room rules: which rows are visible
create policy "Public can read active categories"
  on public.categories
  for select
  to anon, authenticated
  using (is_active);

create policy "Public can read published events"
  on public.events
  for select
  to anon, authenticated
  using (status = 'published');

create policy "Public can read venues of published events"
  on public.venues
  for select
  to anon, authenticated
  using (
    exists (
      select 1 from public.events e
      where e.venue_id = venues.id
        and e.status = 'published'
    )
  );

create policy "Public can read organizers of published events"
  on public.organizers
  for select
  to anon, authenticated
  using (
    exists (
      select 1 from public.events e
      where e.organizer_id = organizers.id
        and e.status = 'published'
    )
  );

commit;