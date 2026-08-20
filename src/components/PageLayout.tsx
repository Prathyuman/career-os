import Sidebar from './Sidebar'
import { useState } from 'react'
import { Menu, ChevronRight } from 'lucide-react'

interface PageLayoutProps {
  children: React.ReactNode
  title: string
}

export default function PageLayout({ children, title }: PageLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="pt-14 min-h-screen bg-[#090D16] text-slate-100 font-body">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block fixed left-0 top-14 h-[calc(100vh-56px)] z-40">
        <Sidebar />
      </div>

      {/* Mobile Sidebar Drawer Overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <div className="absolute left-0 top-0 h-full z-10">
            <Sidebar onClose={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Mobile Sidebar Button */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="lg:hidden fixed top-16 left-4 z-30 w-9 h-9 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center text-slate-200 shadow-md"
      >
        <Menu className="w-4 h-4" />
      </button>

      {/* Main Container */}
      <main className="lg:ml-64 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 mb-6 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-sky-400 uppercase tracking-wider mb-1 font-mono">
                <span>CareerOS</span>
                <ChevronRight className="w-3 h-3 text-slate-600" />
                <span className="text-slate-400">{title}</span>
              </div>
              <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
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
