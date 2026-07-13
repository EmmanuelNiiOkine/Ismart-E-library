import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRightLeft, Plus, Pencil, Trash2, BookOpen } from 'lucide-react'
import { PageHeader } from '../../components/layout/PageHeader'
import { Button } from '../../components/ui/Button'
import { Pagination, paginate } from '../../components/ui/Pagination'
import { useLibrary } from '../../contexts/LibraryContext'

const PER_PAGE = 10

export function DocumentManagement() {
  const {
    documents,
    categories,
    getCategoryById,
    moveDocumentToCategory,
    deleteDocument,
  } = useLibrary()
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [movingId, setMovingId] = useState<string | null>(null)

  const filtered = documents.filter((doc) => {
    if (!search) return true
    const q = search.toLowerCase()
    const cat = getCategoryById(doc.categoryId)
    return (
      doc.title.toLowerCase().includes(q) ||
      doc.author.toLowerCase().includes(q) ||
      cat?.name.toLowerCase().includes(q)
    )
  })

  const { items, totalPages } = paginate(filtered, page, PER_PAGE)

  const handleDelete = (id: string) => {
    if (confirm('Delete this document?')) {
      deleteDocument(id)
    }
  }

  const handleMove = (docId: string, newCategoryId: string, currentCategoryId: string) => {
    if (newCategoryId === currentCategoryId) return
    const target = getCategoryById(newCategoryId)
    const current = getCategoryById(currentCategoryId)
    if (
      confirm(
        `Move this volume from "${current?.name}" to "${target?.name}"?`,
      )
    ) {
      moveDocumentToCategory(docId, newCategoryId)
      setMovingId(null)
    }
  }

  return (
    <div>
      <PageHeader
        title="Volume management"
        description={`${documents.length} volumes across all collections.`}
        actions={
          <Link to="/admin/upload">
            <Button size="sm">
              <Plus size={16} />
              Upload
            </Button>
          </Link>
        }
      />

      <div className="mb-6 max-w-xl">
        <input
          type="search"
          placeholder="Filter volumes..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            setPage(1)
          }}
          className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text placeholder:text-text-muted focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
        />
      </div>

      <div className="overflow-x-auto rounded-xl border border-border bg-surface">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border bg-background/60">
              <th className="px-4 py-3 font-medium text-text-muted">Title</th>
              <th className="px-4 py-3 font-medium text-text-muted">Author</th>
              <th className="px-4 py-3 font-medium text-text-muted min-w-[180px]">Collection</th>
              <th className="px-4 py-3 font-medium text-text-muted">Year</th>
              <th className="px-4 py-3 font-medium text-text-muted">Size</th>
              <th className="px-4 py-3 font-medium text-text-muted">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((doc) => {
              const cat = getCategoryById(doc.categoryId)
              const isMoving = movingId === doc.id

              return (
                <tr key={doc.id} className="border-b border-border last:border-0 hover:bg-background/50">
                  <td className="px-4 py-3 font-medium text-text max-w-[200px] truncate">
                    {doc.title}
                  </td>
                  <td className="px-4 py-3 text-text-muted">{doc.author}</td>
                  <td className="px-4 py-3">
                    {isMoving ? (
                      <div className="flex items-center gap-2">
                        <select
                          autoFocus
                          defaultValue={doc.categoryId}
                          className="w-full max-w-[200px] rounded-lg border border-brand bg-surface px-2 py-1.5 text-xs font-medium text-text focus:outline-none focus:ring-1 focus:ring-brand"
                          onChange={(e) =>
                            handleMove(doc.id, e.target.value, doc.categoryId)
                          }
                          onBlur={() => setMovingId(null)}
                        >
                          {categories.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setMovingId(doc.id)}
                        className="group inline-flex items-center gap-1.5 rounded-lg border border-transparent px-2 py-1 text-left text-text-muted transition-colors hover:border-border hover:bg-background hover:text-text"
                        title="Move to another collection"
                      >
                        <span className="truncate max-w-[140px]">{cat?.name}</span>
                        <ArrowRightLeft
                          size={13}
                          className="shrink-0 opacity-0 transition-opacity group-hover:opacity-100 text-brand"
                        />
                      </button>
                    )}
                  </td>
                  <td className="px-4 py-3 text-text-muted">{doc.publicationYear}</td>
                  <td className="px-4 py-3 text-text-muted">{doc.fileSize}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <Link
                        to={`/read/${doc.id}`}
                        className="rounded p-1.5 text-brand hover:bg-brand-light"
                        title="Read"
                      >
                        <BookOpen size={15} />
                      </Link>
                      <button
                        type="button"
                        onClick={() => setMovingId(doc.id)}
                        className="rounded p-1.5 text-text-muted hover:bg-background hover:text-brand"
                        title="Move collection"
                      >
                        <ArrowRightLeft size={15} />
                      </button>
                      <Link
                        to={`/admin/documents/${doc.id}/edit`}
                        className="rounded p-1.5 text-text-muted hover:bg-background hover:text-text"
                        title="Edit"
                      >
                        <Pencil size={15} />
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(doc.id)}
                        className="rounded p-1.5 text-text-muted hover:bg-background hover:text-danger"
                        title="Delete"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-6">
        <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
      </div>
    </div>
  )
}
