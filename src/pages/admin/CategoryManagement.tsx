import { useMemo, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Plus, Pencil, Trash2, GripVertical, Eye } from 'lucide-react'
import { PageHeader } from '../../components/layout/PageHeader'
import { Button } from '../../components/ui/Button'
import { Modal, ModalActions } from '../../components/ui/Modal'
import { Input } from '../../components/ui/Input'
import { Textarea } from '../../components/ui/Textarea'
import { LibrarySearch } from '../../components/ui/LibrarySearch'
import { useLibrary } from '../../contexts/LibraryContext'
import type { Category } from '../../types'

export function CategoryManagement() {
  const navigate = useNavigate()
  const { categories, createCategory, updateCategory, deleteCategory } = useLibrary()
  const [searchParams] = useSearchParams()
  const listQuery = searchParams.get('q') || ''

  const [modalOpen, setModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [form, setForm] = useState({ name: '', description: '' })

  const filtered = useMemo(() => {
    const sorted = [...categories].sort((a, b) => a.order - b.order)
    if (!listQuery.trim()) return sorted
    const q = listQuery.toLowerCase()
    return sorted.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q),
    )
  }, [categories, listQuery])

  const openCreate = () => {
    setEditingCategory(null)
    setForm({ name: '', description: '' })
    setModalOpen(true)
  }

  const openEdit = (cat: Category) => {
    setEditingCategory(cat)
    setForm({ name: cat.name, description: cat.description })
    setModalOpen(true)
  }

  const handleSave = () => {
    if (!form.name.trim()) return
    if (editingCategory) {
      updateCategory(editingCategory.id, form)
    } else {
      const created = createCategory(form)
      setModalOpen(false)
      navigate(`/admin/categories/${created.id}`)
      return
    }
    setModalOpen(false)
  }

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Delete "${name}"? This cannot be undone.`)) {
      deleteCategory(id)
    }
  }

  return (
    <div>
      <PageHeader
        title="Collections"
        description={`${categories.length} collections · create, browse, and manage volumes.`}
        actions={
          <Button size="sm" onClick={openCreate}>
            <Plus size={16} />
            New collection
          </Button>
        }
      />

      <div className="mb-6">
        <LibrarySearch
          defaultQuery={listQuery}
          basePath="/admin/categories"
          placeholder="Search collections by name or description..."
          showFilters={false}
          showSuggestions={false}
        />
      </div>

      <div className="overflow-x-auto rounded-xl border border-border bg-surface">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="px-4 py-3 font-medium text-text-muted w-8" />
              <th className="px-4 py-3 font-medium text-text-muted">Name</th>
              <th className="px-4 py-3 font-medium text-text-muted">Description</th>
              <th className="px-4 py-3 font-medium text-text-muted">Volumes</th>
              <th className="px-4 py-3 font-medium text-text-muted">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((cat) => (
              <tr key={cat.id} className="border-b border-border last:border-0 hover:bg-background">
                <td className="px-4 py-3 text-text-muted">
                  <GripVertical size={16} />
                </td>
                <td className="px-4 py-3">
                  <Link
                    to={`/admin/categories/${cat.id}`}
                    className="font-semibold text-navy hover:text-brand transition-colors"
                  >
                    {cat.name}
                  </Link>
                </td>
                <td className="px-4 py-3 text-text-muted max-w-xs truncate">{cat.description}</td>
                <td className="px-4 py-3 text-text-muted">{cat.documentCount}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <Link
                      to={`/admin/categories/${cat.id}`}
                      className="rounded p-1.5 text-brand hover:bg-brand-light"
                      title="View volumes"
                    >
                      <Eye size={15} />
                    </Link>
                    <button
                      type="button"
                      onClick={() => openEdit(cat)}
                      className="rounded p-1.5 text-text-muted hover:bg-background hover:text-text"
                      title="Edit"
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(cat.id, cat.name)}
                      className="rounded p-1.5 text-text-muted hover:bg-background hover:text-danger"
                      title="Delete"
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

      {filtered.length === 0 && (
        <p className="mt-4 text-center text-sm text-text-muted">
          {listQuery ? `No collections match "${listQuery}".` : 'No collections yet.'}
        </p>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingCategory ? 'Edit collection' : 'New collection'}
        footer={
          <ModalActions
            onCancel={() => setModalOpen(false)}
            onConfirm={handleSave}
            confirmLabel={editingCategory ? 'Save changes' : 'Create collection'}
          />
        }
      >
        <div className="space-y-4">
          <Input
            label="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <Textarea
            label="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            required
          />
        </div>
      </Modal>
    </div>
  )
}
