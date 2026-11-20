// These describe the shape of data coming back from Supabase.
// TypeScript uses them to catch mistakes (like a misspelled field) while you code.

export type PriceType = 'free' | 'paid' | 'unknown'

export type Category = {
  id: string
  name: string
  slug: string
  description: string | null
}

export type Venue = {
  id: string
  name: string
  street_address: string
  city: string
  state: string
  zip: string | null
  phone: string | null
  website_url: string | null
}

export type Organizer = {
  id: string
  name: string
  website_url: string | null
}

export type PublicEvent = {
  id: string
  slug: string
  title: string
  summary: string | null
  description: string
  start_time: string // ISO timestamp text, e.g. "2026-11-19T15:00:00+00:00"
  end_time: string | null
  is_all_day: boolean
  price_type: PriceType
  price_note: string | null
  image_url: string | null
  info_url: string | null
  source_url: string | null
  category: Pick<Category, 'id' | 'name' | 'slug'>
  venue: Venue
  organizer: Organizer | null
}