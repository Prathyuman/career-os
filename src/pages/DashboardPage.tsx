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
  Flame,
  Activity,
  Compass
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
    desc: 'ATS score & skill match',
    href: '/resume-analyzer',
    color: 'from-cyan-500 to-blue-600',
    textColor: 'text-cyan-400',
    badge: 'AI Powered',
  },
  {
    icon: Github,
    label: 'GitHub Analyzer',
    desc: 'Audit portfolio & commits',
    href: '/github-analyzer',
    color: 'from-purple-500 to-indigo-600',
    textColor: 'text-purple-400',
    badge: 'Code Scan',
  },
  {
    icon: BarChart3,
    label: 'Skill Gap Analysis',
    desc: 'Target missing skills',
    href: '/skill-gap',
    color: 'from-amber-500 to-orange-600',
    textColor: 'text-amber-400',
    badge: 'Strategic',
  },
  {
    icon: FolderGit2,
    label: 'Project Blueprints',
    desc: 'Build portfolio projects',
    href: '/projects',
    color: 'from-blue-500 to-cyan-600',
    textColor: 'text-blue-400',
    badge: 'Hands-on',
  },
  {
    icon: Briefcase,
    label: 'Internship Matcher',
    desc: 'Live role applications',
    href: '/internships',
    color: 'from-emerald-500 to-teal-600',
    textColor: 'text-emerald-400',
    badge: 'Realtime',
  },
  {
    icon: MessageSquare,
    label: 'AI Interview Coach',
    desc: '3-Round mock with Camera AI',
    href: '/interview',
    color: 'from-cyan-500 to-indigo-600',
    textColor: 'text-cyan-300',
    badge: 'WebCam AI',
  },
  {
    icon: BookOpen,
    label: 'Free Courses',
    desc: 'Certification & Non-Cert',
    href: '/courses',
    color: 'from-cyan-500 to-teal-500',
    textColor: 'text-cyan-400',
    badge: 'Uncapped',
  },
  {
    icon: Award,
    label: 'Certifications',
    desc: 'Upload completion proof',
    href: '/certifications',
    color: 'from-amber-500 to-yellow-500',
    textColor: 'text-amber-400',
    badge: 'Verified',
  },
]

export default function DashboardPage() {
  const [userName, setUserName] = useState('Developer')
  const [certificateCount, setCertificateCount] = useState(0)
  const [progressScore, setProgressScore] = useState(0)
  const [atsScore, setAtsScore] = useState(0)
  const [targetRole, setTargetRole] = useState('Software Engineer')
  const [completedProjCount, setCompletedProjCount] = useState(0)

  useEffect(() => {
    const loadDashboardData = async (user: NonNullable<typeof auth.currentUser>) => {
      try {
        if (user.displayName) setUserName(user.displayName.split(' ')[0])

        // Certificates count
        const certSnap = await getDocs(
          query(collection(db, 'certifications'), where('userId', '==', user.uid))
        )
        setCertificateCount(certSnap.size)

        // Resume & Progress score
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

        // Progress Score Calculation
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
    <PageLayout title="AI Career Command Center">
      {/* Hero Welcome Banner */}
      <ScrollReveal className="mb-8">
        <div className="relative rounded-3xl p-8 md:p-10 overflow-hidden bg-gradient-to-r from-slate-900 via-[#0D1532] to-[#151D42] border border-cyan-500/30 shadow-2xl shadow-cyan-500/10">
          {/* Decorative Glow Elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            <div className="space-y-3 max-w-2xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-amber-400" /> Career Readiness Command
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-purple-500/10 text-purple-300 border border-purple-500/20">
                  Target: {targetRole}
                </span>
              </div>

              <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
                Welcome back, <span className="text-gradient-cyan">{userName}</span> 👋
              </h1>

              <p className="text-slate-300 text-sm md:text-base leading-relaxed">
                Your AI Career Intelligence System is active. Monitor your ATS score, run mock interviews, and close skill gaps to accelerate your hiring velocity.
              </p>
            </div>

            {/* Circular Readiness Meter */}
            <div className="flex items-center gap-6 p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl shrink-0">
              <div className="relative w-24 h-24 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-slate-800"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-cyan-400 transition-all duration-1000 ease-out"
                    strokeDasharray={`${progressScore}, 100`}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center text-center">
                  <span className="font-mono text-2xl font-black text-white">{progressScore}%</span>
                  <span className="text-[9px] font-bold uppercase text-cyan-400 tracking-wider">Score</span>
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Career Readiness</div>
                <div className="text-base font-bold text-white">
                  {progressScore >= 80 ? '🌟 Highly Interview Ready' : progressScore >= 60 ? '⚡ Solid Progress' : '🚀 Building Fundamentals'}
                </div>
                <Link to="/progress" className="text-xs font-bold text-cyan-400 hover:underline flex items-center gap-1">
                  View Score Breakdown <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* Metrics Row */}
      <ScrollReveal className="mb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="glass-card rounded-2xl p-6 relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">ATS Resume Health</span>
              <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                <FileText className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-black text-white font-mono mb-1">{atsScore > 0 ? `${atsScore}/100` : 'Not Scanned'}</div>
            <p className="text-xs text-slate-400">ATS formatting & keyword optimization</p>
          </div>

          <div className="glass-card rounded-2xl p-6 relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Certifications Uploaded</span>
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Award className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-black text-white font-mono mb-1">{certificateCount}</div>
            <p className="text-xs text-slate-400">Verified credentials uploaded</p>
          </div>

          <div className="glass-card rounded-2xl p-6 relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Projects Built</span>
              <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                <FolderGit2 className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-black text-white font-mono mb-1">{completedProjCount} / 3</div>
            <p className="text-xs text-slate-400">Portfolio blueprints completed</p>
          </div>

          <div className="glass-card rounded-2xl p-6 relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">AI Mock Interviews</span>
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <MessageSquare className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-black text-white font-mono mb-1">3-Round</div>
            <p className="text-xs text-slate-400">Aptitude, DSA & Camera AI HR</p>
          </div>
        </div>
      </ScrollReveal>

      {/* Quick Action Grid */}
      <ScrollReveal className="mb-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-cyan-400" /> Career OS Tools & Modules
            </h2>
            <p className="text-xs text-slate-400 mt-1">Select an AI module to scan, build, or practice for your target role.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action) => (
            <Link
              key={action.label}
              to={action.href}
              className="glass-card-interactive rounded-2xl p-6 flex flex-col justify-between group relative overflow-hidden"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${action.color} p-3 text-slate-950 flex items-center justify-center shadow-lg`}>
                    <action.icon className="w-6 h-6 fill-current" />
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-white/5 border border-white/10 text-slate-300">
                    {action.badge}
                  </span>
                </div>

                <h3 className="text-base font-extrabold text-white mb-1 group-hover:text-cyan-300 transition-colors">
                  {action.label}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  {action.desc}
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-white/10 text-xs font-bold text-cyan-400 group-hover:translate-x-1 transition-transform">
                <span>Launch Tool</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </Link>
          ))}
        </div>
      </ScrollReveal>
    </PageLayout>
  )
}