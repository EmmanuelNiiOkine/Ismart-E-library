import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useAppLoading } from '../../contexts/AppLoadingContext'
import { Input } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'

export function EmployeeLogin() {
  const [email, setEmail] = useState('employee@ismartghana.com')
  const [password, setPassword] = useState('employee123')
  const [error, setError] = useState('')
  const { login } = useAuth()
  const { runWithLoader } = useAppLoading()
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    if (!login(email, password, 'employee')) {
      setError('Invalid email or password.')
      return
    }
    setSubmitting(true)
    await runWithLoader(() => navigate('/dashboard'))
    setSubmitting(false)
  }

  return (
    <div>
      <h1 className="text-xl font-bold text-navy">Employee sign in</h1>
      <p className="mt-1 text-sm text-text-muted">Access the legal document library.</p>

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
        Administrator?{' '}
        <Link to="/admin/login" className="font-semibold text-brand-cyan hover:text-brand">
          Admin sign in
        </Link>
      </p>
    </div>
  )
}
