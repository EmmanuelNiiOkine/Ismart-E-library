import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Filter, Search, X } from 'lucide-react'
import { useLibrary } from '../../contexts/LibraryContext'
import type { SearchSort } from '../../utils/search'

interface LibrarySearchProps {
  defaultQuery?: string
  categoryId?: string
  categoryName?: string
  basePath?: string
  placeholder?: string
  showFilters?: boolean
  showSuggestions?: boolean
  className?: string
}

const SORT_OPTIONS: { value: SearchSort; label: string }[] = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'newest', label: 'Newest' },
  { value: 'oldest', label: 'Oldest' },
  { value: 'title', label: 'Title A–Z' },
]

export function LibrarySearch({
  defaultQuery = '',
  categoryId,
  categoryName,
  basePath = '/search',
  placeholder,
  showFilters = true,
  showSuggestions = true,
  className = '',
}: LibrarySearchProps) {
  const navigate = useNavigate()
  const { categories, search } = useLibrary()
  const wrapperRef = useRef<HTMLDivElement>(null)

  const [query, setQuery] = useState(defaultQuery)
  const [open, setOpen] = useState(false)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [yearFrom, setYearFrom] = useState('')
  const [yearTo, setYearTo] = useState('')
  const [sort, setSort] = useState<SearchSort>('relevance')
  const [filterCategory, setFilterCategory] = useState(categoryId ?? '')

  const effectiveCategory = categoryId ?? filterCategory

  const results = search(query, {
    categoryId: effectiveCategory || undefined,
    yearFrom: yearFrom ? Number(yearFrom) : undefined,
    yearTo: yearTo ? Number(yearTo) : undefined,
    sort,
  })

  const suggestions = query.trim() ? results.slice(0, 5) : []

  useEffect(() => {
    setQuery(defaultQuery)
  }, [defaultQuery])

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!wrapperRef.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  const buildSearchUrl = (q: string) => {
    const params = new URLSearchParams()
    if (q.trim()) params.set('q', q.trim())
    if (effectiveCategory) params.set('category', effectiveCategory)
    if (yearFrom) params.set('from', yearFrom)
    if (yearTo) params.set('to', yearTo)
    if (sort !== 'relevance') params.set('sort', sort)
    const qs = params.toString()
    return qs ? `${basePath}?${qs}` : basePath
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setOpen(false)
    navigate(buildSearchUrl(query))
  }

  const resolvedPlaceholder =
    placeholder ??
    (categoryName
      ? `Search in ${categoryName}...`
      : 'Search titles, authors, keywords, or collections...')

  const clearFilters = () => {
    if (!categoryId) setFilterCategory('')
    setYearFrom('')
    setYearTo('')
    setSort('relevance')
  }

  const hasActiveFilters =
    (!categoryId && filterCategory) || yearFrom || yearTo || sort !== 'relevance'

  return (
    <div ref={wrapperRef} className={`relative ${className}`}>
      <form onSubmit={handleSubmit} className="relative">
        <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand" />
        <input
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setOpen(true)
          }}
          onFocus={() => setOpen(true)}
          placeholder={resolvedPlaceholder}
          className="w-full rounded-2xl border border-border bg-surface py-3 pl-11 pr-24 text-sm text-text shadow-sm placeholder:text-text-muted focus:border-brand/40 focus:outline-none focus:ring-2 focus:ring-brand/15"
        />
        <div className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-1">
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('')
                setOpen(false)
              }}
              className="rounded-lg p-1.5 text-text-muted hover:bg-background hover:text-text"
              aria-label="Clear search"
            >
              <X size={15} />
            </button>
          )}
          {showFilters && (
            <button
              type="button"
              onClick={() => setFiltersOpen((v) => !v)}
              className={`rounded-lg p-1.5 transition-colors ${
                hasActiveFilters || filtersOpen
                  ? 'bg-brand-light text-brand'
                  : 'text-text-muted hover:bg-background hover:text-text'
              }`}
              aria-label="Toggle filters"
            >
              <Filter size={15} />
            </button>
          )}
          <button
            type="submit"
            className="rounded-xl bg-brand px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90 transition-opacity"
          >
            Search
          </button>
        </div>
      </form>

      {showFilters && filtersOpen && (
        <div className="mt-3 rounded-2xl border border-border bg-surface p-4 shadow-sm">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {!categoryId && (
              <label className="flex flex-col gap-1.5 text-sm">
                <span className="font-medium text-text">Collection</span>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="rounded-lg border border-border bg-surface px-3 py-2 text-sm"
                >
                  <option value="">All collections</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </label>
            )}
            <label className="flex flex-col gap-1.5 text-sm">
              <span className="font-medium text-text">Year from</span>
              <input
                type="number"
                value={yearFrom}
                onChange={(e) => setYearFrom(e.target.value)}
                placeholder="e.g. 2019"
                className="rounded-lg border border-border bg-surface px-3 py-2 text-sm"
              />
            </label>
            <label className="flex flex-col gap-1.5 text-sm">
              <span className="font-medium text-text">Year to</span>
              <input
                type="number"
                value={yearTo}
                onChange={(e) => setYearTo(e.target.value)}
                placeholder="e.g. 2024"
                className="rounded-lg border border-border bg-surface px-3 py-2 text-sm"
              />
            </label>
            <label className="flex flex-col gap-1.5 text-sm">
              <span className="font-medium text-text">Sort by</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SearchSort)}
                className="rounded-lg border border-border bg-surface px-3 py-2 text-sm"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="mt-3 text-xs font-semibold text-brand hover:underline"
            >
              Clear filters
            </button>
          )}
        </div>
      )}

      {showSuggestions && open && query.trim() && suggestions.length > 0 && (
        <div className="absolute left-0 right-0 top-full z-30 mt-2 overflow-hidden rounded-2xl border border-border bg-surface shadow-lg">
          <div className="border-b border-border px-4 py-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">
              Quick results
            </p>
          </div>
          <ul>
            {suggestions.map(({ document, matchedFields }) => {
              const cat = categories.find((c) => c.id === document.categoryId)
              return (
                <li key={document.id}>
                  <Link
                    to={`/documents/${document.id}`}
                    onClick={() => setOpen(false)}
                    className="block px-4 py-3 hover:bg-brand-light/60 transition-colors"
                  >
                    <p className="text-sm font-semibold text-navy line-clamp-1">
                      {document.title}
                    </p>
                    <p className="mt-0.5 text-xs text-text-muted line-clamp-1">
                      {document.author} · {cat?.name} · {document.publicationYear}
                    </p>
                    {matchedFields.length > 0 && (
                      <p className="mt-1 text-[10px] font-medium uppercase tracking-wider text-brand">
                        Matched: {matchedFields.join(', ')}
                      </p>
                    )}
                  </Link>
                </li>
              )
            })}
          </ul>
          <button
            type="button"
            onClick={() => navigate(buildSearchUrl(query))}
            className="w-full border-t border-border px-4 py-3 text-left text-sm font-semibold text-brand hover:bg-brand-light/40 transition-colors"
          >
            View all {results.length} result{results.length !== 1 ? 's' : ''} →
          </button>
        </div>
      )}

      {showSuggestions && open && query.trim() && suggestions.length === 0 && (
        <div className="absolute left-0 right-0 top-full z-30 mt-2 rounded-2xl border border-border bg-surface px-4 py-5 text-center shadow-lg">
          <p className="text-sm text-text-muted">No volumes match "{query}"</p>
        </div>
      )}
    </div>
  )
}
