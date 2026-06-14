import { useState } from 'react'
import PageLayout from '../components/PageLayout'
import ScrollReveal from '../components/ScrollReveal'
import {
  BookOpen,
  Star,
  Clock,
  Search,
  Play,
} from 'lucide-react'

const categories = ['All', 'Technical', 'Leadership', 'Design', 'Data Science', 'Cloud']

const courses = [
  { id: 1, title: 'Advanced React Patterns', provider: 'Frontend Masters', category: 'Technical', rating: 4.8, duration: '12h', enrolled: true, progress: 65, image: '🔵' },
  { id: 2, title: 'System Design Interview', provider: 'Educative', category: 'Technical', rating: 4.9, duration: '18h', enrolled: true, progress: 30, image: '🟢' },
  { id: 3, title: 'AWS Solutions Architect', provider: 'A Cloud Guru', category: 'Cloud', rating: 4.7, duration: '40h', enrolled: false, progress: 0, image: '🟠' },
  { id: 4, title: 'Product Management 101', provider: 'Reforge', category: 'Leadership', rating: 4.6, duration: '8h', enrolled: false, progress: 0, image: '🟣' },
  { id: 5, title: 'Machine Learning Fundamentals', provider: 'Coursera', category: 'Data Science', rating: 4.8, duration: '60h', enrolled: false, progress: 0, image: '🔴' },
  { id: 6, title: 'UI/UX Design Principles', provider: 'DesignLab', category: 'Design', rating: 4.5, duration: '20h', enrolled: true, progress: 85, image: '🟡' },
  { id: 7, title: 'Kubernetes for Developers', provider: 'Pluralsight', category: 'Cloud', rating: 4.7, duration: '15h', enrolled: false, progress: 0, image: '🔷' },
  { id: 8, title: 'Data Structures & Algorithms', provider: 'LeetCode', category: 'Technical', rating: 4.9, duration: '25h', enrolled: true, progress: 45, image: '🔶' },
]

export default function CoursesPage() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [search, setSearch] = useState('')

  const filtered = courses.filter((c) => {
    const matchCat = activeCategory === 'All' || c.category === activeCategory
    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

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

      {/* Course Grid */}
      <ScrollReveal stagger={0.08} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((course) => (
          <div
            key={course.id}
            className="bg-surface rounded-lg border border-border-subtle p-5 hover:border-cyan/20 transition-all duration-200 group"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-cyan/10 flex items-center justify-center text-lg">
                  <BookOpen className="w-5 h-5 text-cyan" />
                </div>
                <div>
                  <h4 className="text-text-primary text-sm font-medium group-hover:text-cyan transition-colors">
                    {course.title}
                  </h4>
                  <p className="text-text-muted text-xs">{course.provider}</p>
                </div>
              </div>
              <span className="text-xs text-text-muted bg-elevated px-2 py-1 rounded-md">{course.category}</span>
            </div>

            <div className="flex items-center gap-4 text-xs text-text-muted mb-3">
              <span className="flex items-center gap-1"><Star className="w-3 h-3 fill-cyan text-cyan" /> {course.rating}</span>
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {course.duration}</span>
            </div>

            {course.enrolled && (
              <div className="mb-3">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-text-secondary">Progress</span>
                  <span className="text-cyan">{course.progress}%</span>
                </div>
                <div className="h-1.5 bg-elevated rounded-full overflow-hidden">
                  <div className="h-full bg-cyan rounded-full" style={{ width: `${course.progress}%` }} />
                </div>
              </div>
            )}

            <div className="flex gap-2">
              {course.enrolled ? (
                <button className="flex-1 py-2 rounded-md bg-cyan text-deep text-xs font-semibold hover:brightness-110 transition-all flex items-center justify-center gap-1.5">
                  <Play className="w-3 h-3" />
                  Continue
                </button>
              ) : (
                <button className="flex-1 py-2 rounded-md border border-cyan text-cyan text-xs font-medium hover:bg-cyan/10 transition-all">
                  Enroll
                </button>
              )}
            </div>
          </div>
        ))}
      </ScrollReveal>
    </PageLayout>
  )
}
