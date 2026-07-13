import { useMemo, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { LibrarySearch } from '../../components/ui/LibrarySearch'
import { DocumentCard } from '../../components/ui/DocumentCard'
import { Bookshelf } from '../../components/ui/Bookshelf'
import { Pagination, paginate } from '../../components/ui/Pagination'
import { EmptyState } from '../../components/ui/EmptyState'
import { useLibrary } from '../../contexts/LibraryContext'
import { getBookPalette, isReportCategory } from '../../utils/bookTheme'
import type { SearchSort } from '../../utils/search'

const PER_PAGE = 12

function stackCode(order: number) {
  const letter = String.fromCharCode(64 + ((order - 1) % 4) + 1)
  return `${letter}-${String(order).padStart(2, '0')}`
}

export function CategoryDetail() {
  const { id } = useParams<{ id: string }>()
  const [searchParams] = useSearchParams()
  const [page, setPage] = useState(1)
  const { getCategoryById, getDocumentsByCategory, search } = useLibrary()

  const query = searchParams.get('q') || ''
  const sort = (searchParams.get('sort') as SearchSort) || 'relevance'
  const yearFrom = searchParams.get('from') ? Number(searchParams.get('from')) : undefined
  const yearTo = searchParams.get('to') ? Number(searchParams.get('to')) : undefined

  const category = getCategoryById(id || '')

  const categoryDocs = useMemo(() => {
    if (!id) return []
    if (!query.trim()) return getDocumentsByCategory(id)
    return search(query, { categoryId: id, sort, yearFrom, yearTo }).map((r) => r.document)
  }, [id, query, sort, yearFrom, yearTo, getDocumentsByCategory, search])

  const { items, totalPages } = paginate(categoryDocs, page, PER_PAGE)

  if (!category) {
    return (
      <EmptyState
        title="Collection not found"
        description="The collection you are looking for does not exist."
        action={
          <Link to="/categories" className="text-sm font-medium text-brand hover:underline">
            Back to collections
          </Link>
        }
      />
    )
  }

  const palette = getBookPalette(category.id)
  const isReport = isReportCategory(category.id)

  return (
    <div>
      <Link
        to="/categories"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-text transition-colors"
      >
        <ArrowLeft size={16} />
        All stacks
      </Link>

      <div className="library-stack-hero">
        <div className="library-stack-hero-glow" style={{ background: palette.accent }} aria-hidden />
        <div className="library-stack-hero-content">
          <div className="library-stack-plaque library-stack-plaque-lg">
            <span className="library-stack-code">{stackCode(category.order)}</span>
            <span className="library-stack-name">{category.name}</span>
          </div>
          <p className="library-stack-hero-desc">{category.description}</p>
          <div className="library-stack-hero-meta">
            <span>{category.documentCount} volumes on this shelf</span>
            <span className="library-stack-hero-dot" aria-hidden />
            <span>{isReport ? 'Report series' : 'Bound volumes'}</span>
          </div>
        </div>
        <div className="library-stack-hero-shelf" aria-hidden>
          <div className="library-shelf-books library-shelf-books-hero">
            {Array.from({ length: 6 }).map((_, i) =>
              isReport ? (
                <div key={i} className="library-report-spine" style={{ height: 48 + (i % 3) * 8, width: 28 }}>
                  <div className="library-report-spine-header" />
                </div>
              ) : (
                <div
                  key={i}
                  className="library-spine"
                  style={{
                    height: 52 + (i % 4) * 10,
                    width: 16 + (i % 2) * 4,
                    background: `linear-gradient(180deg, ${palette.coverLight}, ${palette.cover}, ${palette.spine})`,
                    borderLeft: `2px solid ${palette.spine}`,
                  }}
                >
                  <div className="library-spine-pages" />
                </div>
              ),
            )}
          </div>
          <div className="library-shelf-plank library-shelf-plank-hero" />
        </div>
      </div>

      <div className="mb-8 mt-8">
        <LibrarySearch
          defaultQuery={query}
          categoryId={category.id}
          categoryName={category.name}
          basePath={`/categories/${category.id}`}
          showFilters
        />
      </div>

      {categoryDocs.length === 0 ? (
        <EmptyState
          title={query ? 'No matching volumes' : 'Empty shelf'}
          description={
            query
              ? `Nothing in ${category.name} matches "${query}". Try different keywords.`
              : 'No volumes have been added to this stack yet.'
          }
        />
      ) : (
        <>
          <p className="mb-4 text-sm text-text-muted">
            {query
              ? `${categoryDocs.length} result${categoryDocs.length !== 1 ? 's' : ''} on this shelf`
              : `All ${categoryDocs.length} volumes on shelf ${stackCode(category.order)}`}
          </p>
          <Bookshelf title="On the shelf">
            {items.map((doc) => (
              <DocumentCard key={doc.id} document={doc} />
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
