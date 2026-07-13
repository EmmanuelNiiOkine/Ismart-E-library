import { Search } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useState, type FormEvent } from 'react'

interface SearchBarProps {
  defaultValue?: string
  placeholder?: string
  basePath?: string
  className?: string
}

export function SearchBar({
  defaultValue = '',
  placeholder = 'Search titles, authors, or keywords...',
  basePath = '/search',
  className = '',
}: SearchBarProps) {
  const [query, setQuery] = useState(defaultValue)
  const navigate = useNavigate()

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      navigate(`${basePath}?q=${encodeURIComponent(query.trim())}`)
    }
  }

  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand" />
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-border bg-surface py-3 pl-11 pr-4 text-sm text-text shadow-sm placeholder:text-text-muted focus:border-brand/40 focus:outline-none focus:ring-2 focus:ring-brand/15"
      />
    </form>
  )
}
