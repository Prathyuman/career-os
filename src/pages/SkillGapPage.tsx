import PageLayout from '../components/PageLayout'
import ScrollReveal from '../components/ScrollReveal'
import {
  Target,
  BookOpen,
  AlertTriangle,
  CheckCircle,
  Zap,
  ArrowRight,
} from 'lucide-react'

const currentSkills = [
  { name: 'JavaScript', level: 90 },
  { name: 'React', level: 85 },
  { name: 'HTML/CSS', level: 88 },
  { name: 'Git', level: 80 },
  { name: 'Node.js', level: 65 },
  { name: 'TypeScript', level: 60 },
  { name: 'SQL', level: 55 },
]

const targetSkills = [
  { name: 'System Design', required: 80, current: 45 },
  { name: 'Kubernetes', required: 75, current: 20 },
  { name: 'AWS/GCP', required: 70, current: 35 },
  { name: 'GraphQL', required: 65, current: 40 },
  { name: 'CI/CD', required: 70, current: 30 },
  { name: 'Microservices', required: 75, current: 25 },
  { name: 'Docker', required: 70, current: 50 },
]

const recommendations = [
  { title: 'System Design Primer', type: 'Course', duration: '8 weeks', icon: BookOpen },
  { title: 'AWS Solutions Architect', type: 'Certification', duration: '3 months', icon: Target },
  { title: 'Docker & Kubernetes Mastery', type: 'Course', duration: '6 weeks', icon: BookOpen },
  { title: 'GraphQL Fundamentals', type: 'Course', duration: '4 weeks', icon: BookOpen },
]

export default function SkillGapPage() {
  return (
    <PageLayout title="Skill Gap Analysis">
      {/* Overview */}
      <ScrollReveal>
        <div className="bg-surface rounded-lg border border-border-subtle p-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-coral/20 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-coral" />
            </div>
            <div>
              <h3 className="font-display font-semibold text-text-primary">7 Skill Gaps Identified</h3>
              <p className="text-text-secondary text-sm mt-0.5">
                Based on your target role (Senior Software Engineer), we've identified key areas for improvement.
              </p>
            </div>
          </div>
        </div>
      </ScrollReveal>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Current Skills */}
        <ScrollReveal>
          <div className="bg-surface rounded-lg border border-border-subtle p-6">
            <h3 className="font-display font-semibold text-text-primary mb-4 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-cyan" />
              Current Skills
            </h3>
            <div className="space-y-3">
              {currentSkills.map((skill) => (
                <div key={skill.name}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-text-primary">{skill.name}</span>
                    <span className="text-cyan">{skill.level}%</span>
                  </div>
                  <div className="h-2 bg-elevated rounded-full overflow-hidden">
                    <div className="h-full bg-cyan rounded-full transition-all" style={{ width: `${skill.level}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* Target Skills Gap */}
        <ScrollReveal delay={0.1}>
          <div className="bg-surface rounded-lg border border-border-subtle p-6">
            <h3 className="font-display font-semibold text-text-primary mb-4 flex items-center gap-2">
              <Target className="w-4 h-4 text-coral" />
              Skills to Develop
            </h3>
            <div className="space-y-3">
              {targetSkills.map((skill) => (
                <div key={skill.name}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-text-primary">{skill.name}</span>
                    <span className="text-text-muted">{skill.current}% / {skill.required}%</span>
                  </div>
                  <div className="h-2 bg-elevated rounded-full overflow-hidden relative">
                    <div className="h-full bg-coral/30 rounded-full" style={{ width: `${skill.required}%` }} />
                    <div
                      className="h-full bg-cyan rounded-full absolute top-0 left-0"
                      style={{ width: `${skill.current}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>

      {/* Learning Recommendations */}
      <ScrollReveal>
        <div className="bg-surface rounded-lg border border-border-subtle p-6">
          <h3 className="font-display font-semibold text-text-primary mb-4 flex items-center gap-2">
            <Zap className="w-4 h-4 text-cyan" />
            Recommended Learning
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {recommendations.map((rec) => (
              <div
                key={rec.title}
                className="flex items-start gap-3 p-4 bg-elevated rounded-md hover:border-cyan/20 border border-transparent transition-colors cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-lg bg-cyan/10 flex items-center justify-center flex-shrink-0">
                  <rec.icon className="w-5 h-5 text-cyan" />
                </div>
                <div className="flex-1">
                  <div className="text-text-primary text-sm font-medium group-hover:text-cyan transition-colors">
                    {rec.title}
                  </div>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-text-muted text-xs">{rec.type}</span>
                    <span className="text-text-muted text-xs">{rec.duration}</span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-text-muted group-hover:text-cyan group-hover:translate-x-1 transition-all flex-shrink-0" />
              </div>
            ))}
          </div>
        </div>
      </ScrollReveal>
    </PageLayout>
  )
}
