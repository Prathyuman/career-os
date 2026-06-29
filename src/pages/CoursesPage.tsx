import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import PageLayout from '../components/PageLayout'
import ScrollReveal from '../components/ScrollReveal'
import { Search, BookOpen } from 'lucide-react'
import { db, auth } from '../lib/firebase'
import { doc, getDoc } from 'firebase/firestore'

const categories = [
  'All',
  'Technical',
  'Leadership',
  'Design',
  'Data Science',
  'Cloud',
]

export default function CoursesPage() {
  const navigate = useNavigate()

  const [activeCategory, setActiveCategory] = useState('All')
  const [search, setSearch] = useState('')
  const [courses, setCourses] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const user = auth.currentUser

        if (!user) {
          setLoading(false)
          return
        }

        // Fetch learning roadmap
        const resumeRef = doc(db, 'resumeAnalysis', user.uid)
        const resumeSnap = await getDoc(resumeRef)

        if (resumeSnap.exists()) {
          const data = resumeSnap.data()

          if (data.learningRoadmap) {
            setCourses(data.learningRoadmap)
          }
        }
      } catch (error) {
        console.error('Error fetching courses:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCourses()
  }, [])

  // Course Links
  const getCourseLink = (course: string) => {
    const lower = course.toLowerCase()

    if (lower.includes('python'))
      return 'https://www.coursera.org/learn/python'

    if (lower.includes('react'))
      return 'https://react.dev/learn'

    if (lower.includes('dsa'))
      return 'https://takeuforward.org/strivers-a2z-dsa-course/'

    if (lower.includes('web'))
      return 'https://www.freecodecamp.org/learn'

    if (lower.includes('database'))
      return 'https://www.coursera.org/specializations/database-systems'

    if (lower.includes('git'))
      return 'https://www.coursera.org/learn/introduction-git-github'

    if (lower.includes('aws'))
      return 'https://aws.amazon.com/training/'

    return 'https://www.coursera.org/'
  }

  // Search Filter
  const filteredCourses = courses.filter((course) =>
    course.toLowerCase().includes(search.toLowerCase())
  )

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

      {/* Courses Section */}
      <ScrollReveal>
        {loading ? (
          <div className="bg-surface rounded-lg border border-border-subtle p-10 text-center">
            <p className="text-text-secondary">
              Loading courses...
            </p>
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="bg-surface rounded-lg border border-border-subtle p-10 text-center">
            <BookOpen className="w-12 h-12 text-text-muted mx-auto mb-4" />

            <h2 className="font-display text-xl font-semibold text-text-primary mb-2">
              No Courses Available
            </h2>

            <p className="text-text-secondary text-sm max-w-md mx-auto">
              Personalized course recommendations will appear here
              after Resume Analysis is completed.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course, index) => (
              <div
                key={index}
                className="bg-surface rounded-lg border border-border-subtle p-6 hover:border-cyan/50 transition-all"
              >
                <BookOpen className="w-10 h-10 text-cyan mb-4" />

                <h3 className="text-lg font-semibold text-text-primary mb-2">
                  {course}
                </h3>

                <p className="text-sm text-text-secondary mb-4">
                  Recommended based on your Resume Analysis and Skill Gap
                  Analysis.
                </p>

                <div className="space-y-3">
                  <button
                    onClick={() =>
                      window.open(getCourseLink(course), '_blank')
                    }
                    className="w-full py-2 rounded-md bg-indigo-600 text-white font-medium hover:opacity-90"
                  >
                    Start Learning
                  </button>

                  <button
                    onClick={() => navigate('/certifications')}
                    className="w-full py-2 rounded-md bg-elevated text-text-primary border border-border-subtle hover:border-cyan/50"
                  >
                    Upload Certificate
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollReveal>
    </PageLayout>
  )
}