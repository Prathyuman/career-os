import { jsPDF } from 'jspdf'
import * as pdfjsLib from 'pdfjs-dist'

pdfjsLib.GlobalWorkerOptions.workerSrc =
  new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url
  ).toString()

import { useState, useEffect } from 'react'
import type { ChangeEvent } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth, db } from '../lib/firebase'
import { doc, getDoc, setDoc } from 'firebase/firestore'
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


export default function ResumeAnalyzerPage() {
  const [uploaded, setUploaded] = useState(false)
const [analyzing, setAnalyzing] = useState(false)
const [fileName, setFileName] = useState('')
const [foundSkills, setFoundSkills] = useState<string[]>([])
const [, setResumeText] = useState('')
const [analysisResult, setAnalysisResult] = useState<any>(null)
const [targetRole, setTargetRole] = useState('')


const analysisSections = [
  {
    title: 'ATS Compatibility',
    score: analysisResult?.atsCompatibility || 0,
    icon: Target,
    color: 'text-cyan',
    bg: 'bg-cyan/10',
    suggestions: analysisResult?.atsTips || [],
  },
  {
    title: 'Content Quality',
    score: analysisResult?.contentQuality || 0,
    icon: FileText,
    color: 'text-blue',
    bg: 'bg-blue/10',
    suggestions: analysisResult?.contentTips || [],
  },
  {
    title: 'Formatting',
    score: analysisResult?.formatting || 0,
    icon: Award,
    color: 'text-violet',
    bg: 'bg-violet/10',
    suggestions: analysisResult?.formattingTips || [],
  },
  {
    title: 'Keyword Optimization',
    score: analysisResult?.keywordOptimization || 0,
    icon: Zap,
    color: 'text-coral',
    bg: 'bg-coral/10',
    suggestions: analysisResult?.keywordTips || [],
  },
]
useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, async (user) => {
    if (!user) return

    const docSnap = await getDoc(
      doc(db, 'resumeAnalysis', user.uid)
    )

    if (docSnap.exists()) {
      const data = docSnap.data()

      setAnalysisResult(data)
      setFoundSkills(data.foundSkills || [])
      setFileName(data.fileName || '')
      setUploaded(true)
    }
  })

  return () => unsubscribe()
}, [])
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
   if (!targetRole.trim()) {
    alert('Please enter your dream role or field')
    return
  }
const formData = new FormData()
formData.append("resume", file)

const uploadResponse = await fetch(
  "http://localhost:5000/upload-resume",
  {
    method: "POST",
    body: formData,
  }
)

const uploadData = await uploadResponse.json()

console.log("Backend Response:", uploadData)
  const extractedText = await extractTextFromPDF(file)

  console.log(extractedText)

  setResumeText(extractedText)
  const analysisResponse = await fetch(
  "http://localhost:5000/analyze-resume",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
  resumeText: extractedText,
  targetRole,
}),
  }
)

