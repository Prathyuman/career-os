import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import PageLayout from '../components/PageLayout'
import ScrollReveal from '../components/ScrollReveal'
import {
  FolderGit2,
  CheckCircle2,
  Circle,
  Sparkles,
  ArrowRight,
  Terminal,
  Cpu,
  Eye,
  X,
} from 'lucide-react'
import { auth, db } from '../lib/firebase'
import { onAuthStateChanged } from 'firebase/auth'
import {
  doc,
  getDoc,
  getDocs,
  collection,
  query,
  where,
  deleteDoc,
  addDoc,
} from 'firebase/firestore'

interface ProjectBlueprint {
  id: string
  title: string
  category: string
  objective: string
  features: string[]
  techStack: string[]
  skillsDemonstrated: string[]
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  isCompleted?: boolean
}

// Default rich blueprints if user hasn't generated recommendations yet
const defaultBlueprints: ProjectBlueprint[] = [
  {
    id: 'default-1',
    title: 'AI-Powered Career & Resume Analytics Platform',
    category: 'Full-Stack & AI',
    objective: 'Build a production-grade web SaaS that parses resumes with Gemini LLM, extracts skill vectors, and delivers real-time career matching.',
    features: [
      'PDF text parsing & Gemini API structural prompt pipeline',
      'Realtime Firestore document synchronization',
      'Interactive ATS score charts & skill gap visualizer',
      'JWT Authentication & Role-Based Access Control',
    ],
    techStack: ['React', 'TypeScript', 'Node.js', 'Express', 'Firebase', 'Gemini API'],
    skillsDemonstrated: ['LLM Engineering', 'REST API Architecture', 'Cloud Auth', 'React State Management'],
    difficulty: 'Advanced',
  },
  {
    id: 'default-2',
    title: 'Containerized CI/CD Microservices Infrastructure',
    category: 'DevOps & Cloud',
    objective: 'Architect a scalable microservices cluster with Docker containerization, automated GitHub Actions pipeline, and cloud deployment.',
    features: [
      'Docker multi-stage builds for frontend and API services',
      'GitHub Actions automated lint, test, and build workflows',
      'Nginx reverse proxy with SSL termination',
      'Health check monitoring & Docker Compose cluster orchestration',
    ],
    techStack: ['Docker', 'GitHub Actions', 'Nginx', 'Node.js', 'Linux', 'AWS / Render'],
    skillsDemonstrated: ['Dockerization', 'CI/CD Pipelines', 'Reverse Proxies', 'Cloud Ops'],
    difficulty: 'Intermediate',
  },
  {
    id: 'default-3',
    title: 'Real-Time Distributed Collaborative Engine',
    category: 'Backend & Systems',
    objective: 'Implement a low-latency WebSockets backend for real-time multiplayer document editing or live chat rooms.',
    features: [
      'WebSocket state synchronization & event dispatchers',
      'Redis pub/sub messaging channel for horizontal scalability',
      'Database connection pooling & transactional persistence',
      'Debounced client input stream processing',
    ],
    techStack: ['Node.js', 'Socket.io', 'Redis', 'PostgreSQL', 'TypeScript'],
    skillsDemonstrated: ['WebSockets', 'Pub/Sub Messaging', 'Distributed Systems', 'Low-Latency APIs'],
    difficulty: 'Advanced',
  },
]

