import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useAppLoading } from '../../contexts/AppLoadingContext'
import { Input } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'

export function AdminLogin() {
  const [email, setEmail] = useState('admin@ismartghana.com')
  const [password, setPassword] = useState('admin123')
  const [error, setError] = useState('')
  const { login } = useAuth()
  const { runWithLoader } = useAppLoading()
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    if (!login(email, password, 'admin')) {
      setError('Invalid email or password.')
      return
    }
    setSubmitting(true)
    await runWithLoader(() => navigate('/admin'))
    setSubmitting(false)
  }

  return (
    <div>
      <h1 className="text-xl font-bold text-navy">Administrator sign in</h1>
      <p className="mt-1 text-sm text-text-muted">Manage users, documents, and collections.</p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />
        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
        />
        {error && <p className="text-sm text-danger">{error}</p>}
        <Button type="submit" className="w-full" size="lg" disabled={submitting}>
          {submitting ? 'Signing in…' : 'Sign in'}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-text-muted">
        Employee access?{' '}
        <Link to="/login" className="font-semibold text-brand-cyan hover:text-brand">
          Employee sign in
        </Link>
      </p>
    </div>
  )
}
