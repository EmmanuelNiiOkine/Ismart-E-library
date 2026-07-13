import type { UserStatus } from '../../types'

const statusStyles: Record<UserStatus, string> = {
  active: 'bg-green-50 text-success border-green-200',
  disabled: 'bg-red-50 text-danger border-red-200',
}

export function Badge({
  children,
  variant = 'default',
}: {
  children: React.ReactNode
  variant?: 'default' | UserStatus
}) {
  if (variant === 'active' || variant === 'disabled') {
    return (
      <span className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-medium border ${statusStyles[variant]}`}>
        {children}
      </span>
    )
  }
  return (
    <span className="inline-flex items-center rounded px-2 py-0.5 text-xs font-medium border border-border bg-background text-text-muted">
      {children}
    </span>
  )
}
