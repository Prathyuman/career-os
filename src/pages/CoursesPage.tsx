
import { useState } from 'react'
import PageLayout from '../components/PageLayout'
import ScrollReveal from '../components/ScrollReveal'
import {
  Search,
  BookOpen,
} from 'lucide-react'

const categories = [
  'All',
  'Technical',
  'Leadership',
  'Design',
  'Data Science',
  'Cloud',
]

export default function CoursesPage() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [search, setSearch] = useState('')

  return (
    <PageLayout title="Courses">
      {/* Search & Filter */}
      <ScrollReveal>
        <div className="bg-surface rounded-lg border border-border-subtle p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search courses..."
                className="w-full pl-10 pr-4 py-2.5 bg-elevated border border-border-subtle rounded-md text-text-primary text-sm placeholder:text-text-muted focus:outline-none focus:border-cyan/50 transition-colors"
              />
            </div>

            <div className="flex gap-2 flex-wrap">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-2 rounded-md text-xs font-medium transition-all ${
                    activeCategory === cat
                      ? 'bg-cyan text-deep'
                      : 'bg-elevated text-text-secondary hover:text-text-primary border border-border-subtle'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* Empty State */}
      <ScrollReveal>
        <div className="bg-surface rounded-lg border border-border-subtle p-10 text-center">
          <BookOpen className="w-12 h-12 text-text-muted mx-auto mb-4" />

          <h2 className="font-display text-xl font-semibold text-text-primary mb-2">
            No Courses Available
          </h2>

          <p className="text-text-secondary text-sm max-w-md mx-auto">
            Personalized course recommendations will appear here after
            Skill Gap Analysis and Resume Analysis are completed.
          </p>

          <div className="mt-4 text-xs text-text-muted">
            Selected Category: {activeCategory}
          </div>
        </div>
      </ScrollReveal>
    </PageLayout>
  )
}