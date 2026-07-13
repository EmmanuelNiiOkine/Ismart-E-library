import { Link, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  BookOpen,
  Calendar,
  Download,
  FileText,
  Tag,
  User,
} from 'lucide-react'
import { PageHeader } from '../../components/layout/PageHeader'
import { Button } from '../../components/ui/Button'
import { EmptyState } from '../../components/ui/EmptyState'
import { DocumentCover } from '../../components/ui/DocumentCover'
import { useLibrary } from '../../contexts/LibraryContext'
import { useAuth } from '../../contexts/AuthContext'

export function DocumentViewer() {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const { getDocumentById, getCategoryById } = useLibrary()
  const document = getDocumentById(id || '')
  const category = document ? getCategoryById(document.categoryId) : undefined

  const libraryPath = user?.role === 'admin' ? '/admin/documents' : '/library'

  if (!document) {
    return (
      <EmptyState
        title="Volume not found"
        description="The volume you are looking for does not exist."
        action={
          <Link to={libraryPath} className="text-sm font-medium text-brand hover:underline">
            Back to library
          </Link>
        }
      />
    )
  }

  const metaItems = [
    { label: 'Author', value: document.author, icon: <User size={15} /> },
    { label: 'Collection', value: category?.name, icon: <BookOpen size={15} /> },
    { label: 'Published', value: String(document.publicationYear), icon: <Calendar size={15} /> },
    { label: 'File size', value: document.fileSize, icon: <FileText size={15} /> },
    { label: 'Added', value: document.uploadDate, icon: <Calendar size={15} /> },
    { label: 'Uploaded by', value: document.uploadedBy, icon: <User size={15} /> },
  ]

  return (
    <div>
      <Link
        to={libraryPath}
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-text transition-colors"
      >
        <ArrowLeft size={16} />
        {user?.role === 'admin' ? 'Volumes' : 'Library'}
      </Link>

      <div className="mb-8 flex flex-col gap-8 lg:flex-row lg:items-start">
        <div className="book-hero shrink-0 flex justify-center lg:justify-start">
          <DocumentCover
            title={document.title}
            author={document.author}
            year={document.publicationYear}
            categoryId={document.categoryId}
            coverImageUrl={document.coverImageUrl}
            size="lg"
          />
        </div>

        <div className="flex-1 min-w-0">
          <PageHeader
            title={document.title}
            description={document.description}
            actions={
              <div className="flex flex-wrap items-center gap-2">
                <Link to={`/read/${document.id}`}>
                  <Button size="sm">
                    <BookOpen size={16} />
                    Read now
                  </Button>
                </Link>
                {document.downloadEnabled && (
                  <Button variant="secondary" size="sm">
                    <Download size={16} />
                    Download
                  </Button>
                )}
              </div>
            }
          />

          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {metaItems.map((item) => (
              <div
                key={item.label}
                className="rounded-xl border border-border bg-surface px-4 py-3"
              >
                <div className="flex items-center gap-2 text-text-muted">
                  {item.icon}
                  <p className="text-[11px] font-semibold uppercase tracking-wider">
                    {item.label}
                  </p>
                </div>
                <p className="mt-2 text-sm font-medium text-text">{item.value}</p>
              </div>
            ))}
          </div>

          {document.keywords.length > 0 && (
            <div className="mt-6">
              <div className="mb-2 flex items-center gap-2 text-text-muted">
                <Tag size={15} />
                <p className="text-xs font-semibold uppercase tracking-wider">Keywords</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {document.keywords.map((kw) => (
                  <span
                    key={kw}
                    className="rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-text-muted"
                  >
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="mt-8 rounded-2xl border border-border bg-surface p-6">
            <h2 className="text-sm font-semibold text-navy">About this volume</h2>
            <p className="mt-3 text-sm leading-relaxed text-text-muted">
              {document.description}
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link to={`/read/${document.id}`}>
                <Button>
                  <BookOpen size={16} />
                  Open reader
                </Button>
              </Link>
              {category && (
                <Link to={user?.role === 'admin' ? '/admin/categories' : `/categories/${category.id}`}>
                  <Button variant="secondary">
                    Browse {category.name}
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
