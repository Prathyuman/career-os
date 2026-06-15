import PageLayout from '../components/PageLayout'
import ScrollReveal from '../components/ScrollReveal'
import { Users } from 'lucide-react'

export default function AdminPage() {
  return (
    <PageLayout title="Admin Dashboard">
      <ScrollReveal>
        <div className="bg-surface rounded-lg border border-border-subtle p-10 text-center">
          <Users className="w-14 h-14 text-text-muted mx-auto mb-4" />

          <h2 className="font-display text-xl font-semibold text-text-primary mb-2">
            Admin Dashboard Coming Soon
          </h2>

          <p className="text-text-secondary text-sm max-w-md mx-auto">
            User management, analytics, feature monitoring,
            and platform administration tools will be available
            after backend integration is completed.
          </p>
        </div>
      </ScrollReveal>
    </PageLayout>
  )
}