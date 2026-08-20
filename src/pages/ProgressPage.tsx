import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import PageLayout from '../components/PageLayout'
import ScrollReveal from '../components/ScrollReveal'
import {
  BookOpen,
  FolderGit2,
  FileText,
  CheckCircle2,
  Sparkles,
  Lock,
  ArrowRight,
  BrainCircuit,
  Building2,
} from 'lucide-react'
import { auth, db } from '../lib/firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { getDetailedProgressBreakdown, type ProgressBreakdown } from '../lib/progressScore'
import { fetchUserInternships, type InternshipExperience } from '../services/internshipLogService'
import { doc, getDoc, getDocs, collection, query, where } from 'firebase/firestore'

interface ProjectLog {
  id: string
  projectTitle: string
  completedAt: string
}

interface InterviewResultLog {
  id: string
  targetRole: string
  score: number
  completedAt: any
}

export default function ProgressPage() {
  const [progressData, setProgressData] = useState<ProgressBreakdown | null>(null)
  const [completedProjectsList, setCompletedProjectsList] = useState<ProjectLog[]>([])
  const [internshipLogs, setInternshipLogs] = useState<InternshipExperience[]>([])
  const [interviewHistory, setInterviewHistory] = useState<InterviewResultLog[]>([])

  useEffect(() => {
    const loadAnalyticsData = async (user: NonNullable<typeof auth.currentUser>) => {
      try {
        // 1. Resume & Course Data
        const resumeSnap = await getDoc(doc(db, 'resumeAnalysis', user.uid))
        let resumeData: any = {}
        if (resumeSnap.exists()) {
          resumeData = resumeSnap.data()
        }

        // 2. Completed Projects Data
        const projSnap = await getDocs(
          query(collection(db, 'completedProjects'), where('userId', '==', user.uid))
        )
        const projList: ProjectLog[] = projSnap.docs.map((d) => ({
          id: d.id,
          projectTitle: d.data().projectTitle || 'Software Project',
          completedAt: d.data().completedAt || new Date().toISOString(),
        }))
        setCompletedProjectsList(projList)

        // 3. Logged Internships Data
        const internList = await fetchUserInternships(user.uid)
        setInternshipLogs(internList)

        // 4. Interview History
        const interviewSnap = await getDocs(
          query(collection(db, 'interviewResults'), where('userId', '==', user.uid))
        )
        const interviews: InterviewResultLog[] = interviewSnap.docs.map((d) => ({
          id: d.id,
          targetRole: d.data().targetRole || 'Software Engineer',
          score: d.data().score || 0,
          completedAt: d.data().completedAt,
        }))
        setInterviewHistory(interviews)

        // 5. Calculate Progress Breakdown
        const breakdown = getDetailedProgressBreakdown({
          careerReadinessScore: resumeData.careerReadinessScore,
          atsScore: resumeData.atsCompatibility,
          totalCourses: resumeData.learningRoadmap?.length || 5,
          completedCoursesCount: (resumeData.completedCourses || []).length,
          totalProjects: 3,
          completedProjectsCount: projList.length,
          resumeUpdatedAt: resumeData.analyzedAt,
        })

        setProgressData(breakdown)
      } catch (e) {
        console.error('Error loading progress analytics:', e)
      }
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) loadAnalyticsData(user)
    })
    return () => unsubscribe()
  }, [])

  const score = progressData?.score || 0
  const internshipsUnlocked = score >= 70
  const jobsUnlocked = score >= 70 && internshipLogs.length >= 2

  return (
    <PageLayout title="Career Progress & Personal Analytics">
      {/* Overview Analytics Header */}
      <ScrollReveal className="mb-8">
        <div className="glass-card rounded-2xl p-6 md:p-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div className="flex items-center gap-6">
            {/* Animated Score Circle */}
            <div className="relative w-24 h-24 rounded-full bg-void border-4 border-cyan flex flex-col items-center justify-center shadow-lg flex-shrink-0">
              <span className="text-2xl font-extrabold text-cyan font-mono">{score}%</span>
              <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider">Progress</span>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="w-4 h-4 text-cyan" />
                <span className="text-xs font-bold uppercase tracking-wider text-cyan">Career Readiness Index</span>
              </div>
              <h2 className="text-2xl font-extrabold text-text-primary">
                Personal Growth Dashboard
              </h2>
              <p className="text-text-secondary text-sm mt-1">
                Real-time synthesis of course completion, project milestones, resume quality & interview prep.
              </p>
            </div>
          </div>

          {/* Gate Unlock Status Badges */}
          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <div className={`p-4 rounded-xl border flex items-center gap-3 ${internshipsUnlocked ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-elevated border-border-subtle text-text-muted'}`}>
              {internshipsUnlocked ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : <Lock className="w-5 h-5 text-amber-400" />}
              <div>
                <p className="text-xs font-bold text-text-primary">Internships Finder</p>
                <p className="text-[11px]">{internshipsUnlocked ? 'Unlocked (70%+ Score)' : 'Locked (< 70% Score)'}</p>
              </div>
            </div>

            <div className={`p-4 rounded-xl border flex items-center gap-3 ${jobsUnlocked ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-elevated border-border-subtle text-text-muted'}`}>
              {jobsUnlocked ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : <Lock className="w-5 h-5 text-amber-400" />}
              <div>
                <p className="text-xs font-bold text-text-primary">Full-Time Jobs</p>
                <p className="text-[11px]">{jobsUnlocked ? 'Unlocked (2 Internships)' : 'Locked (Dual Req)'}</p>
              </div>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* Progress Breakdown Cards */}
      <ScrollReveal className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Courses Component */}
          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-cyan/10 text-cyan flex items-center justify-center">
                <BookOpen className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-cyan uppercase tracking-wider">Weight: 35%</span>
            </div>
            <h3 className="text-sm font-bold text-text-primary mb-1">Free Courses Completed</h3>
            <p className="text-2xl font-extrabold text-cyan font-mono mb-3">
              {progressData?.coursesProgressStr || '0 Completed'}
            </p>
            <div className="w-full bg-elevated rounded-full h-2 overflow-hidden mb-3">
              <div
                className="bg-cyan h-full transition-all duration-500"
                style={{ width: `${progressData?.courseScore || 0}%` }}
              />
            </div>
            <Link to="/courses" className="text-xs font-bold text-cyan hover:underline flex items-center gap-1">
              Go to Courses <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {/* Projects Component */}
          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
                <FolderGit2 className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Weight: 35%</span>
            </div>
            <h3 className="text-sm font-bold text-text-primary mb-1">Project Blueprints Built</h3>
            <p className="text-2xl font-extrabold text-indigo-400 font-mono mb-3">
              {progressData?.projectsProgressStr || '0 Completed'}
            </p>
            <div className="w-full bg-elevated rounded-full h-2 overflow-hidden mb-3">
              <div
                className="bg-indigo-400 h-full transition-all duration-500"
                style={{ width: `${progressData?.projectScore || 0}%` }}
              />
            </div>
            <Link to="/projects" className="text-xs font-bold text-indigo-400 hover:underline flex items-center gap-1">
              Explore Projects <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {/* Resume Quality & Recency */}
          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Weight: 30%</span>
            </div>
            <h3 className="text-sm font-bold text-text-primary mb-1">Resume Quality & Recency</h3>
            <p className="text-2xl font-extrabold text-emerald-400 font-mono mb-3">
              {progressData?.resumeStatusStr || 'Not uploaded'}
            </p>
            <div className="w-full bg-elevated rounded-full h-2 overflow-hidden mb-3">
              <div
                className="bg-emerald-400 h-full transition-all duration-500"
                style={{ width: `${progressData?.resumeScore || 0}%` }}
              />
            </div>
            <Link to="/resume-analyzer" className="text-xs font-bold text-emerald-400 hover:underline flex items-center gap-1">
              Analyze Resume <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </ScrollReveal>

      {/* History Grids */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Completed Projects Milestone History */}
        <ScrollReveal>
          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-border-subtle">
              <div className="flex items-center gap-2">
                <FolderGit2 className="w-5 h-5 text-indigo-400" />
                <h3 className="text-base font-bold text-text-primary">Completed Projects ({completedProjectsList.length})</h3>
              </div>
              <Link to="/projects" className="text-xs text-cyan font-bold hover:underline">Manage</Link>
            </div>

            {completedProjectsList.length === 0 ? (
              <div className="p-8 text-center text-text-muted text-xs">
                No built projects recorded yet. Build blueprints to increase your score!
              </div>
            ) : (
              <div className="space-y-3">
                {completedProjectsList.map((proj) => (
                  <div key={proj.id} className="p-3.5 rounded-xl bg-elevated/50 border border-border-subtle flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span className="font-bold text-text-primary">{proj.projectTitle}</span>
                    </div>
                    <span className="text-text-muted font-mono">{new Date(proj.completedAt).toLocaleDateString()}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </ScrollReveal>

        {/* Verified Internship Experience History */}
        <ScrollReveal>
          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-border-subtle">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold text-text-primary">Logged Internships ({internshipLogs.length})</h3>
              </div>
              <Link to="/jobs" className="text-xs text-cyan font-bold hover:underline">Log Experience</Link>
            </div>

            {internshipLogs.length === 0 ? (
              <div className="p-8 text-center text-text-muted text-xs">
                No internship experiences logged yet. Log 2 experiences to unlock full-time jobs!
              </div>
            ) : (
              <div className="space-y-3">
                {internshipLogs.map((log) => (
                  <div key={log.id} className="p-3.5 rounded-xl bg-elevated/50 border border-border-subtle flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-text-primary">{log.role}</p>
                      <p className="text-text-secondary">{log.company} ({log.duration})</p>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      VERIFIED
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </ScrollReveal>
      </div>

      {/* AI Mock Interview History */}
      <ScrollReveal className="mt-8">
        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-border-subtle">
            <div className="flex items-center gap-2">
              <BrainCircuit className="w-5 h-5 text-cyan" />
              <h3 className="text-base font-bold text-text-primary">AI Mock Interview History ({interviewHistory.length})</h3>
            </div>
            <Link to="/interview" className="text-xs text-cyan font-bold hover:underline">Take Mock Interview</Link>
          </div>

          {interviewHistory.length === 0 ? (
            <div className="p-8 text-center text-text-muted text-xs">
              No interview sessions completed yet. Practice with the 3-Round AI Coach to test your skills!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {interviewHistory.map((item) => (
                <div key={item.id} className="p-4 rounded-xl bg-elevated/50 border border-border-subtle">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-text-muted font-mono">3-Round Session</span>
                    <span className="text-sm font-extrabold text-cyan font-mono">{item.score}%</span>
                  </div>
                  <p className="text-xs font-bold text-text-primary">{item.targetRole}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </ScrollReveal>
    </PageLayout>
  )
}