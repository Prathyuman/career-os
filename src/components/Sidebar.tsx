import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  User,
  FileText,
  Github,
  BarChart3,
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
  Zap,
  Sparkles
} from 'lucide-react'

const mainNavItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard', color: 'text-cyan-400' },
  { icon: User, label: 'Profile', href: '/profile', color: 'text-blue-400' },
]

const analysisTools = [
  { icon: FileText, label: 'Resume Analyzer', href: '/resume-analyzer', color: 'text-emerald-400', badge: 'ATS AI' },
  { icon: Github, label: 'GitHub Analyzer', href: '/github-analyzer', color: 'text-purple-400' },
  { icon: BarChart3, label: 'Skill Gap', href: '/skill-gap', color: 'text-amber-400' },
]

const learningCareer = [
  { icon: BookOpen, label: 'Courses', href: '/courses', color: 'text-cyan-400' },
  { icon: Award, label: 'Certifications', href: '/certifications', color: 'text-amber-400' },
  { icon: FolderGit2, label: 'Projects', href: '/projects', color: 'text-blue-400' },
  { icon: Briefcase, label: 'Internships', href: '/internships', color: 'text-emerald-400' },
  { icon: Search, label: 'Job Search', href: '/jobs', color: 'text-indigo-400' },
  { icon: MessageSquare, label: 'AI Interview Coach', href: '/interview', color: 'text-cyan-400', badge: '3-Round' },
  { icon: TrendingUp, label: 'Progress Tracking', href: '/progress', color: 'text-purple-400' },
]

const systemItems = [
  { icon: Settings, label: 'Settings', href: '/settings', color: 'text-slate-400' },
  { icon: Shield, label: 'Admin Portal', href: '/admin', color: 'text-rose-400' },
]

interface SidebarProps {
  onClose?: () => void
}

export default function Sidebar({ onClose }: SidebarProps) {
  const location = useLocation()

  const renderSection = (title: string, items: typeof mainNavItems) => (
    <div className="mb-6">
      <div className="px-3 mb-2 flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-500 font-mono">
        <span>{title}</span>
      </div>
      <div className="space-y-1">
        {items.map((item: any) => {
          const isActive = location.pathname === item.href
          return (
            <Link
              key={item.href}
              to={item.href}
              onClick={onClose}
              className={`group relative flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-500/20 via-indigo-500/15 to-transparent text-cyan-300 border border-cyan-500/30 shadow-lg shadow-cyan-500/10'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-white/5 border border-transparent'
              }`}
            >
              {/* Active Indicator Bar */}
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-cyan-400 rounded-r-full shadow-lg shadow-cyan-400" />
              )}

              <div className="flex items-center gap-3">
                <div className={`p-1.5 rounded-lg transition-all ${
                  isActive ? 'bg-cyan-500/20 text-cyan-300' : 'bg-white/5 text-slate-400 group-hover:text-cyan-400 group-hover:bg-cyan-500/10'
                }`}>
                  <item.icon className="w-4 h-4" />
                </div>
                <span>{item.label}</span>
              </div>

              {item.badge && (
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                  isActive
                    ? 'bg-cyan-400 text-slate-950'
                    : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                }`}>
                  {item.badge}
                </span>
              )}
            </Link>
          )
        })}
      </div>
    </div>
  )

  return (
    <aside className="w-64 h-full bg-[#0B0F24]/90 backdrop-blur-2xl border-r border-white/10 flex flex-col justify-between overflow-y-auto">
      <div>
        {/* Mobile Sidebar Header */}
        <div className="p-4 flex items-center justify-between border-b border-white/10 lg:hidden">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-cyan-400" />
            <span className="font-display font-bold text-lg text-cyan-400">CareerOS</span>
          </div>
          {onClose && (
            <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Sidebar Nav Sections */}
        <div className="p-4">
          {renderSection('Overview', mainNavItems)}
          {renderSection('AI Analyzers', analysisTools)}
          {renderSection('Career & Learning', learningCareer)}
          {renderSection('Account', systemItems)}
        </div>
      </div>

      {/* Footer Banner */}
      <div className="p-4 m-3 rounded-2xl bg-gradient-to-br from-cyan-500/10 via-purple-500/10 to-transparent border border-cyan-500/20 text-center">
        <div className="flex items-center justify-center gap-1.5 text-cyan-400 text-xs font-bold mb-1">
          <Sparkles className="w-3.5 h-3.5" /> CareerOS PRO
        </div>
        <p className="text-[11px] text-slate-400 mb-2">AI Career Intelligence Active</p>
        <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
          <div className="w-3/4 h-full bg-gradient-to-r from-cyan-400 to-indigo-500 rounded-full" />
        </div>
      </div>
    </aside>
  )
}
