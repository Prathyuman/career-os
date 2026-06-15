import PageLayout from '../components/PageLayout'
import ScrollReveal from '../components/ScrollReveal'
import {
  Award,
} from 'lucide-react'

export default function CertificationsPage() {
  return (
    <PageLayout title="Certification Tracker">
      <ScrollReveal>
        <div className="bg-surface rounded-lg border border-border-subtle p-10 text-center">
          <Award className="w-12 h-12 text-text-muted mx-auto mb-4" />

          <h2 className="font-display text-xl font-semibold text-text-primary mb-2">
            No Certifications Available
          </h2>

          <p className="text-text-secondary text-sm max-w-md mx-auto">
            Your certifications and certification recommendations will appear
            here after Skill Gap Analysis and Career Planning are completed.
          </p>

          <div className="mt-6 p-4 bg-elevated rounded-lg border border-border-subtle">
            <p className="text-text-muted text-sm">
              Future certification modules:
            </p>

            <ul className="mt-3 space-y-2 text-sm text-text-secondary">
              <li>• Certification Tracking</li>
              <li>• Exam Preparation Roadmaps</li>
              <li>• Skill-Based Certification Suggestions</li>
              <li>• Progress Monitoring</li>
              <li>• Career Goal Certifications</li>
            </ul>
          </div>
        </div>
      </ScrollReveal>
    </PageLayout>
  )
}