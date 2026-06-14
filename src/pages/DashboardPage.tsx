import { useEffect, useState } from 'react'
import { auth } from '../lib/firebase'
import { Link } from 'react-router-dom'
import PageLayout from '../components/PageLayout'
import ScrollReveal from '../components/ScrollReveal'
import {
  FileText,
  Github,
  BarChart3,
  Map,
  Briefcase,
  MessageSquare,

  Award,
  BookOpen,
  ArrowRight,
  Zap,
  Target,
  Clock,
  Star,
} from 'lucide-react'

const stats = [
  { label: 'Profile Score', value: '78%', icon: Target, color: 'text-cyan', bg: 'bg-cyan/10' },
  { label: 'Skills Tracked', value: '24', icon: Star, color: 'text-blue', bg: 'bg-blue/10' },
  { label: 'Courses Completed', value: '12', icon: BookOpen, color: 'text-violet', bg: 'bg-violet/10' },
  { label: 'Applications', value: '8', icon: Briefcase, color: 'text-coral', bg: 'bg-coral/10' },
]

const quickActions = [
  { icon: FileText, label: 'Analyze Resume', desc: 'Get AI feedback', href: '/resume-analyzer', color: 'text-cyan' },
  { icon: Github, label: 'GitHub Scan', desc: 'Improve profile', href: '/github-analyzer', color: 'text-blue' },
  { icon: BarChart3, label: 'Skill Gap', desc: 'Find gaps', href: '/skill-gap', color: 'text-violet' },
  { icon: Map, label: 'Roadmap', desc: 'View plan', href: '/roadmap', color: 'text-coral' },
  { icon: Briefcase, label: 'Find Jobs', desc: 'New openings', href: '/jobs', color: 'text-cyan' },
  { icon: MessageSquare, label: 'Interview', desc: 'Practice', href: '/interview', color: 'text-blue' },
]

const recentActivity = [
  { action: 'Completed course', item: 'Advanced React Patterns', time: '2 hours ago', icon: BookOpen },
  { action: 'Resume analyzed', item: 'Score improved to 78%', time: '5 hours ago', icon: FileText },
  { action: 'New job match', item: 'Senior Frontend Engineer at Stripe', time: '1 day ago', icon: Briefcase },
  { action: 'Skill added', item: 'TypeScript proficiency', time: '2 days ago', icon: Star },
]

const upcomingTasks = [
  { task: 'Complete System Design course module', due: 'Today', icon: Clock },
  { task: 'Apply to 3 recommended jobs', due: 'Tomorrow', icon: Briefcase },
  { task: 'Update GitHub profile README', due: 'In 2 days', icon: Github },
  { task: 'Practice behavioral interview questions', due: 'In 3 days', icon: MessageSquare },
]

const recommendations = [
  { title: 'Learn Kubernetes', reason: 'In-demand for DevOps roles', icon: Target },
  { title: 'Contribute to Open Source', reason: 'Boost GitHub profile', icon: Github },
  { title: 'Get AWS Certified', reason: 'Top certification for 2025', icon: Award },
]

export default function DashboardPage() {
  const [userName, setUserName] = useState('User')

  useEffect(() => {
    const user = auth.currentUser

    if (user?.displayName) {
      setUserName(user.displayName)
    }
  }, [])

  return (
    <PageLayout title="Dashboard">
      {/* Welcome */}
      <ScrollReveal>
        <div className="bg-surface rounded-lg border border-border-subtle p-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-cyan/20 flex items-center justify-center">
              <Zap className="w-6 h-6 text-cyan" />
            </div>
            <div>
              <h2 className="font-display font-semibold text-text-primary text-lg">Welcome back, {userName}!</h2>
              <p className="text-text-secondary text-sm">You have 4 tasks due this week. Keep up the momentum!</p>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* Stats */}
      <ScrollReveal stagger={0.1} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-surface rounded-lg border border-border-subtle p-5 hover:border-cyan/20 transition-colors"
          >
            <div className={`w-10 h-10 rounded-lg ${stat.bg} flex items-center justify-center mb-3`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <div className="font-display text-2xl font-bold text-text-primary">{stat.value}</div>
            <div className="text-text-muted text-xs mt-1">{stat.label}</div>
          </div>
        ))}
      </ScrollReveal>

      {/* Quick Actions */}
      <ScrollReveal className="mb-8">
        <h3 className="font-display font-semibold text-text-primary mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {quickActions.map((action) => (
            <Link
              key={action.label}
              to={action.href}
              className="bg-surface rounded-lg border border-border-subtle p-4 text-center hover:border-cyan/20 hover:-translate-y-0.5 transition-all duration-200 group"
            >
              <div className="w-10 h-10 rounded-lg bg-elevated flex items-center justify-center mx-auto mb-2 group-hover:bg-cyan/10 transition-colors">
                <action.icon className={`w-5 h-5 ${action.color}`} />
              </div>
              <div className="text-text-primary text-sm font-medium">{action.label}</div>
              <div className="text-text-muted text-xs mt-0.5">{action.desc}</div>
            </Link>
          ))}
        </div>
      </ScrollReveal>

      {/* Two column: Activity + Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Recent Activity */}
        <ScrollReveal>
          <div className="bg-surface rounded-lg border border-border-subtle p-6">
            <h3 className="font-display font-semibold text-text-primary mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {recentActivity.map((activity, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-md bg-elevated flex items-center justify-center flex-shrink-0">
                    <activity.icon className="w-4 h-4 text-cyan" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-text-primary text-sm">{activity.action}</div>
                    <div className="text-text-secondary text-xs truncate">{activity.item}</div>
                  </div>
                  <div className="text-text-muted text-xs flex-shrink-0">{activity.time}</div>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* Upcoming Tasks */}
        <ScrollReveal delay={0.1}>
          <div className="bg-surface rounded-lg border border-border-subtle p-6">
            <h3 className="font-display font-semibold text-text-primary mb-4">Upcoming Tasks</h3>
            <div className="space-y-3">
              {upcomingTasks.map((task, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-elevated rounded-md">
                  <task.icon className="w-4 h-4 text-cyan flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-text-primary text-sm truncate">{task.task}</div>
                  </div>
                  <div className="text-coral text-xs font-medium flex-shrink-0">{task.due}</div>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>

      {/* Recommendations */}
      <ScrollReveal>
        <div className="bg-surface rounded-lg border border-border-subtle p-6">
          <h3 className="font-display font-semibold text-text-primary mb-4">AI Recommendations</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recommendations.map((rec) => (
              <div
                key={rec.title}
                className="flex items-start gap-3 p-4 bg-elevated rounded-md hover:border-cyan/20 border border-transparent transition-colors cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-lg bg-cyan/10 flex items-center justify-center flex-shrink-0">
                  <rec.icon className="w-5 h-5 text-cyan" />
                </div>
                <div>
                  <div className="text-text-primary text-sm font-medium group-hover:text-cyan transition-colors">
                    {rec.title}
                  </div>
                  <div className="text-text-muted text-xs mt-0.5">{rec.reason}</div>
                </div>
                <ArrowRight className="w-4 h-4 text-text-muted group-hover:text-cyan group-hover:translate-x-1 transition-all flex-shrink-0 mt-1" />
              </div>
            ))}
          </div>
        </div>
      </ScrollReveal>
    </PageLayout>
  )
}
