import PageLayout from '../components/PageLayout'
import ScrollReveal from '../components/ScrollReveal'
import {
  Map,
  CheckCircle,
  Circle,
  Clock,
  TrendingUp,
  Zap,
} from 'lucide-react'

const milestones = [
  {
    quarter: 'Q1 2025',
    title: 'Foundation Building',
    status: 'completed',
    items: [
      { text: 'Complete JavaScript Advanced Patterns', done: true },
      { text: 'Learn TypeScript fundamentals', done: true },
      { text: 'Build 2 side projects', done: true },
      { text: 'Get AWS Cloud Practitioner cert', done: true },
    ],
  },
  {
    quarter: 'Q2 2025',
    title: 'Skill Expansion',
    status: 'in-progress',
    items: [
      { text: 'Complete System Design course', done: true },
      { text: 'Learn Docker & Kubernetes basics', done: true },
      { text: 'Contribute to open source', done: false },
      { text: 'Get AWS Solutions Architect cert', done: false },
    ],
  },
  {
    quarter: 'Q3 2025',
    title: 'Leadership & Growth',
    status: 'upcoming',
    items: [
      { text: 'Mentor junior developers', done: false },
      { text: 'Lead a technical initiative', done: false },
      { text: 'Speak at a tech meetup', done: false },
      { text: 'Build a microservices project', done: false },
    ],
  },
  {
    quarter: 'Q4 2025',
    title: 'Senior Level',
    status: 'upcoming',
    items: [
      { text: 'Apply for Senior Engineer roles', done: false },
      { text: 'Complete Staff Engineer prep', done: false },
      { text: 'Publish technical blog posts', done: false },
      { text: 'Build personal brand', done: false },
    ],
  },
]

const skillsProgress = [
  { name: 'System Design', progress: 65, target: 80 },
  { name: 'Cloud (AWS)', progress: 55, target: 75 },
  { name: 'Leadership', progress: 40, target: 70 },
  { name: 'TypeScript', progress: 75, target: 90 },
]

export default function RoadmapPage() {
  return (
    <PageLayout title="Learning Roadmap">
      {/* Progress Overview */}
      <ScrollReveal>
        <div className="bg-surface rounded-lg border border-border-subtle p-6 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-cyan/20 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-cyan" />
            </div>
            <div>
              <h3 className="font-display font-semibold text-text-primary">2025 Career Roadmap</h3>
              <p className="text-text-secondary text-sm">Target: Senior Software Engineer</p>
            </div>
            <div className="ml-auto text-right">
              <div className="font-display text-2xl font-bold text-cyan">42%</div>
              <div className="text-text-muted text-xs">Complete</div>
            </div>
          </div>
          <div className="h-2 bg-elevated rounded-full overflow-hidden">
            <div className="h-full bg-cyan rounded-full" style={{ width: '42%' }} />
          </div>
        </div>
      </ScrollReveal>

      {/* Skills Progress */}
      <ScrollReveal className="mb-6">
        <div className="bg-surface rounded-lg border border-border-subtle p-6">
          <h3 className="font-display font-semibold text-text-primary mb-4 flex items-center gap-2">
            <Zap className="w-4 h-4 text-cyan" />
            Key Skills Progress
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {skillsProgress.map((skill) => (
              <div key={skill.name} className="bg-elevated rounded-md p-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-text-primary font-medium">{skill.name}</span>
                  <span className="text-text-muted">{skill.progress}% / {skill.target}%</span>
                </div>
                <div className="h-2 bg-surface rounded-full overflow-hidden">
                  <div
                    className="h-full bg-cyan rounded-full transition-all"
                    style={{ width: `${(skill.progress / skill.target) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </ScrollReveal>

      {/* Timeline */}
      <ScrollReveal>
        <div className="bg-surface rounded-lg border border-border-subtle p-6">
          <h3 className="font-display font-semibold text-text-primary mb-6 flex items-center gap-2">
            <Map className="w-4 h-4 text-cyan" />
            Milestone Timeline
          </h3>
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-6 top-0 bottom-0 w-px bg-border-subtle" />

            <div className="space-y-8">
              {milestones.map((milestone) => (
                <div key={milestone.quarter} className="relative flex gap-6">
                  {/* Status icon */}
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 z-10 ${
                    milestone.status === 'completed'
                      ? 'bg-cyan/20'
                      : milestone.status === 'in-progress'
                      ? 'bg-violet/20'
                      : 'bg-elevated border border-border-subtle'
                  }`}>
                    {milestone.status === 'completed' ? (
                      <CheckCircle className="w-5 h-5 text-cyan" />
                    ) : milestone.status === 'in-progress' ? (
                      <Clock className="w-5 h-5 text-violet" />
                    ) : (
                      <Circle className="w-5 h-5 text-text-muted" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 pb-2">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-pill ${
                        milestone.status === 'completed'
                          ? 'bg-cyan/10 text-cyan'
                          : milestone.status === 'in-progress'
                          ? 'bg-violet/10 text-violet'
                          : 'bg-elevated text-text-muted'
                      }`}>
                        {milestone.quarter}
                      </span>
                      <span className="font-display font-semibold text-text-primary">{milestone.title}</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {milestone.items.map((item) => (
                        <div
                          key={item.text}
                          className={`flex items-center gap-2 text-sm ${
                            item.done ? 'text-text-secondary' : 'text-text-muted'
                          }`}
                        >
                          {item.done ? (
                            <CheckCircle className="w-3.5 h-3.5 text-cyan flex-shrink-0" />
                          ) : (
                            <Circle className="w-3.5 h-3.5 text-text-muted flex-shrink-0" />
                          )}
                          <span className={item.done ? 'line-through opacity-60' : ''}>{item.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </ScrollReveal>
    </PageLayout>
  )
}
