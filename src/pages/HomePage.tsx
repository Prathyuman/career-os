import { Link } from 'react-router-dom'
import ScrollReveal from '../components/ScrollReveal'
import {
  Upload,
  Brain,
  Map as MapIcon,
  TrendingUp,
  FileText,
  Github,
  BarChart3,
  Route,
  Briefcase,
  MessageSquare,
  ArrowRight,
  Star,
  ChevronLeft,
  ChevronRight,
  Play,
} from 'lucide-react'
import { useState, useRef, useEffect, useCallback } from 'react'

/* ──────────── HERO ──────────── */
function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-16">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, rgba(3,4,94,0.6) 0%, transparent 40%)',
        }}
      />
      <div className="relative z-10 text-center max-w-4xl mx-auto">
        <h1
          className="font-display font-bold leading-[1.05] tracking-[-0.03em]"
          style={{ fontSize: 'clamp(3rem, 8vw, 6rem)' }}
        >
          <span className="text-text-primary">Your Career</span>{' '}
          <span
            className="text-cyan animate-glow-pulse"
            style={{ textShadow: '0 0 40px rgba(0,180,216,0.5)' }}
          >
            OS
          </span>
        </h1>
        <p className="mt-6 text-lg md:text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed">
          The AI-powered platform that analyzes your skills, builds personalized roadmaps, and connects you with opportunities to accelerate your career growth.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/signup"
            className="px-8 py-3.5 rounded-pill bg-cyan text-deep font-semibold text-base hover:brightness-110 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-glow"
          >
            Get Started Free
          </Link>
          <Link
            to="/dashboard"
            className="px-8 py-3.5 rounded-pill border border-cyan text-cyan font-semibold text-base hover:bg-cyan/10 transition-all duration-200"
          >
            Explore Dashboard
          </Link>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto">
          {[
            { value: '50K+', label: 'Users' },
            { value: '12K+', label: 'Jobs Found' },
            { value: '98%', label: 'Success Rate' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="font-display text-2xl md:text-3xl font-bold text-text-primary">{stat.value}</div>
              <div className="text-xs text-text-muted mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <div className="w-px h-10 bg-text-muted/30 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-3 bg-cyan rounded-full animate-scroll-pulse" />
        </div>
      </div>
    </section>
  )
}

/* ──────────── HOW IT WORKS ──────────── */
const steps = [
  {
    icon: Upload,
    title: 'Upload Your Resume',
    description: 'Upload your resume or connect your GitHub profile. Our AI analyzes your skills, experience, and projects instantly.',
  },
  {
    icon: Brain,
    title: 'AI Analysis',
    description: 'Our advanced AI identifies your strengths, skill gaps, and matches you with optimal career opportunities.',
  },
  {
    icon: MapIcon,
    title: 'Get Your Roadmap',
    description: 'Receive a personalized career roadmap with actionable steps, courses, and milestones tailored to your goals.',
  },
  {
    icon: TrendingUp,
    title: 'Track & Grow',
    description: 'Monitor your progress, earn certifications, and watch your employability score rise as you complete each step.',
  },
]

function HowItWorksSection() {
  return (
    <section className="py-24 px-6" id="how-it-works">
      <div className="max-w-[1280px] mx-auto">
        <ScrollReveal className="text-center mb-16">
          <h2
            className="font-display font-bold text-text-primary"
            style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)' }}
          >
            How CareerOS Works
          </h2>
          <p className="mt-4 text-text-secondary max-w-xl mx-auto">
            Four simple steps to transform your career trajectory with AI-powered guidance.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <ScrollReveal key={step.title} delay={i * 0.15}>
              <div className="relative bg-surface rounded-lg p-6 border border-border-subtle hover:border-cyan/20 hover:-translate-y-1 transition-all duration-300 group h-full">
                <div className="absolute -top-3 -left-1 w-8 h-8 rounded-full bg-cyan flex items-center justify-center text-deep font-bold text-sm z-10">
                  {i + 1}
                </div>
                <div className="w-16 h-16 rounded-full bg-cyan/10 flex items-center justify-center mb-4 group-hover:bg-cyan/20 transition-colors">
                  <step.icon className="w-8 h-8 text-cyan/80" />
                </div>
                <h3 className="font-display font-semibold text-text-primary text-lg mb-2">{step.title}</h3>
                <p className="text-text-secondary text-sm leading-relaxed">{step.description}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ──────────── SKILL NETWORK SVG ──────────── */
const nodes = [
  { id: 'js', x: 200, y: 150, r: 10 },
  { id: 'react', x: 260, y: 110, r: 8 },
  { id: 'node', x: 310, y: 160, r: 7 },
  { id: 'ts', x: 250, y: 210, r: 7 },
  { id: 'db', x: 150, y: 210, r: 8 },
  { id: 'design', x: 120, y: 130, r: 8 },
  { id: 'lead', x: 190, y: 70, r: 7 },
  { id: 'ai', x: 330, y: 90, r: 9 },
]

const connections = [
  { from: 'js', to: 'react', curve: -30 },
  { from: 'js', to: 'node', curve: 30 },
  { from: 'js', to: 'ts', curve: -20 },
  { from: 'js', to: 'design', curve: 40 },
  { from: 'react', to: 'node', curve: -20 },
  { from: 'db', to: 'js', curve: 25 },
  { from: 'design', to: 'js', curve: -40 },
  { from: 'lead', to: 'react', curve: 35 },
  { from: 'ai', to: 'node', curve: -25 },
]

function getPathD(n1: typeof nodes[0], n2: typeof nodes[0], curve: number) {
  const mx = (n1.x + n2.x) / 2
  const my = (n1.y + n2.y) / 2
  const dx = n2.x - n1.x
  const dy = n2.y - n1.y
  const dist = Math.sqrt(dx * dx + dy * dy)
  const ndx = -dy / dist
  const ndy = dx / dist
  const cx = mx + ndx * curve
  const cy = my + ndy * curve
  return `M${n1.x},${n1.y} Q${cx},${cy} ${n2.x},${n2.y}`
}

function SkillNetworkSection() {
  const svgRef = useRef<SVGSVGElement>(null)
  const [animated, setAnimated] = useState(false)

  const buildSVG = useCallback(() => {
    if (!svgRef.current || animated) return
    const svg = svgRef.current
    const pathsGroup = svg.querySelector('.skill-paths')
    const nodesGroup = svg.querySelector('.skill-nodes')
    if (!pathsGroup || !nodesGroup) return

    const NS = 'http://www.w3.org/2000/svg'
    const tempPath = document.createElementNS(NS, 'path')

    connections.forEach((conn) => {
      const fromNode = nodes.find((n) => n.id === conn.from)!
      const toNode = nodes.find((n) => n.id === conn.to)!
      const d = getPathD(fromNode, toNode, conn.curve)
      tempPath.setAttribute('d', d)
      const len = tempPath.getTotalLength()

      const pathEl = document.createElementNS(NS, 'path')
      pathEl.setAttribute('d', d)
      pathEl.setAttribute('stroke', '#00B4D8')
      pathEl.setAttribute('fill', 'none')
      pathEl.setAttribute('stroke-width', '1.5')
      pathEl.setAttribute('class', 'connection')
      pathEl.style.strokeDasharray = `${len}`
      pathEl.style.strokeDashoffset = `${len}`
      pathsGroup.appendChild(pathEl)
    })

    nodes.forEach((node) => {
      const g = document.createElementNS(NS, 'g')
      g.setAttribute('class', 'node-group')
      g.style.opacity = '0'

      const circle = document.createElementNS(NS, 'circle')
      circle.setAttribute('cx', `${node.x}`)
      circle.setAttribute('cy', `${node.y}`)
      circle.setAttribute('r', `${node.r}`)
      circle.setAttribute('fill', '#0A0F2C')
      circle.setAttribute('stroke', '#00B4D8')
      circle.setAttribute('stroke-width', '2')

      const text = document.createElementNS(NS, 'text')
      text.setAttribute('x', `${node.x}`)
      text.setAttribute('y', `${node.y - node.r - 10}`)
      text.setAttribute('text-anchor', 'middle')
      text.setAttribute('fill', '#F1F5F9')
      text.setAttribute('font-size', '11px')
      text.setAttribute('font-family', 'JetBrains Mono, monospace')
      text.textContent = node.id.toUpperCase()

      g.appendChild(circle)
      g.appendChild(text)
      nodesGroup.appendChild(g)
    })
  }, [animated])

  const playAnimation = useCallback(() => {
    if (!svgRef.current) return
    const paths = svgRef.current.querySelectorAll('.connection')
    const nodeGroups = svgRef.current.querySelectorAll('.node-group')

    paths.forEach((path) => {
      const el = path as SVGPathElement
      const length = el.getTotalLength()
      el.style.transition = 'none'
      el.style.strokeDashoffset = `${length}`
      el.getBoundingClientRect()
      el.style.transition = 'stroke-dashoffset 1.2s ease-in-out'
      el.style.strokeDashoffset = '0'
    })

    nodeGroups.forEach((group, i) => {
      const el = group as SVGGElement
      el.style.transition = 'none'
      el.style.opacity = '0'
      el.style.transform = 'scale(0.8)'
      el.style.transformOrigin = 'center'
      el.getBoundingClientRect()
      el.style.transition = `opacity 0.8s ease-out ${0.5 + i * 0.2}s, transform 0.8s ease-out ${0.5 + i * 0.2}s`
      el.style.opacity = '1'
      el.style.transform = 'scale(1)'
    })

    setAnimated(true)
  }, [])

  useEffect(() => {
    buildSVG()
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setTimeout(playAnimation, 100)
          observer.disconnect()
        }
      },
      { threshold: 0.5 }
    )
    if (svgRef.current) observer.observe(svgRef.current)
    return () => observer.disconnect()
  }, [buildSVG, playAnimation])

  const handleReplay = () => {
    if (!svgRef.current) return
    const paths = svgRef.current.querySelectorAll('.connection')
    const nodeGroups = svgRef.current.querySelectorAll('.node-group')

    paths.forEach((path) => {
      const el = path as SVGPathElement
      const length = el.getTotalLength()
      el.style.transition = 'none'
      el.style.strokeDashoffset = `${length}`
    })

    nodeGroups.forEach((group) => {
      const el = group as SVGGElement
      el.style.transition = 'none'
      el.style.opacity = '0'
      el.style.transform = 'scale(0.8)'
    })

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        playAnimation()
      })
    })
  }

  return (
    <section className="py-24 px-6 bg-deep" id="network">
      <div className="max-w-[1280px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <ScrollReveal>
            <h2
              className="font-display font-bold text-text-primary"
              style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)' }}
            >
              See Your Skill Network
            </h2>
            <p className="mt-4 text-text-secondary leading-relaxed">
              CareerOS maps your skills as an interconnected network, revealing hidden relationships and growth opportunities you never knew existed.
            </p>
            <ul className="mt-6 space-y-3">
              {[
                'Identify hidden skill adjacencies',
                'Find bridge skills for career pivots',
                'Track skill strength over time',
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-text-secondary text-sm">
                  <div className="w-5 h-5 rounded-full bg-cyan/20 flex items-center justify-center flex-shrink-0">
                    <svg className="w-3 h-3 text-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  {item}
                </li>
              ))}
            </ul>
            <Link
              to="/skill-gap"
              className="inline-flex items-center gap-2 mt-8 px-6 py-3 rounded-pill border border-cyan text-cyan font-medium text-sm hover:bg-cyan/10 transition-all duration-200"
            >
              Explore the Network
              <ArrowRight className="w-4 h-4" />
            </Link>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <div className="relative bg-void rounded-lg p-4 border border-border-subtle">
              <svg
                ref={svgRef}
                className="skill-net w-full"
                viewBox="0 0 400 300"
                preserveAspectRatio="xMidYMid meet"
                style={{ aspectRatio: '4/3' }}
              >
                <defs>
                  <linearGradient id="skillGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#00B4D8" />
                    <stop offset="100%" stopColor="#3A86FF" />
                  </linearGradient>
                  <linearGradient id="skillGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#FF6B6B" />
                    <stop offset="100%" stopColor="#9B5DE5" />
                  </linearGradient>
                </defs>
                <g className="skill-paths" />
                <g className="skill-nodes" />
              </svg>
              <button
                onClick={handleReplay}
                className="absolute bottom-4 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-elevated text-text-muted text-xs hover:text-cyan transition-colors"
              >
                <Play className="w-3 h-3" />
                Replay
              </button>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
}

