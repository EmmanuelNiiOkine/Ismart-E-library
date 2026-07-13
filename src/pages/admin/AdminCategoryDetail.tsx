import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { ArrowLeft, Pencil, Trash2 } from 'lucide-react'
import { PageHeader } from '../../components/layout/PageHeader'
import { LibrarySearch } from '../../components/ui/LibrarySearch'
import { DocumentCard } from '../../components/ui/DocumentCard'
import { Bookshelf } from '../../components/ui/Bookshelf'
import { Pagination, paginate } from '../../components/ui/Pagination'
import { EmptyState } from '../../components/ui/EmptyState'
import { Button } from '../../components/ui/Button'
import { useLibrary } from '../../contexts/LibraryContext'
import type { SearchSort } from '../../utils/search'

const PER_PAGE = 12

export function AdminCategoryDetail() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const [searchParams] = useSearchParams()
  const [page, setPage] = useState(1)
  const { getCategoryById, getDocumentsByCategory, deleteCategory, search } = useLibrary()

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
        description="This collection does not exist or was removed."
        action={
          <Link to="/admin/categories" className="text-sm font-medium text-brand hover:underline">
            Back to collections
          </Link>
        }
      />
    )
  }

  const handleDelete = () => {
    if (
      confirm(
        `Delete "${category.name}"? The collection will be removed from the library.`,
      )
    ) {
      deleteCategory(category.id)
      navigate('/admin/categories')
    }
  }

  return (
    <div>
      <Link
        to="/admin/categories"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-text transition-colors"
      >
        <ArrowLeft size={16} />
        Collections
      </Link>

      <PageHeader
        title={category.name}
        description={`${category.documentCount} volumes · ${category.description}`}
        actions={
          <div className="flex flex-wrap gap-2">
            <Link to="/admin/categories">
              <Button variant="secondary" size="sm">
                <Pencil size={15} />
                Edit
              </Button>
            </Link>
            <Button variant="secondary" size="sm" onClick={handleDelete}>
              <Trash2 size={15} />
              Delete
            </Button>
          </div>
        }
      />

      <div className="mb-8">
        <LibrarySearch
          defaultQuery={query}
          categoryId={category.id}
          categoryName={category.name}
          basePath={`/admin/categories/${category.id}`}
          showFilters
          placeholder={`Search all volumes in ${category.name}...`}
        />
      </div>

      {categoryDocs.length === 0 ? (
        <EmptyState
          title={query ? 'No matching volumes' : 'Empty collection'}
          description={
            query
              ? `Nothing in ${category.name} matches "${query}".`
              : 'No volumes have been assigned to this collection yet.'
          }
        />
      ) : (
        <>
          <p className="mb-4 text-sm text-text-muted">
            {query
              ? `${categoryDocs.length} result${categoryDocs.length !== 1 ? 's' : ''}`
              : `All ${categoryDocs.length} volumes`}
            {' '}in {category.name}
          </p>
          <Bookshelf>
            {items.map((doc) => (
              <DocumentCard key={doc.id} document={doc} linkPrefix="/documents" />
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
