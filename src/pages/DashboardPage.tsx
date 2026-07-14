import { useEffect, useState } from 'react'
import { auth, db } from '../lib/firebase'
import { Link } from 'react-router-dom'
import PageLayout from '../components/PageLayout'
import ScrollReveal from '../components/ScrollReveal'
import {
  FileText,
  Github,
  BarChart3,
  Map,
  Briefcase,
  MessageSquare,
  Zap,
  Award,
} from 'lucide-react'

import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
} from 'firebase/firestore'
const quickActions = [
  {
    icon: FileText,
    label: 'Analyze Resume',
    desc: 'Get AI feedback',
    href: '/resume-analyzer',
    color: 'text-cyan',
  },
  {
    icon: Github,
    label: 'GitHub Scan',
    desc: 'Improve profile',
    href: '/github-analyzer',
    color: 'text-blue',
  },
  {
    icon: BarChart3,
    label: 'Skill Gap',
    desc: 'Find gaps',
    href: '/skill-gap',
    color: 'text-violet',
  },
  {
    icon: Map,
    label: 'Roadmap',
    desc: 'View plan',
    href: '/roadmap',
    color: 'text-coral',
  },
  {
    icon: Briefcase,
    label: 'Find Jobs',
    desc: 'New openings',
    href: '/jobs',
    color: 'text-cyan',
  },
  {
    icon: MessageSquare,
    label: 'Interview',
    desc: 'Practice',
    href: '/interview',
    color: 'text-blue',
  },
]

export default function DashboardPage() {
  const [userName, setUserName] = useState('User')
  const [certificateCount, setCertificateCount] = useState(0)
const [profileScore, setProfileScore] = useState(0)
const [careerXP, setCareerXP] = useState(0)
const [careerLevel, setCareerLevel] = useState('Explorer')
const [badges, setBadges] = useState<string[]>([])
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const user = auth.currentUser

        if (!user) return

        if (user.displayName) {
          setUserName(user.displayName)
        }

        const q = query(
          collection(db, 'certifications'),
          where('userId', '==', user.uid)
        )

        const snapshot = await getDocs(q)

       setCertificateCount(snapshot.size)

let score = 0

// Profile Photo
if (user.photoURL) score += 10

// Certificates
if (snapshot.size > 0) score += 20

// Resume Analysis
const resumeDoc = await getDoc(
  doc(db, 'resumeAnalysis', user.uid)
)

if (resumeDoc.exists()) {
  score += 25

  // Skills Added
  if (resumeDoc.data()?.foundSkills?.length > 0) {
    score += 20
  }
}

// GitHub Analysis
const githubDoc = await getDoc(
  doc(db, 'githubAnalysis', user.uid)
)

if (githubDoc.exists()) {
  score += 25
}

setProfileScore(score)

// Career XP Calculation
let xp = 0

// Profile Photo
if (user.photoURL) xp += 25

// Certificates
if (snapshot.size > 0) xp += 50

// Resume Analysis
if (resumeDoc.exists()) xp += 100

// Skills
if (
  resumeDoc.exists() &&
  resumeDoc.data()?.foundSkills?.length > 0
) {
  xp += 50
}

// GitHub Analysis
if (githubDoc.exists()) xp += 100

setCareerXP(xp)

// Career Level Calculation
if (xp >= 300) {
  setCareerLevel('Professional')
} else if (xp >= 200) {
  setCareerLevel('Developer')
} else if (xp >= 100) {
  setCareerLevel('Builder')
} else if (xp >= 50) {
  setCareerLevel('Learner')
} else {
  setCareerLevel('Explorer')
}
const earnedBadges = []

if (snapshot.size > 0) {
  earnedBadges.push('🏅 First Certificate')
}

if (resumeDoc.exists()) {
  earnedBadges.push('📄 Resume Uploaded')
}

if (githubDoc.exists()) {
  earnedBadges.push('💻 GitHub Connected')
}

if (xp >= 100) {
  earnedBadges.push('🚀 Career Builder')
}

if (xp >= 300) {
  earnedBadges.push('⭐ Professional Level')
}

setBadges(earnedBadges)
      } catch (error) {
        console.error(error)
      }
    }

    loadDashboardData()
  }, [])

  return (
    <PageLayout title="Dashboard">
      {/* Welcome Section */}
      <ScrollReveal>
        <div className="bg-surface rounded-lg border border-border-subtle p-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-cyan/20 flex items-center justify-center">
              <Zap className="w-6 h-6 text-cyan" />
            </div>

            <div>
              <h2 className="font-display font-semibold text-text-primary text-lg">
                Welcome back, {userName}!
              </h2>

              <p className="text-text-secondary text-sm">
                Track your skills, roadmap and career growth from one place.
                Keep up the momentum!
              </p>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* Stats Section */}
      <ScrollReveal className="mb-8">
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

    {/* Certificates Card */}
    <div className="bg-surface rounded-lg border border-border-subtle p-6 hover:border-cyan/50 transition-all">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-text-secondary text-sm">
            Certificates Earned
          </p>

          <h2 className="text-3xl font-bold text-cyan mt-2">
            {certificateCount}
          </h2>
        </div>

        <Award className="w-10 h-10 text-cyan" />
      </div>
    </div>

    {/* Profile Completion Card */}
    <div className="bg-surface rounded-lg border border-border-subtle p-6 hover:border-green-500/50 transition-all">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-text-secondary text-sm">
            Profile Completion
          </p>

          <h2 className="text-3xl font-bold text-green-400 mt-2">
            {profileScore}%
          </h2>
          <div className="mt-3 w-full bg-elevated rounded-full h-2">
  <div
    className="bg-green-400 h-2 rounded-full transition-all duration-500"
    style={{ width: `${profileScore}%` }}
  ></div>
