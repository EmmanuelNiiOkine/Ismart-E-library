import { getShortTitle } from '../../utils/bookTheme'

interface ReportCoverProps {
  title: string
  author: string
  year: number
  size?: 'sm' | 'md' | 'lg'
}

const sizeMap = {
  sm: { width: 96, height: 128, pad: '8px' },
  md: { width: 124, height: 168, pad: '10px' },
  lg: { width: 152, height: 204, pad: '12px' },
}

const titleClamp = { sm: 36, md: 48, lg: 58 } as const

export function ReportCover({ title, author, year, size = 'md' }: ReportCoverProps) {
  const dims = sizeMap[size]
  const shortTitle = getShortTitle(title, titleClamp[size])

  return (
    <div
      className="report-stack"
      style={{ width: dims.width, height: dims.height }}
    >
      <div className="report-sheet report-sheet-back" />
      <div className="report-sheet report-sheet-mid" />
      <div className="report-sheet report-sheet-front">
        <div className="report-header">
          <span className="report-header-label">Official Law Report</span>
          <span className="report-header-year">{year}</span>
        </div>
        <div className="report-body" style={{ padding: dims.pad }}>
          <p className={`report-citation report-citation-${size}`}>
            {getShortTitle(author, 32)}
          </p>
          <h3 className={`report-title report-title-${size}`}>
            {shortTitle}
          </h3>
          <div className="report-lines">
            <span />
            <span />
            <span />
            <span />
            <span className="report-lines-short" />
          </div>
        </div>
        <div className="report-footer">
          <span className="report-stamp">REPORT</span>
        </div>
        <div className="report-clip" />
      </div>
    </div>
  )
}
