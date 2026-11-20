import EventCard from '@/components/EventCard'
import { getUpcomingEvents } from '@/lib/queries'

export default async function Home() {
  const events = await getUpcomingEvents()

  return (
    <main id="main" className="mx-auto max-w-3xl px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Capital Region Events</h1>
        <p className="mt-2 opacity-70">
          Upcoming events across Albany, Troy, Saratoga Springs, and Schenectady.
        </p>
      </header>

      {events.length === 0 ? (
        <p className="rounded-xl border border-dashed border-neutral-400 p-8 text-center opacity-70">
          No upcoming events yet. Please check back soon.
        </p>
      ) : (
        <ul className="space-y-4">
          {events.map((event) => (
            <li key={event.id}>
              <EventCard event={event} />
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}