import Link from 'next/link'

export default function NotFound() {
  return (
    <main id="main" className="mx-auto max-w-3xl px-4 py-16 text-center">
      <h1 className="text-3xl font-bold tracking-tight">Page not found</h1>
      <p className="mt-3 opacity-70">
        We could not find what you were looking for. It may have moved, or the event may no longer be listed.
      </p>
      <Link href="/" className="mt-6 inline-block font-medium text-blue-700 hover:underline">
        Back to all events
      </Link>
    </main>
  )
}