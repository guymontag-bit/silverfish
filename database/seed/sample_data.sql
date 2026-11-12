-- Sample data for development and testing only.
-- All names, phone numbers, and addresses are fictional.
begin;

insert into public.categories (name, slug, sort_order) values
  ('Museums & History', 'museums-history', 1),
  ('Music & Arts', 'music-arts', 2),
  ('Family & Kids', 'family-kids', 3),
  ('Community & Civic', 'community-civic', 4);

insert into public.venues
  (name, street_address, city, state, zip, county, phone, website_url)
values
  ('Riverbend Heritage Museum', '100 Example Way', 'Albany', 'NY', '12207', 'Albany', '(518) 555-0101', 'https://example.com/riverbend'),
  ('Elm Street Music Hall', '25 Sample Street', 'Troy', 'NY', '12180', 'Rensselaer', '(518) 555-0102', null),
  ('Lakeside Community Center', '7 Demo Avenue', 'Saratoga Springs', 'NY', '12866', 'Saratoga', '(518) 555-0103', 'https://example.com/lakeside'),
  ('Old Mill Library', '300 Placeholder Road', 'Schenectady', 'NY', '12305', 'Schenectady', null, null),
  ('Cedar Pavilion', '55 Fictional Lane', 'Albany', 'NY', '12203', 'Albany', null, null);

insert into public.organizers (name, description, website_url) values
  ('Riverbend Heritage Society', 'Fictional sample organizer.', 'https://example.com/society'),
  ('Elm Street Arts Collective', 'Fictional sample organizer.', null),
  ('Lakeside Neighbors Association', null, null),
  ('Cedar Pavilion Friends', 'Used only by a rejected sample event.', null);

with seed (
  slug, title, summary, description, day_offset, start_local,
  duration_minutes, is_all_day, price_type, price_note, image_url,
  source_url, status, origin, category_slug, venue_name, organizer_name
) as (
  values
  ('riverbend-heritage-walk', 'Heritage Walking Tour',
   'A guided walk through the historic district.',
   'Join a volunteer guide for a relaxed two-hour walk past the oldest buildings in town. Wear comfortable shoes. Fictional sample event.',
   2, '10:00'::time, 120, false, 'free', null, null, null,
   'published', 'admin', 'museums-history',
   'Riverbend Heritage Museum', 'Riverbend Heritage Society'),
  ('elm-street-jazz-night', 'Jazz Night at Elm Street',
   'Live jazz from a local quartet.',
   'An evening of live jazz in an intimate hall. Doors open thirty minutes before the show. Fictional sample event.',
   4, '19:30'::time, 150, false, 'paid', '$15 at the door',
   'https://example.com/images/jazz.jpg', null,
   'published', 'organizer', 'music-arts',
   'Elm Street Music Hall', 'Elm Street Arts Collective'),
  ('lakeside-family-craft-day', 'Family Craft Day',
   'Drop in any time for hands-on crafts.',
   'A come-and-go craft day for families, with supplies provided. Fictional sample event.',
   6, '00:00'::time, null, true, 'free', null, null, null,
   'published', 'organizer', 'family-kids',
   'Lakeside Community Center', 'Lakeside Neighbors Association'),
  ('old-mill-book-club', 'Monthly Book Club', null,
   'The library book club meets to discuss the featured book. New members welcome. Fictional sample event.',
   1, '18:00'::time, null, false, 'free', null, null,
   'https://example.com/source/book-club',
   'published', 'scraper', 'community-civic',
   'Old Mill Library', null),
  ('riverbend-history-lecture-past', 'Evening History Lecture',
   'A talk that has already happened.',
   'A past event used to test that upcoming queries skip it. Fictional sample event.',
   -10, '18:00'::time, 90, false, 'free', null, null, null,
   'published', 'admin', 'museums-history',
   'Riverbend Heritage Museum', 'Riverbend Heritage Society'),
  ('elm-street-open-mic-pending', 'Open Mic Night',
   'Sign-ups at the door.',
   'A pending submission awaiting review. Fictional sample event.',
   8, '20:00'::time, 120, false, 'unknown', null, null, null,
   'pending', 'organizer', 'music-arts',
   'Elm Street Music Hall', 'Elm Street Arts Collective'),
  ('cedar-pavilion-neighborhood-meeting-rejected', 'Neighborhood Meeting',
   'A rejected submission.',
   'A rejected submission used to test visibility. Fictional sample event.',
   5, '19:00'::time, 60, false, 'free', null, null, null,
   'rejected', 'organizer', 'community-civic',
   'Cedar Pavilion', 'Cedar Pavilion Friends'),
  ('old-mill-storytime-canceled', 'Children Storytime',
   'Canceled sample event.',
   'A canceled event used to test visibility. Fictional sample event.',
   3, '10:30'::time, 45, false, 'free', null, null, null,
   'canceled', 'organizer', 'family-kids',
   'Old Mill Library', null)
),
timed as (
  select s.*,
    (date_trunc('day', now() at time zone 'America/New_York')
      + s.day_offset * interval '1 day'
      + s.start_local) at time zone 'America/New_York' as start_ts
  from seed s
)
insert into public.events
  (slug, title, summary, description, start_time, end_time, is_all_day,
   price_type, price_note, image_url, source_url, status, origin,
   category_id, venue_id, organizer_id)
select
  t.slug, t.title, t.summary, t.description, t.start_ts,
  t.start_ts + t.duration_minutes * interval '1 minute',
  t.is_all_day, t.price_type, t.price_note, t.image_url, t.source_url,
  t.status, t.origin, c.id, v.id, o.id
from timed t
join public.categories c on c.slug = t.category_slug
join public.venues v on v.name = t.venue_name
left join public.organizers o on o.name = t.organizer_name;

insert into public.event_private
  (event_id, submitter_name, submitter_email, admin_notes, rejection_reason)
select e.id, 'Sample Submitter', 'submitter@example.com', p.note, p.reason
from public.events e
join (values
  ('elm-street-open-mic-pending', 'Awaiting review', null),
  ('cedar-pavilion-neighborhood-meeting-rejected', 'Looks like a duplicate', 'Duplicate submission')
) as p(slug, note, reason) on p.slug = e.slug;

commit;