import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Zap, Mail, Lock, User, Github, ArrowRight, CheckCircle } from 'lucide-react'

export default function SignupPage() {
  const [step, setStep] = useState(1)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (step < 3) setStep(step + 1)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <Zap className="w-8 h-8 text-cyan" />
            <span className="font-display font-bold text-2xl text-cyan">CareerOS</span>
          </Link>
          <h1 className="font-display text-2xl font-bold text-text-primary">
            {step === 3 ? 'All set!' : 'Create your account'}
          </h1>
          <p className="mt-2 text-text-secondary text-sm">
            {step === 3 ? 'Welcome to CareerOS. Let\'s accelerate your career.' : `Step ${step} of 2 — Start your career journey`}
          </p>
        </div>

        {/* Progress */}
        {step < 3 && (
          <div className="flex gap-2 mb-6">
            {[1, 2].map((i) => (
              <div
                key={i}
                className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                  i <= step ? 'bg-cyan' : 'bg-elevated'
                }`}
              />
            ))}
          </div>
        )}

        <div className="bg-surface rounded-lg border border-border-subtle p-8">
          {step === 3 ? (
            <div className="text-center py-4">
              <div className="w-16 h-16 rounded-full bg-cyan/20 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-cyan" />
              </div>
              <p className="text-text-secondary text-sm mb-6">
                Your account has been created. You're ready to accelerate your career.
              </p>
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 px-8 py-3 rounded-pill bg-cyan text-deep font-semibold text-sm hover:brightness-110 transition-all"
              >
                Go to Dashboard
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {step === 1 && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full pl-10 pr-4 py-2.5 bg-elevated border border-border-subtle rounded-md text-text-primary text-sm placeholder:text-text-muted focus:outline-none focus:border-cyan/50 transition-colors"
                      />
                    </div>
                  </div>
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
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Min 8 characters"
                        className="w-full pl-10 pr-4 py-2.5 bg-elevated border border-border-subtle rounded-md text-text-primary text-sm placeholder:text-text-muted focus:outline-none focus:border-cyan/50 transition-colors"
                      />
                    </div>
                  </div>
                </>
              )}

              {step === 2 && (
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">Current or Target Role</label>
                  <p className="text-text-muted text-xs mb-4">This helps us personalize your experience.</p>
                  <div className="space-y-2">
                    {['Software Engineer', 'Product Manager', 'Data Scientist', 'UX Designer', 'DevOps Engineer', 'Student'].map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setRole(r)}
                        className={`w-full text-left px-4 py-3 rounded-md text-sm font-medium transition-all duration-200 ${
                          role === r
                            ? 'bg-cyan/10 text-cyan border border-cyan/30'
                            : 'bg-elevated text-text-secondary border border-border-subtle hover:border-cyan/20'
                        }`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 rounded-pill bg-cyan text-deep font-semibold text-sm hover:brightness-110 transition-all duration-200 flex items-center justify-center gap-2"
              >
                {step === 2 ? 'Create Account' : 'Continue'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {step === 1 && (
            <>
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border-subtle" />
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-surface px-3 text-text-muted text-xs">or sign up with</span>
                </div>
              </div>
              <button className="w-full py-2.5 rounded-md bg-elevated border border-border-subtle text-text-primary text-sm font-medium hover:bg-surface transition-colors flex items-center justify-center gap-2">
                <Github className="w-4 h-4" />
                GitHub
              </button>
            </>
          )}
        </div>

        <p className="text-center mt-6 text-text-muted text-sm">
          Already have an account?{' '}
          <Link to="/login" className="text-cyan hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