</div>
        </div>

        <div className="text-4xl">
          📈
        </div>
      </div>
    </div>

    {/* Career Level Card */}
    <div className="bg-surface rounded-lg border border-border-subtle p-6 hover:border-yellow-500/50 transition-all">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-text-secondary text-sm">
            Career Level
          </p>

          <h2 className="text-2xl font-bold text-yellow-400 mt-2">
            {careerLevel}
          </h2>

          <p className="text-text-secondary text-sm mt-1">
            {careerXP} XP
          </p>
          <div className="mt-3 w-full bg-elevated rounded-full h-2">
  <div
    className="bg-yellow-400 h-2 rounded-full transition-all duration-500"
    style={{
      width: `${Math.min((careerXP / 300) * 100, 100)}%`,
    }}
  ></div>
</div>
        </div>

        <div className="text-4xl">
          🏆
        </div>
      </div>
    </div>

  </div>
</ScrollReveal>
<ScrollReveal className="mb-8">
  <div className="bg-surface rounded-lg border border-border-subtle p-6">
    <h3 className="font-display font-semibold text-text-primary mb-4">
      Achievements
    </h3>

    <div className="flex flex-wrap gap-3">
      {badges.length === 0 ? (
        <p className="text-text-muted">
          No achievements unlocked yet.
        </p>
      ) : (
        badges.map((badge, index) => (
          <div
            key={index}
            className="bg-elevated px-4 py-2 rounded-full border border-border-subtle text-text-primary text-sm"
          >
            {badge}
          </div>
        ))
      )}
    </div>
  </div>
</ScrollReveal>
      {/* Quick Actions */}
      <ScrollReveal className="mb-8">
        <h3 className="font-display font-semibold text-text-primary mb-4">
          Quick Actions
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {quickActions.map((action) => (
            <Link
              key={action.label}
              to={action.href}
              className="bg-surface rounded-lg border border-border-subtle p-4 text-center hover:border-cyan/20 hover:-translate-y-0.5 transition-all duration-200 group"
            >
              <div className="w-10 h-10 rounded-lg bg-elevated flex items-center justify-center mx-auto mb-2 group-hover:bg-cyan/10 transition-colors">
                <action.icon className={`w-5 h-5 ${action.color}`} />
              </div>

              <div className="text-text-primary text-sm font-medium">
                {action.label}
              </div>

              <div className="text-text-muted text-xs mt-0.5">
                {action.desc}
              </div>
            </Link>
          ))}
        </div>
      </ScrollReveal>
    </PageLayout>
  )
}