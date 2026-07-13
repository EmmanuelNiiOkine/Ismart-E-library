import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { PageHeader } from '../../components/layout/PageHeader'
import { CollectionsShowcase } from '../../components/ui/CollectionsShowcase'
import { LibrarySearch } from '../../components/ui/LibrarySearch'
import { useLibrary } from '../../contexts/LibraryContext'

export function Categories() {
  const [searchParams] = useSearchParams()
  const { categories } = useLibrary()
  const query = searchParams.get('q') || ''

  const filtered = useMemo(() => {
    const sorted = [...categories].sort((a, b) => a.order - b.order)
    if (!query.trim()) return sorted
    const q = query.toLowerCase()
    return sorted.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q),
    )
  }, [categories, query])

  return (
    <div>
      <PageHeader
        title="Collections"
        description="Walk the stacks — every shelf is a subject area of Ghana legal reference."
      />

      <div className="mb-8">
        <LibrarySearch
          defaultQuery={query}
          basePath="/categories"
          placeholder="Search stacks by name or subject..."
          showFilters={false}
          showSuggestions={false}
        />
      </div>

      <CollectionsShowcase
        categories={filtered}
        title="All stacks"
        description="Eight reference areas, each with its own shelf of volumes."
        emptyMessage={query ? `No stacks match "${query}".` : 'No collections yet.'}
      />
    </div>
  )
}
