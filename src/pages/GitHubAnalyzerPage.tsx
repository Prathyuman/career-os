import { useState } from 'react'
import PageLayout from '../components/PageLayout'
import ScrollReveal from '../components/ScrollReveal'
import {
  Github,
  Star,
  GitFork,
  Users,
  Code,
  GitCommit,
  Award,
  Zap,
  FolderGit2,
  Calendar,
  ArrowUpRight,
} from 'lucide-react'

const languages = [
  { name: 'TypeScript', percent: 42, color: '#3A86FF' },
  { name: 'JavaScript', percent: 28, color: '#00B4D8' },
  { name: 'Python', percent: 18, color: '#9B5DE5' },
  { name: 'CSS', percent: 8, color: '#FF6B6B' },
  { name: 'HTML', percent: 4, color: '#F1F5F9' },
]

const topRepos = [
  { name: 'career-dashboard', stars: 234, forks: 45, lang: 'TypeScript', desc: 'A career tracking dashboard built with React' },
  { name: 'ai-resume-parser', stars: 189, forks: 32, lang: 'Python', desc: 'AI-powered resume parsing and analysis tool' },
  { name: 'skill-graph', stars: 156, forks: 28, lang: 'TypeScript', desc: 'Interactive skill network visualization' },
  { name: 'interview-prep', stars: 98, forks: 15, lang: 'JavaScript', desc: 'Collection of interview preparation materials' },
]

const contributions = [
  { day: 'Mon', count: 12 },
  { day: 'Tue', count: 18 },
  { day: 'Wed', count: 8 },
  { day: 'Thu', count: 24 },
  { day: 'Fri', count: 15 },
  { day: 'Sat', count: 5 },
  { day: 'Sun', count: 3 },
]

const recommendations = [
  { text: 'Add a professional README to your top 3 repositories', priority: 'high' },
  { text: 'Contribute to 2+ open source projects this month', priority: 'high' },
  { text: 'Pin your best projects to your profile', priority: 'medium' },
  { text: 'Enable GitHub Sponsors to showcase community support', priority: 'low' },
]

