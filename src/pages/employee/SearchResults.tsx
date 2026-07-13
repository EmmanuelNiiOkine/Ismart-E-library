import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { PageHeader } from '../../components/layout/PageHeader'
import { LibrarySearch } from '../../components/ui/LibrarySearch'
import { DocumentCard } from '../../components/ui/DocumentCard'
import { Bookshelf } from '../../components/ui/Bookshelf'
import { Pagination, paginate } from '../../components/ui/Pagination'
import { EmptyState } from '../../components/ui/EmptyState'
import { useLibrary } from '../../contexts/LibraryContext'
import type { SearchSort } from '../../utils/search'

const PER_PAGE = 12

export function SearchResults() {
  const [searchParams] = useSearchParams()
  const [page, setPage] = useState(1)
  const { search, categories } = useLibrary()

  const query = searchParams.get('q') || ''
  const categoryId = searchParams.get('category') || undefined
  const sort = (searchParams.get('sort') as SearchSort) || 'relevance'
  const yearFrom = searchParams.get('from') ? Number(searchParams.get('from')) : undefined
  const yearTo = searchParams.get('to') ? Number(searchParams.get('to')) : undefined

  const results = useMemo(
    () => search(query, { categoryId, sort, yearFrom, yearTo }),
    [search, query, categoryId, sort, yearFrom, yearTo],
  )

  const { items, totalPages, total } = paginate(results, page, PER_PAGE)
  const activeCategory = categoryId ? categories.find((c) => c.id === categoryId) : undefined

  const description = query
    ? `${total} volume${total !== 1 ? 's' : ''} found${activeCategory ? ` in ${activeCategory.name}` : ''}${query ? ` for "${query}"` : ''}`
    : 'Search across all volumes, authors, keywords, and collections.'

  return (
    <div>
      <PageHeader title="Search library" description={description} />

      <div className="mb-8">
        <LibrarySearch defaultQuery={query} showFilters />
      </div>

      {!query && !categoryId && !yearFrom && !yearTo ? (
        <EmptyState
          title="Start searching"
          description="Type a title, author, keyword, or collection name. Use filters to narrow by year or collection."
        />
      ) : results.length === 0 ? (
        <EmptyState
          title="No volumes found"
          description={`Nothing matches your search. Try broader keywords or clear some filters.`}
        />
      ) : (
        <>
          <div className="mb-4 flex flex-wrap gap-2">
            {activeCategory && (
              <span className="rounded-full bg-brand-light px-3 py-1 text-xs font-semibold text-brand">
                {activeCategory.name}
              </span>
            )}
            {yearFrom && (
              <span className="rounded-full bg-background px-3 py-1 text-xs font-medium text-text-muted border border-border">
                From {yearFrom}
              </span>
            )}
            {yearTo && (
              <span className="rounded-full bg-background px-3 py-1 text-xs font-medium text-text-muted border border-border">
                To {yearTo}
              </span>
            )}
            <span className="rounded-full bg-background px-3 py-1 text-xs font-medium text-text-muted border border-border">
              Sorted by {sort}
            </span>
          </div>

          <Bookshelf>
            {items.map(({ document, matchedFields }) => (
              <div key={document.id} className="relative">
                <DocumentCard document={document} />
                {query && matchedFields.length > 0 && (
                  <p className="mt-1 text-center text-[10px] font-medium uppercase tracking-wider text-brand">
                    Matched: {matchedFields.join(' · ')}
                  </p>
                )}
              </div>
            ))}
          </Bookshelf>
          <div className="mt-6">
            <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
          </div>
        </>
      )}
    </div>
  )
}