const analysisData = await analysisResponse.json()
console.log("FULL ANALYSIS DATA:", analysisData)
console.log("Gemini Analysis:", analysisData)
try {
  if (!analysisData.success || !analysisData.result) {
    console.error("Backend Error:", analysisData)
    return
  }

 const cleanResult = analysisData.result
  .replace(/```json/g, "")
  .replace(/```/g, "")
  .trim()

const parsedResult = JSON.parse(cleanResult)

console.log("PARSED RESULT:", parsedResult)
console.log(
  "Career Readiness Score:",
  parsedResult.careerReadinessScore
)

// ATS Score Calculation
const atsScore =
  (parsedResult.resumeStructure || 0) +
  (parsedResult.skillsMatch || 0) +
  (parsedResult.keywordOptimizationScore || 0) +
  (parsedResult.projectsScore || 0) +
  (parsedResult.educationScore || 0)

parsedResult.atsScore = atsScore

console.log("PARSED RESULT:", parsedResult)

setAnalysisResult(parsedResult)
console.log("ATS Compatibility:", parsedResult.atsCompatibility)
console.log("Content Quality:", parsedResult.contentQuality)
console.log("Formatting:", parsedResult.formatting)
console.log("Keyword Optimization:", parsedResult.keywordOptimization)
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

const user = auth.currentUser

if (user) {
  await setDoc(
    doc(db, 'resumeAnalysis', user.uid),
    {
      fileName: file.name,

      atsScore: parsedResult.atsScore,
      roleMatch: parsedResult.roleMatch,

      atsCompatibility: parsedResult.atsCompatibility || 0,
      contentQuality: parsedResult.contentQuality || 0,
      formatting: parsedResult.formatting || 0,
      keywordOptimization: parsedResult.keywordOptimization || 0,

      atsTips: parsedResult.atsTips || [],
      contentTips: parsedResult.contentTips || [],
      formattingTips: parsedResult.formattingTips || [],
      keywordTips: parsedResult.keywordTips || [],

      recommendedRoles: parsedResult.recommendedRoles || [],
missingSkills: parsedResult.missingSkills || [],

recommendedCourses:
  parsedResult.recommendedCourses || [],

learningRoadmap:
  parsedResult.learningRoadmap || [],

careerReadinessScore:
  parsedResult.careerReadinessScore || 0,

areasToFocus:
  parsedResult.areasToFocus || [],

strengths: parsedResult.strengths || [],
weaknesses: parsedResult.weaknesses || [],

foundSkills: detectedSkills,

currentSkills: detectedSkills,

updatedAt: new Date().toISOString(),
    },
    { merge: true }
  )
}
} catch (err) {
  console.error("JSON Parse Error:", err)
}
  setFileName(file.name)
  setUploaded(true)
  setAnalyzing(true)

  setTimeout(() => {
    setAnalyzing(false)
  }, 2000)
  
}
const downloadReport = () => {
  const pdf = new jsPDF()

  // Header
  pdf.setFillColor(6, 182, 212)
  pdf.rect(0, 0, 210, 30, 'F')

  pdf.setTextColor(255, 255, 255)
  pdf.setFontSize(24)
  pdf.text('Career OS', 20, 20)

  pdf.setFontSize(10)
  pdf.text('AI Powered Career Platform', 20, 26)

  // Reset color
  pdf.setTextColor(0, 0, 0)

  pdf.setFontSize(18)
  pdf.text('Resume Analysis Report', 20, 45)

  pdf.line(20, 50, 190, 50)

  pdf.setFontSize(12)
  pdf.text(`Resume: ${fileName}`, 20, 65)

  pdf.text(
    `ATS Score: ${analysisResult?.atsScore || 0}/100`,
    20,
    75
  )

  // Skills
  pdf.setFontSize(14)
  pdf.text('Skills Found', 20, 95)

  pdf.setFontSize(11)
  pdf.text(
    foundSkills.join(', '),
    20,
    105
  )
pdf.setFontSize(14)
pdf.text('Recommended Roles', 20, 125)

let roleY = 135

analysisResult?.recommendedRoles
  ?.slice(0, 5)
  ?.forEach((role: string) => {
    pdf.text(`• ${role}`, 25, roleY)
    roleY += 8
  })

pdf.setFontSize(14)
pdf.text('Missing Skills', 20, roleY + 10)

let y = roleY + 20

analysisResult?.missingSkills
  ?.slice(0, 8)
  ?.forEach((skill: string) => {
    pdf.text(`• ${skill}`, 25, y)
    y += 8
  })
  

  // Footer
  pdf.line(20, 270, 190, 270)

  pdf.setFontSize(10)
  pdf.text(
    'Generated by Career OS',
    20,
    280
  )

  pdf.save('CareerOS_Report.pdf')
}
 const overallScore =
  analysisResult?.roleMatch ??
  analysisResult?.atsScore ??
  0
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
            <div className="mb-6">
  <label className="block text-sm mb-2 text-text-primary">
    Dream Role / Field
  </label>

  <input
    type="text"
    value={targetRole}
    onChange={(e) => setTargetRole(e.target.value)}
    placeholder="AI Engineer, Doctor, CA, IAS Officer, Marketing Manager..."
    className="w-full max-w-md p-3 rounded-lg bg-elevated border border-border-subtle"
  />
</div>
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
                  {analysisResult && (
  <div className="mt-4 text-white">
    <h3>ATS Score: {analysisResult.atsScore}/100</h3>

<h3 className="mt-2">
  Role Match: {analysisResult.roleMatch}/100
</h3>
    <h3 className="mt-2">Recommended Roles</h3>

    <ul>
      {analysisResult.recommendedRoles?.map((role: string) => (
        <li key={role}>{role}</li>
      ))}
    </ul>
    
<button
  onClick={() =>
    alert(
      `Analyzing skill gap for ${targetRole}`
    )
  }
  className="mt-4 px-4 py-2 rounded-lg bg-cyan text-black font-semibold hover:opacity-90"
>
  Analyze Skill Gap
</button>
  </div>
)}
                  <div className="flex flex-wrap gap-2 mt-4 justify-center md:justify-start">
                    <button
  onClick={() => {
    setUploaded(false)
    setAnalysisResult(null)
    setFoundSkills([])
    setFileName('')
  }}
  className="px-4 py-2 rounded-pill bg-cyan text-deep text-xs font-semibold hover:brightness-110 transition-all flex items-center gap-1.5"
>
  <RefreshCw className="w-3 h-3" />
  Re-analyze
</button>
                    <button
  onClick={downloadReport}
  className="px-4 py-2 rounded-pill border border-cyan text-cyan text-xs font-semibold hover:bg-cyan/10 transition-all flex items-center gap-1.5"
>
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
                {analysisResult?.missingSkills?.map((skill: string) => (
  <span
    key={skill}
    className="px-3 py-1.5 rounded-pill bg-coral/10 text-coral text-xs font-medium border border-coral/20"
  >
    {skill}
  </span>
))}
              </div>
            </div>
          </ScrollReveal>

{analysisResult?.strengths && (
  <div className="bg-surface rounded-lg border border-border-subtle p-6 mb-6">
    <h3 className="font-display font-semibold text-text-primary mb-4">
      Strengths
    </h3>

    <ul className="space-y-2">
      {analysisResult.strengths.map((item: string) => (
        <li key={item} className="text-green-400">
          ✅ {item}
        </li>
      ))}
    </ul>
  </div>
)}
{analysisResult?.weaknesses && (
  <div className="bg-surface rounded-lg border border-border-subtle p-6 mb-6">
    <h3 className="font-display font-semibold text-text-primary mb-4">
      Areas to Improve
    </h3>

    <ul className="space-y-2">
      {analysisResult.weaknesses.map((item: string) => (
        <li key={item} className="text-red-400">
          ⚠️ {item}
        </li>
      ))}
    </ul>
  </div>
)}


        </>
      )}
    </PageLayout>
  )
}
