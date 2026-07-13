import { useState, type FormEvent } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { PageHeader } from '../../components/layout/PageHeader'
import { Input } from '../../components/ui/Input'
import { Textarea } from '../../components/ui/Textarea'
import { Select } from '../../components/ui/Select'
import { Button } from '../../components/ui/Button'
import { EmptyState } from '../../components/ui/EmptyState'
import { DocumentCover } from '../../components/ui/DocumentCover'
import { useLibrary } from '../../contexts/LibraryContext'

export function EditDocument() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { getDocumentById, getCategoryById, categories, updateDocument } = useLibrary()
  const document = getDocumentById(id || '')

  const [form, setForm] = useState(
    document
      ? {
          title: document.title,
          author: document.author,
          description: document.description,
          categoryId: document.categoryId,
          publicationYear: document.publicationYear.toString(),
          keywords: document.keywords.join(', '),
        }
      : null,
  )

  if (!document || !form) {
    return (
      <EmptyState
        title="Volume not found"
        action={
          <Link to="/admin/documents" className="text-sm font-medium text-brand hover:underline">
            Back to volumes
          </Link>
        }
      />
    )
  }

  const currentCategory = getCategoryById(form.categoryId)
  const originalCategory = getCategoryById(document.categoryId)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()

    if (
      form.categoryId !== document.categoryId &&
      !confirm(
        `Move this volume from "${originalCategory?.name}" to "${currentCategory?.name}"?`,
      )
    ) {
      return
    }

    updateDocument(document.id, {
      title: form.title,
      author: form.author,
      description: form.description,
      categoryId: form.categoryId,
      publicationYear: Number(form.publicationYear) || document.publicationYear,
      keywords: form.keywords
        .split(',')
        .map((k) => k.trim())
        .filter(Boolean),
    })

    navigate('/admin/documents')
  }

  return (
    <div>
      <Link
        to="/admin/documents"
        className="mb-4 inline-flex items-center gap-1 text-sm text-text-muted hover:text-text"
      >
        <ArrowLeft size={16} />
        Volumes
      </Link>

      <PageHeader title="Edit volume" description={document.title} />

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
          <DocumentCover
            title={form.title || document.title}
            author={form.author || document.author}
            year={Number(form.publicationYear) || document.publicationYear}
            categoryId={form.categoryId}
            coverImageUrl={document.coverImageUrl}
            size="md"
          />
          <div className="flex-1 rounded-lg border border-border bg-surface p-6 space-y-4">
            <Input
              label="Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
            <Input
              label="Author"
              value={form.author}
              onChange={(e) => setForm({ ...form, author: e.target.value })}
              required
            />
            <Textarea
              label="Description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
            <Select
              label="Collection"
              value={form.categoryId}
              onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
              options={categories.map((c) => ({ value: c.id, label: c.name }))}
            />
            {form.categoryId !== document.categoryId && (
              <p className="text-xs text-brand font-medium">
                This volume will be moved to {currentCategory?.name}.
              </p>
            )}
            <Input
              label="Publication year"
              type="number"
              value={form.publicationYear}
              onChange={(e) => setForm({ ...form, publicationYear: e.target.value })}
            />
            <Input
              label="Keywords"
              value={form.keywords}
              onChange={(e) => setForm({ ...form, keywords: e.target.value })}
              placeholder="Comma-separated keywords"
            />
          </div>
        </div>

        <div className="rounded-lg border border-border bg-surface p-6">
          <h2 className="text-sm font-semibold text-text mb-3">Replace file</h2>
          <input type="file" accept=".pdf" className="text-sm" />
          <p className="mt-2 text-xs text-text-muted">Current file: {document.fileSize}</p>
        </div>

        <div className="flex items-center gap-3">
          <Button type="submit">Save changes</Button>
          <Button type="button" variant="secondary" onClick={() => navigate('/admin/documents')}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}
