import PageLayout from '../components/PageLayout'
import ScrollReveal from '../components/ScrollReveal'
import {
  Award,
  Clock,
  CheckCircle,
  Circle,
  TrendingUp,
  AlertTriangle,
  Calendar,
  ExternalLink,
} from 'lucide-react'

const certifications = [
  {
    name: 'AWS Solutions Architect Associate',
    issuer: 'Amazon Web Services',
    status: 'in-progress',
    progress: 65,
    deadline: 'March 30, 2025',
    difficulty: 'Advanced',
    relevance: 95,
  },
  {
    name: 'Kubernetes Administrator (CKA)',
    issuer: 'Cloud Native Computing Foundation',
    status: 'planned',
    progress: 0,
    deadline: 'June 15, 2025',
    difficulty: 'Advanced',
    relevance: 88,
  },
  {
    name: 'AWS Cloud Practitioner',
    issuer: 'Amazon Web Services',
    status: 'completed',
    progress: 100,
    deadline: 'Completed',
    difficulty: 'Beginner',
    relevance: 90,
  },
  {
    name: 'Meta React Developer',
    issuer: 'Meta',
    status: 'completed',
    progress: 100,
    deadline: 'Completed',
    difficulty: 'Intermediate',
    relevance: 85,
  },
  {
    name: 'Google Cloud Professional',
    issuer: 'Google Cloud',
    status: 'planned',
    progress: 0,
    deadline: 'August 1, 2025',
    difficulty: 'Advanced',
    relevance: 78,
  },
  {
    name: 'Terraform Associate',
    issuer: 'HashiCorp',
    status: 'planned',
    progress: 0,
    deadline: 'October 10, 2025',
    difficulty: 'Intermediate',
    relevance: 72,
  },
]

export default function CertificationsPage() {
  const inProgress = certifications.filter((c) => c.status === 'in-progress')
  const completed = certifications.filter((c) => c.status === 'completed')
  const planned = certifications.filter((c) => c.status === 'planned')

  return (
    <PageLayout title="Certification Tracker">
      {/* Summary */}
      <ScrollReveal>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {[
            { label: 'In Progress', value: inProgress.length, icon: Clock, color: 'text-violet' },
            { label: 'Completed', value: completed.length, icon: CheckCircle, color: 'text-cyan' },
            { label: 'Planned', value: planned.length, icon: Circle, color: 'text-text-muted' },
          ].map((stat) => (
            <div key={stat.label} className="bg-surface rounded-lg border border-border-subtle p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-elevated flex items-center justify-center">
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <div>
                  <div className="font-display text-2xl font-bold text-text-primary">{stat.value}</div>
                  <div className="text-text-muted text-xs">{stat.label}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollReveal>

      {/* In Progress */}
      {inProgress.length > 0 && (
        <ScrollReveal className="mb-6">
          <h3 className="font-display font-semibold text-text-primary mb-4 flex items-center gap-2">
            <Clock className="w-4 h-4 text-violet" />
            In Progress
          </h3>
          <div className="space-y-3">
            {inProgress.map((cert) => (
              <div key={cert.name} className="bg-surface rounded-lg border border-border-subtle p-5">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-violet/10 flex items-center justify-center flex-shrink-0">
                      <Award className="w-5 h-5 text-violet" />
                    </div>
                    <div>
                      <h4 className="text-text-primary text-sm font-medium">{cert.name}</h4>
                      <p className="text-text-muted text-xs mt-0.5">{cert.issuer}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-xs text-coral flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" />
                          Due {cert.deadline}
                        </span>
                        <span className="text-xs text-text-muted bg-elevated px-2 py-0.5 rounded-md">{cert.difficulty}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-32">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-text-muted">Progress</span>
                        <span className="text-violet">{cert.progress}%</span>
                      </div>
                      <div className="h-1.5 bg-elevated rounded-full overflow-hidden">
                        <div className="h-full bg-violet rounded-full" style={{ width: `${cert.progress}%` }} />
                      </div>
                    </div>
                    <button className="px-3 py-1.5 rounded-md bg-cyan text-deep text-xs font-semibold hover:brightness-110 transition-all flex items-center gap-1">
                      Study
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollReveal>
      )}

      {/* Completed */}
      <ScrollReveal className="mb-6">
        <h3 className="font-display font-semibold text-text-primary mb-4 flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-cyan" />
          Completed
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {completed.map((cert) => (
            <div key={cert.name} className="bg-surface rounded-lg border border-border-subtle p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-cyan/10 flex items-center justify-center flex-shrink-0">
                <Award className="w-5 h-5 text-cyan" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-text-primary text-sm font-medium truncate">{cert.name}</h4>
                <p className="text-text-muted text-xs">{cert.issuer}</p>
              </div>
              <CheckCircle className="w-5 h-5 text-cyan flex-shrink-0" />
            </div>
          ))}
        </div>
      </ScrollReveal>

      {/* Planned */}
      <ScrollReveal>
        <h3 className="font-display font-semibold text-text-primary mb-4 flex items-center gap-2">
          <Circle className="w-4 h-4 text-text-muted" />
          Planned
        </h3>
        <div className="space-y-3">
          {planned.map((cert) => (
            <div key={cert.name} className="bg-surface rounded-lg border border-border-subtle p-5">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-elevated flex items-center justify-center flex-shrink-0">
                    <Award className="w-5 h-5 text-text-muted" />
                  </div>
                  <div>
                    <h4 className="text-text-primary text-sm font-medium">{cert.name}</h4>
                    <p className="text-text-muted text-xs mt-0.5">{cert.issuer}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-xs text-text-muted flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Target: {cert.deadline}
                      </span>
                      <span className="text-xs text-text-muted bg-elevated px-2 py-0.5 rounded-md">{cert.difficulty}</span>
                      <span className="text-xs text-cyan flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        {cert.relevance}% relevant
                      </span>
                    </div>
                  </div>
                </div>
                <button className="px-3 py-1.5 rounded-md border border-cyan text-cyan text-xs font-medium hover:bg-cyan/10 transition-all">
                  Start Prep
                </button>
              </div>
            </div>
          ))}
        </div>
      </ScrollReveal>
    </PageLayout>
  )
}
