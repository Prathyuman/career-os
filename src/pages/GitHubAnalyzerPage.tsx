import PageLayout from '../components/PageLayout'
import ScrollReveal from '../components/ScrollReveal'
import { Github } from 'lucide-react'

export default function GitHubAnalyzerPage() {
  return (
    <PageLayout title="GitHub Analyzer">
      <ScrollReveal>
        <div className="bg-surface rounded-lg border border-border-subtle p-10 text-center">
          <Github className="w-14 h-14 text-text-muted mx-auto mb-4" />

          <h2 className="font-display text-xl font-semibold text-text-primary mb-2">
            GitHub Not Connected
          </h2>

          <p className="text-text-secondary text-sm max-w-md mx-auto">
            Connect your GitHub account to analyze repositories,
            contributions, skills, and receive personalized recommendations.
          </p>

          <button
            className="mt-6 px-5 py-2 rounded-md bg-cyan text-deep font-medium hover:brightness-110 transition-all"
          >
            Connect GitHub
          </button>
        </div>
      </ScrollReveal>
    </PageLayout>
  )
}