import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import type { Category } from '../../types'
import { getBookPalette, isReportCategory } from '../../utils/bookTheme'

interface CategoryCardProps {
  category: Category
  linkPrefix?: string
}

const SPINE_COUNT = 8

function spineLayout(categoryId: string) {
  const seed = categoryId.split('').reduce((n, c) => n + c.charCodeAt(0), 0)
  return Array.from({ length: SPINE_COUNT }, (_, i) => {
    const wave = Math.sin(seed * 0.17 + i * 1.3)
    return {
      height: 58 + Math.round(wave * 14) + (i % 3) * 6,
      width: 14 + (i % 4) * 3,
      lean: (i % 5) - 2,
    }
  })
}

function MiniBookSpine({
  categoryId,
  height,
  width,
  lean,
}: {
  categoryId: string
  height: number
  width: number
  lean: number
}) {
  const palette = getBookPalette(categoryId)
  return (
    <div
      className="library-spine"
      style={{
        height,
        width,
        transform: `rotate(${lean * 0.4}deg)`,
        background: `linear-gradient(180deg, ${palette.coverLight} 0%, ${palette.cover} 48%, ${palette.spine} 100%)`,
        borderLeft: `2px solid ${palette.spine}`,
      }}
    >
      <span className="library-spine-label" style={{ color: palette.accent }}>
        {palette.label.slice(0, 3).toUpperCase()}
      </span>
      <div className="library-spine-pages" />
      <div className="library-spine-shine" />
    </div>
  )
}

function MiniReportSheet({ height, width, lean }: { height: number; width: number; lean: number }) {
  return (
    <div
      className="library-report-spine"
      style={{ height, width, transform: `rotate(${lean * 0.35}deg)` }}
    >
      <div className="library-report-spine-header" />
      <div className="library-report-spine-line" />
      <div className="library-report-spine-line library-report-spine-line-short" />
    </div>
  )
}

function stackCode(order: number) {
  const letter = String.fromCharCode(64 + ((order - 1) % 4) + 1)
  return `${letter}-${String(order).padStart(2, '0')}`
}

export function CategoryCard({ category, linkPrefix = '/categories' }: CategoryCardProps) {
  const spines = spineLayout(category.id)
  const isReport = isReportCategory(category.id)
  const palette = getBookPalette(category.id)

  return (
    <Link
      to={`${linkPrefix}/${category.id}`}
      className="library-stack-card group block"
      aria-label={`Browse ${category.name}`}
    >
      <div className="library-stack-card-inner">
        <div className="library-stack-header">
          <div className="library-stack-plaque">
            <span className="library-stack-code">{stackCode(category.order)}</span>
            <span className="library-stack-name">{category.name}</span>
          </div>
          <span
            className="library-stack-accent"
            style={{ background: palette.accent }}
            aria-hidden
          />
        </div>

        <p className="library-stack-desc">{category.description}</p>

        <div className="library-shelf-unit">
          <div className="library-shelf-back" aria-hidden />
          <div className="library-shelf-books">
            {isReport
              ? spines.map((s, i) => (
                  <MiniReportSheet key={i} height={s.height} width={s.width + 8} lean={s.lean} />
                ))
              : spines.map((s, i) => (
                  <MiniBookSpine
                    key={i}
                    categoryId={category.id}
                    height={s.height}
                    width={s.width}
                    lean={s.lean}
                  />
                ))}
          </div>
          <div className="library-shelf-plank" />
          <div className="library-shelf-lip" aria-hidden />
        </div>

        <div className="library-stack-footer">
          <span className="library-stack-count">
            {category.documentCount} volume{category.documentCount !== 1 ? 's' : ''}
          </span>
          <span className="library-stack-cta">
            Enter stack
            <ArrowRight size={14} className="library-stack-cta-icon" />
          </span>
        </div>
      </div>
    </Link>
  )
}
