import type { Document } from '../types'

export type SearchSort = 'relevance' | 'newest' | 'oldest' | 'title'

export interface SearchFilters {
  categoryId?: string
  yearFrom?: number
  yearTo?: number
  sort?: SearchSort
}

export interface SearchResult {
  document: Document
  score: number
  matchedFields: string[]
}

function tokenize(query: string): string[] {
  return query
    .toLowerCase()
    .trim()
    .split(/\s+/)
    .filter((t) => t.length > 1)
}

function fieldScore(text: string, tokens: string[]): number {
  const lower = text.toLowerCase()
  let score = 0
  for (const token of tokens) {
    if (lower === token) score += 12
    else if (lower.startsWith(token)) score += 8
    else if (lower.includes(token)) score += 4
  }
  return score
}

export function searchDocumentsRanked(
  documents: Document[],
  query: string,
  filters: SearchFilters = {},
  getCategoryName?: (id: string) => string | undefined,
): SearchResult[] {
  const q = query.trim()
  const tokens = tokenize(q)

  let results = documents.filter((doc) => {
    if (filters.categoryId && doc.categoryId !== filters.categoryId) return false
    if (filters.yearFrom && doc.publicationYear < filters.yearFrom) return false
    if (filters.yearTo && doc.publicationYear > filters.yearTo) return false
    return true
  })

  if (!q) {
    return results.map((document) => ({
      document,
      score: 0,
      matchedFields: [],
    }))
  }

  const scored: SearchResult[] = []

  for (const doc of results) {
    const categoryName = getCategoryName?.(doc.categoryId) ?? ''
    const matchedFields: string[] = []
    let score = 0

    const titleScore = fieldScore(doc.title, tokens) * 3
    if (titleScore > 0) {
      score += titleScore
      matchedFields.push('title')
    }

    const authorScore = fieldScore(doc.author, tokens) * 2
    if (authorScore > 0) {
      score += authorScore
      matchedFields.push('author')
    }

    const descScore = fieldScore(doc.description, tokens)
    if (descScore > 0) {
      score += descScore
      matchedFields.push('description')
    }

    const keywordScore = doc.keywords.reduce(
      (sum, kw) => sum + fieldScore(kw, tokens) * 2,
      0,
    )
    if (keywordScore > 0) {
      score += keywordScore
      matchedFields.push('keywords')
    }

    const catScore = fieldScore(categoryName, tokens) * 1.5
    if (catScore > 0) {
      score += catScore
      matchedFields.push('collection')
    }

    if (String(doc.publicationYear).includes(q)) {
      score += 3
      matchedFields.push('year')
    }

    if (score > 0) {
      scored.push({ document: doc, score, matchedFields: [...new Set(matchedFields)] })
    }
  }

  const sort = filters.sort ?? 'relevance'

  scored.sort((a, b) => {
    if (sort === 'relevance') return b.score - a.score
    if (sort === 'newest') return b.document.publicationYear - a.document.publicationYear
    if (sort === 'oldest') return a.document.publicationYear - b.document.publicationYear
    return a.document.title.localeCompare(b.document.title)
  })

  return scored
}

export function highlightMatch(text: string, query: string): string {
  const tokens = tokenize(query)
  if (tokens.length === 0) return text
  let result = text
  for (const token of tokens) {
    const re = new RegExp(`(${token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
    result = result.replace(re, '«$1»')
  }
  return result
}
