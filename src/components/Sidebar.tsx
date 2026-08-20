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
  Zap
} from 'lucide-react'

const workspaceItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
  { icon: User, label: 'Candidate Profile', href: '/profile' },
]

const analysisTools = [
  { icon: FileText, label: 'Resume Analyzer', href: '/resume-analyzer', badge: 'ATS AI' },
  { icon: Github, label: 'GitHub Audit', href: '/github-analyzer' },
  { icon: BarChart3, label: 'Skill Gap Analysis', href: '/skill-gap' },
]

const executionPrep = [
  { icon: BookOpen, label: 'Courses & Skills', href: '/courses' },
  { icon: Award, label: 'Certifications', href: '/certifications' },
  { icon: FolderGit2, label: 'Project Blueprints', href: '/projects' },
  { icon: Briefcase, label: 'Internships', href: '/internships' },
  { icon: Search, label: 'Job Search', href: '/jobs' },
  { icon: MessageSquare, label: 'AI Mock Interview', href: '/interview', badge: '3-Round' },
  { icon: TrendingUp, label: 'Progress Tracking', href: '/progress' },
]

const platformSettings = [
  { icon: Settings, label: 'Settings', href: '/settings' },
  { icon: Shield, label: 'Admin Portal', href: '/admin' },
]

interface SidebarProps {
  onClose?: () => void
}

export default function Sidebar({ onClose }: SidebarProps) {
  const location = useLocation()

  const renderNavGroup = (title: string, items: typeof workspaceItems) => (
    <div className="mb-6">
      <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
        {title}
      </div>
      <div className="space-y-0.5">
        {items.map((item: any) => {
          const isActive = location.pathname === item.href
          return (
            <Link
              key={item.href}
              to={item.href}
              onClick={onClose}
              className={`group flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                isActive
                  ? 'bg-sky-50 text-sky-700 font-semibold border-l-2 border-sky-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <item.icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-sky-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
                <span className="truncate">{item.label}</span>
              </div>

              {item.badge && (
                <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold ${
                  isActive ? 'bg-sky-100 text-sky-700' : 'bg-slate-100 text-slate-500'
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
    <aside className="w-64 h-full pro-sidebar flex flex-col justify-between overflow-y-auto">
      <div>
        {/* Sidebar Brand Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-sky-600 flex items-center justify-center text-white font-bold shadow-xs">
              <Zap className="w-4 h-4 fill-current" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-sm text-slate-900 leading-tight">CareerOS</span>
              <span className="text-[10px] text-slate-500 font-mono">Enterprise Light v2.4</span>
            </div>
          </div>

          {onClose && (
            <button onClick={onClose} className="lg:hidden p-1 text-slate-400 hover:text-slate-700">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Nav Links */}
        <div className="p-3">
          {renderNavGroup('Workspace', workspaceItems)}
          {renderNavGroup('Analytics & AI', analysisTools)}
          {renderNavGroup('Career Modules', executionPrep)}
          {renderNavGroup('System', platformSettings)}
        </div>
      </div>

      {/* Footer Info */}
      <div className="p-3 m-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="font-mono text-[11px]">System Active</span>
        </div>
        <span className="text-[10px] text-slate-400 font-mono">Light Mode</span>
      </div>
    </aside>
  )
}
