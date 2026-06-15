import PageLayout from '../components/PageLayout'
import ScrollReveal from '../components/ScrollReveal'
import { Map } from 'lucide-react'

export default function RoadmapPage() {
  return (
    <PageLayout title="Learning Roadmap">
      <ScrollReveal>
        <div className="bg-surface rounded-lg border border-border-subtle p-10 text-center">
          <Map className="w-12 h-12 text-text-muted mx-auto mb-4" />

          <h2 className="font-display text-xl font-semibold text-text-primary mb-2">
            No Roadmap Available
          </h2>

          <p className="text-text-secondary text-sm max-w-md mx-auto">
            Your personalized learning roadmap will appear here after completing
            Resume Analysis and Skill Gap Analysis.
          </p>

          <div className="mt-6 p-4 bg-elevated rounded-lg border border-border-subtle">
            <p className="text-text-muted text-sm">
              Future roadmap modules:
            </p>

            <ul className="mt-3 space-y-2 text-sm text-text-secondary">
              <li>• Skill Gap Analysis</li>
              <li>• Personalized Learning Path</li>
              <li>• Recommended Courses</li>
              <li>• Career Milestones</li>
              <li>• Certification Tracking</li>
            </ul>
          </div>
        </div>
      </ScrollReveal>
    </PageLayout>
  )
}