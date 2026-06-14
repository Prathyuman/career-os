import { useState } from 'react'
import PageLayout from '../components/PageLayout'
import ScrollReveal from '../components/ScrollReveal'
import {
  Search,
  MapPin,
  DollarSign,
  Clock,
  Bookmark,
  ExternalLink,
  Briefcase,
  TrendingUp,
  Building2,
} from 'lucide-react'

const jobs = [
  { id: 1, title: 'Senior Frontend Engineer', company: 'Stripe', location: 'San Francisco, CA', salary: '$180k - $240k', posted: '2 days ago', type: 'Full-time', tags: ['React', 'TypeScript', 'Node.js'], match: 94, applicants: 45 },
  { id: 2, title: 'Staff Software Engineer', company: 'Netflix', location: 'Los Gatos, CA', salary: '$250k - $350k', posted: '1 week ago', type: 'Full-time', tags: ['Java', 'Python', 'Distributed Systems'], match: 82, applicants: 89 },
  { id: 3, title: 'Full Stack Developer', company: 'Vercel', location: 'Remote', salary: '$160k - $220k', posted: '3 days ago', type: 'Full-time', tags: ['Next.js', 'React', 'Edge'], match: 91, applicants: 67 },
  { id: 4, title: 'Engineering Manager', company: 'Shopify', location: 'Remote (US)', salary: '$200k - $280k', posted: '5 days ago', type: 'Full-time', tags: ['Leadership', 'Ruby', 'React'], match: 75, applicants: 34 },
  { id: 5, title: 'Senior React Developer', company: 'Airbnb', location: 'San Francisco, CA', salary: '$170k - $230k', posted: '1 day ago', type: 'Full-time', tags: ['React', 'GraphQL', 'TypeScript'], match: 96, applicants: 112 },
  { id: 6, title: 'ML Engineer', company: 'OpenAI', location: 'San Francisco, CA', salary: '$300k - $450k', posted: '4 days ago', type: 'Full-time', tags: ['Python', 'PyTorch', 'LLMs'], match: 68, applicants: 234 },
]

const filters = ['All', 'Remote', 'Frontend', 'Backend', 'Full Stack', 'ML/AI', 'Management']

export default function JobsPage() {
  const [activeFilter, setActiveFilter] = useState('All')
  const [search, setSearch] = useState('')

  const filtered = jobs.filter((j) => {
    const matchFilter = activeFilter === 'All' || j.tags.some((t) => t.toLowerCase().includes(activeFilter.toLowerCase())) || (activeFilter === 'Remote' && j.location.toLowerCase().includes('remote'))
    const matchSearch = j.title.toLowerCase().includes(search.toLowerCase()) || j.company.toLowerCase().includes(search.toLowerCase())
    return matchFilter && matchSearch
  })

  return (
    <PageLayout title="Job Finder">
      {/* Stats */}
      <ScrollReveal>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'New Jobs Today', value: '24', icon: Briefcase },
            { label: 'Saved Jobs', value: '8', icon: Bookmark },
            { label: 'Applications', value: '5', icon: ExternalLink },
            { label: 'Avg. Match', value: '84%', icon: TrendingUp },
          ].map((stat) => (
            <div key={stat.label} className="bg-surface rounded-lg border border-border-subtle p-4 text-center">
              <stat.icon className="w-5 h-5 text-cyan mx-auto mb-1" />
              <div className="font-display text-xl font-bold text-text-primary">{stat.value}</div>
              <div className="text-text-muted text-xs">{stat.label}</div>
            </div>
          ))}
        </div>
      </ScrollReveal>

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
                    activeFilter === f ? 'bg-cyan text-deep' : 'bg-elevated text-text-secondary hover:text-text-primary border border-border-subtle'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* Job Listings */}
      <ScrollReveal stagger={0.06} className="space-y-3">
        {filtered.map((job) => (
          <div
            key={job.id}
            className="bg-surface rounded-lg border border-border-subtle p-5 hover:border-cyan/20 transition-all duration-200 group"
          >
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h4 className="text-text-primary text-sm font-medium group-hover:text-cyan transition-colors">
                    {job.title}
                  </h4>
                  <span className="text-xs bg-cyan/10 text-cyan px-2 py-0.5 rounded-pill font-medium">
                    {job.match}% match
                  </span>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <Building2 className="w-3.5 h-3.5 text-text-muted" />
                  <span className="text-text-secondary text-sm">{job.company}</span>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-text-muted text-xs">
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {job.location}</span>
                  <span className="flex items-center gap-1"><DollarSign className="w-3 h-3" /> {job.salary}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {job.posted}</span>
                  <span className="bg-elevated px-2 py-0.5 rounded-md">{job.type}</span>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {job.tags.map((tag) => (
                    <span key={tag} className="px-2 py-0.5 rounded-pill bg-elevated text-text-muted text-xs">{tag}</span>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-text-muted text-xs">{job.applicants} applicants</span>
                <button className="w-8 h-8 rounded-md bg-elevated flex items-center justify-center text-text-muted hover:text-cyan transition-colors">
                  <Bookmark className="w-4 h-4" />
                </button>
                <button className="px-4 py-2 rounded-md bg-cyan text-deep text-xs font-semibold hover:brightness-110 transition-all flex items-center gap-1.5">
                  Apply
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </ScrollReveal>
    </PageLayout>
  )
}