/* ──────────── CAREER SIMULATOR ──────────── */
const SKILL_OPTIONS = ['Python', 'JavaScript', 'React', 'Node.js', 'SQL', 'Machine Learning', 'Data Analysis', 'Leadership', 'Communication', 'UI/UX Design', 'Project Management', 'Cloud Computing']

const ROLES = ['Software Engineer', 'Product Manager', 'Data Scientist', 'UX Designer', 'DevOps Engineer', 'ML Engineer', 'Full Stack Developer', 'Mobile Developer']

function CareerSimulatorSection() {
  const [step, setStep] = useState(0)
  const [skills, setSkills] = useState<string[]>([])
  const [role, setRole] = useState('')
  const [timeline, setTimeline] = useState(3)
  const [showResults, setShowResults] = useState(false)

  const toggleSkill = (s: string) => {
    setSkills((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]))
  }

  const handleNext = () => {
    if (step === 2) {
      setShowResults(true)
    } else {
      setStep(step + 1)
    }
  }

  const handleBack = () => {
    if (showResults) {
      setShowResults(false)
      setStep(2)
    } else {
      setStep(step - 1)
    }
  }

  const handleRestart = () => {
    setStep(0)
    setSkills([])
    setRole('')
    setTimeline(3)
    setShowResults(false)
  }

  return (
    <section className="py-24 px-6" id="simulator">
      <div className="max-w-[720px] mx-auto">
        <ScrollReveal className="text-center mb-12">
          <h2
            className="font-display font-bold text-text-primary"
            style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)' }}
          >
            Career Simulator
          </h2>
          <p className="mt-4 text-text-secondary">
            Simulate your career trajectory based on your current skills and goals.
          </p>
        </ScrollReveal>

        <div className="bg-surface rounded-lg border border-border-subtle p-6 md:p-8">
          {/* Progress bar */}
          <div className="flex gap-2 mb-8">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
                  i < step || (showResults && i === 3)
                    ? 'bg-blue'
                    : i === step && !showResults
                    ? 'bg-cyan'
                    : 'bg-elevated'
                }`}
              />
            ))}
          </div>

          {!showResults ? (
            <>
              {step === 0 && (
                <div>
                  <h3 className="font-display font-semibold text-text-primary text-lg mb-2">Select Your Current Skills</h3>
                  <p className="text-text-muted text-sm mb-6">Choose all skills you currently have experience with.</p>
                  <div className="flex flex-wrap gap-2">
                    {SKILL_OPTIONS.map((s) => (
                      <button
                        key={s}
                        onClick={() => toggleSkill(s)}
                        className={`px-4 py-2 rounded-pill text-sm font-medium transition-all duration-200 ${
                          skills.includes(s)
                            ? 'bg-cyan text-deep'
                            : 'bg-elevated text-text-secondary border border-border-subtle hover:border-cyan/30'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === 1 && (
                <div>
                  <h3 className="font-display font-semibold text-text-primary text-lg mb-2">Choose Your Target Role</h3>
                  <p className="text-text-muted text-sm mb-6">What role are you aiming for?</p>
                  <div className="space-y-2">
                    {ROLES.map((r) => (
                      <button
                        key={r}
                        onClick={() => setRole(r)}
                        className={`w-full text-left px-4 py-3 rounded-md text-sm font-medium transition-all duration-200 ${
                          role === r
                            ? 'bg-cyan/10 text-cyan border border-cyan/30'
                            : 'bg-elevated text-text-secondary border border-border-subtle hover:border-cyan/20'
                        }`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === 2 && (
                <div>
                  <h3 className="font-display font-semibold text-text-primary text-lg mb-2">Set Your Timeline</h3>
                  <p className="text-text-muted text-sm mb-6">How many years do you want to plan for?</p>
                  <div className="px-2">
                    <input
                      type="range"
                      min={1}
                      max={10}
                      value={timeline}
                      onChange={(e) => setTimeline(Number(e.target.value))}
                      className="w-full h-2 bg-elevated rounded-full appearance-none cursor-pointer accent-cyan"
                    />
                    <div className="text-center mt-4">
                      <span className="font-display text-3xl font-bold text-cyan">{timeline}</span>
                      <span className="text-text-muted ml-1">years</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-between mt-8">
                <button
                  onClick={handleBack}
                  disabled={step === 0}
                  className={`px-6 py-2.5 rounded-pill text-sm font-medium transition-all duration-200 ${
                    step === 0
                      ? 'text-text-muted cursor-not-allowed'
                      : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  Back
                </button>
                <button
                  onClick={handleNext}
                  disabled={step === 0 && skills.length === 0}
                  className={`px-6 py-2.5 rounded-pill bg-cyan text-deep font-semibold text-sm transition-all duration-200 hover:brightness-110 hover:-translate-y-0.5 ${
                    step === 0 && skills.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {step === 2 ? 'Simulate' : 'Next'}
                </button>
              </div>
            </>
          ) : (
            <div>
              <h3 className="font-display font-semibold text-text-primary text-lg mb-6">Your Career Path</h3>

              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-cyan flex items-center justify-center text-deep font-bold text-xs">1</div>
                    <div className="w-px h-12 bg-border-subtle" />
                  </div>
                  <div>
                    <div className="font-medium text-text-primary text-sm">Current: Junior {role}</div>
                    <div className="text-text-muted text-xs mt-0.5">Entry-level position</div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-blue flex items-center justify-center text-white font-bold text-xs">2</div>
                    <div className="w-px h-12 bg-border-subtle" />
                  </div>
                  <div>
                    <div className="font-medium text-text-primary text-sm">Year {Math.ceil(timeline * 0.4)}: {role}</div>
                    <div className="text-text-muted text-xs mt-0.5">Mid-level with expanded responsibilities</div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-violet flex items-center justify-center text-white font-bold text-xs">3</div>
                    <div className="w-px h-12 bg-border-subtle" />
                  </div>
                  <div>
                    <div className="font-medium text-text-primary text-sm">Year {Math.ceil(timeline * 0.7)}: Senior {role}</div>
                    <div className="text-text-muted text-xs mt-0.5">Technical leadership and mentoring</div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-coral flex items-center justify-center text-white font-bold text-xs">4</div>
                  </div>
                  <div>
                    <div className="font-medium text-text-primary text-sm">Year {timeline}: Lead / Staff {role}</div>
                    <div className="text-text-muted text-xs mt-0.5">Strategic impact and team leadership</div>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-elevated rounded-md border border-border-subtle">
                <div className="text-text-muted text-xs mb-2">Projected Salary Range</div>
                <div className="font-display text-2xl font-bold text-cyan">
                  ${60 + timeline * 15}k - ${90 + timeline * 20}k
                </div>
              </div>

              <div className="flex justify-between mt-8">
                <button
                  onClick={handleBack}
                  className="px-6 py-2.5 rounded-pill text-text-secondary hover:text-text-primary text-sm font-medium transition-colors"
                >
                  Back
                </button>
                <div className="flex gap-3">
                  <button
                    onClick={handleRestart}
                    className="px-6 py-2.5 rounded-pill border border-cyan text-cyan font-medium text-sm hover:bg-cyan/10 transition-all"
                  >
                    Start Over
                  </button>
                  <Link
                    to="/roadmap"
                    className="px-6 py-2.5 rounded-pill bg-cyan text-deep font-semibold text-sm hover:brightness-110 transition-all"
                  >
                    Save Path
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

/* ──────────── FEATURE CARDS ──────────── */
const features = [
  {
    icon: FileText,
    title: 'Resume Analyzer',
    description: 'AI-powered resume analysis with ATS optimization, keyword suggestions, and formatting improvements.',
    href: '/resume-analyzer',
  },
  {
    icon: Github,
    title: 'GitHub Profile',
    description: 'Analyze your GitHub profile, get repository suggestions, and improve your developer portfolio.',
    href: '/github-analyzer',
  },
  {
    icon: BarChart3,
    title: 'Skill Gap Analysis',
    description: 'Identify gaps between your current skills and target roles with personalized learning plans.',
    href: '/skill-gap',
  },
  {
    icon: Route,
    title: 'Learning Roadmap',
    description: 'Get step-by-step career roadmaps with milestones, courses, and timeline recommendations.',
    href: '/roadmap',
  },
  {
    icon: Briefcase,
    title: 'Job Matcher',
    description: 'Find jobs that match your skills and career goals with AI-powered recommendations.',
    href: '/jobs',
  },
  {
    icon: MessageSquare,
    title: 'Interview Coach',
    description: 'Practice with AI-generated interview questions tailored to your target roles and companies.',
    href: '/interview',
  },
]

function FeatureCardsSection() {
  return (
    <section className="py-24 px-6 bg-deep" id="features">
      <div className="max-w-[1280px] mx-auto">
        <ScrollReveal className="text-center mb-16">
          <h2
            className="font-display font-bold text-text-primary"
            style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)' }}
          >
            Everything You Need to Grow
          </h2>
          <p className="mt-4 text-text-secondary max-w-xl mx-auto">
            A complete toolkit for career development, from skill analysis to job placement.
          </p>
        </ScrollReveal>

        <ScrollReveal stagger={0.1} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <Link
              key={feature.title}
              to={feature.href}
              className="group bg-surface rounded-lg p-8 border border-border-subtle hover:border-cyan/20 hover:-translate-y-1.5 transition-all duration-300 block"
            >
              <div className="w-16 h-16 rounded-full bg-cyan/10 flex items-center justify-center mb-5 group-hover:bg-cyan/20 transition-colors">
                <feature.icon className="w-8 h-8 text-cyan" />
              </div>
              <h3 className="font-display font-semibold text-text-primary text-lg mb-2">{feature.title}</h3>
              <p className="text-text-secondary text-sm leading-relaxed mb-4">{feature.description}</p>
              <span className="inline-flex items-center gap-1.5 text-cyan text-sm font-medium">
                Learn more
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
          ))}
        </ScrollReveal>
      </div>
    </section>
  )
}

/* ──────────── SOCIAL PROOF ──────────── */
const testimonials = [
  {
    quote: "CareerOS helped me identify gaps I didn't even know I had. Landed my dream job at a top tech company within 3 months.",
    name: 'Sarah Chen',
    role: 'Software Engineer',
    company: 'Google',
    avatar: '/avatars/avatar-1.jpg',
  },
  {
    quote: "The resume analyzer alone is worth it. My interview callback rate went from 5% to 40% after using their suggestions.",
    name: 'Michael Torres',
    role: 'Product Manager',
    company: 'Stripe',
    avatar: '/avatars/avatar-2.jpg',
  },
  {
    quote: "I pivoted from marketing to data science using the skill gap analysis and roadmap. Best career decision I ever made.",
    name: 'Emily Zhang',
    role: 'Data Scientist',
    company: 'Netflix',
    avatar: '/avatars/avatar-3.jpg',
  },
  {
    quote: "The interview coach prepared me for questions I actually got asked. Felt confident going into every interview.",
    name: 'David Kim',
    role: 'UX Designer',
    company: 'Figma',
    avatar: '/avatars/avatar-4.jpg',
  },
]

const companies = ['Google', 'Microsoft', 'Amazon', 'Meta', 'Apple', 'Netflix', 'Stripe', 'Spotify', 'Airbnb', 'Uber', 'LinkedIn', 'Twitter']

function SocialProofSection() {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return
    const amount = 340
    scrollRef.current.scrollBy({ left: dir === 'left' ? -amount : amount, behavior: 'smooth' })
  }

  return (
    <section className="py-24 px-6">
      <div className="max-w-[1280px] mx-auto">
        <ScrollReveal className="text-center mb-12">
          <h2
            className="font-display font-bold text-text-primary"
            style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)' }}
          >
            Trusted by Professionals at Top Companies
          </h2>
        </ScrollReveal>

        {/* Logo wall */}
        <ScrollReveal>
          <div className="grid grid-cols-4 md:grid-cols-6 gap-6 mb-16">
            {companies.map((company) => (
              <div
                key={company}
                className="flex items-center justify-center h-12 text-text-muted hover:text-text-primary transition-colors duration-300 cursor-default"
                style={{ filter: 'grayscale(100%) brightness(2)' }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.filter = 'grayscale(0%) brightness(1)' }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.filter = 'grayscale(100%) brightness(2)' }}
              >
                <span className="font-display font-semibold text-sm">{company}</span>
              </div>
            ))}
          </div>
        </ScrollReveal>

        {/* Testimonials */}
        <div className="relative">
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-elevated border border-border-subtle flex items-center justify-center text-text-muted hover:text-cyan hover:border-cyan/30 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-elevated border border-border-subtle flex items-center justify-center text-text-muted hover:text-cyan hover:border-cyan/30 transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto scrollbar-hide px-12 pb-4"
            style={{ scrollSnapType: 'x mandatory', scrollbarWidth: 'none' }}
          >
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="flex-shrink-0 w-[300px] md:w-[340px] bg-surface rounded-lg p-6 border border-border-subtle"
                style={{ scrollSnapAlign: 'start' }}
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-coral text-coral" />
                  ))}
                </div>
                <p className="text-text-secondary text-sm italic leading-relaxed mb-6">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <div className="text-text-primary text-sm font-medium">{t.name}</div>
                    <div className="text-text-muted text-xs">{t.role} at {t.company}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ──────────── PRICING ──────────── */