export default function GitHubAnalyzerPage() {
  const [connected, setConnected] = useState(true)

  if (!connected) {
    return (
      <PageLayout title="GitHub Analyzer">
        <ScrollReveal>
          <div className="bg-surface rounded-lg border border-border-subtle p-12 text-center">
            <Github className="w-16 h-16 text-text-muted mx-auto mb-6" />
            <h3 className="font-display text-xl font-semibold text-text-primary mb-2">Connect Your GitHub</h3>
            <p className="text-text-secondary text-sm max-w-md mx-auto mb-8">
              Link your GitHub account to get personalized analysis of your repositories, contributions, and profile strength.
            </p>
            <button
              onClick={() => setConnected(true)}
              className="px-8 py-3 rounded-pill bg-cyan text-deep font-semibold hover:brightness-110 transition-all flex items-center gap-2 mx-auto"
            >
              <Github className="w-4 h-4" />
              Connect GitHub Account
            </button>
          </div>
        </ScrollReveal>
      </PageLayout>
    )
  }

  return (
    <PageLayout title="GitHub Analyzer">
      {/* Profile Overview */}
      <ScrollReveal>
        <div className="bg-surface rounded-lg border border-border-subtle p-6 mb-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-full bg-cyan/20 flex items-center justify-center">
              <Github className="w-7 h-7 text-cyan" />
            </div>
            <div>
              <h3 className="font-display text-lg font-semibold text-text-primary">@johndoe</h3>
              <p className="text-text-secondary text-sm">Full-stack developer passionate about open source</p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Repositories', value: '24', icon: FolderGit2 },
              { label: 'Stars Earned', value: '1.2k', icon: Star },
              { label: 'Followers', value: '328', icon: Users },
              { label: 'Contributions', value: '847', icon: GitCommit },
            ].map((stat) => (
              <div key={stat.label} className="bg-elevated rounded-md p-4 text-center">
                <stat.icon className="w-5 h-5 text-cyan mx-auto mb-1" />
                <div className="font-display text-xl font-bold text-text-primary">{stat.value}</div>
                <div className="text-text-muted text-xs">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </ScrollReveal>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Language Distribution */}
        <ScrollReveal>
          <div className="bg-surface rounded-lg border border-border-subtle p-6">
            <h3 className="font-display font-semibold text-text-primary mb-4 flex items-center gap-2">
              <Code className="w-4 h-4 text-cyan" />
              Language Distribution
            </h3>
            <div className="flex h-4 rounded-full overflow-hidden mb-4">
              {languages.map((lang) => (
                <div
                  key={lang.name}
                  style={{ width: `${lang.percent}%`, backgroundColor: lang.color }}
                  className="h-full"
                />
              ))}
            </div>
            <div className="space-y-2">
              {languages.map((lang) => (
                <div key={lang.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: lang.color }} />
                    <span className="text-text-primary">{lang.name}</span>
                  </div>
                  <span className="text-text-muted">{lang.percent}%</span>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* Weekly Activity */}
        <ScrollReveal delay={0.1}>
          <div className="bg-surface rounded-lg border border-border-subtle p-6">
            <h3 className="font-display font-semibold text-text-primary mb-4 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-cyan" />
              Weekly Contributions
            </h3>
            <div className="flex items-end gap-3 h-40">
              {contributions.map((c) => (
                <div key={c.day} className="flex-1 flex flex-col items-center gap-2">
                  <div
                    className="w-full bg-cyan/30 rounded-t-md transition-all duration-300 hover:bg-cyan/50"
                    style={{ height: `${(c.count / 24) * 100}%` }}
                  />
                  <span className="text-text-muted text-xs">{c.day}</span>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>

      {/* Top Repositories */}
      <ScrollReveal className="mb-6">
        <div className="bg-surface rounded-lg border border-border-subtle p-6">
          <h3 className="font-display font-semibold text-text-primary mb-4 flex items-center gap-2">
            <FolderGit2 className="w-4 h-4 text-cyan" />
            Top Repositories
          </h3>
          <div className="space-y-3">
            {topRepos.map((repo) => (
              <div key={repo.name} className="flex items-center justify-between p-4 bg-elevated rounded-md hover:border-cyan/20 border border-transparent transition-colors group cursor-pointer">
                <div>
                  <div className="text-text-primary text-sm font-medium flex items-center gap-2">
                    {repo.name}
                    <ArrowUpRight className="w-3 h-3 text-text-muted group-hover:text-cyan transition-colors" />
                  </div>
                  <div className="text-text-muted text-xs mt-0.5">{repo.desc}</div>
                </div>
                <div className="flex items-center gap-4 text-text-muted text-xs">
                  <span className="flex items-center gap-1"><Star className="w-3 h-3" /> {repo.stars}</span>
                  <span className="flex items-center gap-1"><GitFork className="w-3 h-3" /> {repo.forks}</span>
                  <span className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-cyan" />
                    {repo.lang}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </ScrollReveal>

      {/* Recommendations */}
      <ScrollReveal>
        <div className="bg-surface rounded-lg border border-border-subtle p-6">
          <h3 className="font-display font-semibold text-text-primary mb-4 flex items-center gap-2">
            <Zap className="w-4 h-4 text-coral" />
            Improvement Recommendations
          </h3>
          <div className="space-y-3">
            {recommendations.map((rec) => (
              <div key={rec.text} className="flex items-start gap-3">
                <Award className={`w-4 h-4 flex-shrink-0 mt-0.5 ${
                  rec.priority === 'high' ? 'text-coral' : rec.priority === 'medium' ? 'text-violet' : 'text-text-muted'
                }`} />
                <span className="text-text-secondary text-sm">{rec.text}</span>
              </div>
            ))}
          </div>
        </div>
      </ScrollReveal>
    </PageLayout>
  )
}
