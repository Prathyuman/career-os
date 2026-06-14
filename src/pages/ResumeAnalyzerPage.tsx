import * as pdfjsLib from 'pdfjs-dist'

pdfjsLib.GlobalWorkerOptions.workerSrc =
  new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url
  ).toString()

import { useState, ChangeEvent } from 'react'
import PageLayout from '../components/PageLayout'
import ScrollReveal from '../components/ScrollReveal'
import {
  Upload,
  FileText,
  AlertCircle,
  Zap,
  Target,
  TrendingUp,
  Award,
  RefreshCw,
  Download,
} from 'lucide-react'

const analysisSections = [
  {
    title: 'ATS Compatibility',
    score: 82,
    icon: Target,
    color: 'text-cyan',
    bg: 'bg-cyan/10',
    suggestions: [
      'Add more keywords from the job description',
      'Use standard section headings (Experience, Education)',
      'Avoid tables and graphics that ATS cannot parse',
    ],
  },
  {
    title: 'Content Quality',
    score: 75,
    icon: FileText,
    color: 'text-blue',
    bg: 'bg-blue/10',
    suggestions: [
      'Quantify achievements with metrics (%, $, numbers)',
      'Add action verbs to bullet points',
      'Include a compelling summary statement',
    ],
  },
  {
    title: 'Formatting',
    score: 90,
    icon: Award,
    color: 'text-violet',
    bg: 'bg-violet/10',
    suggestions: [
      'Consistent font usage throughout',
      'Proper spacing and margins',
      'One-page length is ideal for your experience level',
    ],
  },
  {
    title: 'Keyword Optimization',
    score: 68,
    icon: Zap,
    color: 'text-coral',
    bg: 'bg-coral/10',
    suggestions: [
      'Include more industry-specific technical terms',
      'Match keywords from target job postings',
      'Add relevant certifications and tools',
    ],
  },
]

const missingKeywords = ['Kubernetes', 'CI/CD', 'Agile', 'REST APIs', 'GraphQL', 'Microservices', 'Docker']

export default function ResumeAnalyzerPage() {
  const [uploaded, setUploaded] = useState(false)
const [analyzing, setAnalyzing] = useState(false)
const [fileName, setFileName] = useState('')
const [foundSkills, setFoundSkills] = useState<string[]>([])
const [resumeText, setResumeText] = useState('')
const extractTextFromPDF = async (file: File) => {
  const arrayBuffer = await file.arrayBuffer()

  const pdf = await pdfjsLib.getDocument({
    data: arrayBuffer,
  }).promise

  let text = ''

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i)

    const content = await page.getTextContent()

    const pageText = content.items
      .map((item: any) => item.str)
      .join(' ')

    text += pageText + ' '
  }

  return text
}
const handleUpload = async (e: ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0]

  if (!file) return

  const extractedText = await extractTextFromPDF(file)

  console.log(extractedText)

  setResumeText(extractedText)
const sampleSkills = [
  'JavaScript',
  'React',
  'TypeScript',
  'Node.js',
  'Python',
  'Java',
  'Git',
  'Docker',
  'AWS',
  'HTML',
  'CSS',
  'MongoDB',
  'C',
  'C++',
]

const detectedSkills = sampleSkills.filter((skill) =>
  extractedText.toLowerCase().includes(skill.toLowerCase())
)

