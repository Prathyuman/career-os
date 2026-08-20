import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, Zap, Search, Bell, User, ChevronRight } from 'lucide-react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../lib/firebase'

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [userDisplayName, setUserDisplayName] = useState('')
  const [photoURL, setPhotoURL] = useState('')

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserDisplayName(user.displayName || user.email?.split('@')[0] || 'User')
        setPhotoURL(user.photoURL || '')
      }
    })
    return () => unsubscribe()
  }, [])

  const location = useLocation()
  const isAuthPage = ['/login', '/signup', '/forgot-password'].includes(location.pathname)

  if (isAuthPage) return null

  // Capitalize path for breadcrumb
  const currentSegment = location.pathname === '/' || location.pathname === '/dashboard'
    ? 'Dashboard'
    : location.pathname.substring(1).replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 h-14 pro-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-full flex items-center justify-between">
          {/* Left: Brand & Breadcrumb */}
          <div className="flex items-center gap-3">
            <Link to="/dashboard" className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-sky-600 flex items-center justify-center text-white font-bold shadow-sm">
                <Zap className="w-4 h-4 fill-current" />
              </div>
              <span className="font-bold text-sm text-slate-100 hidden sm:inline">CareerOS</span>
            </Link>

            <ChevronRight className="w-4 h-4 text-slate-600 hidden sm:inline" />

            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
              <span>{currentSegment}</span>
            </div>
          </div>

          {/* Center: Search Input Simulation */}
          <div className="hidden md:flex items-center w-72 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-400 gap-2">
            <Search className="w-3.5 h-3.5 text-slate-500" />
            <input
              type="text"
              readOnly
              placeholder="Search tools, modules, docs... (Ctrl + K)"
              className="bg-transparent border-none outline-none text-slate-300 placeholder:text-slate-500 w-full text-xs cursor-default"
            />
          </div>

          {/* Right: Actions & User Profile */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>ENTERPRISE</span>
            </div>

            <Link
              to="/profile"
              className="flex items-center gap-2 p-1 pr-2.5 rounded-lg hover:bg-slate-800 border border-transparent hover:border-slate-700 transition-all"
            >
              <div className="w-7 h-7 rounded-md overflow-hidden bg-sky-600/20 border border-sky-500/30 flex items-center justify-center text-sky-400 font-bold text-xs">
                {photoURL ? (
                  <img src={photoURL} alt="User" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  userDisplayName.charAt(0).toUpperCase()
                )}
              </div>
              <span className="text-xs font-medium text-slate-200 hidden sm:inline">{userDisplayName}</span>
            </Link>
          </div>
        </div>
      </nav>
    </>
  )
}
