import { PageHeader } from '../../components/layout/PageHeader'
import { Input } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'
import { useAuth } from '../../contexts/AuthContext'

export function Profile() {
  const { user } = useAuth()

  return (
    <div>
      <PageHeader title="Profile" description="Your account information." />

      <div className="max-w-lg rounded-lg border border-border bg-surface p-6">
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <Input label="Full name" defaultValue={user?.name} readOnly />
          <Input label="Email" type="email" defaultValue={user?.email} readOnly />
          <Input label="Role" defaultValue={user?.role === 'admin' ? 'Administrator' : 'Employee'} readOnly />

          <div className="border-t border-border pt-4">
            <h2 className="text-sm font-semibold text-text mb-4">Change password</h2>
            <div className="space-y-4">
              <Input label="Current password" type="password" />
              <Input label="New password" type="password" />
              <Input label="Confirm new password" type="password" />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button type="submit">Update password</Button>
          </div>
        </form>
      </div>
    </div>
  )
}
