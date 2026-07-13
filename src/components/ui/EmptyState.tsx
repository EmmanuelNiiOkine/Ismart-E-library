import { BookOpen } from 'lucide-react'

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string
  description?: string
  action?: React.ReactNode
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/80 bg-surface/60 py-16 px-6 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-background">
        <BookOpen size={24} className="text-text-muted" />
      </div>
      <h3 className="font-serif text-base font-semibold text-text">{title}</h3>
      {description && <p className="mt-2 text-sm text-text-muted max-w-sm leading-relaxed">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}
