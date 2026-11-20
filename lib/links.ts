import type { Venue } from '@/lib/types'

// A Google Maps directions link for a venue's address.
export function directionsUrl(
  venue: Pick<Venue, 'street_address' | 'city' | 'state' | 'zip'>
): string {
  const address = `${venue.street_address}, ${venue.city}, ${venue.state}${
    venue.zip ? ` ${venue.zip}` : ''
  }`
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`
}

// "(518) 555-0101" -> "tel:5185550101", so tapping the number on a phone dials it.
export function telHref(phone: string): string {
  return `tel:${phone.replace(/[^\d+]/g, '')}`
}

// "https://www.example.com/page" -> "example.com", or null if it is not a valid URL.
export function hostnameOf(url: string): string | null {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return null
  }
}