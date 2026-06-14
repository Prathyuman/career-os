import { useState } from 'react'
import PageLayout from '../components/PageLayout'
import ScrollReveal from '../components/ScrollReveal'
import {
  MapPin,
  Clock,
  DollarSign,
  Search,
  Bookmark,
  ExternalLink,
} from 'lucide-react'

const internships = [
  {
    id: 1,
    title: 'Software Engineering Intern',
    company: 'Google',
    location: 'Mountain View, CA',
    type: 'Summer 2025',
    salary: '$8,000/mo',
    posted: '2 days ago',
    tags: ['Python', 'Go', 'Distributed Systems'],
    saved: false,
    match: 95,
  },
  {
    id: 2,
    title: 'Frontend Engineering Intern',
    company: 'Stripe',
    location: 'San Francisco, CA',
    type: 'Summer 2025',
    salary: '$9,500/mo',
    posted: '1 week ago',
    tags: ['React', 'TypeScript', 'UI Engineering'],
    saved: true,
    match: 92,
  },
  {
    id: 3,
    title: 'ML Engineering Intern',
    company: 'OpenAI',
    location: 'San Francisco, CA',
    type: 'Summer 2025',
    salary: '$10,000/mo',
    posted: '3 days ago',
    tags: ['Python', 'PyTorch', 'LLMs'],
    saved: false,
    match: 78,
  },
  {
    id: 4,
    title: 'Product Management Intern',
    company: 'Microsoft',
    location: 'Seattle, WA (Remote)',
    type: 'Summer 2025',
    salary: '$7,500/mo',
    posted: '5 days ago',
    tags: ['Product Strategy', 'Analytics', 'SQL'],
    saved: false,
    match: 65,
  },
  {
    id: 5,
    title: 'Data Science Intern',
    company: 'Netflix',
    location: 'Los Gatos, CA',
    type: 'Summer 2025',
    salary: '$9,000/mo',
    posted: '1 day ago',
    tags: ['Python', 'SQL', 'Statistics'],
    saved: false,
    match: 70,
  },
  {
    id: 6,
    title: 'DevOps Engineering Intern',
    company: 'Amazon',
    location: 'Seattle, WA',
    type: 'Summer 2025',
    salary: '$8,500/mo',
    posted: '4 days ago',
    tags: ['AWS', 'Docker', 'Kubernetes'],
    saved: true,
    match: 82,
  },
]

const filters = ['All', 'Software Engineering', 'Data Science', 'Product', 'DevOps', 'Design']

export default function InternshipsPage() {
  const [activeFilter, setActiveFilter] = useState('All')
  const [search, setSearch] = useState('')

  const filtered = internships.filter((i) => {
    const matchFilter = activeFilter === 'All' || i.title.toLowerCase().includes(activeFilter.toLowerCase())
    const matchSearch = i.title.toLowerCase().includes(search.toLowerCase()) || i.company.toLowerCase().includes(search.toLowerCase())
    return matchFilter && matchSearch
  })

  return (
    <PageLayout title="Internship Finder">
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
                placeholder="Search internships..."
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

      {/* Listings */}
      <ScrollReveal stagger={0.06} className="space-y-3">
        {filtered.map((internship) => (
          <div
            key={internship.id}
            className="bg-surface rounded-lg border border-border-subtle p-5 hover:border-cyan/20 transition-all duration-200 group"
          >
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h4 className="text-text-primary text-sm font-medium group-hover:text-cyan transition-colors">
                    {internship.title}
                  </h4>
                  <span className="text-xs bg-cyan/10 text-cyan px-2 py-0.5 rounded-pill font-medium">
                    {internship.match}% match
                  </span>
                </div>
                <p className="text-text-secondary text-sm font-medium">{internship.company}</p>
                <div className="flex flex-wrap items-center gap-4 mt-2 text-text-muted text-xs">
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {internship.location}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {internship.type}</span>
                  <span className="flex items-center gap-1"><DollarSign className="w-3 h-3" /> {internship.salary}</span>
                  <span>{internship.posted}</span>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {internship.tags.map((tag) => (
                    <span key={tag} className="px-2 py-0.5 rounded-pill bg-elevated text-text-muted text-xs">{tag}</span>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button className="w-8 h-8 rounded-md bg-elevated flex items-center justify-center text-text-muted hover:text-cyan transition-colors">
                  <Bookmark className={`w-4 h-4 ${internship.saved ? 'fill-cyan text-cyan' : ''}`} />
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
