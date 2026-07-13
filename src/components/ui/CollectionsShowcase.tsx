import type { ReactNode } from 'react'
import { BookMarked, Library } from 'lucide-react'
import type { Category } from '../../types'
import { CategoryCard } from './CategoryCard'

interface CollectionsShowcaseProps {
  categories: Category[]
  linkPrefix?: string
  title?: string
  description?: string
  action?: ReactNode
  emptyMessage?: string
}

export function CollectionsShowcase({
  categories,
  linkPrefix = '/categories',
  title = 'Reference stacks',
  description = 'Curated shelves of legal materials — pick a stack to browse its volumes.',
  action,
  emptyMessage = 'No collections to display.',
}: CollectionsShowcaseProps) {
  const totalVolumes = categories.reduce((sum, c) => sum + c.documentCount, 0)

  return (
    <section className="library-stacks-section">
      <div className="library-stacks-intro">
        <div className="library-stacks-intro-icon" aria-hidden>
          <Library size={22} />
        </div>
        <div className="library-stacks-intro-text">
          <div className="library-stacks-intro-row">
            <h2 className="library-stacks-title">{title}</h2>
            {action}
          </div>
          <p className="library-stacks-subtitle">{description}</p>
        </div>
        <div className="library-stacks-meta">
          <span className="library-stacks-meta-item">
            <BookMarked size={14} />
            {categories.length} stack{categories.length !== 1 ? 's' : ''}
          </span>
          <span className="library-stacks-meta-divider" aria-hidden />
          <span className="library-stacks-meta-item">{totalVolumes} volumes</span>
        </div>
      </div>

      {categories.length > 0 ? (
        <div className="library-stacks-grid">
          {categories.map((cat) => (
            <CategoryCard key={cat.id} category={cat} linkPrefix={linkPrefix} />
          ))}
        </div>
      ) : (
        <p className="library-stacks-empty">{emptyMessage}</p>
      )}
    </section>
  )
}
