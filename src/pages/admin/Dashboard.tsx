import { Link } from 'react-router-dom'
import { Users, BookOpen, Library, HardDrive, Upload } from 'lucide-react'
import { PageHeader } from '../../components/layout/PageHeader'
import { DocumentCard } from '../../components/ui/DocumentCard'
import { CollectionsShowcase } from '../../components/ui/CollectionsShowcase'
import { LibrarySearch } from '../../components/ui/LibrarySearch'
import { Button } from '../../components/ui/Button'
import { useLibrary } from '../../contexts/LibraryContext'
import { users } from '../../data/mockData'

function StatCard({
  label,
  value,
  icon,
}: {
  label: string
  value: string | number
  icon: React.ReactNode
}) {
  return (
    <div className="rounded-xl border border-border/70 bg-surface p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium uppercase tracking-wider text-text-muted">{label}</p>
        <span className="text-brand/60">{icon}</span>
      </div>
      <p className="mt-2 font-serif text-3xl font-semibold text-text">{value}</p>
    </div>
  )
}

export function AdminDashboard() {
  const { categories, documents } = useLibrary()

  const recentDocuments = [...documents]
    .sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime())
    .slice(0, 4)

  const topCategories = [...categories].sort((a, b) => a.order - b.order).slice(0, 4)
  const activeUsers = users.filter((u) => u.status === 'active').length

  return (
    <div>
      <PageHeader
        title="Administration"
        description="Manage volumes, collections, and users."
        actions={
          <Link to="/admin/upload">
            <Button size="sm">
              <Upload size={16} />
              Add volume
            </Button>
          </Link>
        }
      />

      <div className="mb-8">
        <LibrarySearch basePath="/search" showFilters />
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Users" value={users.length} icon={<Users size={18} />} />
        <StatCard label="Active" value={activeUsers} icon={<Users size={18} />} />
        <StatCard label="Volumes" value={documents.length} icon={<BookOpen size={18} />} />
        <StatCard label="Collections" value={categories.length} icon={<Library size={18} />} />
      </div>

      <div className="mb-8 rounded-xl border border-border/70 bg-surface p-5 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <HardDrive size={18} className="text-text-muted" />
            <h2 className="text-sm font-semibold text-text">Storage</h2>
          </div>
          <span className="text-sm text-text-muted">142.8 MB / 10 GB</span>
        </div>
        <div className="h-2 rounded-full bg-background overflow-hidden">
          <div className="h-full rounded-full bg-gradient-to-r from-brand to-accent" style={{ width: '1.4%' }} />
        </div>
      </div>

      <CollectionsShowcase
        categories={topCategories}
        linkPrefix="/admin/categories"
        title="Featured stacks"
        description="Quick access to your largest subject collections."
        action={
          <Link to="/admin/categories" className="text-sm font-medium text-brand hover:underline">
            Manage all
          </Link>
        }
      />

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-serif text-lg font-semibold text-text">Recently added</h2>
          <Link to="/admin/documents" className="text-sm font-medium text-brand hover:underline">
            View all
          </Link>
        </div>
        <div className="grid gap-3">
          {recentDocuments.map((doc) => (
            <DocumentCard key={doc.id} document={doc} linkPrefix="/documents" variant="compact" />
          ))}
        </div>
      </section>
    </div>
  )
}
