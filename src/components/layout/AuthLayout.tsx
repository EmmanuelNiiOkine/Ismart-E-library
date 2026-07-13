import { Link, Outlet, useLocation } from 'react-router-dom'
import { BookOpen, FolderOpen, Search, Shield, UserCircle } from 'lucide-react'

const features = [
  { icon: BookOpen, label: 'Curated legal volumes' },
  { icon: FolderOpen, label: 'Organized collections' },
  { icon: Search, label: 'Smart search & filters' },
]

export function AuthLayout() {
  const location = useLocation()
  const isAdminLogin = location.pathname === '/admin/login'

  return (
    <div className="flex min-h-screen">
      <div className="auth-hero hidden lg:flex lg:w-1/2 lg:flex-col lg:justify-between relative overflow-hidden">
        <div className="auth-hero-glow auth-hero-glow-a" />
        <div className="auth-hero-glow auth-hero-glow-b" />
        <div className="auth-hero-grid" />

        <div className="auth-hero-shelf" aria-hidden>
          <div className="auth-hero-book auth-hero-book-1" />
          <div className="auth-hero-book auth-hero-book-2" />
          <div className="auth-hero-book auth-hero-book-3" />
          <div className="auth-hero-report" />
        </div>

        <div className="relative z-10 flex items-center gap-3 p-12 pb-0">
          <img src="/ismartlogo.png" alt="iSmart" className="h-11 w-11 object-contain" />
          <div>
            <p className="text-lg font-bold text-white">iSmart E-Library</p>
            <p className="text-xs font-medium text-brand-cyan">Internal legal reference</p>
          </div>
        </div>

        <div className="relative z-10 px-12 py-8">
          <span className="auth-hero-badge">
            {isAdminLogin ? 'Administrator access' : 'Employee access'}
          </span>
          <h2 className="mt-5 text-4xl font-bold text-white leading-[1.15] max-w-lg">
            Your firm&apos;s legal knowledge,{' '}
            <span className="text-brand">one secure library.</span>
          </h2>
          <p className="mt-4 text-sm text-white/65 leading-relaxed max-w-md">
            Statutes, reports, cases, and reference works — structured for compliance teams,
            searchable by collection, and ready when your people need them.
          </p>

          <div className="auth-hero-stats">
            <div className="auth-hero-stat">
              <p className="auth-hero-stat-value">8+</p>
              <p className="auth-hero-stat-label">Collections</p>
            </div>
            <div className="auth-hero-stat">
              <p className="auth-hero-stat-value">250+</p>
              <p className="auth-hero-stat-label">Volumes</p>
            </div>
            <div className="auth-hero-stat">
              <p className="auth-hero-stat-value">24/7</p>
              <p className="auth-hero-stat-label">Access</p>
            </div>
          </div>

          <ul className="auth-hero-features">
            {features.map(({ icon: Icon, label }) => (
              <li key={label} className="auth-hero-feature">
                <span className="auth-hero-feature-icon">
                  <Icon size={16} />
                </span>
                {label}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative z-10 px-12 pb-10">
          <p className="text-xs text-white/35">
            iSmart International Ghana Limited · Secure internal use only
          </p>
        </div>
      </div>

      <div className="relative flex flex-1 items-center justify-center bg-background px-4 py-12">
        <Link
          to={isAdminLogin ? '/login' : '/admin/login'}
          className="absolute top-4 right-4 z-10 inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-3.5 py-2 text-xs font-semibold text-navy shadow-sm transition-colors hover:border-brand/30 hover:bg-brand-light hover:text-brand"
        >
          {isAdminLogin ? (
            <>
              <UserCircle size={15} />
              Employee sign in
            </>
          ) : (
            <>
              <Shield size={15} />
              Admin sign in
            </>
          )}
        </Link>

        <div className="w-full max-w-sm">
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <img src="/ismartlogo.png" alt="iSmart" className="h-9 w-9 object-contain" />
            <div>
              <p className="text-base font-bold text-navy">iSmart</p>
              <p className="text-xs font-medium text-brand-cyan">E-Library</p>
            </div>
          </div>
          <div className="rounded-3xl border border-border bg-surface p-8 shadow-sm">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  )
}
