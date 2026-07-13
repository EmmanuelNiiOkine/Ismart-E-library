import { useState } from 'react'
import { PageHeader } from '../../components/layout/PageHeader'
import { LibrarySearch } from '../../components/ui/LibrarySearch'
import { DocumentCard } from '../../components/ui/DocumentCard'
import { Bookshelf } from '../../components/ui/Bookshelf'
import { Pagination, paginate } from '../../components/ui/Pagination'
import { useLibrary } from '../../contexts/LibraryContext'

const PER_PAGE = 12

export function Library() {
  const [page, setPage] = useState(1)
  const { documents } = useLibrary()

  const sorted = [...documents].sort(
    (a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime()
  )
  const { items, totalPages } = paginate(sorted, page, PER_PAGE)

  return (
    <div>
      <PageHeader
        title="All volumes"
        description={`${documents.length} legal volumes in the collection.`}
      />

      <div className="mb-8">
        <LibrarySearch showFilters />
      </div>

      <Bookshelf>
        {items.map((doc) => (
          <DocumentCard key={doc.id} document={doc} />
        ))}
      </Bookshelf>

      <div className="mt-6">
        <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
      </div>
    </div>
  )
}
