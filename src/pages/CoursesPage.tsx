import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import PageLayout from '../components/PageLayout'
import ScrollReveal from '../components/ScrollReveal'
import {
  Search,
  BookOpen,
  CheckCircle2,
  Circle,
  ExternalLink,
  Sparkles,
  Award,
  Upload,
  X,
  Eye,
  AlertCircle,
  ShieldCheck,
  FileText
} from 'lucide-react'
import { db, auth } from '../lib/firebase'
import { onAuthStateChanged } from 'firebase/auth'
import {
  doc,
  getDoc,
  setDoc,
  collection,
  addDoc,
  query,
  where,
  getDocs,
  serverTimestamp
} from 'firebase/firestore'
import { uploadCertificate as uploadToCloudinary } from '../lib/cloudinary'

const categories = [
  'All',
  'Frontend',
  'Backend',
  'Data & AI',
  'DevOps & Cloud',
  'Core CS',
]

interface CertificationItem {
  id: string
  certificateName: string
  fileURL: string
  publicId?: string
  fileType?: string
  format?: string
  uploadedAt?: any
}

// Helper to determine if a course awards a Certificate or is a non-certification tutorial/guide
export const isCertificationCourse = (courseName: string): boolean => {
  const lower = courseName.toLowerCase()
  return (
    lower.includes('certified') ||
    lower.includes('certification') ||
    lower.includes('coursera') ||
    lower.includes('aws') ||
    lower.includes('meta') ||
    lower.includes('google') ||
    lower.includes('certificate') ||
    lower.includes('diploma') ||
    lower.includes('degree') ||
    lower.includes('specialization') ||
    lower.includes('professional certificate') ||
    lower.includes('exam')
  )
}

