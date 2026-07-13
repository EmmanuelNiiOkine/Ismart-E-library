import { useState } from 'react'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { PageHeader } from '../../components/layout/PageHeader'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import { Modal, ModalActions } from '../../components/ui/Modal'
import { Input } from '../../components/ui/Input'
import { Select } from '../../components/ui/Select'
import { users as initialUsers } from '../../data/mockData'
import type { User, UserRole, UserStatus } from '../../types'

export function UserManagement() {
  const [userList, setUserList] = useState(initialUsers)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [form, setForm] = useState({
    name: '',
    email: '',
    employeeId: '',
    role: 'employee' as UserRole,
    status: 'active' as UserStatus,
    password: '',
  })

  const openCreate = () => {
    setEditingUser(null)
    setForm({ name: '', email: '', employeeId: '', role: 'employee', status: 'active', password: '' })
    setModalOpen(true)
  }

  const openEdit = (user: User) => {
    setEditingUser(user)
    setForm({
      name: user.name,
      email: user.email,
      employeeId: user.employeeId || '',
      role: user.role,
      status: user.status,
      password: '',
    })
    setModalOpen(true)
  }

  const handleSave = () => {
    if (editingUser) {
      setUserList((prev) =>
        prev.map((u) =>
          u.id === editingUser.id
            ? { ...u, name: form.name, email: form.email, employeeId: form.employeeId, role: form.role, status: form.status }
            : u
        )
      )
    } else {
      const newUser: User = {
        id: `user-${Date.now()}`,
        name: form.name,
        email: form.email,
        employeeId: form.employeeId || undefined,
        role: form.role,
        status: form.status,
        createdAt: new Date().toISOString().split('T')[0],
      }
      setUserList((prev) => [...prev, newUser])
    }
    setModalOpen(false)
  }

  const handleDelete = (id: string) => {
    if (confirm('Delete this user?')) {
      setUserList((prev) => prev.filter((u) => u.id !== id))
    }
  }

  const toggleStatus = (id: string) => {
    setUserList((prev) =>
      prev.map((u) =>
        u.id === id ? { ...u, status: u.status === 'active' ? 'disabled' : 'active' } : u
      )
    )
  }

  return (
    <div>
      <PageHeader
        title="User management"
        description={`${userList.length} registered users.`}
        actions={
          <Button size="sm" onClick={openCreate}>
            <Plus size={16} />
            Add user
          </Button>
        }
      />

      <div className="overflow-x-auto rounded-lg border border-border bg-surface">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="px-4 py-3 font-medium text-text-muted">Name</th>
              <th className="px-4 py-3 font-medium text-text-muted">Email</th>
              <th className="px-4 py-3 font-medium text-text-muted">Employee ID</th>
              <th className="px-4 py-3 font-medium text-text-muted">Role</th>
              <th className="px-4 py-3 font-medium text-text-muted">Status</th>
              <th className="px-4 py-3 font-medium text-text-muted">Actions</th>
            </tr>
          </thead>
          <tbody>
            {userList.map((user) => (
              <tr key={user.id} className="border-b border-border last:border-0 hover:bg-background">
                <td className="px-4 py-3 font-medium text-text">{user.name}</td>
                <td className="px-4 py-3 text-text-muted">{user.email}</td>
                <td className="px-4 py-3 text-text-muted">{user.employeeId || '—'}</td>
                <td className="px-4 py-3 text-text-muted capitalize">{user.role}</td>
                <td className="px-4 py-3">
                  <button onClick={() => toggleStatus(user.id)}>
                    <Badge variant={user.status}>{user.status}</Badge>
                  </button>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEdit(user)}
                      className="rounded p-1.5 text-text-muted hover:bg-background hover:text-text"
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="rounded p-1.5 text-text-muted hover:bg-background hover:text-danger"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingUser ? 'Edit user' : 'Add user'}
        footer={
          <ModalActions
            onCancel={() => setModalOpen(false)}
            onConfirm={handleSave}
            confirmLabel={editingUser ? 'Save changes' : 'Create user'}
          />
        }
      >
        <div className="space-y-4">
          <Input label="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <Input label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          <Input label="Employee ID" value={form.employeeId} onChange={(e) => setForm({ ...form, employeeId: e.target.value })} />
          {!editingUser && (
            <Input label="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          )}
          <Select
            label="Role"
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value as UserRole })}
            options={[
              { value: 'employee', label: 'Employee' },
              { value: 'admin', label: 'Administrator' },
            ]}
          />
          <Select
            label="Status"
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value as UserStatus })}
            options={[
              { value: 'active', label: 'Active' },
              { value: 'disabled', label: 'Disabled' },
            ]}
          />
        </div>
      </Modal>
    </div>
  )
}
