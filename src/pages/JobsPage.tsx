import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import PageLayout from '../components/PageLayout'
import ScrollReveal from '../components/ScrollReveal'
import {
  Search,
  Briefcase,
  MapPin,
  Lock,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Plus,
  Trash2,
  Building2,
  Sparkles,
  X,
} from 'lucide-react'
import { auth, db } from '../lib/firebase'
import { getDetailedProgressBreakdown } from '../lib/progressScore'
import {
  fetchUserInternships,
  logInternshipExperience,
  deleteInternshipExperience,
  type InternshipExperience,
} from '../services/internshipLogService'
import { doc, onSnapshot, getDocs, collection, query, where } from 'firebase/firestore'

const filters = [
  'All',
  'Remote',
  'Frontend',
  'Backend',
  'Full Stack',
  'ML/AI',
  'DevOps',
]

interface JobItem {
  id: string
  company: string
  title: string
  location: string
  type: string
  skills: string[]
  applyUrl: string
  description?: string
}

export default function JobsPage() {
  const [activeFilter, setActiveFilter] = useState('All')
  const [search, setSearch] = useState('')
  const [jobs, setJobs] = useState<JobItem[]>([])
  const [loadingJobs, setLoadingJobs] = useState(false)

  // Gating States
  const [progressScore, setProgressScore] = useState(0)
  const [internshipLogs, setInternshipLogs] = useState<InternshipExperience[]>([])
  const [isGated, setIsGated] = useState(true)

  // Modal State for logging internship
  const [modalOpen, setModalOpen] = useState(false)
  const [newCompany, setNewCompany] = useState('')
  const [newRole, setNewRole] = useState('')
  const [newDuration, setNewDuration] = useState('')
  const [newDescription, setNewDescription] = useState('')
  const [newSkills, setNewSkills] = useState('')
  const [savingLog, setSavingLog] = useState(false)

  // Realtime user data, progress score & internship logs
  useEffect(() => {
    let unsubscribeSnapshot: (() => void) | undefined

    const loadUserData = (userId: string) => {
      // Fetch internship logs
      fetchUserInternships(userId).then(setInternshipLogs)

      // Listen to resume analysis
      unsubscribeSnapshot = onSnapshot(
        doc(db, 'resumeAnalysis', userId),
        async (snap) => {
          let resumeData: any = {}
          if (snap.exists()) resumeData = snap.data()

          let completedProjectsCount = 0
          try {
            const pSnap = await getDocs(
              query(collection(db, 'completedProjects'), where('userId', '==', userId))
            )
            completedProjectsCount = pSnap.size
          } catch (e) {
            console.error(e)
          }

          const breakdown = getDetailedProgressBreakdown({
            careerReadinessScore: resumeData.careerReadinessScore,
            atsScore: resumeData.atsCompatibility,
            totalCourses: resumeData.learningRoadmap?.length || 5,
            completedCoursesCount: resumeData.completedCourses?.length || 0,
            totalProjects: 3,
            completedProjectsCount,
            resumeUpdatedAt: resumeData.analyzedAt,
          })

          setProgressScore(breakdown.score)
        }
      )
    }

    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (unsubscribeSnapshot) {
        unsubscribeSnapshot()
        unsubscribeSnapshot = undefined
      }

      if (user) {
        loadUserData(user.uid)
      } else {
        setProgressScore(0)
        setInternshipLogs([])
        setIsGated(true)
      }
    })

    return () => {
      unsubscribeAuth()
      if (unsubscribeSnapshot) unsubscribeSnapshot()
    }
  }, [])

  // Evaluate gate condition
  useEffect(() => {
    const scoreOk = progressScore >= 70
    const internshipsOk = internshipLogs.length >= 2
    setIsGated(!scoreOk || !internshipsOk)
  }, [progressScore, internshipLogs])

  // Mock / API Job Loader when unlocked
  useEffect(() => {
    if (isGated) return

    setLoadingJobs(true)
    // Populate high-quality realistic tech jobs matching career role
    const mockJobs: JobItem[] = [
      {
        id: '1',
        title: 'Full Stack Software Engineer',
        company: 'Stripe',
        location: 'Remote / San Francisco',
        type: 'Full-Time',
        skills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'System Design'],
        applyUrl: 'https://stripe.com/jobs',
        description: 'Build scalable global payments infrastructure and financial web products.',
      },
      {
        id: '2',
        title: 'Frontend Developer (React / Next.js)',
        company: 'Vercel',
        location: 'Remote',
        type: 'Full-Time',
        skills: ['Next.js', 'React', 'Tailwind CSS', 'TypeScript'],
        applyUrl: 'https://vercel.com/careers',
        description: 'Craft high-performance frontend interfaces for the world modern web platform.',
      },
      {
        id: '3',
        title: 'Backend Engineer (Node & Cloud)',
        company: 'Datadog',
        location: 'New York / Remote',
        type: 'Full-Time',
        skills: ['Node.js', 'Go', 'AWS', 'Kubernetes', 'REST APIs'],
        applyUrl: 'https://www.datadoghq.com/careers',
        description: 'Design robust distributed microservices and real-time observability telemetry pipelines.',
      },
      {
        id: '4',
        title: 'AI / ML Solutions Engineer',
        company: 'Anthropic',
        location: 'San Francisco, CA',
        type: 'Full-Time',
        skills: ['Python', 'PyTorch', 'LLMs', 'API Design'],
        applyUrl: 'https://www.anthropic.com/careers',
        description: 'Deploy cutting-edge AI models and build developer integrations for Claude.',
      },
      {
        id: '5',
        title: 'DevOps & Cloud Engineer',
        company: 'Cloudflare',
        location: 'Remote',
        type: 'Full-Time',
        skills: ['Docker', 'Kubernetes', 'CI/CD', 'Terraform', 'Linux'],
        applyUrl: 'https://www.cloudflare.com/careers',
        description: 'Manage global edge infrastructure, automated deployments, and zero-trust security.',
      },
    ]

    setTimeout(() => {
      setJobs(mockJobs)
      setLoadingJobs(false)
    }, 400)
  }, [isGated])

  const handleSaveInternshipLog = async () => {
    if (!newCompany.trim() || !newRole.trim()) {
      alert('Please provide at least company name and role title.')
      return
    }

    try {
      setSavingLog(true)
      const user = auth.currentUser
      if (!user) return

      await logInternshipExperience({
        company: newCompany.trim(),
        role: newRole.trim(),
        duration: newDuration.trim() || '3 Months',
        description: newDescription.trim() || 'Worked on software development team projects.',
        skillsUsed: newSkills ? newSkills.split(',').map((s) => s.trim()).filter(Boolean) : ['Software Engineering'],
      })

      // Refresh list
      const updated = await fetchUserInternships(user.uid)
      setInternshipLogs(updated)

      setNewCompany('')
      setNewRole('')
      setNewDuration('')
      setNewDescription('')
      setNewSkills('')
      setModalOpen(false)
    } catch (e) {
      console.error(e)
      alert('Failed to log internship experience.')
    } finally {
      setSavingLog(false)
    }
  }

  const handleDeleteLog = async (id: string) => {
    if (!window.confirm('Delete this logged internship experience?')) return
    const user = auth.currentUser
    if (!user) return
    await deleteInternshipExperience(id)
    const updated = await fetchUserInternships(user.uid)
    setInternshipLogs(updated)
  }

  const filteredJobs = jobs.filter((job) => {
    const matchesFilter =
      activeFilter === 'All' ||
      (activeFilter === 'Remote' && job.location.toLowerCase().includes('remote')) ||
      job.title.toLowerCase().includes(activeFilter.toLowerCase()) ||
      job.skills.some((s) => s.toLowerCase().includes(activeFilter.toLowerCase()))

    const matchesSearch =
      !search.trim() ||
      job.title.toLowerCase().includes(search.toLowerCase()) ||
      job.company.toLowerCase().includes(search.toLowerCase()) ||
      job.skills.some((s) => s.toLowerCase().includes(search.toLowerCase()))

    return matchesFilter && matchesSearch
  })

  return (
    <PageLayout title="Job Finder & Career Opportunities">
      {/* Header Banner */}
      <ScrollReveal className="mb-8">
        <div className="glass-card rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-cyan/10 border border-cyan/20 flex items-center justify-center text-cyan flex-shrink-0">
              <Briefcase className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-cyan">Dual Gate Requirements</span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${!isGated ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                  {!isGated ? 'UNLOCKED' : 'LOCKED'}
                </span>
              </div>
              <h2 className="text-xl font-bold text-text-primary">
                Job Placement Access
              </h2>
              <p className="text-text-secondary text-sm mt-1">
                Access to full-time tech roles requires a <strong className="text-cyan">70%+ Progress Score</strong> AND at least <strong className="text-cyan">2 Logged Internship Experiences</strong>.
              </p>
            </div>
          </div>

          <button
            onClick={() => setModalOpen(true)}
            className="px-5 py-3 rounded-xl bg-cyan text-deep font-bold text-sm flex items-center gap-2 hover:brightness-110 transition-all shadow-md flex-shrink-0"
          >
            <Plus className="w-4 h-4" /> Log Internship Experience
          </button>
        </div>
      </ScrollReveal>

      {/* GATED ACCESS SCREEN */}
      {isGated ? (
        <ScrollReveal>
          <div className="glass-card rounded-2xl p-8 md:p-12 max-w-4xl mx-auto border-amber-500/30">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto mb-6 text-amber-400">
              <Lock className="w-8 h-8" />
            </div>

            <h2 className="font-display text-2xl md:text-3xl font-extrabold text-text-primary text-center mb-3">
              Full-Time Job Board Gated
            </h2>
            <p className="text-text-secondary text-base max-w-xl mx-auto text-center mb-8">
              Complete the two prerequisites below to unlock full-time engineering and product opportunities.
            </p>

            {/* Dual Requirement Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto mb-10 text-left">
              {/* Req 1: Progress Score */}
              <div className={`p-6 rounded-2xl border ${progressScore >= 70 ? 'bg-emerald-500/5 border-emerald-500/30' : 'bg-elevated border-border-subtle'}`}>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold text-cyan uppercase tracking-wider">Requirement 1</span>
                  {progressScore >= 70 ? (
                    <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                  ) : (
                    <AlertCircle className="w-6 h-6 text-amber-400" />
                  )}
                </div>
                <h3 className="font-bold text-lg text-text-primary mb-1">
                  70%+ Career Progress Score
                </h3>
                <p className="text-xs text-text-secondary mb-4">
                  Current Score: <strong className={progressScore >= 70 ? 'text-emerald-400' : 'text-amber-400'}>{progressScore}%</strong> (Target: 70%)
                </p>
                <div className="w-full bg-void rounded-full h-2.5 overflow-hidden mb-4 border border-border-subtle">
                  <div
                    className={`h-full transition-all duration-500 ${progressScore >= 70 ? 'bg-emerald-400' : 'bg-amber-400'}`}
                    style={{ width: `${Math.min(100, (progressScore / 70) * 100)}%` }}
                  />
                </div>
                <Link
                  to="/internships"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan hover:underline"
                >
                  Improve Progress Score <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Req 2: 2 Internships Logged */}
              <div className={`p-6 rounded-2xl border ${internshipLogs.length >= 2 ? 'bg-emerald-500/5 border-emerald-500/30' : 'bg-elevated border-border-subtle'}`}>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold text-cyan uppercase tracking-wider">Requirement 2</span>
                  {internshipLogs.length >= 2 ? (
                    <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                  ) : (
                    <AlertCircle className="w-6 h-6 text-amber-400" />
                  )}
                </div>
                <h3 className="font-bold text-lg text-text-primary mb-1">
                  2 Logged Internship Experiences
                </h3>
                <p className="text-xs text-text-secondary mb-4">
                  Logged: <strong className={internshipLogs.length >= 2 ? 'text-emerald-400' : 'text-amber-400'}>{internshipLogs.length} / 2 required</strong>
                </p>

                {/* Logged Internships List */}
                <div className="space-y-2 mb-4">
                  {internshipLogs.map((log) => (
                    <div key={log.id} className="p-2.5 rounded-xl bg-surface border border-border-subtle flex items-center justify-between text-xs">
                      <div>
                        <p className="font-bold text-text-primary">{log.role}</p>
                        <p className="text-text-muted">{log.company} ({log.duration})</p>
                      </div>
                      <button
                        onClick={() => handleDeleteLog(log.id!)}
                        className="text-rose-400 hover:text-rose-300 p-1"
                        title="Delete log"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                  {internshipLogs.length === 0 && (
                    <p className="text-xs text-text-muted italic">No internship experiences logged yet.</p>
                  )}
                </div>

                <button
                  onClick={() => setModalOpen(true)}
                  className="w-full py-2.5 rounded-xl bg-cyan text-deep font-bold text-xs flex items-center justify-center gap-1.5 hover:brightness-110"
                >
                  <Plus className="w-4 h-4" /> Log An Experience
                </button>
              </div>
            </div>
          </div>
        </ScrollReveal>
      ) : (
        <>
          {/* Unlocked Job Search */}
          <ScrollReveal className="mb-6">
            <div className="glass-card rounded-2xl p-4 md:p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search full-time roles, companies, or tech stacks..."
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

          {/* Job List */}
          <ScrollReveal>
            {loadingJobs ? (
              <div className="glass-card rounded-2xl p-12 text-center">
                <p className="text-text-secondary text-sm font-medium animate-pulse">
                  Fetching verified software job listings...
                </p>
              </div>
            ) : filteredJobs.length === 0 ? (
              <div className="glass-card rounded-2xl p-12 text-center">
                <Briefcase className="w-14 h-14 text-text-muted mx-auto mb-4" />
                <h3 className="text-lg font-bold text-text-primary mb-2">No Jobs Found</h3>
                <p className="text-text-secondary text-sm">
                  Try adjusting your filter parameters or search term.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredJobs.map((job) => (
                  <div key={job.id} className="glass-card rounded-2xl p-6 flex flex-col justify-between hover:border-cyan/50">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-xl bg-cyan/10 border border-cyan/20 flex items-center justify-center text-cyan">
                          <Building2 className="w-6 h-6" />
                        </div>
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          {job.type}
                        </span>
                      </div>

                      <h3 className="text-lg font-bold text-text-primary mb-1">{job.title}</h3>
                      <p className="text-text-secondary text-sm font-medium mb-3">{job.company}</p>
                      <p className="text-xs text-text-muted mb-4 line-clamp-2">{job.description}</p>

                      <div className="flex items-center gap-2 text-xs text-text-secondary mb-4">
                        <MapPin className="w-3.5 h-3.5 text-cyan" />
                        {job.location}
                      </div>

                      <div className="flex flex-wrap gap-1.5 mb-6">
                        {job.skills.map((s, idx) => (
                          <span key={idx} className="px-2.5 py-1 rounded-lg text-xs font-medium bg-elevated text-cyan border border-border-subtle">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    <a
                      href={job.applyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3 rounded-xl bg-cyan text-deep font-bold text-sm text-center flex items-center justify-center gap-2 hover:brightness-110 transition-all"
                    >
                      Apply for Job <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                ))}
              </div>
            )}
          </ScrollReveal>
        </>
      )}

      {/* MODAL: Log Internship Experience */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-surface border border-border-subtle rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl p-6">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-border-subtle">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-cyan" />
                <h3 className="text-lg font-bold text-text-primary">Log Internship Experience</h3>
              </div>
              <button onClick={() => setModalOpen(false)} className="text-text-muted hover:text-text-primary">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-text-primary uppercase tracking-wider block mb-1.5">
                  Company / Organization *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Microsoft / Acme Startup"
                  value={newCompany}
                  onChange={(e) => setNewCompany(e.target.value)}
                  className="w-full px-4 py-2.5 bg-elevated border border-border-subtle rounded-xl text-text-primary text-sm outline-none focus:border-cyan/50"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-text-primary uppercase tracking-wider block mb-1.5">
                  Role Title *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Software Engineering Intern"
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  className="w-full px-4 py-2.5 bg-elevated border border-border-subtle rounded-xl text-text-primary text-sm outline-none focus:border-cyan/50"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-text-primary uppercase tracking-wider block mb-1.5">
                  Duration / Period
                </label>
                <input
                  type="text"
                  placeholder="e.g. 3 Months (May 2025 - Aug 2025)"
                  value={newDuration}
                  onChange={(e) => setNewDuration(e.target.value)}
                  className="w-full px-4 py-2.5 bg-elevated border border-border-subtle rounded-xl text-text-primary text-sm outline-none focus:border-cyan/50"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-text-primary uppercase tracking-wider block mb-1.5">
                  Key Skills Used (comma separated)
                </label>
                <input
                  type="text"
                  placeholder="React, Node.js, Python, Git"
                  value={newSkills}
                  onChange={(e) => setNewSkills(e.target.value)}
                  className="w-full px-4 py-2.5 bg-elevated border border-border-subtle rounded-xl text-text-primary text-sm outline-none focus:border-cyan/50"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-text-primary uppercase tracking-wider block mb-1.5">
                  Brief Description & Key Achievements
                </label>
                <textarea
                  rows={3}
                  placeholder="Built REST APIs, improved frontend performance by 25%..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full px-4 py-2.5 bg-elevated border border-border-subtle rounded-xl text-text-primary text-sm outline-none focus:border-cyan/50 resize-none"
                />
              </div>

              <div className="pt-4 border-t border-border-subtle flex items-center justify-end gap-3">
                <button
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-elevated text-text-secondary text-xs font-bold hover:text-text-primary"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveInternshipLog}
                  disabled={savingLog}
                  className="px-5 py-2.5 rounded-xl bg-cyan text-deep text-xs font-bold hover:brightness-110 disabled:opacity-50"
                >
                  {savingLog ? 'Saving Log...' : 'Save & Verify Log'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </PageLayout>
  )
}