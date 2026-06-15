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
  Zap,
} from 'lucide-react'

const quickActions = [
  { icon: FileText, label: 'Analyze Resume', desc: 'Get AI feedback', href: '/resume-analyzer', color: 'text-cyan' },
  { icon: Github, label: 'GitHub Scan', desc: 'Improve profile', href: '/github-analyzer', color: 'text-blue' },
  { icon: BarChart3, label: 'Skill Gap', desc: 'Find gaps', href: '/skill-gap', color: 'text-violet' },
  { icon: Map, label: 'Roadmap', desc: 'View plan', href: '/roadmap', color: 'text-coral' },
  { icon: Briefcase, label: 'Find Jobs', desc: 'New openings', href: '/jobs', color: 'text-cyan' },
  { icon: MessageSquare, label: 'Interview', desc: 'Practice', href: '/interview', color: 'text-blue' },
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
              <p className="text-text-secondary text-sm">Track your skills, roadmap and career growth from one place.Keep up the momentum!</p>
            </div>
          </div>
        </div>
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

      

        
  

      
    </PageLayout>
  )
}