const plans = [
  {
    name: 'Starter',
    price: '$0',
    description: 'Perfect for exploring CareerOS',
    features: [
      { text: 'Resume analysis (1/month)', included: true },
      { text: 'Basic skill gap report', included: true },
      { text: 'Career simulator', included: true },
      { text: 'GitHub profile scan', included: false },
      { text: 'Interview practice', included: false },
      { text: 'Job matching', included: false },
      { text: 'Learning roadmap', included: false },
      { text: 'Certification tracking', included: false },
    ],
    cta: 'Get Started',
    highlighted: false,
  },
  {
    name: 'Pro',
    price: '$19',
    description: 'Everything you need to accelerate',
    features: [
      { text: 'Unlimited resume analysis', included: true },
      { text: 'Advanced skill gap report', included: true },
      { text: 'Career simulator', included: true },
      { text: 'GitHub profile scan', included: true },
      { text: 'Interview practice', included: true },
      { text: 'Job matching', included: true },
      { text: 'Learning roadmap', included: true },
      { text: 'Certification tracking', included: true },
    ],
    cta: 'Start Free Trial',
    highlighted: true,
  },
  {
    name: 'Teams',
    price: '$49',
    description: 'For teams and organizations',
    features: [
      { text: 'Everything in Pro', included: true },
      { text: 'Team skill analytics', included: true },
      { text: 'Collaborative roadmaps', included: true },
      { text: 'Admin dashboard', included: true },
      { text: 'Priority support', included: true },
      { text: 'Custom integrations', included: true },
      { text: 'SSO authentication', included: true },
      { text: 'Dedicated account manager', included: true },
    ],
    cta: 'Contact Sales',
    highlighted: false,
    perUser: true,
  },
]

