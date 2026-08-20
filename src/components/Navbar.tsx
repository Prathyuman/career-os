import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, Zap, Sparkles, User, Settings, LogOut, Search, Bell } from 'lucide-react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../lib/firebase'

const appLinks = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Resume AI', href: '/resume-analyzer' },
  { label: 'GitHub Scan', href: '/github-analyzer' },
  { label: 'Courses', href: '/courses' },
  { label: 'Jobs', href: '/jobs' },
  { label: 'AI Interview', href: '/interview' },
]

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [userDisplayName, setUserDisplayName] = useState('')
  const [photoURL, setPhotoURL] = useState('')

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserDisplayName(user.displayName || user.email?.split('@')[0] || 'Member')
        setPhotoURL(user.photoURL || '')
      }
    })
    return () => unsubscribe()
  }, [])

  const location = useLocation()
  const isHome = location.pathname === '/'
  const isAuthPage = ['/login', '/signup', '/forgot-password'].includes(location.pathname)

  if (isAuthPage) return null

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 h-16 glass-nav shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-full flex items-center justify-between">
          {/* Logo & Brand */}
          <Link to={isHome ? '/' : '/dashboard'} className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-cyan-500/25 group-hover:scale-105 transition-transform duration-300">
              <Zap className="w-5 h-5 fill-current" />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-black text-lg tracking-tight text-white group-hover:text-cyan-400 transition-colors">
                Career<span className="text-cyan-400">OS</span>
              </span>
              <span className="text-[9px] font-mono text-cyan-400/80 tracking-widest uppercase -mt-1">
                AI Intelligence Platform
              </span>
            </div>
          </Link>

          {/* Center Navigation Links for Dashboard / App */}
          {!isHome && (
            <div className="hidden md:flex items-center gap-1 bg-white/5 p-1 rounded-2xl border border-white/10">
              {appLinks.map((link) => {
                const isActive = location.pathname === link.href
                return (
                  <Link
                    key={link.label}
                    to={link.href}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                      isActive
                        ? 'bg-cyan-500 text-slate-950 shadow-md font-bold'
                        : 'text-slate-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {link.label}
                  </Link>
                )
              })}
            </div>
          )}

          {/* Right Action Icons & Profile */}
          <div className="hidden md:flex items-center gap-4">
            {isHome ? (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="text-xs font-semibold text-slate-300 hover:text-white transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-xs hover:brightness-110 shadow-lg shadow-cyan-500/20 transition-all hover:-translate-y-0.5"
                >
                  Get Started Free
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <div className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                  <span>PRO AI ACTIVE</span>
                </div>

                <Link
                  to="/profile"
                  className="flex items-center gap-2.5 p-1.5 pr-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
                >
                  <div className="w-7 h-7 rounded-lg overflow-hidden bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center text-cyan-300 font-bold text-xs">
                    {photoURL ? (
                      <img src={photoURL} alt="User" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    ) : (
                      userDisplayName.charAt(0).toUpperCase()
                    )}
                  </div>
                  <span className="text-xs font-semibold text-slate-200">{userDisplayName}</span>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-xl bg-white/5 border border-white/10 text-slate-200"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Navigation */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-[#070913]/98 backdrop-blur-2xl flex flex-col items-center justify-center gap-6 md:hidden">
          <button
            className="absolute top-5 right-6 text-slate-300 hover:text-white"
            onClick={() => setMobileOpen(false)}
          >
            <X className="w-8 h-8" />
          </button>
          
          <div className="flex flex-col items-center gap-4">
            {appLinks.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                onClick={() => setMobileOpen(false)}
                className="font-display text-2xl font-bold text-slate-200 hover:text-cyan-400 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex flex-col items-center gap-3 mt-6">
            <Link
              to="/dashboard"
              onClick={() => setMobileOpen(false)}
              className="px-8 py-3 rounded-xl bg-cyan-500 text-slate-950 font-bold text-base shadow-lg shadow-cyan-500/25"
            >
              Open Dashboard
            </Link>
          </div>
        </div>
      )}
    </>
  )
}