// Smart URL resolver to map course titles / topics to verified 100% FREE resources
const resolveFreeResourceUrl = (courseName: string): { url: string; platform: string } => {
  const lower = courseName.toLowerCase()

  if (lower.includes('python')) {
    return { url: 'https://www.freecodecamp.org/news/python-programming-course/', platform: 'freeCodeCamp' }
  }
  if (lower.includes('react') || lower.includes('next')) {
    return { url: 'https://react.dev/learn', platform: 'Official React Docs' }
  }
  if (lower.includes('dsa') || lower.includes('algorithm') || lower.includes('data structure')) {
    return { url: 'https://takeuforward.org/strivers-a2z-dsa-course/', platform: 'takeUforward (Free)' }
  }
  if (lower.includes('javascript') || lower.includes('js')) {
    return { url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide', platform: 'MDN Web Docs' }
  }
  if (lower.includes('node') || lower.includes('express') || lower.includes('backend')) {
    return { url: 'https://www.youtube.com/results?search_query=freecodecamp+node.js+full+course', platform: 'YouTube / freeCodeCamp' }
  }
  if (lower.includes('aws') || lower.includes('cloud')) {
    return { url: 'https://aws.amazon.com/training/free/', platform: 'AWS Skill Builder (Free)' }
  }
  if (lower.includes('sql') || lower.includes('database') || lower.includes('postgres')) {
    return { url: 'https://www.freecodecamp.org/news/sql-and-databases-full-course/', platform: 'freeCodeCamp' }
  }
  if (lower.includes('git') || lower.includes('github')) {
    return { url: 'https://www.youtube.com/results?search_query=git+and+github+full+course+freecodecamp', platform: 'freeCodeCamp / YouTube' }
  }
  if (lower.includes('machine learning') || lower.includes('ai') || lower.includes('deep learning')) {
    return { url: 'https://www.coursera.org/learn/machine-learning', platform: 'Coursera (Free Audit)' }
  }
  if (lower.includes('docker') || lower.includes('kubernetes') || lower.includes('devops')) {
    return { url: 'https://www.youtube.com/results?search_query=freecodecamp+docker+kubernetes+course', platform: 'YouTube / freeCodeCamp' }
  }

  const query = encodeURIComponent(`${courseName} free course tutorial`)
  return { url: `https://www.youtube.com/results?search_query=${query}`, platform: 'Free Learning Resource' }
}

export default function CoursesPage() {
  const navigate = useNavigate()

  const [activeCategory, setActiveCategory] = useState('All')
  const [courseTypeFilter, setCourseTypeFilter] = useState<'All' | 'Certification' | 'Non-Certification'>('All')
  const [search, setSearch] = useState('')
  const [courses, setCourses] = useState<string[]>([])
  const [completedCourses, setCompletedCourses] = useState<string[]>([])
  const [userCertificates, setUserCertificates] = useState<CertificationItem[]>([])
  const [loading, setLoading] = useState(true)

  // Upload modal state
  const [uploadModalCourse, setUploadModalCourse] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')

  // View preview modal
  const [activePreviewCert, setActivePreviewCert] = useState<CertificationItem | null>(null)

  const fetchUserData = async (user: NonNullable<typeof auth.currentUser>) => {
    try {
      // 1. Fetch user certificates from Firestore
      const certsQuery = query(
        collection(db, 'certifications'),
        where('userId', '==', user.uid)
      )
      const certSnap = await getDocs(certsQuery)
      const certsData = certSnap.docs.map((docSnap) => ({
        id: docSnap.id,
        ...(docSnap.data() as Omit<CertificationItem, 'id'>),
      }))
      setUserCertificates(certsData)

      // 2. Fetch courses & completed courses from resumeAnalysis
      const resumeRef = doc(db, 'resumeAnalysis', user.uid)
      const resumeSnap = await getDoc(resumeRef)

      if (resumeSnap.exists()) {
        const data = resumeSnap.data()
        const combined = Array.from(
          new Set([
            ...(data.recommendedCourses || []),
            ...(data.learningRoadmap || []),
          ])
        )

        if (combined.length > 0) {
          setCourses(combined)
        } else {
          // Default recommended courses with a mix of Certification and Non-Certification courses
          setCourses([
            'AWS Certified Cloud Practitioner - AWS Training (Certification)',
            'Coursera Full Stack Web Development Professional Certificate',
            'Google Data Analytics Professional Certificate (Certification Course)',
            'Python Programming Fundamentals - freeCodeCamp',
            'Striver A2Z DSA & Algorithms Course - takeUforward',
            'Git & GitHub Version Control - Coursera Free Audit',
            'SQL & Relational Database Design - MDN Docs',
            'Docker & Containerization Essentials - YouTube freeCodeCamp',
          ])
        }

        setCompletedCourses(data.completedCourses || [])
      } else {
        setCourses([
          'AWS Certified Cloud Practitioner - AWS Training (Certification)',
          'Coursera Full Stack Web Development Professional Certificate',
          'Google Data Analytics Professional Certificate (Certification Course)',
          'Python Programming Fundamentals - freeCodeCamp',
          'Striver A2Z DSA & Algorithms Course - takeUforward',
          'Git & GitHub Version Control - Coursera Free Audit',
          'SQL & Relational Database Design - MDN Docs',
          'Docker & Containerization Essentials - YouTube freeCodeCamp',
        ])
      }
    } catch (error) {
      console.error('Error fetching courses data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchUserData(user)
      } else {
        setLoading(false)
      }
    })

    return () => unsubscribe()
  }, [])

  // Find if user has uploaded a matching certificate for a given course name
  const getMatchingCertificate = (courseName: string): CertificationItem | undefined => {
    const cLower = courseName.toLowerCase().trim()
    return userCertificates.find((cert) => {
      const nameLower = cert.certificateName.toLowerCase().trim()
      return (
        nameLower === cLower ||
        nameLower.includes(cLower) ||
        cLower.includes(nameLower)
      )
    })
  }

  // Toggle course completion logic:
  // For Non-Certification courses: directly toggleable.
  // For Certification courses: mandatory certificate upload required first.
  const handleToggleCourse = async (course: string) => {
    const user = auth.currentUser
    if (!user) return

    const isCert = isCertificationCourse(course)
    const isCompleted = completedCourses.includes(course)
    const matchingCert = getMatchingCertificate(course)

    if (isCert && !isCompleted && !matchingCert) {
      // Mandatory certificate upload prompt for certification courses
      setUploadModalCourse(course)
      setSelectedFile(null)
      setUploadError('')
      return
    }

    // Toggle completion status
    const updated = isCompleted
      ? completedCourses.filter((c) => c !== course)
      : [...completedCourses, course]

    setCompletedCourses(updated)

    try {
      await setDoc(
        doc(db, 'resumeAnalysis', user.uid),
        { completedCourses: updated },
        { merge: true }
      )
    } catch (error) {
      console.error('Error updating course completion:', error)
      setCompletedCourses(completedCourses)
    }
  }

  // Handle uploading certificate directly from modal
  const handleCertificateUpload = async () => {
    if (!uploadModalCourse || !selectedFile) {
      setUploadError('Please select a certificate file (PDF or Image).')
      return
    }

    const user = auth.currentUser
    if (!user) return

    try {
      setUploading(true)
      setUploadError('')

      // 1. Upload file to Cloudinary
      const uploadResult = await uploadToCloudinary(selectedFile)
      const fileURL = uploadResult.secure_url
      const isPdf = selectedFile.type === 'application/pdf' || selectedFile.name.endsWith('.pdf')

      // 2. Add document to Firestore 'certifications' collection
      const certDocRef = await addDoc(collection(db, 'certifications'), {
        userId: user.uid,
        certificateName: uploadModalCourse.trim(),
        fileURL,
        publicId: uploadResult.public_id || '',
        fileType: isPdf ? 'pdf' : (uploadResult.resource_type || 'image'),
        format: uploadResult.format || (isPdf ? 'pdf' : 'jpg'),
        uploadedAt: serverTimestamp(),
      })

      const newCert: CertificationItem = {
        id: certDocRef.id,
        certificateName: uploadModalCourse.trim(),
        fileURL,
        fileType: isPdf ? 'pdf' : 'image',
      }

      setUserCertificates((prev) => [...prev, newCert])

      // 3. Automatically mark course as completed in resumeAnalysis
      const updatedCompleted = Array.from(new Set([...completedCourses, uploadModalCourse]))
      setCompletedCourses(updatedCompleted)

      await setDoc(
        doc(db, 'resumeAnalysis', user.uid),
        { completedCourses: updatedCompleted },
        { merge: true }
      )

      // Close modal
      setUploadModalCourse(null)
      setSelectedFile(null)
    } catch (err: any) {
      console.error('Failed to upload certificate:', err)
      setUploadError('Failed to upload certificate. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  // Filtering Courses
  const filteredCourses = courses.filter((course) => {
    // 1. Search Query Filter
    const matchesSearch = course.toLowerCase().includes(search.toLowerCase())
    if (!matchesSearch) return false

    // 2. Certification vs Non-Certification Filter
    const isCert = isCertificationCourse(course)
    if (courseTypeFilter === 'Certification' && !isCert) return false
    if (courseTypeFilter === 'Non-Certification' && isCert) return false

    // 3. Category Filter
    if (activeCategory === 'All') return true
    const lower = course.toLowerCase()
    if (activeCategory === 'Frontend') return lower.includes('react') || lower.includes('web') || lower.includes('html') || lower.includes('css') || lower.includes('javascript')
    if (activeCategory === 'Backend') return lower.includes('node') || lower.includes('python') || lower.includes('sql') || lower.includes('database') || lower.includes('api')
    if (activeCategory === 'Data & AI') return lower.includes('data') || lower.includes('machine') || lower.includes('ai') || lower.includes('python')
    if (activeCategory === 'DevOps & Cloud') return lower.includes('aws') || lower.includes('docker') || lower.includes('cloud') || lower.includes('git')
    if (activeCategory === 'Core CS') return lower.includes('dsa') || lower.includes('algorithm') || lower.includes('system')
    return true
  })

  const certCoursesCount = courses.filter(isCertificationCourse).length
  const nonCertCoursesCount = courses.length - certCoursesCount
  const completionPercentage = courses.length > 0 ? Math.round((completedCourses.length / courses.length) * 100) : 0

  return (
    <PageLayout title="Courses & Learning Module">
      {/* Header & Controls */}
      <ScrollReveal className="mb-6">
        <div className="glass-card rounded-2xl p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="w-4 h-4 text-cyan" />
                <span className="text-xs font-bold uppercase tracking-wider text-cyan">Personalized Learning Roadmap</span>
              </div>
              <h2 className="text-xl font-bold text-text-primary">
                Recommended Courses ({courses.length})
              </h2>
              <p className="text-xs text-text-secondary mt-1">
                Filter between <strong>Certification Courses</strong> (Mandatory Certificate Upload) and <strong>Non-Certification Courses</strong> (Optional/Free Track).
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/certifications')}
                className="px-4 py-2.5 rounded-xl bg-cyan/10 text-cyan border border-cyan/20 text-xs font-bold flex items-center gap-2 hover:bg-cyan/20 transition-all"
              >
                <Award className="w-4 h-4" /> Manage All Certificates
              </button>
            </div>
          </div>

          {/* Certification vs Non-Certification Filter Tabs */}
          <div className="flex items-center gap-2 mb-6 p-1.5 bg-void/60 border border-border-subtle rounded-xl max-w-md">
            <button
              onClick={() => setCourseTypeFilter('All')}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                courseTypeFilter === 'All'
                  ? 'bg-cyan text-deep shadow-md'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              All Courses ({courses.length})
            </button>
            <button
              onClick={() => setCourseTypeFilter('Certification')}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                courseTypeFilter === 'Certification'
                  ? 'bg-cyan text-deep shadow-md'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              <Award className="w-3.5 h-3.5" /> Certification ({certCoursesCount})
            </button>
            <button
              onClick={() => setCourseTypeFilter('Non-Certification')}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                courseTypeFilter === 'Non-Certification'
                  ? 'bg-cyan text-deep shadow-md'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" /> Non-Certification ({nonCertCoursesCount})
            </button>
          </div>

          {/* Search & Category Filter */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search courses by skill, topic, or keyword..."
                className="w-full pl-11 pr-4 py-3 bg-elevated border border-border-subtle rounded-xl text-text-primary text-sm placeholder:text-text-muted focus:outline-none focus:border-cyan/50"
              />
            </div>

            <div className="flex gap-2 flex-wrap items-center">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    activeCategory === cat
                      ? 'bg-cyan text-deep shadow-md'
                      : 'bg-elevated text-text-secondary hover:text-text-primary border border-border-subtle'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* Progress Bar */}
      {!loading && courses.length > 0 && (
        <ScrollReveal className="mb-8">
          <div className="glass-card rounded-2xl p-6 border-cyan/20">
            <div className="flex items-center justify-between text-sm font-semibold mb-2">
              <span className="text-text-primary">Overall Course Completion Progress</span>
              <span className="text-cyan font-mono text-base">
                {completedCourses.length} / {courses.length} Completed ({completionPercentage}%)
              </span>
            </div>
            <div className="w-full bg-void rounded-full h-3 overflow-hidden border border-border-subtle">
              <div
                className="bg-gradient-to-r from-cyan to-indigo-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </div>
        </ScrollReveal>
      )}

      {/* Courses Grid */}
      <ScrollReveal>
        {loading ? (
          <div className="glass-card rounded-2xl p-12 text-center">
            <p className="text-text-secondary text-sm font-medium animate-pulse">
              Loading courses and checking certificate verification status...
            </p>
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="glass-card rounded-2xl p-12 text-center">
            <BookOpen className="w-14 h-14 text-text-muted mx-auto mb-4" />
            <h3 className="text-lg font-bold text-text-primary mb-2">No Courses Match Filter</h3>
            <p className="text-text-secondary text-sm">
              Try switching course type filter or category filter.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course, index) => {
              const isCert = isCertificationCourse(course)
              const isCompleted = completedCourses.includes(course)
              const matchingCert = getMatchingCertificate(course)
              const { url, platform } = resolveFreeResourceUrl(course)

              return (
                <div
                  key={index}
                  className={`glass-card rounded-2xl p-6 flex flex-col justify-between transition-all relative overflow-hidden ${
                    isCompleted ? 'border-emerald-500/40 bg-emerald-500/5' : 'hover:border-cyan/50'
                  }`}
                >
                  <div>
                    {/* Top Badges */}
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center border ${
                        isCert ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' : 'bg-cyan/10 border-cyan/20 text-cyan'
                      }`}>
                        {isCert ? <Award className="w-5 h-5" /> : <BookOpen className="w-5 h-5" />}
                      </div>

                      <div className="flex flex-col items-end gap-1.5">
                        {isCert ? (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3" /> Certification (Mandatory Upload)
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-cyan/10 text-cyan border border-cyan/20">
                            Non-Certification (Optional)
                          </span>
                        )}

                        {/* Status badge / Checkmark */}
                        <div className="flex items-center gap-2 mt-1">
                          <button
                            onClick={() => handleToggleCourse(course)}
                            className="p-1 text-text-muted hover:text-cyan transition-colors"
                            title={
                              isCert && !isCompleted && !matchingCert
                                ? 'Upload certificate required to complete'
                                : isCompleted
                                ? 'Mark as incomplete'
                                : 'Mark as completed'
                            }
                          >
                            {isCompleted ? (
                              <CheckCircle2 className="w-7 h-7 text-emerald-400 fill-emerald-400/20" />
                            ) : (
                              <Circle className="w-7 h-7 text-text-muted hover:text-cyan" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>

                    <h3 className="text-base font-bold text-text-primary mb-2 leading-snug">
                      {course}
                    </h3>
                    <p className="text-xs text-text-muted mb-4">
                      Platform: <strong className="text-cyan">{platform}</strong>
                    </p>

                    {/* Certificate Status Info */}
                    {isCert && (
                      <div className="mb-4 p-3 rounded-xl bg-elevated/60 border border-border-subtle text-xs">
                        {matchingCert ? (
                          <div className="flex items-center justify-between">
                            <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
                              <CheckCircle2 className="w-4 h-4" /> Certificate Verified
                            </span>
                            <button
                              onClick={() => setActivePreviewCert(matchingCert)}
                              className="text-cyan hover:underline text-[11px] font-bold flex items-center gap-1"
                            >
                              <Eye className="w-3 h-3" /> View Document
                            </button>
                          </div>
                        ) : (
                          <div className="text-amber-400/90 font-medium flex items-center gap-1.5">
                            <AlertCircle className="w-4 h-4 shrink-0" />
                            <span>Mandatory certificate upload required to complete</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="space-y-2 pt-4 border-t border-border-subtle">
                    {isCert && !matchingCert && !isCompleted && (
                      <button
                        onClick={() => {
                          setUploadModalCourse(course)
                          setSelectedFile(null)
                          setUploadError('')
                        }}
                        className="w-full py-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-bold flex items-center justify-center gap-2 transition-all"
                      >
                        <Upload className="w-3.5 h-3.5" /> Upload Certificate to Complete
                      </button>
                    )}

                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2.5 rounded-xl bg-cyan text-deep font-bold text-xs flex items-center justify-center gap-2 hover:brightness-110 transition-all"
                    >
                      Start Learning <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </ScrollReveal>

      {/* Mandatory Certificate Upload Modal */}
      {uploadModalCourse && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-surface border border-border-subtle rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl p-6 sm:p-8">
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-border-subtle">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-text-primary">
                    Upload Completion Certificate
                  </h3>
                  <p className="text-xs text-amber-400">Mandatory for Certification Courses</p>
                </div>
              </div>
              <button
                onClick={() => setUploadModalCourse(null)}
                className="p-1.5 rounded-lg bg-elevated text-text-muted hover:text-text-primary"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
                <span>
                  This is a <strong>Certification Course</strong>. To mark it as completed, you must upload a valid completion document (PDF or image).
                </span>
              </div>

              <div>
                <label className="text-xs font-semibold text-text-primary block mb-1">
                  Course Title
                </label>
                <input
                  type="text"
                  readOnly
                  value={uploadModalCourse}
                  className="w-full px-4 py-2.5 bg-void border border-border-subtle rounded-xl text-text-primary text-xs font-medium focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-text-primary block mb-1">
                  Upload Certificate File (PDF or Image)
                </label>
                <input
                  type="file"
                  accept=".pdf,image/*"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  className="w-full text-xs text-text-secondary file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-cyan/10 file:text-cyan hover:file:bg-cyan/20 cursor-pointer"
                />
              </div>

              {selectedFile && (
                <div className="p-3 bg-elevated/60 rounded-xl border border-border-subtle flex items-center justify-between text-xs">
                  <span className="text-text-secondary truncate">{selectedFile.name}</span>
                  <span className="text-cyan font-mono">{(selectedFile.size / 1024).toFixed(1)} KB</span>
                </div>
              )}

              {uploadError && (
                <p className="text-xs text-rose-400 font-medium">{uploadError}</p>
              )}

              <div className="flex items-center gap-3 pt-4 border-t border-border-subtle">
                <button
                  onClick={() => setUploadModalCourse(null)}
                  className="flex-1 py-2.5 rounded-xl bg-elevated text-text-secondary hover:text-text-primary text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCertificateUpload}
                  disabled={uploading || !selectedFile}
                  className="flex-1 py-2.5 rounded-xl bg-cyan text-deep text-xs font-bold flex items-center justify-center gap-2 hover:brightness-110 disabled:opacity-50"
                >
                  <Upload className="w-4 h-4" />
                  {uploading ? 'Uploading...' : 'Upload & Verify'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Certificate Document Viewer Modal */}
      {activePreviewCert && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-surface border border-border-subtle rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
            <div className="p-4 sm:p-6 border-b border-border-subtle flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-text-primary">
                  {activePreviewCert.certificateName}
                </h3>
                <p className="text-xs text-text-secondary">Verified Certificate Preview</p>
              </div>
              <div className="flex items-center gap-3">
                <a
                  href={activePreviewCert.fileURL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-cyan text-deep text-xs font-bold flex items-center gap-1 hover:brightness-110"
                >
                  Open Original <ExternalLink className="w-3 h-3" />
                </a>
                <button
                  onClick={() => setActivePreviewCert(null)}
                  className="p-1.5 rounded-lg bg-elevated text-text-muted hover:text-text-primary"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 bg-void p-4 overflow-auto flex items-center justify-center min-h-[400px]">
              {activePreviewCert.fileType === 'pdf' || activePreviewCert.fileURL?.toLowerCase().includes('.pdf') ? (
                <iframe
                  src={activePreviewCert.fileURL}
                  className="w-full h-[600px] rounded-xl border border-border-subtle"
                  title={activePreviewCert.certificateName}
                />
              ) : (
                <img
                  src={activePreviewCert.fileURL}
                  alt={activePreviewCert.certificateName}
                  className="max-w-full max-h-[600px] object-contain rounded-xl shadow-lg border border-border-subtle"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </PageLayout>
  )
}