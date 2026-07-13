import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from './Button'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null

  return (
    <div className="flex items-center justify-between border-t border-border pt-4">
      <span className="text-sm text-text-muted">
        Page {currentPage} of {totalPages}
      </span>
      <div className="flex items-center gap-2">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
        >
          <ChevronLeft size={16} />
          Previous
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
        >
          Next
          <ChevronRight size={16} />
        </Button>
      </div>
    </div>
  )
}

export function paginate<T>(items: T[], page: number, perPage: number) {
  const totalPages = Math.ceil(items.length / perPage)
  const start = (page - 1) * perPage
  return {
    items: items.slice(start, start + perPage),
    totalPages,
    total: items.length,
  }
}
