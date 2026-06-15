import { useState } from 'react'
import PageLayout from '../components/PageLayout'
import ScrollReveal from '../components/ScrollReveal'
import {
  Search,
  Briefcase,
} from 'lucide-react'

const filters = [
  'All',
  'Remote',
  'Frontend',
  'Backend',
  'Full Stack',
  'ML/AI',
  'Management',
]

export default function JobsPage() {
  const [activeFilter, setActiveFilter] = useState('All')
  const [search, setSearch] = useState('')
  const [jobs] = useState([])

  const filtered = jobs

  return (
    <PageLayout title="Job Finder">
      {/* Search */}
      <ScrollReveal>
        <div className="bg-surface rounded-lg border border-border-subtle p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search jobs, companies, or keywords..."
                className="w-full pl-10 pr-4 py-2.5 bg-elevated border border-border-subtle rounded-md text-text-primary text-sm placeholder:text-text-muted focus:outline-none focus:border-cyan/50 transition-colors"
              />
            </div>

            <div className="flex gap-2 flex-wrap">
              {filters.map((f) => (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className={`px-3 py-2 rounded-md text-xs font-medium transition-all ${
                    activeFilter === f
                      ? 'bg-cyan text-deep'
                      : 'bg-elevated text-text-secondary hover:text-text-primary border border-border-subtle'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* Empty State */}
      <ScrollReveal>
        <div className="bg-surface rounded-lg border border-border-subtle p-8 text-center">
          <Briefcase className="w-10 h-10 text-text-muted mx-auto mb-3" />

          <h3 className="text-text-primary font-medium mb-2">
            No Jobs Available
          </h3>

          <p className="text-text-muted text-sm">
            Job recommendations will appear here after API integration.
          </p>

          <div className="mt-4 text-xs text-text-muted">
            Current Filter: {activeFilter}
          </div>

          <div className="mt-1 text-xs text-text-muted">
            Search Query: {search || 'None'}
          </div>
        </div>
      </ScrollReveal>
    </PageLayout>
  )
}