export default function ProjectsPage() {
  const [blueprints, setBlueprints] = useState<ProjectBlueprint[]>([])
  const [completedProjectIds, setCompletedProjectIds] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [activeBlueprintModal, setActiveBlueprintModal] = useState<ProjectBlueprint | null>(null)

  const fetchProjectData = async (user: NonNullable<typeof auth.currentUser>) => {
    try {
      setLoading(true)

      // Fetch completed project IDs from Firestore
      const q = query(
        collection(db, 'completedProjects'),
        where('userId', '==', user.uid)
      )
      const snapshot = await getDocs(q)
      const completedIds = snapshot.docs.map((docSnap) => docSnap.data().projectId)
      setCompletedProjectIds(completedIds)

      // Fetch AI recommended project titles from githubAnalysis
      const githubRef = doc(db, 'githubAnalysis', user.uid)
      const githubSnap = await getDoc(githubRef)

      let aiProjects: string[] = []
      if (githubSnap.exists()) {
        aiProjects = githubSnap.data()?.recommendedProjects || []
      }

      if (aiProjects.length > 0) {
        const mappedBlueprints: ProjectBlueprint[] = aiProjects.map((title, idx) => {
          return {
            id: `ai-project-${idx}`,
            title,
            category: idx % 2 === 0 ? 'Full-Stack & Cloud' : 'DevOps & Systems',
            objective: `Build a portfolio-grade implementation of ${title} to prove core software engineering competency to tech recruiters.`,
            features: [
              `Design modular backend API architecture for ${title}`,
              'Implement clean responsive UI with dark mode support',
              'Set up automated unit tests & GitHub repository documentation',
              'Deploy live demo with cloud hosting provider',
            ],
            techStack: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Docker'],
            skillsDemonstrated: ['System Architecture', 'API Development', 'Clean Code', 'Git Workflow'],
            difficulty: idx === 0 ? 'Intermediate' : 'Advanced',
          }
        })

        // Merge AI projects with defaults to ensure rich choice
        setBlueprints([...mappedBlueprints, ...defaultBlueprints])
      } else {
        setBlueprints(defaultBlueprints)
      }
    } catch (error) {
      console.error('Error loading projects:', error)
      setBlueprints(defaultBlueprints)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) fetchProjectData(user)
      else setLoading(false)
    })
    return () => unsubscribe()
  }, [])

  const toggleProjectCompletion = async (project: ProjectBlueprint) => {
    const user = auth.currentUser
    if (!user) return

    const isCompleted = completedProjectIds.includes(project.id)

    try {
      if (isCompleted) {
        // Delete doc
        const q = query(
          collection(db, 'completedProjects'),
          where('userId', '==', user.uid),
          where('projectId', '==', project.id)
        )
        const snap = await getDocs(q)
        for (const d of snap.docs) {
          await deleteDoc(doc(db, 'completedProjects', d.id))
        }
        setCompletedProjectIds(completedProjectIds.filter((id) => id !== project.id))
      } else {
        // Add doc
        await addDoc(collection(db, 'completedProjects'), {
          userId: user.uid,
          projectId: project.id,
          projectTitle: project.title,
          completedAt: new Date().toISOString(),
        })
        setCompletedProjectIds([...completedProjectIds, project.id])
      }
    } catch (e) {
      console.error('Failed to toggle project completion:', e)
    }
  }

  const completedCount = completedProjectIds.length

  return (
    <PageLayout title="Project Blueprints & Portfolio Roadmap">
      {/* Header Banner */}
      <ScrollReveal className="mb-8">
        <div className="glass-card rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-cyan/10 border border-cyan/20 flex items-center justify-center text-cyan flex-shrink-0">
              <FolderGit2 className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="w-4 h-4 text-cyan" />
                <span className="text-xs font-bold uppercase tracking-wider text-cyan">Personalized Project Blueprints</span>
              </div>
              <h2 className="text-xl font-bold text-text-primary">
                Recommended Projects to Build ({blueprints.length})
              </h2>
              <p className="text-text-secondary text-sm mt-1">
                Completing recommended project blueprints directly boosts your <strong className="text-cyan">Progress Score</strong> for Internships & Jobs.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 flex-shrink-0">
            <div className="text-right">
              <p className="text-xs text-text-muted">Portfolio Completed</p>
              <p className="text-lg font-bold text-emerald-400">{completedCount} of {blueprints.length} Built</p>
            </div>
            <Link
              to="/github-analyzer"
              className="px-4 py-2.5 rounded-xl bg-cyan/10 text-cyan border border-cyan/20 text-xs font-bold flex items-center gap-1.5 hover:bg-cyan/20 transition-all"
            >
              Scan GitHub <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </ScrollReveal>

      {/* Projects Grid */}
      <ScrollReveal>
        {loading ? (
          <div className="glass-card rounded-2xl p-12 text-center">
            <p className="text-text-secondary text-sm font-medium animate-pulse">
              Loading AI project blueprints tailored to your target skills...
            </p>
          </div>
        ) : blueprints.length === 0 ? (
          <div className="glass-card rounded-2xl p-12 text-center">
            <FolderGit2 className="w-14 h-14 text-text-muted mx-auto mb-4" />
            <h3 className="text-lg font-bold text-text-primary mb-2">No Recommended Projects Found</h3>
            <p className="text-text-secondary text-sm max-w-md mx-auto">
              Run a scan on GitHub Analyzer or Resume Analyzer to generate AI project recommendations.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {blueprints.map((project) => {
              const isCompleted = completedProjectIds.includes(project.id)

              return (
                <div
                  key={project.id}
                  className={`glass-card rounded-2xl p-6 md:p-8 flex flex-col justify-between transition-all ${
                    isCompleted ? 'border-emerald-500/40 bg-emerald-500/5' : 'hover:border-cyan/50'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-cyan/10 text-cyan border border-cyan/20">
                        {project.category}
                      </span>

                      <button
                        onClick={() => toggleProjectCompletion(project)}
                        className="flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-xl transition-all border"
                        style={{
                          borderColor: isCompleted ? 'rgba(16,185,129,0.3)' : 'rgba(255,255,255,0.1)',
                          backgroundColor: isCompleted ? 'rgba(16,185,129,0.1)' : 'rgba(255,255,255,0.05)',
                          color: isCompleted ? '#34d399' : '#94a3b8',
                        }}
                      >
                        {isCompleted ? (
                          <>
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Completed
                          </>
                        ) : (
                          <>
                            <Circle className="w-4 h-4" /> Mark Built
                          </>
                        )}
                      </button>
                    </div>

                    <h3 className="text-xl font-bold text-text-primary mb-3 leading-snug">
                      {project.title}
                    </h3>
                    <p className="text-xs text-text-secondary mb-6 leading-relaxed">
                      {project.objective}
                    </p>

                    {/* Features list */}
                    <div className="mb-6">
                      <p className="text-xs font-bold text-text-primary uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                        <Terminal className="w-3.5 h-3.5 text-cyan" /> Key Blueprint Deliverables
                      </p>
                      <ul className="space-y-1.5 text-xs text-text-secondary">
                        {project.features.map((feat, fIdx) => (
                          <li key={fIdx} className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-cyan mt-1.5 flex-shrink-0" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Tech Stack */}
                    <div className="mb-6">
                      <p className="text-xs font-bold text-text-primary uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <Cpu className="w-3.5 h-3.5 text-indigo-400" /> Recommended Stack
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {project.techStack.map((tech, tIdx) => (
                          <span
                            key={tIdx}
                            className="px-2.5 py-1 rounded-lg text-xs font-medium bg-elevated text-cyan border border-border-subtle"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border-subtle flex items-center justify-between">
                    <span className="text-xs text-text-muted">
                      Difficulty: <strong className="text-text-primary">{project.difficulty}</strong>
                    </span>
                    <button
                      onClick={() => setActiveBlueprintModal(project)}
                      className="px-4 py-2 rounded-xl bg-elevated hover:bg-elevated/80 text-cyan text-xs font-bold flex items-center gap-1 transition-colors"
                    >
                      Full Architecture <Eye className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </ScrollReveal>

      {/* Blueprint Architecture Modal */}
      {activeBlueprintModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-surface border border-border-subtle rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl p-6 md:p-8">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-border-subtle">
              <div>
                <span className="text-xs font-bold text-cyan uppercase tracking-wider">{activeBlueprintModal.category}</span>
                <h3 className="text-xl font-bold text-text-primary">{activeBlueprintModal.title}</h3>
              </div>
              <button onClick={() => setActiveBlueprintModal(null)} className="text-text-muted hover:text-text-primary">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6 overflow-auto pr-2">
              <div>
                <h4 className="text-xs font-bold text-text-primary uppercase tracking-wider mb-2">Project Goal & Impact</h4>
                <p className="text-sm text-text-secondary leading-relaxed">{activeBlueprintModal.objective}</p>
              </div>

              <div>
                <h4 className="text-xs font-bold text-text-primary uppercase tracking-wider mb-2">Detailed Architecture Steps</h4>
                <div className="space-y-2 text-xs text-text-secondary">
                  {activeBlueprintModal.features.map((feat, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-elevated border border-border-subtle flex items-start gap-3">
                      <span className="w-5 h-5 rounded-full bg-cyan/10 text-cyan flex items-center justify-center font-bold text-xs flex-shrink-0">
                        {idx + 1}
                      </span>
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-text-primary uppercase tracking-wider mb-2">Demonstrated Resume Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {activeBlueprintModal.skillsDemonstrated.map((s, idx) => (
                    <span key={idx} className="px-3 py-1 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-border-subtle flex items-center justify-between">
              <button
                onClick={() => {
                  toggleProjectCompletion(activeBlueprintModal)
                  setActiveBlueprintModal(null)
                }}
                className="px-5 py-2.5 rounded-xl bg-cyan text-deep text-xs font-bold hover:brightness-110 flex items-center gap-2"
              >
                {completedProjectIds.includes(activeBlueprintModal.id) ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" /> Marked as Built
                  </>
                ) : (
                  <>
                    <Circle className="w-4 h-4" /> Mark Project as Built
                  </>
                )}
              </button>
              <button
                onClick={() => setActiveBlueprintModal(null)}
                className="px-4 py-2.5 rounded-xl bg-elevated text-text-secondary text-xs font-bold hover:text-text-primary"
              >
                Close Blueprint
              </button>
            </div>
          </div>
        </div>
      )}
    </PageLayout>
  )
}