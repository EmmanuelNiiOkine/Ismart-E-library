import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import type { AuthUser, UserRole } from '../types'
import { demoCredentials } from '../data/mockData'

interface AuthContextValue {
  user: AuthUser | null
  login: (email: string, password: string, role: UserRole) => boolean
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextValue | null>(null)

const STORAGE_KEY = 'ismart-elibrary-auth'

function loadStoredUser(): AuthUser | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : null
  } catch {
    return null
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(loadStoredUser)

  const login = useCallback((email: string, password: string, role: UserRole) => {
    const creds = demoCredentials[role]
    if (email === creds.email && password === creds.password) {
      const authUser: AuthUser = {
        id: role === 'admin' ? 'user-1' : 'user-2',
        name: role === 'admin' ? 'Kwame Asante' : 'Ama Osei',
        email,
        role,
      }
      setUser(authUser)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(authUser))
      return true
    }
    return false
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    localStorage.removeItem(STORAGE_KEY)
  }, [])

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
