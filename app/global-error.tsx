'use client'

import './globals.css'

export default function GlobalError({
  retry,
}: {
  error: Error & { digest?: string }
  retry: () => void
}) {
  return (
    <html lang="en">
      <body>
        <main className="mx-auto max-w-3xl px-4 py-16 text-center">
          <h1 className="text-3xl font-bold tracking-tight">Something went wrong</h1>
          <p className="mt-3 opacity-70">Please try again in a moment.</p>
          <button
            type="button"
            onClick={() => retry()}
            className="mt-6 rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800"
          >
            Try again
          </button>
        </main>
      </body>
    </html>
  )
}