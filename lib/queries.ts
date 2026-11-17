import 'server-only'
import { cacheLife, cacheTag } from 'next/cache'
import { supabase } from '@/lib/supabase/server'
import { startOfTodayNY } from '@/lib/dates'
import type { Category, PublicEvent } from '@/lib/types'

// Which columns we want, including linked rows from other tables.
// "category:categories ( ... )" means: follow the foreign key and
// return the linked category row under the name "category".
const EVENT_SELECT = `
  id, slug, title, summary, description, start_time, end_time, is_all_day,
  price_type, price_note, image_url, info_url, source_url,
  category:categories ( id, name, slug ),
  venue:venues ( id, name, street_address, city, state, zip, phone, website_url ),
  organizer:organizers ( id, name, website_url )
`

// NOTE: none of these filter on status. Row-level security in the database
// already limits the public to published events.
//
// Each function is cached with 'use cache'. cacheLife('minutes') keeps the
// result for a short while, and the tags let us refresh it on demand later
// (for example, when an admin approves an event).

export async function getUpcomingEvents(limit = 50): Promise<PublicEvent[]> {
  'use cache'
  cacheLife('minutes')
  cacheTag('events')

  const { data, error } = await supabase
    .from('events')
    .select(EVENT_SELECT)
    .gte('start_time', startOfTodayNY().toISOString())
    .order('start_time', { ascending: true })
    .limit(limit)

  if (error) throw new Error(`getUpcomingEvents failed: ${error.message}`)
  return (data ?? []) as unknown as PublicEvent[]
}

export async function getEventBySlug(slug: string): Promise<PublicEvent | null> {
  'use cache'
  cacheLife('minutes')
  cacheTag('events')

  const { data, error } = await supabase
    .from('events')
    .select(EVENT_SELECT)
    .eq('slug', slug)
    .maybeSingle()

  if (error) throw new Error(`getEventBySlug failed: ${error.message}`)
  return (data as unknown as PublicEvent | null) ?? null
}

export async function getCategories(): Promise<Category[]> {
  'use cache'
  cacheLife('minutes')
  cacheTag('categories')

  const { data, error } = await supabase
    .from('categories')
    .select('id, name, slug, description')
    .order('sort_order', { ascending: true })
    .order('name', { ascending: true })

  if (error) throw new Error(`getCategories failed: ${error.message}`)
  return (data ?? []) as Category[]
}

export async function getCategoryWithEvents(
  slug: string
): Promise<{ category: Category; events: PublicEvent[] } | null> {
  'use cache'
  cacheLife('minutes')
  cacheTag('categories')
  cacheTag('events')

  const { data: category, error: categoryError } = await supabase
    .from('categories')
    .select('id, name, slug, description')
    .eq('slug', slug)
    .maybeSingle()

  if (categoryError) {
    throw new Error(`getCategoryWithEvents (category) failed: ${categoryError.message}`)
  }
  if (!category) return null // unknown or inactive category -> the page will show a 404

  const { data, error } = await supabase
    .from('events')
    .select(EVENT_SELECT)
    .eq('category_id', category.id)
    .gte('start_time', startOfTodayNY().toISOString())
    .order('start_time', { ascending: true })

  if (error) throw new Error(`getCategoryWithEvents (events) failed: ${error.message}`)
  return { category: category as Category, events: (data ?? []) as unknown as PublicEvent[] }
}