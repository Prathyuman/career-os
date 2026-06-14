import { Link } from 'react-router-dom'
import { Zap, Github, Twitter, Linkedin } from 'lucide-react'

const productLinks = [
  { label: 'Features', href: '/#features' },
  { label: 'Pricing', href: '/#pricing' },
  { label: 'Changelog', href: '#' },
]

const resourceLinks = [
  { label: 'Blog', href: '#' },
  { label: 'Guides', href: '#' },
  { label: 'Community', href: '#' },
  { label: 'Support', href: '#' },
]

const companyLinks = [
  { label: 'About', href: '#' },
  { label: 'Careers', href: '#' },
  { label: 'Privacy', href: '#' },
  { label: 'Terms', href: '#' },
]

export default function Footer() {
  return (
    <footer className="bg-void border-t border-border-subtle">
      <div className="max-w-[1280px] mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <Zap className="w-5 h-5 text-cyan" />
              <span className="font-display font-bold text-lg text-cyan">CareerOS</span>
            </Link>
            <p className="text-text-secondary text-sm leading-relaxed">
              Your AI-powered Career Operating System. Analyze, plan, and accelerate your career growth.
            </p>
          </div>

          <div>
            <h4 className="font-display font-semibold text-text-primary mb-4">Product</h4>
            <ul className="space-y-3">
              {productLinks.map((link) => (
                <li key={link.label}>
                  <Link to={link.href} className="text-text-secondary text-sm hover:text-cyan transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold text-text-primary mb-4">Resources</h4>
            <ul className="space-y-3">
              {resourceLinks.map((link) => (
                <li key={link.label}>
                  <Link to={link.href} className="text-text-secondary text-sm hover:text-cyan transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold text-text-primary mb-4">Company</h4>
            <ul className="space-y-3">
              {companyLinks.map((link) => (
                <li key={link.label}>
                  <Link to={link.href} className="text-text-secondary text-sm hover:text-cyan transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border-subtle flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-text-muted text-xs">
            &copy; {new Date().getFullYear()} CareerOS. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className="text-text-muted hover:text-cyan transition-colors">
              <Github className="w-5 h-5" />
            </a>
            <a href="#" className="text-text-muted hover:text-cyan transition-colors">
              <Twitter className="w-5 h-5" />
            </a>
            <a href="#" className="text-text-muted hover:text-cyan transition-colors">
              <Linkedin className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
