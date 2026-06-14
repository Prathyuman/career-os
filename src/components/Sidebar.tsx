import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  User,
  FileText,
  Github,
  BarChart3,
  Map,
  BookOpen,
  Award,
  FolderGit2,
  Briefcase,
  Search,
  MessageSquare,
  TrendingUp,
  Settings,
  Shield,
  X,
} from 'lucide-react'

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
  { icon: User, label: 'Profile', href: '/profile' },
  { icon: FileText, label: 'Resume Analyzer', href: '/resume-analyzer' },
  { icon: Github, label: 'GitHub Analyzer', href: '/github-analyzer' },
  { icon: BarChart3, label: 'Skill Gap', href: '/skill-gap' },
  { icon: Map, label: 'Roadmap', href: '/roadmap' },
  { icon: BookOpen, label: 'Courses', href: '/courses' },
  { icon: Award, label: 'Certifications', href: '/certifications' },
  { icon: FolderGit2, label: 'Projects', href: '/projects' },
  { icon: Briefcase, label: 'Internships', href: '/internships' },
  { icon: Search, label: 'Jobs', href: '/jobs' },
  { icon: MessageSquare, label: 'Interview Coach', href: '/interview' },
  { icon: TrendingUp, label: 'Progress', href: '/progress' },
  { icon: Settings, label: 'Settings', href: '/settings' },
  { icon: Shield, label: 'Admin', href: '/admin' },
]

interface SidebarProps {
  onClose?: () => void
}

export default function Sidebar({ onClose }: SidebarProps) {
  const location = useLocation()

  return (
    <aside className="w-64 h-full bg-surface/95 backdrop-blur-xl border-r border-border-subtle overflow-y-auto">
      <div className="p-4 flex items-center justify-between lg:hidden">
        <span className="font-display font-bold text-cyan">CareerOS</span>
        {onClose && (
          <button onClick={onClose} className="text-text-muted hover:text-text-primary transition-colors">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
      <nav className="p-3 space-y-1">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.href
          return (
            <Link
              key={item.href}
              to={item.href}
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-cyan/10 text-cyan'
                  : 'text-text-secondary hover:text-text-primary hover:bg-elevated'
              }`}
            >
              <item.icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-cyan' : ''}`} />
              <span className="truncate">{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
