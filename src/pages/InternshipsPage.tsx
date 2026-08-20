import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import PageLayout from '../components/PageLayout'
import ScrollReveal from '../components/ScrollReveal'
import {
  Search,
  Briefcase,
  MapPin,
  IndianRupee,
  Bookmark,
  TrendingUp,
  Lock,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  BookOpen,
  FolderGit2,
  FileText,
} from 'lucide-react'
import { auth, db } from '../lib/firebase'
import { getInternships } from '../services/internshipService'
import { getDetailedProgressBreakdown } from '../lib/progressScore'
import {
  collection,
  addDoc,
  deleteDoc,
  getDocs,
  onSnapshot,
  query,
  where,
  doc,
} from 'firebase/firestore'

const filters = [
  'All',
  'Software Engineering',
  'Data Science',
  'Product',
  'DevOps',
  'Design',
]

interface Internship {
  company: string
  role: string
  category: string
  location: string
  stipend: string
  skills: string[]
  applyLink: string
}

export default function InternshipsPage() {
  const [activeFilter, setActiveFilter] = useState('All')
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [apiInternships, setApiInternships] = useState<Internship[]>([])
  const [loadingInternships, setLoadingInternships] = useState(true)
  const [savedInternships, setSavedInternships] = useState<string[]>([])
  const [userSkills, setUserSkills] = useState<string[]>([])
  const [targetRole, setTargetRole] = useState('')
  const [progressData, setProgressData] = useState<any>(null)
  const [isGated, setIsGated] = useState(false)

  const fetchSavedInternships = async (user: NonNullable<typeof auth.currentUser>) => {
    try {
      const q = query(
        collection(db, 'savedInternships'),
        where('userId', '==', user.uid)
      )
      const snapshot = await getDocs(q)
      const roles = snapshot.docs.map((docSnap) => docSnap.data().role)
      setSavedInternships(roles)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) fetchSavedInternships(user)
    })
    return () => unsubscribe()
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search.trim()), 500)
    return () => clearTimeout(timer)
  }, [search])

  // Load internships when unlocked
  useEffect(() => {
    let cancelled = false
    const loadInternships = async () => {
      if (isGated) return
      setLoadingInternships(true)
      const queryText = debouncedSearch || targetRole || undefined
      try {
        const internships = await getInternships(queryText)
        if (!cancelled) {
          setApiInternships(internships)
        }
      } catch (e) {
        console.error(e)
      } finally {
        if (!cancelled) setLoadingInternships(false)
      }
    }

    loadInternships()
    return () => {
      cancelled = true
    }
  }, [debouncedSearch, targetRole, isGated])

  // Realtime user data & progress score
  useEffect(() => {
    let unsubscribeSnapshot: (() => void) | undefined

    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (unsubscribeSnapshot) {
        unsubscribeSnapshot()
        unsubscribeSnapshot = undefined
      }

      if (!user) {
        setUserSkills([])
        setTargetRole('')
        setIsGated(true)
        return
      }

      unsubscribeSnapshot = onSnapshot(
        doc(db, 'resumeAnalysis', user.uid),
        async (snap) => {
          let resumeData: any = {}
          if (snap.exists()) {
            resumeData = snap.data()
          }

          // Fetch completed projects count
          let completedProjectsCount = 0
          try {
            const projectsSnap = await getDocs(
              query(collection(db, 'completedProjects'), where('userId', '==', user.uid))
            )
            completedProjectsCount = projectsSnap.size
          } catch (e) {
            console.error(e)
          }

          const foundSkills: string[] = resumeData.currentSkills || resumeData.foundSkills || []
          const totalCourses: number = resumeData.learningRoadmap?.length || 5
          const completedCoursesCount: number = resumeData.completedCourses?.length || 0

          setUserSkills(foundSkills)
          setTargetRole(resumeData.targetRole || resumeData.recommendedRoles?.[0] || '')

          const breakdown = getDetailedProgressBreakdown({
            careerReadinessScore: resumeData.careerReadinessScore,
            atsScore: resumeData.atsCompatibility,
            totalCourses,
            completedCoursesCount,
            totalProjects: 3,
            completedProjectsCount,
            resumeUpdatedAt: resumeData.analyzedAt,
          })

          setProgressData(breakdown)
          setIsGated(breakdown.score < 70)
        },
        (error) => {
          console.error('Failed to load resume analysis:', error)
        }
      )
    })

    return () => {
      unsubscribeAuth()
      if (unsubscribeSnapshot) unsubscribeSnapshot()
    }
  }, [])

  const calculateMatchScore = (requiredSkills: string[]) => {
    if (!requiredSkills || requiredSkills.length === 0) return 0
    const matched = requiredSkills.filter((s) => userSkills.includes(s))
    return Math.round((matched.length / requiredSkills.length) * 100)
  }

  const getMissingSkills = (requiredSkills: string[]) => {
    return requiredSkills.filter((s) => !userSkills.includes(s))
  }

  const toggleBookmark = async (internship: Internship) => {
    const user = auth.currentUser
    if (!user) return

    const alreadySaved = savedInternships.includes(internship.role)
    if (alreadySaved) {
      const q = query(
        collection(db, 'savedInternships'),
        where('userId', '==', user.uid),
        where('role', '==', internship.role)
      )
      const snapshot = await getDocs(q)
      for (const document of snapshot.docs) {
        await deleteDoc(doc(db, 'savedInternships', document.id))
      }
      setSavedInternships(savedInternships.filter((item) => item !== internship.role))
    } else {
      await addDoc(collection(db, 'savedInternships'), {
        userId: user.uid,
        ...internship,
      })
      setSavedInternships([...savedInternships, internship.role])
    }
  }

  const filteredInternships = apiInternships
    .filter((internship) => {
      const matchesFilter = activeFilter === 'All' || internship.category === activeFilter
      const searchLower = search.trim().toLowerCase()
      const matchesSearch =
        searchLower === '' ||
        internship.role?.toLowerCase().includes(searchLower) ||
        internship.company?.toLowerCase().includes(searchLower) ||
        (internship.skills || []).some((s: string) => s.toLowerCase().includes(searchLower))
      return matchesFilter && matchesSearch
    })
    .sort((a, b) => calculateMatchScore(b.skills || []) - calculateMatchScore(a.skills || []))

  const score = progressData?.score || 0

  return (
    <PageLayout title="Internship Finder">
      {/* Header Banner */}
      <ScrollReveal className="mb-8">
        <div className="glass-card rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-cyan/10 border border-cyan/20 flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-7 h-7 text-cyan" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-cyan">Career Progress Gate</span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${score >= 70 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                  {score >= 70 ? 'UNLOCKED (70%+ Requirement Met)' : 'LOCKED (70%+ Requirement)'}
                </span>
              </div>
              <h2 className="text-xl font-bold text-text-primary">
                Current Progress Score: <span className="text-cyan font-mono text-2xl">{score}%</span> / 100
              </h2>
              <p className="text-text-secondary text-sm mt-1">
                {score >= 70
                  ? targetRole
                    ? `Matching active internships personalized for "${targetRole}".`
                    : 'Matching active internships based on your profile skills.'
                  : 'Internship matches are locked until you reach a 70% Progress Score.'}
              </p>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* GATED ACCESS SCREEN */}
      {isGated ? (
        <ScrollReveal>
          <div className="glass-card rounded-2xl p-8 md:p-12 text-center max-w-4xl mx-auto border-amber-500/30">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto mb-6 text-amber-400">
              <Lock className="w-8 h-8" />
            </div>

            <h2 className="font-display text-2xl md:text-3xl font-extrabold text-text-primary mb-3">
              Internship Finder Locked
            </h2>
            <p className="text-text-secondary text-base max-w-xl mx-auto mb-8">
              To ensure candidates are industry-ready, Career OS requires a <strong className="text-cyan">Progress Score of 70% or higher</strong> to access live internship applications.
            </p>

            {/* Score Progress Bar */}
            <div className="bg-elevated p-6 rounded-2xl border border-border-subtle mb-10 max-w-xl mx-auto">
              <div className="flex justify-between text-sm font-semibold mb-2">
                <span className="text-text-secondary">Your Current Score</span>
                <span className={score >= 70 ? 'text-emerald-400' : 'text-amber-400'}>{score}% / 70% Target</span>
              </div>
              <div className="w-full bg-void rounded-full h-3 overflow-hidden border border-border-subtle">
                <div
                  className={`h-full transition-all duration-500 ${score >= 70 ? 'bg-emerald-400' : 'bg-gradient-to-r from-amber-500 to-cyan'}`}
                  style={{ width: `${Math.min(100, (score / 70) * 100)}%` }}
                />
              </div>
            </div>

            {/* Actionable Gap Checklist */}
            <h3 className="text-lg font-bold text-text-primary mb-6 text-left max-w-2xl mx-auto">
              Required Steps to Unlock Internships:
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto mb-8 text-left">
              {progressData?.gapItems?.map((item: any, idx: number) => (
                <div
                  key={idx}
                  className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                    item.completed
                      ? 'bg-emerald-500/5 border-emerald-500/20'
                      : 'bg-elevated/50 border-border-subtle hover:border-cyan/40'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      {idx === 0 && <FileText className="w-5 h-5 text-cyan" />}
                      {idx === 1 && <BookOpen className="w-5 h-5 text-indigo-400" />}
                      {idx === 2 && <FolderGit2 className="w-5 h-5 text-amber-400" />}
                      {item.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-amber-400" />
                      )}
                    </div>
                    <h4 className="font-bold text-sm text-text-primary mb-1">{item.title}</h4>
                    <p className="text-xs text-text-secondary mb-4">{item.description}</p>
                  </div>

                  <Link
                    to={item.actionHref}
                    className={`py-2 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                      item.completed
                        ? 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
                        : 'bg-cyan text-deep hover:brightness-110'
                    }`}
                  >
                    {item.actionText} <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>
      ) : (
        <>
          {/* Search & Filters */}
          <ScrollReveal className="mb-6">
            <div className="glass-card rounded-2xl p-4 md:p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search live internships by role, company, or skill..."
                    className="w-full pl-11 pr-4 py-3 bg-elevated border border-border-subtle rounded-xl text-text-primary text-sm placeholder:text-text-muted focus:outline-none focus:border-cyan/50"
                  />
                </div>

                <div className="flex gap-2 flex-wrap items-center">
                  {filters.map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setActiveFilter(filter)}
                      className={`px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                        activeFilter === filter
                          ? 'bg-cyan text-deep shadow-md'
                          : 'bg-elevated text-text-secondary hover:text-text-primary border border-border-subtle'
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Internship Cards */}
          <ScrollReveal>
            {loadingInternships ? (
              <div className="glass-card rounded-2xl p-12 text-center">
                <p className="text-text-secondary text-sm font-medium animate-pulse">
                  Searching real-time internship openings matching your profile...
                </p>
              </div>
            ) : filteredInternships.length === 0 ? (
              <div className="glass-card rounded-2xl p-12 text-center">
                <Briefcase className="w-14 h-14 text-text-muted mx-auto mb-4" />
                <h3 className="text-lg font-bold text-text-primary mb-2">No Internships Found</h3>
                <p className="text-text-secondary text-sm">
                  Try broadening your search query or selecting a different role category.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredInternships.map((internship, index) => {
                  const matchScore = calculateMatchScore(internship.skills || [])
                  const missingSkills = getMissingSkills(internship.skills || [])
                  const isSaved = savedInternships.includes(internship.role)

                  return (
                    <div
                      key={index}
                      className="glass-card rounded-2xl p-6 flex flex-col justify-between hover:border-cyan/50"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <div className="w-12 h-12 rounded-xl bg-cyan/10 border border-cyan/20 flex items-center justify-center text-cyan">
                            <Briefcase className="w-6 h-6" />
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => toggleBookmark(internship)}
                              className="p-2 rounded-xl bg-elevated border border-border-subtle hover:text-amber-400 transition-colors"
                            >
                              <Bookmark
                                className={`w-4 h-4 ${isSaved ? 'fill-amber-400 text-amber-400' : 'text-text-muted'}`}
                              />
                            </button>
                            <span className="bg-cyan/10 text-cyan border border-cyan/20 px-3 py-1 rounded-full text-xs font-semibold">
                              {internship.category}
                            </span>
                          </div>
                        </div>

                        <h3 className="text-lg font-bold text-text-primary leading-tight mb-1">
                          {internship.role}
                        </h3>
                        <p className="text-text-secondary text-sm font-medium mb-4">
                          {internship.company}
                        </p>

                        <div className="space-y-2 mb-4 text-xs text-text-secondary">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-3.5 h-3.5 text-cyan" />
                            {internship.location}
                          </div>
                          <div className="flex items-center gap-2">
                            <IndianRupee className="w-3.5 h-3.5 text-emerald-400" />
                            {internship.stipend}
                          </div>
                        </div>

                        {/* Match Bar */}
                        <div className="mb-4 bg-elevated/60 p-3 rounded-xl border border-border-subtle">
                          <div className="flex justify-between text-xs font-semibold mb-1.5">
                            <span className="text-text-secondary">Profile Match</span>
                            <span className="text-emerald-400">{matchScore}% Match</span>
                          </div>
                          <div className="w-full bg-void rounded-full h-2 overflow-hidden">
                            <div
                              className="bg-emerald-400 h-full rounded-full transition-all duration-500"
                              style={{ width: `${matchScore}%` }}
                            />
                          </div>
                        </div>

                        {/* Skills */}
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {(internship.skills || []).map((skill, sIdx) => {
                            const hasSkill = userSkills.includes(skill)
                            return (
                              <span
                                key={sIdx}
                                className={`px-2.5 py-1 rounded-lg text-xs font-medium ${
                                  hasSkill
                                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                    : 'bg-elevated text-text-muted border border-border-subtle'
                                }`}
                              >
                                {skill}
                              </span>
                            )
                          })}
                        </div>

                        {missingSkills.length > 0 && (
                          <div className="mb-4">
                            <p className="text-rose-400 text-xs font-semibold mb-1">Missing Skills:</p>
                            <div className="flex flex-wrap gap-1">
                              {missingSkills.map((s, mIdx) => (
                                <span key={mIdx} className="bg-rose-500/10 text-rose-400 text-xs px-2 py-0.5 rounded-md border border-rose-500/20">
                                  {s}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      <a
                        href={internship.applyLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-3 rounded-xl bg-cyan text-deep font-bold text-sm text-center flex items-center justify-center gap-2 hover:brightness-110 transition-all mt-4"
                      >
                        Apply Now <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  )
                })}
              </div>
            )}
          </ScrollReveal>
        </>
      )}
    </PageLayout>
  )
}