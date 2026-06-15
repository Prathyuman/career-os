import PageLayout from '../components/PageLayout'
import ScrollReveal from '../components/ScrollReveal'
import {
  FolderGit2,
} from 'lucide-react'

export default function ProjectsPage() {
  return (
    <PageLayout title="Project Recommendations">
      <ScrollReveal>
        <div className="bg-surface rounded-lg border border-border-subtle p-10 text-center">
          <FolderGit2 className="w-12 h-12 text-text-muted mx-auto mb-4" />

          <h2 className="font-display text-xl font-semibold text-text-primary mb-2">
            No Projects Available
          </h2>

          <p className="text-text-secondary text-sm max-w-md mx-auto">
            Your projects and AI-generated project recommendations will appear
            here after Skill Gap Analysis and Career Roadmap generation.
          </p>

          <div className="mt-6 p-4 bg-elevated rounded-lg border border-border-subtle">
            <p className="text-text-muted text-sm">
              Future project recommendation modules:
            </p>

            <ul className="mt-3 space-y-2 text-sm text-text-secondary">
              <li>• AI Recommended Projects</li>
              <li>• GitHub Integration</li>
              <li>• Portfolio Tracking</li>
              <li>• Skill-Based Project Suggestions</li>
              <li>• Career Goal Projects</li>
            </ul>
          </div>
        </div>
      </ScrollReveal>
    </PageLayout>
  )
}