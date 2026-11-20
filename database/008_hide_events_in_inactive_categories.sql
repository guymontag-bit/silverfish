begin;

drop policy "Public can read published events" on public.events;

create policy "Public can read published events in active categories"
  on public.events
  for select
  to anon, authenticated
  using (
    status = 'published'
    and exists (
      select 1 from public.categories c
      where c.id = events.category_id
        and c.is_active
    )
  );

commit;