import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Image, Upload } from 'lucide-react'
import { PageHeader } from '../../components/layout/PageHeader'
import { Input } from '../../components/ui/Input'
import { Textarea } from '../../components/ui/Textarea'
import { Select } from '../../components/ui/Select'
import { Button } from '../../components/ui/Button'
import { DocumentCover } from '../../components/ui/DocumentCover'
import { useLibrary } from '../../contexts/LibraryContext'
import { useAuth } from '../../contexts/AuthContext'
import { getFileTypeFromName, saveDocumentFile } from '../../utils/fileStorage'
import { isReportCategory } from '../../utils/bookTheme'

function formatFileSize(bytes: number): string {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function UploadDocument() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { categories, addDocument } = useLibrary()
  const [file, setFile] = useState<File | null>(null)
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [coverPreview, setCoverPreview] = useState<string | null>(null)
  const [form, setForm] = useState({
    title: '',
    author: '',
    description: '',
    categoryId: categories[0]?.id || '',
    publicationYear: new Date().getFullYear().toString(),
    keywords: '',
  })

  const year = Number(form.publicationYear) || new Date().getFullYear()
  const previewCoverUrl = coverPreview

  const handleCoverChange = (next: File | null) => {
    setCoverFile(next)
    if (coverPreview) URL.revokeObjectURL(coverPreview)
    setCoverPreview(next ? URL.createObjectURL(next) : null)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!file) return

    const fileType = getFileTypeFromName(file.name)

    const doc = addDocument({
      title: form.title,
      author: form.author,
      description: form.description || `Uploaded volume: ${form.title}`,
      categoryId: form.categoryId,
      publicationYear: year,
      keywords: form.keywords
        .split(',')
        .map((k) => k.trim())
        .filter(Boolean),
      fileSize: formatFileSize(file.size),
      uploadDate: new Date().toISOString().slice(0, 10),
      uploadedBy: user?.name || 'Administrator',
      filePath: `/uploads/${file.name}`,
      fileType,
      downloadEnabled: true,
      coverImageUrl: previewCoverUrl,
    })

    await saveDocumentFile(doc.id, file)
    navigate('/admin/documents')
  }

  return (
    <div>
      <PageHeader
        title="Upload document"
        description="Add a new volume. Without a cover image, a styled book or report preview is generated automatically."
      />

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        <div
          className={`rounded-lg border-2 border-dashed p-8 text-center ${
            file ? 'border-brand bg-brand-light' : 'border-border bg-surface'
          }`}
        >
          <Upload size={32} className="mx-auto text-text-muted mb-3" />
          {file ? (
            <p className="text-sm font-medium text-text">{file.name}</p>
          ) : (
            <>
              <p className="text-sm font-medium text-text">Drop a PDF or Word file here</p>
              <p className="mt-1 text-xs text-text-muted">PDF and DOCX open in the flip-book reader</p>
            </>
          )}
          <input
            type="file"
            accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            className="mt-4 text-sm"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
        </div>

        <div className="rounded-lg border border-border bg-surface p-6 space-y-4">
          <div>
            <p className="text-sm font-medium text-text">Cover image (optional)</p>
            <p className="mt-1 text-xs text-text-muted">
              Leave empty to use the generated {isReportCategory(form.categoryId) ? 'report' : 'book'} cover with the title on it.
            </p>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
            <div className="flex shrink-0 justify-center sm:justify-start">
              <DocumentCover
                title={form.title || 'Volume title'}
                author={form.author || 'Author'}
                year={year}
                categoryId={form.categoryId}
                coverImageUrl={previewCoverUrl}
                size="md"
              />
            </div>
            <div className="flex-1">
              <div
                className={`rounded-lg border-2 border-dashed p-5 text-center ${
                  coverFile ? 'border-brand/40 bg-brand-light/40' : 'border-border'
                }`}
              >
                <Image size={24} className="mx-auto text-text-muted mb-2" />
                <p className="text-xs text-text-muted">
                  {coverFile ? coverFile.name : 'Optional cover image (JPG, PNG)'}
                </p>
                <input
                  type="file"
                  accept="image/*"
                  className="mt-3 text-sm"
                  onChange={(e) => handleCoverChange(e.target.files?.[0] || null)}
                />
                {coverFile && (
                  <button
                    type="button"
                    className="mt-2 text-xs font-semibold text-brand hover:underline"
                    onClick={() => handleCoverChange(null)}
                  >
                    Remove cover — use generated design
                  </button>
                )}
              </div>
            </div>
          </div>

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

        <div className="flex items-center gap-3">
          <Button type="submit" disabled={!file || !form.title || !form.author}>
            Upload document
          </Button>
          <Button type="button" variant="secondary" onClick={() => navigate('/admin/documents')}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}
