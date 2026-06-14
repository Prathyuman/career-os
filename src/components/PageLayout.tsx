import Sidebar from './Sidebar'
import { useState } from 'react'
import { Menu } from 'lucide-react'

interface PageLayoutProps {
  children: React.ReactNode
  title: string
}

export default function PageLayout({ children, title }: PageLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="pt-16 min-h-screen">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block fixed left-0 top-16 h-[calc(100vh-64px)] z-40">
        <Sidebar />
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <div className="absolute left-0 top-0 h-full z-10">
            <Sidebar onClose={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Mobile menu button */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="lg:hidden fixed top-20 left-4 z-30 w-10 h-10 rounded-lg bg-surface border border-border-subtle flex items-center justify-center text-text-primary hover:text-cyan transition-colors shadow-lg"
      >
        <Menu className="w-5 h-5" />
      </button>

      <main className="lg:ml-64 p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="font-display text-2xl md:text-3xl font-bold text-text-primary mb-6 md:mb-8">{title}</h1>
          {children}
        </div>
      </main>
    </div>
  )
}
