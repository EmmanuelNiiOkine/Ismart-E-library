import { useEffect, useState } from 'react'
import type { Document } from '../types'
import {
  loadReaderPages,
  revokeReaderPages,
  type LoadedReaderContent,
  type ReaderPageContent,
} from '../utils/reader/loadReaderPages'

interface UseReaderPagesResult {
  pages: ReaderPageContent[]
  loading: boolean
  error: string | null
  source: LoadedReaderContent['source'] | null
}

export function useReaderPages(document: Document | undefined): UseReaderPagesResult {
  const [pages, setPages] = useState<ReaderPageContent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [source, setSource] = useState<LoadedReaderContent['source'] | null>(null)

  useEffect(() => {
    if (!document) {
      setPages([])
      setLoading(false)
      setError(null)
      setSource(null)
      return
    }

    let cancelled = false
    let loadedPages: ReaderPageContent[] = []

    setLoading(true)
    setError(null)

    loadReaderPages(document)
      .then((result) => {
        if (cancelled) return
        loadedPages = result.pages
        setPages(result.pages)
        setSource(result.source)
        setLoading(false)
      })
      .catch((err: unknown) => {
        if (cancelled) return
        setError(err instanceof Error ? err.message : 'Could not open this volume')
        setPages([])
        setSource(null)
        setLoading(false)
      })

    return () => {
      cancelled = true
      revokeReaderPages(loadedPages)
    }
  }, [document])

  return { pages, loading, error, source }
}