setFoundSkills(detectedSkills)
  
  setFileName(file.name)
  setUploaded(true)
  setAnalyzing(true)

  setTimeout(() => {
    setAnalyzing(false)
  }, 2000)
  
}

  const overallScore = Math.round(
  analysisSections.reduce((acc, s) => acc + s.score, 0) /
  analysisSections.length
)
  return (
    <PageLayout title="Resume Analyzer">
      {!uploaded ? (
        <ScrollReveal>
          <div className="bg-surface rounded-lg border border-border-subtle p-12 text-center">
            <div className="w-20 h-20 rounded-full bg-cyan/10 flex items-center justify-center mx-auto mb-6">
              <Upload className="w-10 h-10 text-cyan" />
            </div>
            <h3 className="font-display text-xl font-semibold text-text-primary mb-2">
              Upload Your Resume
            </h3>
            <p className="text-text-secondary text-sm max-w-md mx-auto mb-8">
              Get AI-powered analysis of your resume including ATS compatibility, content quality, formatting, and keyword optimization.
            </p>
            <label className="px-8 py-3 rounded-pill bg-cyan text-deep font-semibold hover:brightness-110 transition-all cursor-pointer inline-block">
  Upload Resume (PDF/DOCX)

  <input
    type="file"
    accept=".pdf,.doc,.docx"
    onChange={handleUpload}
    className="hidden"
  />
</label>
            <p className="text-text-muted text-xs mt-4">Drag and drop or click to browse</p>
          </div>
        </ScrollReveal>
      ) : analyzing ? (
        <ScrollReveal>
          <div className="bg-surface rounded-lg border border-border-subtle p-12 text-center">
            <RefreshCw className="w-10 h-10 text-cyan animate-spin mx-auto mb-4" />
            <h3 className="font-display text-lg font-semibold text-text-primary mb-2">Analyzing your resume...</h3>
            <p className="text-text-secondary text-sm">Our AI is reviewing your resume for optimization opportunities.</p>
          </div>
        </ScrollReveal>
      ) : (
        <>
          {/* Overall Score */}
          <ScrollReveal>
            <div className="bg-surface rounded-lg border border-border-subtle p-6 mb-6">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="relative w-28 h-28 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="42" fill="none" stroke="#1A2235" strokeWidth="8" />
                    <circle
                      cx="50" cy="50" r="42" fill="none" stroke="#00B4D8" strokeWidth="8"
                      strokeDasharray={`${(overallScore / 100) * 264} 264`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="font-display text-2xl font-bold text-cyan">{overallScore}</span>
                  </div>
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h3 className="font-display text-lg font-semibold text-text-primary">{fileName}</h3>
                  <p className="text-text-secondary text-sm mt-1">
                    Your resume scores {overallScore}/100. Here are the key areas to improve.
                  </p>
                  <div className="flex flex-wrap gap-2 mt-4 justify-center md:justify-start">
                    <button className="px-4 py-2 rounded-pill bg-cyan text-deep text-xs font-semibold hover:brightness-110 transition-all flex items-center gap-1.5">
                      <RefreshCw className="w-3 h-3" />
                      Re-analyze
                    </button>
                    <button className="px-4 py-2 rounded-pill border border-cyan text-cyan text-xs font-medium hover:bg-cyan/10 transition-all flex items-center gap-1.5">
                      <Download className="w-3 h-3" />
                      Download Report
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Analysis Sections */}
          <ScrollReveal stagger={0.1} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {analysisSections.map((section) => (
              <div key={section.title} className="bg-surface rounded-lg border border-border-subtle p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-lg ${section.bg} flex items-center justify-center`}>
                      <section.icon className={`w-4 h-4 ${section.color}`} />
                    </div>
                    <span className="text-text-primary text-sm font-medium">{section.title}</span>
                  </div>
                  <span className={`font-display font-bold ${section.color}`}>{section.score}%</span>
                </div>
                <div className="h-1.5 bg-elevated rounded-full overflow-hidden mb-3">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${section.score}%`,
                      backgroundColor: section.color === 'text-cyan' ? '#00B4D8' : section.color === 'text-blue' ? '#3A86FF' : section.color === 'text-violet' ? '#9B5DE5' : '#FF6B6B',
                    }}
                  />
                </div>
                <ul className="space-y-2">
                  {section.suggestions.map((s) => (
                    <li key={s} className="flex items-start gap-2 text-xs text-text-secondary">
                      <AlertCircle className="w-3 h-3 text-coral flex-shrink-0 mt-0.5" />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </ScrollReveal>
<ScrollReveal>
  <div className="bg-surface rounded-lg border border-border-subtle p-6 mb-6">
    <h3 className="font-display font-semibold text-text-primary mb-4">
      Skills Found
    </h3>

    <div className="flex flex-wrap gap-2">
      {foundSkills.map((skill) => (
        <span
          key={skill}
          className="px-3 py-1.5 rounded-pill bg-cyan/10 text-cyan text-xs font-medium border border-cyan/20"
        >
          {skill}
        </span>
      ))}
    </div>
  </div>
</ScrollReveal>
          {/* Missing Keywords */}
          <ScrollReveal>
            <div className="bg-surface rounded-lg border border-border-subtle p-6">
              <h3 className="font-display font-semibold text-text-primary mb-4 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-coral" />
                Missing Keywords
              </h3>
              <p className="text-text-secondary text-sm mb-4">
                These keywords are commonly found in job descriptions for your target role but are missing from your resume.
              </p>
              <div className="flex flex-wrap gap-2">
                {missingKeywords.map((kw) => (
                  <span
                    key={kw}
                    className="px-3 py-1.5 rounded-pill bg-coral/10 text-coral text-xs font-medium border border-coral/20"
                  >
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </>
      )}
    </PageLayout>
  )
}
