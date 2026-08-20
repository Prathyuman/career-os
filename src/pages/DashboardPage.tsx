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
    label: 'Analyze Resume',
    desc: 'ATS & skill scan',
    href: '/resume-analyzer',
    color: 'text-cyan',
  },
  {
    icon: Github,
    label: 'GitHub Scan',
    desc: 'Audit portfolio',
    href: '/github-analyzer',
    color: 'text-indigo-400',
  },
  {
    icon: BarChart3,
    label: 'Skill Gap',
    desc: 'Identify missing skills',
    href: '/skill-gap',
    color: 'text-violet-400',
  },
  {
    icon: FolderGit2,
    label: 'Projects',
    desc: 'Build blueprints',
    href: '/projects',
    color: 'text-amber-400',
  },
  {
    icon: Briefcase,
    label: 'Internships',
    desc: 'Realtime matching',
    href: '/internships',
    color: 'text-emerald-400',
  },
  {
    icon: MessageSquare,
    label: 'AI Interview',
    desc: '3-Round Coach',
    href: '/interview',
    color: 'text-cyan',
  },
]

export default function DashboardPage() {
  const [userName, setUserName] = useState('User')
  const [certificateCount, setCertificateCount] = useState(0)
  const [profileScore, setProfileScore] = useState(0)
  const [progressScore, setProgressScore] = useState(0)
  const [careerXP, setCareerXP] = useState(0)
  const [careerLevel, setCareerLevel] = useState('Explorer')
  const [badges, setBadges] = useState<string[]>([])

  useEffect(() => {
    const loadDashboardData = async (user: NonNullable<typeof auth.currentUser>) => {
      try {
        if (user.displayName) setUserName(user.displayName)

        // Certificates count
        const certSnap = await getDocs(
          query(collection(db, 'certifications'), where('userId', '==', user.uid))
        )
        setCertificateCount(certSnap.size)

        // Resume & Progress score
        const resumeDoc = await getDoc(doc(db, 'resumeAnalysis', user.uid))
        const githubDoc = await getDoc(doc(db, 'githubAnalysis', user.uid))

        let completedProjCount = 0
        try {
          const pSnap = await getDocs(query(collection(db, 'completedProjects'), where('userId', '==', user.uid)))
          completedProjCount = pSnap.size
        } catch (e) {
          console.error(e)
        }

        let rData: any = {}
        if (resumeDoc.exists()) rData = resumeDoc.data()

        // Progress Score
        const pScore = calculateProgressScore({
          careerReadinessScore: rData.careerReadinessScore,
          atsScore: rData.atsCompatibility,
          totalCourses: rData.learningRoadmap?.length || 5,
          completedCoursesCount: rData.completedCourses?.length || 0,
          totalProjects: 3,
          completedProjectsCount: completedProjCount,
          resumeUpdatedAt: rData.analyzedAt,
        })
        setProgressScore(pScore)

        // Profile score
        let score = 0
        if (user.photoURL) score += 10
        if (certSnap.size > 0) score += 20
        if (resumeDoc.exists()) {
          score += 25
          if (rData?.foundSkills?.length > 0) score += 20
        }
        if (githubDoc.exists()) score += 25
        setProfileScore(Math.min(100, score))

        // XP & Level
        let xp = 0
        if (user.photoURL) xp += 25
        if (certSnap.size > 0) xp += 50
        if (resumeDoc.exists()) xp += 100
        if (rData?.foundSkills?.length > 0) xp += 50
        if (githubDoc.exists()) xp += 100
        if (completedProjCount > 0) xp += completedProjCount * 50

        setCareerXP(xp)

        if (xp >= 300) setCareerLevel('Senior Builder')
        else if (xp >= 200) setCareerLevel('Full-Stack Engineer')
        else if (xp >= 100) setCareerLevel('Career Developer')
        else if (xp >= 50) setCareerLevel('Active Learner')
        else setCareerLevel('Career Explorer')

        const earned = []
        if (certSnap.size > 0) earned.push('🏅 Certified Achiever')
        if (resumeDoc.exists()) earned.push('📄 Resume Parsed')
        if (githubDoc.exists()) earned.push('💻 GitHub Synced')
        if (completedProjCount > 0) earned.push('🏗️ Blueprint Builder')
        if (pScore >= 70) earned.push('🔓 Internships Unlocked')
        if (xp >= 300) earned.push('⭐ Professional Level')

        setBadges(earned)
      } catch (error) {
        console.error(error)
      }
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) loadDashboardData(user)
    })
    return () => unsubscribe()
  }, [])

  return (
    <PageLayout title="Career Dashboard">
      {/* Welcome Banner */}
      <ScrollReveal className="mb-8">
        <div className="glass-card rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-cyan/20">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-cyan/10 border border-cyan/20 flex items-center justify-center text-cyan flex-shrink-0">
              <Zap className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="w-4 h-4 text-cyan" />
                <span className="text-xs font-bold uppercase tracking-wider text-cyan">Command Center</span>
              </div>
              <h2 className="text-2xl font-extrabold text-text-primary">
                Welcome back, {userName}!
              </h2>
              <p className="text-text-secondary text-sm mt-1">
                Your AI career copilot is tracking your skills, progress gate, and portfolio readiness.
              </p>
            </div>
          </div>

          <Link
            to="/progress"
            className="px-5 py-3 rounded-xl bg-cyan text-deep font-bold text-sm flex items-center gap-2 hover:brightness-110 transition-all shadow-md flex-shrink-0"
          >
            View Full Analytics <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </ScrollReveal>

      {/* Main Stats Widgets Grid */}
      <ScrollReveal className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Progress Score Widget */}
          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-cyan uppercase tracking-wider">Progress Gate</span>
              <TrendingUp className="w-5 h-5 text-cyan" />
            </div>
            <h3 className="text-3xl font-extrabold text-cyan font-mono">{progressScore}%</h3>
            <p className="text-xs text-text-muted mt-1">
              {progressScore >= 70 ? 'Unlocked for Internships & Jobs' : 'Need 70%+ to unlock internships'}
            </p>
            <div className="mt-3 w-full bg-void rounded-full h-2 overflow-hidden border border-border-subtle">
              <div className="bg-cyan h-full rounded-full transition-all duration-500" style={{ width: `${progressScore}%` }} />
            </div>
          </div>

          {/* Certificates Card */}
          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Certifications</span>
              <Award className="w-5 h-5 text-indigo-400" />
            </div>
            <h3 className="text-3xl font-extrabold text-indigo-400 font-mono">{certificateCount}</h3>
            <p className="text-xs text-text-muted mt-1">Verified achievements uploaded</p>
            <div className="mt-3">
              <Link to="/certifications" className="text-xs text-indigo-400 font-bold hover:underline">
                Upload New Certificate →
              </Link>
            </div>
          </div>

          {/* Profile Completion */}
          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Profile Health</span>
              <FileText className="w-5 h-5 text-emerald-400" />
            </div>
            <h3 className="text-3xl font-extrabold text-emerald-400 font-mono">{profileScore}%</h3>
            <p className="text-xs text-text-muted mt-1">Profile & credentials complete</p>
            <div className="mt-3 w-full bg-void rounded-full h-2 overflow-hidden border border-border-subtle">
              <div className="bg-emerald-400 h-full rounded-full transition-all duration-500" style={{ width: `${profileScore}%` }} />
            </div>
          </div>

          {/* Career XP & Rank */}
          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Rank & XP</span>
              <span className="text-2xl">🏆</span>
            </div>
            <h3 className="text-xl font-extrabold text-amber-400 leading-snug">{careerLevel}</h3>
            <p className="text-xs text-text-muted mt-1 font-mono">{careerXP} Career XP</p>
            <div className="mt-3 w-full bg-void rounded-full h-2 overflow-hidden border border-border-subtle">
              <div
                className="bg-amber-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (careerXP / 300) * 100)}%` }}
              />
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* Badges Section */}
      <ScrollReveal className="mb-8">
        <div className="glass-card rounded-2xl p-6">
          <h3 className="font-display font-bold text-text-primary text-base mb-4">
            Unlocked Career Achievements ({badges.length})
          </h3>

          <div className="flex flex-wrap gap-3">
            {badges.length === 0 ? (
              <p className="text-xs text-text-muted">No achievements unlocked yet. Analyze your resume or upload certificates!</p>
            ) : (
              badges.map((badge, idx) => (
                <div
                  key={idx}
                  className="px-4 py-2 rounded-xl bg-elevated border border-border-subtle text-text-primary text-xs font-bold flex items-center gap-2"
                >
                  {badge}
                </div>
              ))
            )}
          </div>
        </div>
      </ScrollReveal>

      {/* Quick Actions Grid */}
      <ScrollReveal>
        <h3 className="font-display font-bold text-text-primary text-lg mb-4">
          Quick Action Workflows
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {quickActions.map((action) => (
            <Link
              key={action.label}
              to={action.href}
              className="glass-card rounded-2xl p-5 text-center flex flex-col items-center justify-between hover:border-cyan/50 group"
            >
              <div className="w-12 h-12 rounded-xl bg-elevated flex items-center justify-center mb-3 group-hover:bg-cyan/10 transition-colors">
                <action.icon className={`w-6 h-6 ${action.color}`} />
              </div>

              <div>
                <div className="text-text-primary text-sm font-bold group-hover:text-cyan transition-colors">
                  {action.label}
                </div>
                <div className="text-text-muted text-[11px] mt-1 leading-tight">
                  {action.desc}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </ScrollReveal>
    </PageLayout>
  )
}