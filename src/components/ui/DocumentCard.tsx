import { Download, BookOpen, FileText } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Document } from '../../types'
import { useLibrary } from '../../contexts/LibraryContext'
import { DocumentCover } from './DocumentCover'
import { getBookPalette, isReportCategory } from '../../utils/bookTheme'

interface DocumentCardProps {
  document: Document
  linkPrefix?: string
  showDownload?: boolean
  variant?: 'grid' | 'compact'
}

function CategoryBadge({ name, palette }: { name: string; palette: ReturnType<typeof getBookPalette> }) {
  return (
    <div className="book-card-category-row">
      <span
        className="book-category-badge"
        style={{ background: `linear-gradient(135deg, ${palette.coverLight}, ${palette.cover})` }}
        title={name}
      >
        {name}
      </span>
    </div>
  )
}

export function DocumentCard({
  document,
  linkPrefix = '/documents',
  showDownload = true,
  variant = 'grid',
}: DocumentCardProps) {
  const { getCategoryById } = useLibrary()
  const category = getCategoryById(document.categoryId)
  const palette = getBookPalette(document.categoryId)
  const isReport = isReportCategory(document.categoryId)
  const ReadIcon = isReport ? FileText : BookOpen

  if (variant === 'compact') {
    return (
      <Link
        to={`${linkPrefix}/${document.id}`}
        className="book-card-compact group flex items-center gap-4 rounded-xl border border-border bg-surface p-3 transition-all duration-200 hover:border-brand/30 hover:shadow-md"
      >
        <DocumentCover
          title={document.title}
          author={document.author}
          year={document.publicationYear}
          categoryId={document.categoryId}
          coverImageUrl={document.coverImageUrl}
          size="sm"
        />
        <div className="min-w-0 flex-1">
          <h3 className="font-serif text-sm font-semibold text-text group-hover:text-brand line-clamp-2 min-h-[2.5em]">
            {document.title}
          </h3>
          <p className="mt-0.5 text-xs text-text-muted truncate h-4">{document.author}</p>
          {category && (
            <div className="mt-2 h-7">
              <span
                className="book-category-badge"
                style={{ background: `linear-gradient(135deg, ${palette.coverLight}, ${palette.cover})` }}
                title={category.name}
              >
                {category.name}
              </span>
            </div>
          )}
        </div>
        {showDownload && document.downloadEnabled && (
          <button
            className="shrink-0 rounded-lg p-2 text-text-muted opacity-0 transition-opacity group-hover:opacity-100 hover:bg-brand-light hover:text-brand"
            title="Download"
            onClick={(e) => e.preventDefault()}
          >
            <Download size={16} />
          </button>
        )}
        <Link
          to={`/read/${document.id}`}
          className="shrink-0 rounded-lg bg-brand px-2.5 py-1.5 text-xs font-semibold text-white opacity-0 transition-opacity group-hover:opacity-100"
          onClick={(e) => e.stopPropagation()}
        >
          Read
        </Link>
      </Link>
    )
  }

  return (
    <div className="book-card group">
      <Link to={`${linkPrefix}/${document.id}`} className="block w-full">
        <div className="book-card-visual">
          <DocumentCover
            title={document.title}
            author={document.author}
            year={document.publicationYear}
            categoryId={document.categoryId}
            coverImageUrl={document.coverImageUrl}
            size="lg"
          />
        </div>
      </Link>

      <div className="book-card-info">
        <Link
          to={`${linkPrefix}/${document.id}`}
          className="book-card-title text-[15px] font-bold leading-snug text-navy hover:text-brand"
        >
          {document.title}
        </Link>
        <p className="book-card-author text-xs text-text-muted">{document.author}</p>
        {category && <CategoryBadge name={category.name} palette={palette} />}
        <div className="mt-3 flex items-center gap-2">
          <Link
            to={`/read/${document.id}`}
            className="inline-flex items-center gap-1.5 rounded-lg bg-brand px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90 transition-opacity"
            onClick={(e) => e.stopPropagation()}
          >
            <ReadIcon size={13} />
            Read
          </Link>
          {showDownload && document.downloadEnabled && (
            <button
              className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-text-muted hover:bg-background hover:text-text transition-colors"
              title="Download"
              onClick={(e) => e.preventDefault()}
            >
              <Download size={13} />
              Save
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
