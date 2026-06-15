import PageLayout from '../components/PageLayout'
import ScrollReveal from '../components/ScrollReveal'
import {
  MessageSquare,
} from 'lucide-react'

export default function InterviewPage() {
  return (
    <PageLayout title="Interview Coach">
      <ScrollReveal>
        <div className="bg-surface rounded-lg border border-border-subtle p-10 text-center">
          <MessageSquare className="w-14 h-14 text-text-muted mx-auto mb-4" />

          <h2 className="font-display text-xl font-semibold text-text-primary mb-2">
            Interview Coach Coming Soon
          </h2>

          <p className="text-text-secondary text-sm max-w-md mx-auto">
            Personalized mock interviews and AI-powered feedback
            will be available after Resume Analysis and Skill Gap
            Analysis are completed.
          </p>
        </div>
      </ScrollReveal>
    </PageLayout>
  )
}