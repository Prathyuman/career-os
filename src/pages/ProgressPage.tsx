import PageLayout from '../components/PageLayout'
import ScrollReveal from '../components/ScrollReveal'
import {
  TrendingUp,
  Target,
  BookOpen,
  Award,
  Star,
  Zap,
  Calendar,
  ArrowUp,
} from 'lucide-react'

const weeklyData = [
  { day: 'Mon', hours: 3.5, tasks: 4 },
  { day: 'Tue', hours: 5.2, tasks: 6 },
  { day: 'Wed', hours: 2.8, tasks: 3 },
  { day: 'Thu', hours: 4.1, tasks: 5 },
  { day: 'Fri', hours: 6.0, tasks: 7 },
  { day: 'Sat', hours: 1.5, tasks: 2 },
  { day: 'Sun', hours: 0.5, tasks: 1 },
]

const monthlyProgress = [
  { month: 'Jan', score: 45 },
  { month: 'Feb', score: 52 },
  { month: 'Mar', score: 58 },
  { month: 'Apr', score: 64 },
  { month: 'May', score: 71 },
  { month: 'Jun', score: 78 },
]

const recentAchievements = [
  { title: 'Course Completed', desc: 'Advanced React Patterns', date: '2 days ago', icon: BookOpen, color: 'text-cyan' },
  { title: 'Skill Milestone', desc: 'TypeScript proficiency reached 75%', date: '1 week ago', icon: Star, color: 'text-violet' },
  { title: 'Certification', desc: 'AWS Cloud Practitioner earned', date: '2 weeks ago', icon: Award, color: 'text-cyan' },
  { title: 'Application Sent', desc: 'Applied to 3 Senior Frontend roles', date: '3 weeks ago', icon: Zap, color: 'text-coral' },
]

const skillGrowth = [
  { skill: 'JavaScript', before: 75, after: 90, change: +15 },
  { skill: 'React', before: 70, after: 85, change: +15 },
  { skill: 'TypeScript', before: 45, after: 75, change: +30 },
  { skill: 'System Design', before: 30, after: 55, change: +25 },
  { skill: 'Leadership', before: 50, after: 65, change: +15 },
]

export default function ProgressPage() {
  return (
    <PageLayout title="Progress Dashboard">
      {/* Summary Stats */}
      <ScrollReveal stagger={0.1} className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Career Score', value: '78', change: '+12', icon: Target, color: 'text-cyan' },
          { label: 'Hours This Week', value: '23.6', change: '+5.2', icon: Calendar, color: 'text-blue' },
          { label: 'Courses Done', value: '12', change: '+3', icon: BookOpen, color: 'text-violet' },
          { label: 'Skills Gained', value: '8', change: '+2', icon: Star, color: 'text-coral' },
        ].map((stat) => (
          <div key={stat.label} className="bg-surface rounded-lg border border-border-subtle p-5">
            <div className="flex items-center justify-between mb-2">
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
              <span className="text-xs text-cyan flex items-center gap-0.5">
                <ArrowUp className="w-3 h-3" />
                {stat.change}
              </span>
            </div>
            <div className="font-display text-2xl font-bold text-text-primary">{stat.value}</div>
            <div className="text-text-muted text-xs">{stat.label}</div>
          </div>
        ))}
      </ScrollReveal>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Weekly Activity */}
        <ScrollReveal>
          <div className="bg-surface rounded-lg border border-border-subtle p-6">
            <h3 className="font-display font-semibold text-text-primary mb-4 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-cyan" />
              Weekly Activity
            </h3>
            <div className="flex items-end gap-3 h-48">
              {weeklyData.map((d) => (
                <div key={d.day} className="flex-1 flex flex-col items-center gap-2">
                  <div className="relative w-full flex flex-col items-center">
                    <span className="text-xs text-text-muted mb-1">{d.hours}h</span>
                    <div
                      className="w-full bg-cyan/30 rounded-t-md transition-all hover:bg-cyan/50"
                      style={{ height: `${(d.hours / 6) * 140}px` }}
                    />
                  </div>
                  <span className="text-text-muted text-xs">{d.day}</span>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* Career Score Trend */}
        <ScrollReveal delay={0.1}>
          <div className="bg-surface rounded-lg border border-border-subtle p-6">
            <h3 className="font-display font-semibold text-text-primary mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-cyan" />
              Career Score Trend
            </h3>
            <div className="flex items-end gap-3 h-48">
              {monthlyProgress.map((m) => (
                <div key={m.month} className="flex-1 flex flex-col items-center gap-2">
                  <div className="relative w-full flex flex-col items-center">
                    <span className="text-xs text-text-muted mb-1">{m.score}</span>
                    <div
                      className="w-full bg-cyan/30 rounded-t-md transition-all hover:bg-cyan/50"
                      style={{ height: `${(m.score / 100) * 140}px` }}
                    />
                  </div>
                  <span className="text-text-muted text-xs">{m.month}</span>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>

      {/* Skill Growth */}
      <ScrollReveal className="mb-6">
        <div className="bg-surface rounded-lg border border-border-subtle p-6">
          <h3 className="font-display font-semibold text-text-primary mb-4 flex items-center gap-2">
            <Zap className="w-4 h-4 text-cyan" />
            Skill Growth (Last 6 Months)
          </h3>
          <div className="space-y-4">
            {skillGrowth.map((skill) => (
              <div key={skill.skill}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-text-primary">{skill.skill}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-text-muted text-xs">{skill.before}%</span>
                    <ArrowUp className="w-3 h-3 text-cyan" />
                    <span className="text-cyan text-xs font-medium">+{skill.change}</span>
                    <span className="text-cyan font-medium">{skill.after}%</span>
                  </div>
                </div>
                <div className="h-2 bg-elevated rounded-full overflow-hidden relative">
                  <div className="h-full bg-coral/20 rounded-full" style={{ width: `${skill.after}%` }} />
                  <div
                    className="h-full bg-cyan rounded-full absolute top-0 left-0"
                    style={{ width: `${skill.before}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </ScrollReveal>

      {/* Recent Achievements */}
      <ScrollReveal>
        <div className="bg-surface rounded-lg border border-border-subtle p-6">
          <h3 className="font-display font-semibold text-text-primary mb-4 flex items-center gap-2">
            <Award className="w-4 h-4 text-cyan" />
            Recent Achievements
          </h3>
          <div className="space-y-3">
            {recentAchievements.map((a) => (
              <div key={a.title} className="flex items-start gap-3 p-3 bg-elevated rounded-md">
                <div className="w-9 h-9 rounded-lg bg-cyan/10 flex items-center justify-center flex-shrink-0">
                  <a.icon className={`w-4 h-4 ${a.color}`} />
                </div>
                <div className="flex-1">
                  <div className="text-text-primary text-sm font-medium">{a.title}</div>
                  <div className="text-text-secondary text-xs">{a.desc}</div>
                </div>
                <div className="text-text-muted text-xs flex-shrink-0">{a.date}</div>
              </div>
            ))}
          </div>
        </div>
      </ScrollReveal>
    </PageLayout>
  )
}
