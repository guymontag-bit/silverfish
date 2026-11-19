# Decision log

Short records of the choices behind Silverfish, what each one costs, and when to revisit it.

Format: **Decision**, **Why**, **Tradeoff**, **Revisit when**.

---

## 1. Stack: Next.js, Supabase, Vercel, Python scrapers
- **Decision:** Build with Next.js (App Router, TypeScript, Tailwind), a Supabase Postgres database, Vercel hosting, and Python scrapers on GitHub Actions.
- **Why:** The project is a learning showcase, so I chose the stack that covers the most ground, including server rendering, database security, and scheduled jobs. Free tiers keep the MVP at near-zero cost.
- **Tradeoff:** The steepest path. WordPress or Django would have given me an admin panel and approval queue sooner.
- **Revisit when:** Any free tier limit is reached, or the project earns money (see entry 12).

## 2. Every event requires admin approval
- **Decision:** Nothing is published without review, including scraped events.
- **Why:** Protects quality and keeps spam off the site while the volume is small.
- **Tradeoff:** Admin work grows with volume.
- **Revisit when:** Review time becomes a burden. Trusted organizers could then auto-publish.

## 3. Images are linked, not uploaded
- **Decision:** Event images come from venue or organizer URLs. Cards show a gray placeholder if an image is missing or fails, and I use a plain `<img>` instead of Next.js `Image`.
- **Why:** No file storage to build or pay for, and `Image` would need every possible image host listed in the config.
- **Tradeoff:** Images can disappear or be blocked by the other site, and I do not optimize or resize them.
- **Revisit when:** Broken images become common, or organizers need to upload their own.

## 4. Private submitter data lives in its own table
- **Decision:** Submitter name, email, and admin notes are stored in `event_private`, with no public access.
- **Why:** Row Level Security controls which rows someone can read, not which columns. Keeping private fields in a separate table means one rule protects them all.
- **Tradeoff:** One more table, and joins when an admin needs both.
- **Revisit when:** Admin screens need both tables often enough to justify a view.

## 5. Times stored in UTC, shown in New York time
- **Decision:** Event times are `timestamptz` in the database and formatted in America/New_York on the site. "Upcoming" means "starts today or later" in New York time.
- **Why:** Avoids daylight saving bugs, and keeps all-day events visible for the whole day.
- **Tradeoff:** Events that already ended earlier today still show in listings.
- **Revisit when:** The site expands beyond one time zone, or finished events should hide.

## 6. Database rules do the access control
- **Decision:** The public can read only published events in active categories. Venues and organizers are visible only when a visible event uses them. Grants and Row Level Security policies are separate layers, and both are required.
- **Why:** The database enforces the rule even if a page has a bug. Testing a hidden category exposed a crash, which led to migration 008, so deactivating a category now hides its events too.
- **Tradeoff:** Policies that reference other tables need careful testing.
- **Revisit when:** Admin and organizer access is added in the next phase.

## 7. Cache Components and use cache
- **Decision:** Next.js 16.4 enables Cache Components for new projects, so I kept it. Data functions use `use cache` with `cacheLife('minutes')` and tags.
- **Why:** It's the direction Next.js is heading, and it gives fast pages with data that refreshes within minutes.
- **Tradeoff:** More concepts than the older `revalidate` model, and edits in Supabase can take a minute to appear.
- **Revisit when:** Approvals should appear instantly. I plan to refresh by cache tag when an admin approves an event.

## 8. Dynamic pages are allowed to block (`instant = false`)
- **Decision:** The event and category pages export `instant = false` instead of streaming behind Suspense.
- **Why:** Simpler code. The data is cached and most pages are prebuilt, so navigation should still feel quick.
- **Tradeoff:** Click-through is not guaranteed to be instant.
- **Revisit when:** Polishing. Suspense with skeleton placeholders is the more modern approach.

## 9. First request to an unknown URL returns 200 with noindex
- **Decision:** I accepted the framework's behavior: the first request for an unknown or hidden URL returns a 200 status with a "not found" page and `noindex`, and later requests return a real 404.
- **Why:** I tested a fresh build, removed `instant = false`, and repeated requests, and the pattern held. Hidden event content is never exposed.
- **Tradeoff:** The status code is not a true 404 on the first hit, which is a small search-engine cost.
- **Revisit when:** Search indexing is affected. Options are an existence check in `proxy.ts`, or rebuilding when events are approved.

## 10. Dependency audit: declined a forced fix
- **Decision:** I did not run `npm audit fix --force`. The remaining 14 high findings trace to one unpatched picomatch advisory (GHSA-fc5q-39xc-vjpf) inside ESLint development tools.
- **Why:** `npm audit --omit=dev` reports 0, so nothing shipped to visitors is affected. The forced fix would downgrade `eslint-config-next`.
- **Tradeoff:** The audit stays noisy until the dependency is patched.
- **Revisit when:** A patched picomatch is released, or at the start of each phase.

## 11. Admin role stored in app_metadata
- **Decision:** Admins are identified by a role in `app_metadata`, set only from the server.
- **Why:** Users can edit their own `user_metadata`, so a role stored there could be self-granted. The database can enforce `app_metadata`.
- **Tradeoff:** Role changes apply after the login token refreshes.
- **Revisit when:** Building the admin area.

## 12. Hosting on Vercel's free plan
- **Decision:** Start on the Hobby plan.
- **Why:** Free, and the smoothest path for Next.js.
- **Tradeoff:** Hobby is for non-commercial use only.
- **Revisit when:** Ads, sponsorships, or any revenue are added. Then upgrade or move hosts.