import type { ReactNode } from 'react'

interface BookshelfProps {
  title?: string
  action?: ReactNode
  children: ReactNode
}

export function Bookshelf({ title, action, children }: BookshelfProps) {
  return (
    <section className="bookshelf-section">
      {(title || action) && (
        <div className="mb-4 flex items-center justify-between">
          {title && (
            <h2 className="text-lg font-bold text-navy">{title}</h2>
          )}
          {action}
        </div>
      )}
      <div className="bookshelf-surface">
        <div className="bookshelf-grid">{children}</div>
      </div>
    </section>
  )
}
