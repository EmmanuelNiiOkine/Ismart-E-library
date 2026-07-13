import { GlobalWorkerOptions, getDocument, type PDFPageProxy } from 'pdfjs-dist'
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url'
import mammoth from 'mammoth'
import type { Document, DocumentFileType } from '../../types'
import { flattenReaderPages, getReaderSections } from '../../data/readerContent'
import {
  getDocumentFile,
  resolveDocumentFileType,
} from '../fileStorage'
import { getReaderPageSlot, getTextCharsPerPage } from './readerLayout'

GlobalWorkerOptions.workerSrc = pdfWorker

export type ReaderPageContent =
  | { kind: 'text'; content: string }
  | { kind: 'image'; src: string }

export interface LoadedReaderContent {
  pages: ReaderPageContent[]
  source: DocumentFileType
}

const DEFAULT_SAMPLE_PDF = '/samples/ismart-library-sample.pdf'

async function resolveFileBlob(document: Document): Promise<Blob | null> {
  const stored = await getDocumentFile(document.id)
  if (stored) return stored

  const filePath = document.filePath
  if (!filePath || filePath === '/sample.pdf') {
    try {
      const fallback = await fetch(DEFAULT_SAMPLE_PDF)
      if (fallback.ok) return fallback.blob()
    } catch {
      return null
    }
    return null
  }

  try {
    const response = await fetch(filePath)
    if (!response.ok) return null
    return response.blob()
  } catch {
    return null
  }
}

function getPdfPageScale(page: PDFPageProxy): number {
  const baseViewport = page.getViewport({ scale: 1 })
  const single = getReaderPageSlot('single')
  const spread = getReaderPageSlot('spread')

  const scaleForSlot = (slotWidth: number, slotHeight: number) => {
    const byWidth = slotWidth / baseViewport.width
    const byHeight = slotHeight / baseViewport.height
    return Math.min(byWidth, byHeight, 3.8)
  }

  const singleScale = scaleForSlot(single.width, single.height)
  const spreadScale = scaleForSlot(spread.width, spread.height)
  const displayScale = Math.max(singleScale, spreadScale)
  return displayScale * Math.min(window.devicePixelRatio || 1, 2)
}

async function loadPdfPages(data: ArrayBuffer): Promise<ReaderPageContent[]> {
  const pdf = await getDocument({ data }).promise
  const pages: ReaderPageContent[] = []

  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
    const page = await pdf.getPage(pageNumber)
    const scale = getPdfPageScale(page)
    const viewport = page.getViewport({ scale })
    const canvas = window.document.createElement('canvas')
    const context = canvas.getContext('2d')
    if (!context) continue

    canvas.width = viewport.width
    canvas.height = viewport.height
    await page.render({ canvas, canvasContext: context, viewport }).promise
    pages.push({ kind: 'image', src: canvas.toDataURL('image/jpeg', 0.92) })
  }

  return pages
}

function splitTextIntoPages(text: string, charsPerPage: number): string[] {
  const normalized = text.replace(/\r\n/g, '\n').trim()
  if (!normalized) return ['This document has no readable text content.']

  const paragraphs = normalized.split(/\n{2,}/)
  const pages: string[] = []
  let current = ''

  for (const paragraph of paragraphs) {
    const chunk = paragraph.trim()
    if (!chunk) continue

    if (`${current}\n\n${chunk}`.trim().length > charsPerPage && current) {
      pages.push(current.trim())
      current = chunk
    } else {
      current = current ? `${current}\n\n${chunk}` : chunk
    }
  }

  if (current.trim()) pages.push(current.trim())
  return pages.length > 0 ? pages : [normalized]
}

async function loadDocxPages(data: ArrayBuffer): Promise<ReaderPageContent[]> {
  const result = await mammoth.extractRawText({ arrayBuffer: data })
  const chars = getTextCharsPerPage('single')
  return splitTextIntoPages(result.value, chars).map((content) => ({ kind: 'text', content }))
}

function loadGeneratedTextPages(document: Document): ReaderPageContent[] {
  const sections = getReaderSections(document.id)
  const chars = getTextCharsPerPage('single')
  const flat = flattenReaderPages(sections)
  const combined = flat.map((p) => p.content).join('\n\n')
  return splitTextIntoPages(combined, chars).map((content) => ({
    kind: 'text' as const,
    content,
  }))
}

export async function loadReaderPages(document: Document): Promise<LoadedReaderContent> {
  const fileType = resolveDocumentFileType(document.filePath, document.fileType)
  const blob = await resolveFileBlob(document)

  if (!blob) {
    return { pages: loadGeneratedTextPages(document), source: 'sample' }
  }

  const buffer = await blob.arrayBuffer()

  if (fileType === 'pdf') {
    const pages = await loadPdfPages(buffer)
    return { pages, source: 'pdf' }
  }

  if (fileType === 'docx') {
    const pages = await loadDocxPages(buffer)
    return { pages, source: 'docx' }
  }

  return { pages: loadGeneratedTextPages(document), source: 'sample' }
}

export function revokeReaderPages(pages: ReaderPageContent[]) {
  for (const page of pages) {
    if (page.kind === 'image' && page.src.startsWith('blob:')) {
      URL.revokeObjectURL(page.src)
    }
  }
}
