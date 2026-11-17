import Link from 'next/link'
import type { PublicEvent } from '@/lib/types'
import { formatEventDateTime } from '@/lib/dates'
import { excerpt } from '@/lib/text'

export default function EventCard({ event }: { event: PublicEvent }) {
  const blurb = event.summary ?? excerpt(event.description, 160)

  return (
    <article className="relative flex flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white text-neutral-900 shadow-sm transition hover:shadow-md sm:flex-row">
      {/* Gray block that shows when there is no image or it fails to load */}
      <div className="relative h-48 w-full shrink-0 bg-neutral-200 sm:h-auto sm:w-56">
        {event.image_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={event.image_url}
            alt=""
            loading="lazy"
            referrerPolicy="no-referrer"
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <h2 className="text-lg font-semibold leading-snug">
          {/* The ::after stretches this link over the whole card */}
          <Link href={`/events/${event.slug}`} className="after:absolute after:inset-0 hover:underline">
            {event.title}
          </Link>
        </h2>

        <p className="text-xs font-semibold uppercase tracking-wide text-neutral-600">
          {formatEventDateTime(event.start_time, event.is_all_day)}
        </p>

        <p className="line-clamp-3 text-sm text-neutral-700">{blurb}</p>

        <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-1 pt-2 text-sm">
          {/* relative + z-10 keeps this link clickable above the stretched title link */}
          <Link
            href={`/category/${event.category.slug}`}
            className="relative z-10 font-medium text-blue-700 hover:underline"
          >
            {event.category.name}
          </Link>
          {event.price_type === 'free' && (
            <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
              Free
            </span>
          )}
          <span className="text-neutral-600">
            {event.venue.name} · {event.venue.city}, {event.venue.state}
          </span>
        </div>
      </div>
    </article>
  )
}