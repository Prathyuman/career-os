import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, Zap } from 'lucide-react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../lib/firebase'
const navLinks = [
  { label: 'Features', href: '/#features' },
  { label: 'Simulator', href: '/#simulator' },
  { label: 'Pricing', href: '/#pricing' },
]

const appLinks = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Resume', href: '/resume-analyzer' },
  { label: 'GitHub', href: '/github-analyzer' },
  { label: 'Roadmap', href: '/roadmap' },
  { label: 'Jobs', href: '/jobs' },
  { label: 'Interview', href: '/interview' },
]

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [photoURL, setPhotoURL] = useState('')

useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    setPhotoURL(user?.photoURL || '')
  })

  return () => unsubscribe()
}, [])
  const location = useLocation()
  const isHome = location.pathname === '/'
  const isAppPage = location.pathname !== '/' && !['/login', '/signup', '/forgot-password'].includes(location.pathname)

  const links = isAppPage ? appLinks : navLinks

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 h-16 glass">
        <div className="max-w-[1280px] mx-auto px-6 h-full flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Zap className="w-6 h-6 text-cyan" />
            <span className="font-display font-bold text-xl text-cyan">CareerOS</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {links.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors duration-200 tracking-wide"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-4">
            {isHome ? (
              <>
                <Link
                  to="/login"
                  className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="px-5 py-2 rounded-pill bg-cyan text-deep font-semibold text-sm hover:brightness-110 transition-all duration-200 hover:-translate-y-0.5"
                >
                  Get Started
                </Link>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link
  to="/profile"
  className="w-8 h-8 rounded-full overflow-hidden bg-surface border border-border-subtle hover:border-cyan/30 transition-colors"
>
  {photoURL ? (
    <img
      src={photoURL}
      alt="Profile"
      className="w-full h-full object-cover"
      referrerPolicy="no-referrer"
    />
  ) : (
    <div className="w-full h-full flex items-center justify-center text-xs font-semibold text-cyan">
      U
    </div>
  )}
</Link>
                <Link
                  to="/settings"
                  className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
                >
                  Settings
                </Link>
              </div>
            )}
          </div>

          <button
            className="md:hidden text-text-primary"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-void/98 flex flex-col items-center justify-center gap-8 md:hidden">
          <button
            className="absolute top-5 right-6 text-text-primary"
            onClick={() => setMobileOpen(false)}
          >
            <X className="w-8 h-8" />
          </button>
          {links.map((link) => (
            <Link
              key={link.label}
              to={link.href}
              onClick={() => setMobileOpen(false)}
              className="font-display text-3xl font-semibold text-text-primary hover:text-cyan transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <div className="flex flex-col items-center gap-4 mt-4">
            <Link
              to="/login"
              onClick={() => setMobileOpen(false)}
              className="text-lg text-text-secondary hover:text-text-primary transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              onClick={() => setMobileOpen(false)}
              className="px-8 py-3 rounded-pill bg-cyan text-deep font-semibold text-lg"
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </>
  )
}
