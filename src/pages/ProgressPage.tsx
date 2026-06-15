import PageLayout from '../components/PageLayout'
import ScrollReveal from '../components/ScrollReveal'
import {
  TrendingUp,
} from 'lucide-react'

export default function ProgressPage() {
  return (
    <PageLayout title="Progress Dashboard">
      <ScrollReveal>
        <div className="bg-surface rounded-lg border border-border-subtle p-10 text-center">
          <TrendingUp className="w-12 h-12 text-text-muted mx-auto mb-4" />

          <h2 className="font-display text-xl font-semibold text-text-primary mb-2">
            No Progress Data Available
          </h2>

          <p className="text-text-secondary text-sm max-w-md mx-auto">
            Your progress analytics will appear here once you start using
            Resume Analyzer, Skill Gap Analyzer, Courses, and other Career OS
            features.
          </p>
        </div>
      </ScrollReveal>
    </PageLayout>
  )
}