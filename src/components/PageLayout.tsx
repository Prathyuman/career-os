import Sidebar from './Sidebar'
import { useState } from 'react'
import { Menu, Sparkles, ChevronRight } from 'lucide-react'

interface PageLayoutProps {
  children: React.ReactNode
  title: string
}

export default function PageLayout({ children, title }: PageLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="pt-16 min-h-screen bg-[#070913] text-slate-100 relative overflow-hidden">
      {/* Background Ambient Mesh Glow Spheres */}
      <div className="fixed top-20 left-10 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none animate-ambient-1 z-0" />
      <div className="fixed bottom-10 right-10 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[160px] pointer-events-none animate-ambient-2 z-0" />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/5 rounded-full blur-[180px] pointer-events-none z-0" />

      {/* Desktop Sidebar */}
      <div className="hidden lg:block fixed left-0 top-16 h-[calc(100vh-64px)] z-40">
        <Sidebar />
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={() => setSidebarOpen(false)} />
          <div className="absolute left-0 top-0 h-full z-10">
            <Sidebar onClose={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Mobile Menu Trigger Button */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="lg:hidden fixed top-20 left-4 z-30 w-11 h-11 rounded-xl bg-slate-900/90 border border-white/10 flex items-center justify-center text-slate-100 hover:text-cyan-400 transition-colors shadow-2xl backdrop-blur-xl"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Main Page Area */}
      <main className="lg:ml-64 p-4 sm:p-6 lg:p-10 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Header Banner & Breadcrumbs */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 mb-8 border-b border-white/10">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-1.5 font-mono">
                <span className="flex items-center gap-1"><Sparkles className="w-3.5 h-3.5" /> CareerOS</span>
                <ChevronRight className="w-3 h-3 text-slate-600" />
                <span className="text-slate-400">{title}</span>
              </div>
              <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white flex items-center gap-3">
                {title}
              </h1>
            </div>
          </div>
          {children}
        </div>
      </main>
    </div>
  )
}
