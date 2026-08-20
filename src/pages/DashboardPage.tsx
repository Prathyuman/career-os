import { useEffect, useState } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth, db } from '../lib/firebase'
import { Link } from 'react-router-dom'
import PageLayout from '../components/PageLayout'
import ScrollReveal from '../components/ScrollReveal'
import {
  FileText,
  Github,
  BarChart3,
  Briefcase,
  MessageSquare,
  Zap,
  Award,
  FolderGit2,
  TrendingUp,
  ArrowRight,
  Sparkles,
  BookOpen,
  CheckCircle2,
  ShieldCheck,
  Activity,
  Layers,
  Search
} from 'lucide-react'
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
} from 'firebase/firestore'
import { calculateProgressScore } from '../lib/progressScore'

const quickActions = [
  {
    icon: FileText,
    label: 'Resume AI Scan',
    desc: 'ATS compatibility & skill matching',
    href: '/resume-analyzer',
    badge: 'ATS Scanner',
  },
  {
    icon: Github,
    label: 'GitHub Audit',
    desc: 'Repository & commit code audit',
    href: '/github-analyzer',
    badge: 'Code Scan',
  },
  {
    icon: BarChart3,
    label: 'Skill Gap Analysis',
    desc: 'Identify missing technical requirements',
    href: '/skill-gap',
    badge: 'Analytics',
  },
  {
    icon: FolderGit2,
    label: 'Project Blueprints',
    desc: 'Build portfolio-ready projects',
    href: '/projects',
    badge: 'Execution',
  },
  {
    icon: Briefcase,
    label: 'Internship Matcher',
    desc: 'Realtime matching & applications',
    href: '/internships',
    badge: 'Realtime',
  },
  {
    icon: MessageSquare,
    label: 'AI Interview Coach',
    desc: '3-Round mock with Camera AI',
    href: '/interview',
    badge: 'WebCam AI',
  },
  {
    icon: BookOpen,
    label: 'Free Courses',
    desc: 'Certification & Non-Cert tracks',
    href: '/courses',
    badge: 'Curated',
  },
  {
    icon: Award,
    label: 'Certifications',
    desc: 'Upload completion proof',
    href: '/certifications',
    badge: 'Verification',
  },
]

export default function DashboardPage() {
  const [userName, setUserName] = useState('Candidate')
  const [certificateCount, setCertificateCount] = useState(0)
  const [progressScore, setProgressScore] = useState(0)
  const [atsScore, setAtsScore] = useState(0)
  const [targetRole, setTargetRole] = useState('Software Engineer')
  const [completedProjCount, setCompletedProjCount] = useState(0)

  useEffect(() => {
    const loadDashboardData = async (user: NonNullable<typeof auth.currentUser>) => {
      try {
        if (user.displayName) setUserName(user.displayName.split(' ')[0])

        // Fetch Certificates
        const certSnap = await getDocs(
          query(collection(db, 'certifications'), where('userId', '==', user.uid))
        )
        setCertificateCount(certSnap.size)

        // Fetch Resume & Progress Data
        const resumeDoc = await getDoc(doc(db, 'resumeAnalysis', user.uid))

        let pCount = 0
        try {
          const pSnap = await getDocs(query(collection(db, 'completedProjects'), where('userId', '==', user.uid)))
          pCount = pSnap.size
          setCompletedProjCount(pCount)
        } catch (e) {
          console.error(e)
        }

        let rData: any = {}
        if (resumeDoc.exists()) {
          rData = resumeDoc.data()
          if (rData.targetRole) setTargetRole(rData.targetRole)
          if (rData.atsScore || rData.careerReadinessScore) {
            setAtsScore(rData.atsScore || rData.careerReadinessScore || 0)
          }
        }

        const pScore = calculateProgressScore({
          careerReadinessScore: rData.careerReadinessScore,
          atsScore: rData.atsCompatibility,
          totalCourses: rData.learningRoadmap?.length || 5,
          completedCoursesCount: rData.completedCourses?.length || 0,
          totalProjects: 3,
          completedProjectsCount: pCount,
          resumeUpdatedAt: rData.analyzedAt,
        })
        setProgressScore(pScore)
      } catch (error) {
        console.error('Error loading dashboard:', error)
      }
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) loadDashboardData(user)
    })
    return () => unsubscribe()
  }, [])

  return (
    <PageLayout title="Executive Command Center">
      {/* Hero Welcome Banner */}
      <ScrollReveal className="mb-6">
        <div className="pro-card p-6 sm:p-8 bg-slate-900/90 border border-slate-800 relative overflow-hidden">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded text-xs font-mono font-semibold badge-sky">
                  TARGET ROLE: {targetRole.toUpperCase()}
                </span>
                <span className="px-2.5 py-0.5 rounded text-xs font-mono font-semibold badge-emerald">
                  SYSTEM READY
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Welcome, {userName}
              </h1>

              <p className="text-slate-400 text-xs sm:text-sm max-w-2xl leading-relaxed">
                CareerOS Career Readiness System is monitoring your ATS score, skill coverage, and interview preparation.
              </p>
            </div>

            {/* Overall Score Progress Card */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-5 shrink-0 w-full sm:w-auto">
              <div className="space-y-1">
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider font-mono">
                  Career Readiness
                </div>
                <div className="text-3xl font-extrabold text-white font-mono">{progressScore}%</div>
                <div className="w-32 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-sky-500 rounded-full transition-all duration-700"
                    style={{ width: `${progressScore}%` }}
                  />
                </div>
              </div>

              <Link
                to="/progress"
                className="px-3.5 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs transition-colors shadow-sm flex items-center gap-1.5"
              >
                <span>Report</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* Metrics Row */}
      <ScrollReveal className="mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="pro-card p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono">ATS Health</span>
              <FileText className="w-4 h-4 text-sky-400" />
            </div>
            <div className="text-2xl font-bold text-white font-mono mb-1">
              {atsScore > 0 ? `${atsScore} / 100` : 'Pending'}
            </div>
            <p className="text-xs text-slate-400">Resume scan score</p>
          </div>

          <div className="pro-card p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono font-mono">Certifications</span>
              <Award className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-bold text-white font-mono mb-1">{certificateCount}</div>
            <p className="text-xs text-slate-400">Verified credentials</p>
          </div>

          <div className="pro-card p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono">Projects</span>
              <FolderGit2 className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="text-2xl font-bold text-white font-mono mb-1">{completedProjCount} / 3</div>
            <p className="text-xs text-slate-400">Portfolio blueprints</p>
          </div>

          <div className="pro-card p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono">Mock Interview</span>
              <MessageSquare className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-bold text-white font-mono mb-1">3-Round AI</div>
            <p className="text-xs text-slate-400">Aptitude, DSA & Camera HR</p>
          </div>
        </div>
      </ScrollReveal>

      {/* Module Tool Grid */}
      <ScrollReveal className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <span>CareerOS Core Modules</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <Link
              key={action.label}
              to={action.href}
              className="pro-card-interactive p-5 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 rounded-lg bg-slate-800 text-sky-400 group-hover:bg-sky-500 group-hover:text-slate-950 transition-colors">
                    <action.icon className="w-4 h-4" />
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-slate-800 text-slate-400">
                    {action.badge}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-100 mb-1 group-hover:text-sky-400 transition-colors">
                  {action.label}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  {action.desc}
                </p>
              </div>

              <div className="flex items-center justify-between text-xs font-semibold text-sky-400 pt-3 border-t border-slate-800">
                <span>Access Module</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </ScrollReveal>
    </PageLayout>
  )
}