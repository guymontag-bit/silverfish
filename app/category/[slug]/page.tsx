import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import EventCard from '@/components/EventCard'
import { getCategories, getCategoryBySlug, getCategoryWithEvents } from '@/lib/queries'

type Props = { params: Promise<{ slug: string }> }

// Intentional: this page reads the URL (params) and must return a real
// HTTP 404 for unknown or hidden events, so it is allowed to block
// instead of streaming. Revisit in the polish phase.
export const instant = false

// Tells Next.js which category pages to build ahead of time.
export async function generateStaticParams() {
  const categories = await getCategories()
  const params = categories.map((category) => ({ slug: category.slug }))
  // The build fails on an empty list, so fall back to a placeholder
  // (it simply leads to the 404 page below).
  return params.length > 0 ? params : [{ slug: '__placeholder__' }]
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const category = await getCategoryBySlug(slug)
  if (!category) return { title: 'Category not found' }

  return {
    title: category.name,
    description:
      category.description ??
      `Upcoming ${category.name} events in New York's Capital Region.`,
  }
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params
  const result = await getCategoryWithEvents(slug)
  if (!result) notFound()

  const { category, events } = result

  return (
    <main id="main"className="mx-auto max-w-3xl px-4 py-8">
      <p className="mb-4 text-sm">
        <Link href="/" className="text-blue-700 dark:text-blue-400 hover:underline">
          All events
        </Link>
      </p>

      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">{category.name}</h1>
        {category.description && <p className="mt-2 opacity-70">{category.description}</p>}
      </header>

      {events.length === 0 ? (
        <p className="rounded-xl border border-dashed border-neutral-400 p-8 text-center opacity-70">
          No upcoming events in this category yet. Check back soon.
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