import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Library,
  BookOpen,
  Search,
  User,
  Users,
  FileText,
  Upload,
  Settings,
  LogOut,
  Menu,
  X,
} from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'

interface NavItem {
  to: string
  label: string
  icon: React.ReactNode
}

const employeeNav: NavItem[] = [
  { to: '/dashboard', label: 'Home', icon: <LayoutDashboard size={18} /> },
  { to: '/library', label: 'All volumes', icon: <Library size={18} /> },
  { to: '/categories', label: 'Collections', icon: <BookOpen size={18} /> },
  { to: '/search', label: 'Search', icon: <Search size={18} /> },
  { to: '/profile', label: 'Profile', icon: <User size={18} /> },
]

const adminNav: NavItem[] = [
  { to: '/admin', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
  { to: '/admin/users', label: 'Users', icon: <Users size={18} /> },
  { to: '/admin/categories', label: 'Collections', icon: <BookOpen size={18} /> },
  { to: '/admin/documents', label: 'Volumes', icon: <FileText size={18} /> },
  { to: '/admin/upload', label: 'Upload', icon: <Upload size={18} /> },
  { to: '/admin/settings', label: 'Settings', icon: <Settings size={18} /> },
]

export function Sidebar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)
  const navItems = user?.role === 'admin' ? adminNav : employeeNav

  const handleLogout = () => {
    logout()
    navigate(user?.role === 'admin' ? '/admin/login' : '/login')
  }

  const sidebarContent = (
    <>
      <div className="shrink-0 border-b border-border px-5 py-5">
        <div className="flex items-center gap-3">
          <img src="/ismartlogo.png" alt="iSmart" className="h-9 w-9 object-contain" />
          <div className="min-w-0">
            <p className="text-sm font-bold text-navy truncate">iSmart</p>
            <p className="text-[11px] font-medium text-brand-cyan truncate">E-Library</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-0.5">
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                end={item.to === '/dashboard' || item.to === '/admin'}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors duration-150 ${
                    isActive
                      ? 'bg-brand-light text-brand-cyan'
                      : 'text-text-muted hover:bg-brand-light/50 hover:text-navy'
                  }`
                }
              >
                {item.icon}
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="shrink-0 border-t border-border px-3 py-4">
        <div className="mb-3 rounded-xl bg-navy px-3 py-3">
          <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
          <p className="text-xs text-white/50 truncate">{user?.email}</p>
        </div>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-text-muted hover:bg-brand-light hover:text-navy transition-colors duration-150"
        >
          <LogOut size={18} />
          Sign out
        </button>
      </div>
    </>
  )

  return (
    <>
      <button
        className="fixed top-4 left-4 z-40 rounded-xl border border-border bg-surface p-2 shadow-sm lg:hidden"
        onClick={() => setMobileOpen(true)}
      >
        <Menu size={20} />
      </button>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-navy/60" onClick={() => setMobileOpen(false)} />
          <aside className="relative flex h-full w-[260px] flex-col bg-surface border-r border-border shadow-xl">
            <button
              className="absolute top-4 right-4 rounded p-1 text-text-muted"
              onClick={() => setMobileOpen(false)}
            >
              <X size={20} />
            </button>
            {sidebarContent}
          </aside>
        </div>
      )}

      <aside className="hidden lg:sticky lg:top-0 lg:flex lg:h-screen lg:w-[260px] lg:shrink-0 lg:flex-col lg:overflow-hidden lg:border-r lg:border-border lg:bg-surface">
        {sidebarContent}
      </aside>
    </>
  )
}
