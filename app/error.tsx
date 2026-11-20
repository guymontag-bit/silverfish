'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function ErrorPage({
  error,
  retry,
}: {
  error: Error & { digest?: string }
  retry: () => void
}) {
  useEffect(() => {
    // Later, this is where an error-reporting service would be called.
    console.error(error)
  }, [error])

  return (
    <main id="main" className="mx-auto max-w-3xl px-4 py-16 text-center">
      <h1 className="text-3xl font-bold tracking-tight">Something went wrong</h1>
      <p className="mt-3 opacity-70">We could not load this page. Please try again in a moment.</p>
      <div className="mt-6 flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={() => retry()}
          className="rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800"
        >
          Try again
        </button>
        <Link href="/" className="font-medium text-blue-700 hover:underline dark:text-blue-400">
          Back to all events
        </Link>
      </div>
    </main>
  )
}