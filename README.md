# Codename Silverfish

A community events calendar for New York's Capital Region. Built as a learning and portfolio project.

> All events, venues, and organizers in the demo are fictional sample data.

## Status
Public browsing is working: home page, category pages, and event detail pages.
Planned next: organizer submissions, admin review, and event scrapers.

## Stack
| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router, Cache Components), TypeScript, Tailwind CSS |
| Database and auth | Supabase (Postgres with Row Level Security) |
| Hosting | Vercel |
| Planned | Python scrapers on GitHub Actions |

## Highlights
- Row Level Security limits the public to published events in active categories.
- Submitter details live in a separate table that the public cannot read.
- Times are stored in UTC and displayed in America/New_York.
- Data access is cached with `use cache` and refreshed every few minutes.

See [docs/decisions.md](docs/decisions.md) for the reasoning behind the main design choices.

## Getting started
1. Install Node.js and run `npm install`.
2. Create a Supabase project, then run the scripts in `database/` in numeric order.
3. Optionally load `database/seed/sample_data.sql` for sample data. Never run it in production.
4. Copy `.env.example` to `.env.local` and fill in your Supabase URL and publishable key.
5. Run `npm run dev` and open http://localhost:3000.

## Project layout
- `app/` pages and routes
- `components/` shared UI
- `lib/` data queries, types, and helpers
- `database/` SQL migrations and seed data

## License
To be decided.