import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Zap, Mail, ArrowLeft, CheckCircle } from 'lucide-react'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <Zap className="w-8 h-8 text-cyan" />
            <span className="font-display font-bold text-2xl text-cyan">CareerOS</span>
          </Link>
          <h1 className="font-display text-2xl font-bold text-text-primary">Reset password</h1>
          <p className="mt-2 text-text-secondary text-sm">
            {submitted ? 'Check your inbox for reset instructions.' : "Enter your email and we'll send you reset instructions."}
          </p>
        </div>

        <div className="bg-surface rounded-lg border border-border-subtle p-8">
          {submitted ? (
            <div className="text-center py-4">
              <div className="w-16 h-16 rounded-full bg-cyan/20 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-cyan" />
              </div>
              <p className="text-text-secondary text-sm mb-6">
                If an account exists for {email}, you'll receive a password reset email shortly.
              </p>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 text-cyan text-sm font-medium hover:underline"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to sign in
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">Email</label>
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

              <button
                type="submit"
                className="w-full py-2.5 rounded-pill bg-cyan text-deep font-semibold text-sm hover:brightness-110 transition-all duration-200"
              >
                Send Reset Link
              </button>
            </form>
          )}
        </div>

        <p className="text-center mt-6 text-text-muted text-sm">
          Remember your password?{' '}
          <Link to="/login" className="text-cyan hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
