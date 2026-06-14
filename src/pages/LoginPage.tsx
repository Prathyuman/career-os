import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Zap, Mail, Lock, Github, ArrowRight } from 'lucide-react'
import { signInWithGoogle } from '../lib/auth'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const navigate = useNavigate()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
  }

  const handleGoogleLogin = async () => {
    try {
      const user = await signInWithGoogle()

      console.log('Logged in:', user)

      alert(`Welcome ${user?.displayName}`)

      navigate('/dashboard')
    } catch (error) {
      console.error(error)
      alert('Google Login Failed')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <Zap className="w-8 h-8 text-cyan" />
            <span className="font-display font-bold text-2xl text-cyan">
              CareerOS
            </span>
          </Link>

          <h1 className="font-display text-2xl font-bold text-text-primary">
            Welcome back
          </h1>

          <p className="mt-2 text-text-secondary text-sm">
            Sign in to continue your career journey
          </p>
        </div>

        <div className="bg-surface rounded-lg border border-border-subtle p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Email
              </label>

              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-elevated border border-border-subtle rounded-md text-text-primary text-sm placeholder:text-text-muted focus:outline-none focus:border-cyan/50 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Password
              </label>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />

                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-4 py-2.5 bg-elevated border border-border-subtle rounded-md text-text-primary text-sm placeholder:text-text-muted focus:outline-none focus:border-cyan/50 transition-colors"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-border-subtle bg-elevated accent-cyan"
                />
                <span className="text-text-muted text-xs">
                  Remember me
                </span>
              </label>

              <Link
                to="/forgot-password"
                className="text-cyan text-xs hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-pill bg-cyan text-deep font-semibold text-sm hover:brightness-110 transition-all duration-200 flex items-center justify-center gap-2"
            >
              Sign In
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border-subtle" />
            </div>

            <div className="relative flex justify-center">
              <span className="bg-surface px-3 text-text-muted text-xs">
                or continue with
              </span>
            </div>
          </div>

          <button
            onClick={handleGoogleLogin}
            className="w-full py-2.5 rounded-md bg-elevated border border-border-subtle text-text-primary text-sm font-medium hover:bg-surface transition-colors flex items-center justify-center gap-2"
          >
            <Github className="w-4 h-4" />
            Continue with Google
          </button>
        </div>

        <p className="text-center mt-6 text-text-muted text-sm">
          Don't have an account?{' '}
          <Link to="/signup" className="text-cyan hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}