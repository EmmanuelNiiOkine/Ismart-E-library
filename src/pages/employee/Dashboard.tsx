import { Link } from 'react-router-dom'
import { PageHeader } from '../../components/layout/PageHeader'
import { LibrarySearch } from '../../components/ui/LibrarySearch'
import { DocumentCard } from '../../components/ui/DocumentCard'
import { CollectionsShowcase } from '../../components/ui/CollectionsShowcase'
import { Bookshelf } from '../../components/ui/Bookshelf'
import { useLibrary } from '../../contexts/LibraryContext'

export function EmployeeDashboard() {
  const { categories, documents } = useLibrary()

  const recentDocuments = [...documents]
    .sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime())
    .slice(0, 6)

  const topCategories = [...categories].sort((a, b) => a.order - b.order).slice(0, 4)

  return (
    <div>
      <PageHeader
        title="Library"
        description="Your legal reference collection — browse, search, and read."
      />

      <div className="space-y-10">
        <LibrarySearch showFilters />

        <Bookshelf
          title="Recently added"
          action={
            <Link to="/library" className="text-sm font-semibold text-brand hover:text-brand-dark transition-colors">
              View all →
            </Link>
          }
        >
          {recentDocuments.map((doc) => (
            <DocumentCard key={doc.id} document={doc} />
          ))}
        </Bookshelf>

        <CollectionsShowcase
          categories={topCategories}
          title="Featured stacks"
          description="Start with a subject shelf — each stack groups related volumes."
          action={
            <Link to="/categories" className="text-sm font-semibold text-brand hover:text-brand-dark transition-colors">
              All stacks →
            </Link>
          }
        />
      </div>
    </div>
  )
}
