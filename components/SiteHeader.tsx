import Link from 'next/link'
import { getCategories } from '@/lib/queries'

export default async function SiteHeader() {
  const categories = await getCategories()

  return (
    <header className="border-b border-neutral-300/60">
      <div className="mx-auto flex max-w-3xl flex-col gap-3 px-4 py-4">
        <Link href="/" className="text-xl font-bold tracking-tight">
          Silverfish
        </Link>
        <nav aria-label="Categories">
          <ul className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
            {categories.map((category) => (
              <li key={category.id}>
                <Link href={`/category/${category.slug}`} className="hover:underline">
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  )
}