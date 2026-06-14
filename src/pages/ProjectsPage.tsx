import PageLayout from '../components/PageLayout'
import ScrollReveal from '../components/ScrollReveal'
import {
  FolderGit2,
  Star,
  ArrowUpRight,
  Github,
  ExternalLink,
  Zap,
  Target,
} from 'lucide-react'

const recommendedProjects = [
  {
    title: 'Build a Real-time Chat App',
    description: 'Learn WebSockets by building a Slack-like chat application with React and Node.js.',
    difficulty: 'Intermediate',
    skills: ['React', 'Node.js', 'Socket.io'],
    stars: 234,
    why: 'Improves full-stack skills highly requested in job postings.',
  },
  {
    title: 'E-commerce Platform with Microservices',
    description: 'Design and build a scalable e-commerce platform using microservices architecture.',
    difficulty: 'Advanced',
    skills: ['Docker', 'Kubernetes', 'Node.js', 'MongoDB'],
    stars: 189,
    why: 'Demonstrates system design and architecture knowledge.',
  },
  {
    title: 'AI-Powered Resume Analyzer',
    description: 'Build a tool that parses and scores resumes using NLP techniques.',
    difficulty: 'Advanced',
    skills: ['Python', 'NLP', 'React', 'FastAPI'],
    stars: 312,
    why: 'Showcases ML integration with web development.',
  },
  {
    title: 'Personal Portfolio with 3D Effects',
    description: 'Create an interactive portfolio using Three.js and modern animations.',
    difficulty: 'Intermediate',
    skills: ['Three.js', 'React', 'GSAP'],
    stars: 156,
    why: 'Great for showcasing frontend creativity to recruiters.',
  },
  {
    title: 'Task Management Dashboard',
    description: 'A Trello-like Kanban board with drag-and-drop and real-time collaboration.',
    difficulty: 'Intermediate',
    skills: ['React', 'TypeScript', 'Firebase'],
    stars: 198,
    why: 'Covers state management and real-time data patterns.',
  },
  {
    title: 'Open Source CLI Tool',
    description: 'Build a command-line tool that solves a developer workflow problem.',
    difficulty: 'Beginner',
    skills: ['Node.js', 'CLI Design', 'Testing'],
    stars: 87,
    why: 'Easy entry into open source contribution.',
  },
]

const myProjects = [
  { name: 'Career Dashboard', description: 'Personal career tracking app', tech: ['React', 'TypeScript', 'Tailwind'], github: '#', demo: '#' },
  { name: 'AI Resume Parser', description: 'NLP-based resume analysis tool', tech: ['Python', 'FastAPI', 'React'], github: '#', demo: '#' },
  { name: 'Skill Graph Viz', description: 'Interactive skill network visualization', tech: ['D3.js', 'React'], github: '#', demo: '#' },
]

export default function ProjectsPage() {
  return (
    <PageLayout title="Project Recommendations">
      {/* My Projects */}
      <ScrollReveal className="mb-8">
        <h3 className="font-display font-semibold text-text-primary mb-4 flex items-center gap-2">
          <FolderGit2 className="w-4 h-4 text-cyan" />
          My Projects
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {myProjects.map((project) => (
            <div key={project.name} className="bg-surface rounded-lg border border-border-subtle p-5">
              <h4 className="text-text-primary text-sm font-medium mb-1">{project.name}</h4>
              <p className="text-text-muted text-xs mb-3">{project.description}</p>
              <div className="flex flex-wrap gap-1.5 mb-4">
                {project.tech.map((t) => (
                  <span key={t} className="px-2 py-0.5 rounded-pill bg-elevated text-text-muted text-xs">{t}</span>
                ))}
              </div>
              <div className="flex gap-2">
                <a href={project.github} className="flex-1 py-1.5 rounded-md bg-elevated text-text-secondary text-xs text-center hover:text-cyan transition-colors flex items-center justify-center gap-1">
                  <Github className="w-3 h-3" />
                  Code
                </a>
                <a href={project.demo} className="flex-1 py-1.5 rounded-md bg-elevated text-text-secondary text-xs text-center hover:text-cyan transition-colors flex items-center justify-center gap-1">
                  <ExternalLink className="w-3 h-3" />
                  Demo
                </a>
              </div>
            </div>
          ))}
        </div>
      </ScrollReveal>

      {/* Recommended Projects */}
      <ScrollReveal>
        <h3 className="font-display font-semibold text-text-primary mb-4 flex items-center gap-2">
          <Zap className="w-4 h-4 text-coral" />
          AI-Recommended Projects
        </h3>
        <p className="text-text-secondary text-sm mb-6">
          Based on your skill gap analysis, these projects will help you build the most in-demand skills.
        </p>
        <div className="space-y-4">
          {recommendedProjects.map((project) => (
            <div
              key={project.title}
              className="bg-surface rounded-lg border border-border-subtle p-5 hover:border-cyan/20 transition-all duration-200 group"
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="text-text-primary text-sm font-medium group-hover:text-cyan transition-colors flex items-center gap-2">
                      {project.title}
                      <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </h4>
                    <span className={`text-xs px-2 py-0.5 rounded-md ${
                      project.difficulty === 'Beginner' ? 'bg-cyan/10 text-cyan' :
                      project.difficulty === 'Intermediate' ? 'bg-violet/10 text-violet' :
                      'bg-coral/10 text-coral'
                    }`}>
                      {project.difficulty}
                    </span>
                  </div>
                  <p className="text-text-secondary text-sm mb-3">{project.description}</p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {project.skills.map((skill) => (
                      <span key={skill} className="px-2 py-0.5 rounded-pill bg-cyan/10 text-cyan text-xs">{skill}</span>
                    ))}
                  </div>
                  <div className="flex items-center gap-1 text-text-muted text-xs">
                    <Target className="w-3 h-3 text-coral" />
                    <span className="text-coral">{project.why}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-text-muted text-sm flex-shrink-0">
                  <Star className="w-4 h-4 fill-cyan text-cyan" />
                  {project.stars}
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollReveal>
    </PageLayout>
  )
}
