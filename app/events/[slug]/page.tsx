import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { describeWhen } from '@/lib/dates'
import { directionsUrl, hostnameOf, telHref } from '@/lib/links'
import { getEventBySlug, getUpcomingEvents } from '@/lib/queries'
import { excerpt } from '@/lib/text'

type Props = { params: Promise<{ slug: string }> }

// Intentional: this page reads the URL (params) and must return a real
// HTTP 404 for unknown or hidden events, so it is allowed to block
// instead of streaming. Revisit in the polish phase.
export const instant = false

// Prebuild pages for upcoming events. Other events render on demand.
export async function generateStaticParams() {
  const events = await getUpcomingEvents()
  const params = events.map((event) => ({ slug: event.slug }))
  return params.length > 0 ? params : [{ slug: '__placeholder__' }]
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const event = await getEventBySlug(slug)
  if (!event) return { title: 'Event not found' }

  const description = event.summary ?? excerpt(event.description, 160)
  return {
    title: event.title,
    description,
    openGraph: {
      title: event.title,
      description,
      images: event.image_url ? [event.image_url] : undefined,
    },
  }
}

export default async function EventPage({ params }: Props) {
  const { slug } = await params
  const event = await getEventBySlug(slug)
  if (!event) notFound()

  const { venue, organizer, category } = event
  const { dateLine, timeLine } = describeWhen(
    event.start_time,
    event.end_time,
    event.is_all_day
  )
  const sourceHost = event.source_url ? hostnameOf(event.source_url) : null
  const costLabel =
    event.price_type === 'free' ? 'Free' : event.price_type === 'paid' ? 'Paid' : 'Not listed'

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <nav aria-label="Breadcrumb" className="mb-4 text-sm">
        <Link href="/" className="text-blue-700 hover:underline">
          All events
        </Link>
        <span aria-hidden="true"> / </span>
        <Link href={`/category/${category.slug}`} className="text-blue-700 hover:underline">
          {category.name}
        </Link>
      </nav>

      <article>
        <header className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">{event.title}</h1>
          {event.summary && <p className="mt-2 text-lg opacity-80">{event.summary}</p>}
        </header>

        <div className={`grid gap-6 ${event.image_url ? 'md:grid-cols-[18rem_1fr]' : ''}`}>
          <section
            aria-labelledby="when-where"
            className="space-y-4 rounded-xl border border-neutral-300 p-4"
          >
            <h2 id="when-where" className="text-lg font-semibold">
              When and where
            </h2>
            <dl className="space-y-4 text-sm">
              <div>
                <dt className="font-semibold">Date and time</dt>
                <dd>
                  {dateLine}
                  <br />
                  {timeLine}
                </dd>
              </div>

              <div>
                <dt className="font-semibold">Location</dt>
                <dd>
                  <span className="font-medium">{venue.name}</span>
                  <br />
                  {venue.street_address}
                  <br />
                  {venue.city}, {venue.state} {venue.zip}
                </dd>
                {venue.phone && (
                  <dd className="mt-1">
                    <a href={telHref(venue.phone)} className="text-blue-700 hover:underline">
                      {venue.phone}
                    </a>
                  </dd>
                )}
                <dd className="mt-1">
                  <a
                    href={directionsUrl(venue)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-700 hover:underline"
                  >
                    Driving directions
                  </a>
                </dd>
              </div>

              <div>
                <dt className="font-semibold">Cost</dt>
                <dd>
                  {costLabel}
                  {event.price_note ? ` · ${event.price_note}` : ''}
                </dd>
              </div>
            </dl>
          </section>

          {event.image_url && (
            <div className="relative order-first aspect-[4/3] overflow-hidden rounded-xl bg-neutral-200 md:order-none">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={event.image_url}
                alt={`Image for ${event.title}`}
                referrerPolicy="no-referrer"
                className="absolute inset-0 h-full w-full object-contain"
              />
            </div>
          )}
        </div>

        <section aria-labelledby="about" className="mt-8">
          <h2 id="about" className="text-xl font-semibold">
            About this event
          </h2>
          <p className="mt-3 whitespace-pre-line leading-relaxed">{event.description}</p>

          {organizer && (
            <p className="mt-4 text-sm">
              Presented by{' '}
              {organizer.website_url ? (
                <a
                  href={organizer.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-blue-700 hover:underline"
                >
                  {organizer.name}
                </a>
              ) : (
                <span className="font-medium">{organizer.name}</span>
              )}
            </p>
          )}

          {event.info_url && (
            <p className="mt-6">
              <a
                href={event.info_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800"
              >
                More info or tickets
              </a>
            </p>
          )}

          {sourceHost && event.source_url && (
            <p className="mt-6 text-xs opacity-60">
              Originally listed at{' '}
              <a
                href={event.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                {sourceHost}
              </a>
            </p>
          )}
        </section>
      </article>
    </main>
  )
}