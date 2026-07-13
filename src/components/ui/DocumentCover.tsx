import { useState } from 'react'
import { BookCover } from './BookCover'
import { ReportCover } from './ReportCover'
import { isReportCategory } from '../../utils/bookTheme'

interface DocumentCoverProps {
  title: string
  author: string
  year: number
  categoryId: string
  coverImageUrl?: string | null
  size?: 'sm' | 'md' | 'lg'
}

const sizeMap = {
  sm: { width: 88, height: 128 },
  md: { width: 120, height: 172 },
  lg: { width: 148, height: 212 },
}

function GeneratedCover(props: Omit<DocumentCoverProps, 'coverImageUrl'>) {
  if (isReportCategory(props.categoryId)) {
    return (
      <ReportCover
        title={props.title}
        author={props.author}
        year={props.year}
        size={props.size}
      />
    )
  }

  return <BookCover {...props} />
}

export function DocumentCover({
  coverImageUrl,
  ...props
}: DocumentCoverProps) {
  const [imageFailed, setImageFailed] = useState(false)
  const dims = sizeMap[props.size ?? 'md']
  const useGenerated = !coverImageUrl?.trim() || imageFailed

  if (useGenerated) {
    return <GeneratedCover {...props} />
  }

  return (
    <div
      className="document-cover-photo"
      style={{ width: dims.width, height: dims.height }}
    >
      <img
        src={coverImageUrl!}
        alt=""
        className="document-cover-photo-img"
        onError={() => setImageFailed(true)}
      />
    </div>
  )
}
