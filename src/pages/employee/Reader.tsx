import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Download,
  FileText,
  Maximize2,
  Minimize2,
} from 'lucide-react'
import { EmptyState } from '../../components/ui/EmptyState'
import { LoadingScreen } from '../../components/ui/LoadingScreen'
import { useLibrary } from '../../contexts/LibraryContext'
import { useAuth } from '../../contexts/AuthContext'
import { useReaderPages } from '../../hooks/useReaderPages'
import type { ReaderPageContent } from '../../utils/reader/loadReaderPages'
import { getDocumentFile } from '../../utils/fileStorage'
import { applyReaderLayoutVars } from '../../utils/reader/readerLayout'

type ViewMode = 'single' | 'spread'

function DocumentPage({
  page,
  pageNumber,
}: {
  page: ReaderPageContent
  pageNumber: number
}) {
  return (
    <article className="doc-page" aria-label={`Page ${pageNumber}`}>
      <div className="doc-page-body">
        {page.kind === 'image' ? (
          <img src={page.src} alt={`Page ${pageNumber}`} className="doc-page-image" />
        ) : (
          <div className="doc-page-text">
            {page.content.split('\n\n').map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        )}
      </div>
      <footer className="doc-page-footer">Page {pageNumber}</footer>
    </article>
  )
}

const sourceLabels = {
  pdf: 'PDF',
  docx: 'Word',
  sample: 'Document',
} as const

export function Reader() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { getDocumentById, getCategoryById } = useLibrary()
  const document = getDocumentById(id || '')
  const category = document ? getCategoryById(document.categoryId) : undefined
  const { pages, loading, error, source } = useReaderPages(document)
  const readerRef = useRef<HTMLDivElement>(null)

  const [viewMode, setViewMode] = useState<ViewMode>('single')
  const [position, setPosition] = useState(0)
  const [fullscreen, setFullscreen] = useState(false)

  const isSingle = viewMode === 'single'
  const totalPositions = isSingle
    ? Math.max(1, pages.length)
    : Math.max(1, Math.ceil(pages.length / 2))

  const leftIndex = isSingle ? position : position * 2
  const rightIndex = position * 2 + 1
  const leftPage = pages[leftIndex]
  const rightPage = isSingle ? undefined : pages[rightIndex]
  const currentPage = pages[position]
  const progress = totalPositions > 0 ? ((position + 1) / totalPositions) * 100 : 0

  const backPath = user?.role === 'admin' ? '/admin/documents' : `/documents/${id}`

  useEffect(() => {
    setPosition(0)
    setViewMode('single')
  }, [document?.id])

  useEffect(() => {
    const el = readerRef.current
    if (!el) return

    const updateLayout = () => {
      requestAnimationFrame(() => applyReaderLayoutVars(el))
    }
    updateLayout()

    const stage = el.querySelector('.reader-stage')
    const observer =
      stage && typeof ResizeObserver !== 'undefined'
        ? new ResizeObserver(updateLayout)
        : null
    if (stage) observer?.observe(stage)

    window.addEventListener('resize', updateLayout)
    return () => {
      observer?.disconnect()
      window.removeEventListener('resize', updateLayout)
    }
  }, [viewMode, loading, pages.length])

  const turn = useCallback(
    (direction: 'next' | 'prev') => {
      if (direction === 'next' && position >= totalPositions - 1) return
      if (direction === 'prev' && position <= 0) return
      setPosition((p) => (direction === 'next' ? p + 1 : p - 1))
    },
    [position, totalPositions],
  )

  const toggleViewMode = () => {
    setViewMode((mode) => {
      const next: ViewMode = mode === 'single' ? 'spread' : 'single'
      setPosition((pos) => (next === 'spread' ? Math.floor(pos / 2) : pos * 2))
      return next
    })
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') turn('next')
      if (e.key === 'ArrowLeft') turn('prev')
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [turn])

  const toggleFullscreen = () => {
    if (!window.document.fullscreenElement) {
      window.document.documentElement.requestFullscreen?.()
      setFullscreen(true)
    } else {
      window.document.exitFullscreen?.()
      setFullscreen(false)
    }
  }

  const handleDownload = async () => {
    if (!document) return
    const stored = await getDocumentFile(document.id)
    const url = stored
      ? URL.createObjectURL(stored)
      : document.filePath && document.filePath !== '/sample.pdf'
        ? document.filePath
        : null
    if (!url) return

    const anchor = window.document.createElement('a')
    anchor.href = url
    anchor.download = document.title
    anchor.click()
    if (stored) URL.revokeObjectURL(url)
  }

  if (!document) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-6">
        <EmptyState
          title="Volume not found"
          description="The document you are trying to read does not exist."
          action={
            <Link to="/library" className="text-sm font-medium text-brand hover:underline">
              Back to library
            </Link>
          }
        />
      </div>
    )
  }

  if (loading) {
    return (
      <div className="reader-app">
        <LoadingScreen />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-6">
        <EmptyState
          title="Could not open volume"
          description={error}
          action={
            <Link to={backPath} className="text-sm font-medium text-brand hover:underline">
              Back to document
            </Link>
          }
        />
      </div>
    )
  }

  const readerClass = [
    'reader-app',
    isSingle ? 'reader-app-single' : 'reader-app-spread',
    fullscreen ? 'reader-app-fullscreen' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div ref={readerRef} className={readerClass}>
      <header className="reader-topbar">
        <div className="reader-topbar-left">
          <button
            type="button"
            onClick={() => navigate(backPath)}
            className="reader-icon-btn"
            aria-label="Back to document"
          >
            <ArrowLeft size={18} />
          </button>
          <img src="/ismartlogo.png" alt="" className="reader-logo" />
          <div className="reader-topbar-meta min-w-0">
            <p className="reader-doc-title truncate">{document.title}</p>
            <p className="reader-doc-subtitle truncate">
              {source && (
                <span className="reader-source-pill">{sourceLabels[source]}</span>
              )}
              {category?.name} · {document.author}
            </p>
          </div>
        </div>

        <div className="reader-topbar-right">
          <button
            type="button"
            onClick={toggleViewMode}
            className="reader-view-toggle"
            title={isSingle ? 'Show two pages side by side' : 'Show one page at a time'}
          >
            {isSingle ? <BookOpen size={16} /> : <FileText size={16} />}
            <span>{isSingle ? '2 pages' : '1 page'}</span>
          </button>
          <span className="reader-page-pill">
            {isSingle
              ? `Page ${position + 1} of ${pages.length}`
              : `Pages ${leftIndex + 1}${rightPage ? `–${rightIndex + 1}` : ''} of ${pages.length}`}
          </span>
          {document.downloadEnabled && (
            <button
              type="button"
              className="reader-icon-btn"
              aria-label="Download"
              onClick={() => void handleDownload()}
            >
              <Download size={18} />
            </button>
          )}
          <button
            type="button"
            onClick={toggleFullscreen}
            className="reader-icon-btn"
            aria-label={fullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
          >
            {fullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
          </button>
        </div>
      </header>

      <main className="reader-stage">
        <button
          type="button"
          className="reader-turn-zone reader-turn-zone-prev"
          onClick={() => turn('prev')}
          disabled={position <= 0}
          aria-label="Previous page"
        >
          <ChevronLeft size={28} />
        </button>

        <div className="doc-viewer" aria-live="polite">
          {isSingle ? (
            <div className="doc-viewer-single">
              {currentPage && (
                <DocumentPage page={currentPage} pageNumber={position + 1} />
              )}
            </div>
          ) : (
            <div className="doc-viewer-spread">
              {leftPage && <DocumentPage page={leftPage} pageNumber={leftIndex + 1} />}
              {rightPage && <DocumentPage page={rightPage} pageNumber={rightIndex + 1} />}
            </div>
          )}
        </div>

        <button
          type="button"
          className="reader-turn-zone reader-turn-zone-next"
          onClick={() => turn('next')}
          disabled={position >= totalPositions - 1}
          aria-label="Next page"
        >
          <ChevronRight size={28} />
        </button>
      </main>

      <footer className="reader-toolbar">
        <button
          type="button"
          className="reader-toolbar-nav"
          onClick={() => turn('prev')}
          disabled={position <= 0}
        >
          <ChevronLeft size={16} />
          Previous
        </button>

        <div className="reader-progress-wrap">
          <div className="reader-progress-track">
            <div className="reader-progress-fill" style={{ width: `${progress}%` }} />
          </div>
          <span className="reader-progress-label">
            {isSingle
              ? `Page ${position + 1} of ${pages.length}`
              : `Pages ${leftIndex + 1}${rightPage ? `–${rightIndex + 1}` : ''} of ${pages.length}`}
          </span>
        </div>

        <button
          type="button"
          className="reader-toolbar-nav"
          onClick={() => turn('next')}
          disabled={position >= totalPositions - 1}
        >
          Next
          <ChevronRight size={16} />
        </button>
      </footer>
    </div>
  )
}
