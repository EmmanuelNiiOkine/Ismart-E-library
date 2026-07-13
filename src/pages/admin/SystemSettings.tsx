import { PageHeader } from '../../components/layout/PageHeader'
import { Input } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'

export function SystemSettings() {
  return (
    <div>
      <PageHeader title="System settings" description="Configure library system preferences." />

      <div className="max-w-2xl space-y-6">
        <section className="rounded-lg border border-border bg-surface p-6">
          <h2 className="text-sm font-semibold text-text mb-4">General</h2>
          <div className="space-y-4">
            <Input label="Library name" defaultValue="ISMART E-Library" />
            <Input label="Organization" defaultValue="iSmart International Ghana Limited" />
            <Input label="Support email" type="email" defaultValue="support@ismartghana.com" />
          </div>
        </section>

        <section className="rounded-lg border border-border bg-surface p-6">
          <h2 className="text-sm font-semibold text-text mb-4">Storage</h2>
          <div className="space-y-4">
            <Input label="Storage provider" defaultValue="AWS S3" readOnly />
            <Input label="Bucket name" defaultValue="ismart-elibrary-docs" />
            <Input label="Region" defaultValue="eu-west-1" />
          </div>
        </section>

        <section className="rounded-lg border border-border bg-surface p-6">
          <h2 className="text-sm font-semibold text-text mb-4">Security</h2>
          <div className="space-y-4">
            <label className="flex items-center gap-3 text-sm text-text">
              <input type="checkbox" defaultChecked className="rounded border-border" />
              Require HTTPS
            </label>
            <label className="flex items-center gap-3 text-sm text-text">
              <input type="checkbox" defaultChecked className="rounded border-border" />
              Session timeout after 30 minutes
            </label>
            <label className="flex items-center gap-3 text-sm text-text">
              <input type="checkbox" className="rounded border-border" />
              Allow document downloads by default
            </label>
          </div>
        </section>

        <div className="flex justify-end">
          <Button>Save settings</Button>
        </div>
      </div>
    </div>
  )
}