function PricingSection() {
  return (
    <section className="py-24 px-6 bg-deep" id="pricing">
      <div className="max-w-[1280px] mx-auto">
        <ScrollReveal className="text-center mb-16">
          <h2
            className="font-display font-bold text-text-primary"
            style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)' }}
          >
            Simple, Transparent Pricing
          </h2>
          <p className="mt-4 text-text-secondary max-w-xl mx-auto">
            Choose the plan that fits your career goals. Upgrade or downgrade anytime.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {plans.map((plan) => (
            <ScrollReveal key={plan.name} delay={plan.highlighted ? 0.1 : 0}>
              <div
                className={`relative rounded-lg p-8 border transition-all duration-300 ${
                  plan.highlighted
                    ? 'bg-surface border-cyan/40 shadow-glow-lg scale-105 md:scale-105 z-10'
                    : 'bg-surface border-border-subtle hover:border-cyan/20'
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-pill bg-cyan text-deep text-xs font-semibold">
                    Most Popular
                  </div>
                )}

                <h3 className="font-display font-semibold text-text-primary text-lg">{plan.name}</h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="font-display text-4xl font-bold text-text-primary">{plan.price}</span>
                  <span className="text-text-muted text-sm">/mo{plan.perUser ? ' per user' : ''}</span>
                </div>
                <p className="mt-2 text-text-muted text-sm">{plan.description}</p>

                <ul className="mt-6 space-y-3">
                  {plan.features.map((f) => (
                    <li key={f.text} className="flex items-center gap-3 text-sm">
                      {f.included ? (
                        <svg className="w-4 h-4 text-cyan flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4 text-text-muted flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
                        </svg>
                      )}
                      <span className={f.included ? 'text-text-secondary' : 'text-text-muted'}>{f.text}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  to="/signup"
                  className={`block text-center mt-8 px-6 py-3 rounded-pill font-semibold text-sm transition-all duration-200 ${
                    plan.highlighted
                      ? 'bg-cyan text-deep hover:brightness-110'
                      : 'border border-cyan text-cyan hover:bg-cyan/10'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ──────────── CTA ──────────── */
function CTASection() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-[720px] mx-auto text-center">
        <ScrollReveal>
          <h2
            className="font-display font-bold text-text-primary"
            style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)' }}
          >
            Ready to Accelerate Your Career?
          </h2>
          <p className="mt-4 text-text-secondary text-lg">
            Join 50,000+ professionals using CareerOS to reach their career goals faster.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/signup"
              className="px-8 py-3.5 rounded-pill bg-cyan text-deep font-semibold text-base hover:brightness-110 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-glow"
            >
              Get Started for Free
            </Link>
            <Link
              to="/dashboard"
              className="px-8 py-3.5 rounded-pill border border-cyan text-cyan font-semibold text-base hover:bg-cyan/10 transition-all duration-200"
            >
              View Demo Dashboard
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}

/* ──────────── HOME PAGE ──────────── */
export default function HomePage() {
  return (
    <div>
      <HeroSection />
      <HowItWorksSection />
      <SkillNetworkSection />
      <CareerSimulatorSection />
      <FeatureCardsSection />
      <SocialProofSection />
      <PricingSection />
      <CTASection />
    </div>
  )
}
