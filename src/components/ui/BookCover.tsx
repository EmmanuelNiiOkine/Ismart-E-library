import { getBookPalette, getShortTitle } from '../../utils/bookTheme'

interface BookCoverProps {
  title: string
  author: string
  year: number
  categoryId: string
  size?: 'sm' | 'md' | 'lg'
}

const sizeMap = {
  sm: { width: 88, height: 128, pad: '10px 8px' },
  md: { width: 120, height: 172, pad: '14px 10px' },
  lg: { width: 148, height: 212, pad: '18px 12px' },
}

const titleClamp = { sm: 32, md: 42, lg: 52 } as const

export function BookCover({ title, author, year, categoryId, size = 'md' }: BookCoverProps) {
  const palette = getBookPalette(categoryId)
  const dims = sizeMap[size]

  return (
    <div
      className="book-3d"
      style={{ width: dims.width, height: dims.height }}
    >
      <div className="book-3d-inner">
        <div
          className="book-spine"
          style={{ background: `linear-gradient(180deg, ${palette.spine} 0%, ${palette.cover} 100%)` }}
        />
        <div
          className="book-front"
          style={{
            background: `linear-gradient(145deg, ${palette.coverLight} 0%, ${palette.cover} 55%, ${palette.spine} 100%)`,
            padding: dims.pad,
          }}
        >
          <div className="book-texture" />
          <div
            className={`book-emblem book-emblem-${size}`}
            style={{ color: palette.accent }}
          >
            ISMART
          </div>
          <div className="book-divider" style={{ background: palette.accent }} />
          <h3 className={`book-title book-title-${size}`}>
            {getShortTitle(title, titleClamp[size])}
          </h3>
          <p className={`book-author book-author-${size}`}>
            {getShortTitle(author, 28)}
          </p>
          <span className={`book-year book-year-${size}`} style={{ color: palette.accent }}>
            {year}
          </span>
          <div className="book-pages-edge" />
          <div className="book-shine" />
        </div>
      </div>
      <div className="book-shadow" />
    </div>
  )
}
