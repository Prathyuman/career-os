import { useState, useEffect } from 'react'
import PageLayout from '../components/PageLayout'
import ScrollReveal from '../components/ScrollReveal'
import { Award, Upload, FileText, ExternalLink, Trash2, Eye, X, CheckCircle2 } from 'lucide-react'

import { auth, db } from '../lib/firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { uploadCertificate as uploadToCloudinary } from '../lib/cloudinary'
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  serverTimestamp,
  deleteDoc,
  doc,
} from 'firebase/firestore'

interface CertificationItem {
  id: string
  certificateName: string
  fileURL: string
  publicId?: string
  fileType?: string
  format?: string
  uploadedAt?: any
}

export default function CertificationsPage() {
  const [certificateName, setCertificateName] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [certificates, setCertificates] = useState<CertificationItem[]>([])
  const [activePreview, setActivePreview] = useState<CertificationItem | null>(null)
  const [successMsg, setSuccessMsg] = useState('')

  const fetchCertificates = async () => {
    try {
      const user = auth.currentUser
      if (!user) return

      const q = query(
        collection(db, 'certifications'),
        where('userId', '==', user.uid)
      )

      const snapshot = await getDocs(q)
      const data = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...(docSnap.data() as Omit<CertificationItem, 'id'>),
      }))

      setCertificates(data)
    } catch (error) {
      console.error('Error fetching certificates:', error)
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) fetchCertificates()
    })
    return () => unsubscribe()
  }, [])

  const deleteCertificate = async (id: string) => {
    try {
      const confirmDelete = window.confirm(
        'Are you sure you want to delete this certificate?'
      )
      if (!confirmDelete) return

      await deleteDoc(doc(db, 'certifications', id))
      if (activePreview?.id === id) setActivePreview(null)

      setSuccessMsg('Certificate deleted successfully')
      setTimeout(() => setSuccessMsg(''), 3000)

      fetchCertificates()
    } catch (error) {
      console.error(error)
      alert('Failed to delete certificate')
    }
  }

  const handleUpload = async () => {
    try {
      if (!certificateName.trim() || !selectedFile) {
        alert('Please enter a certificate name and choose a file')
        return
      }

      const user = auth.currentUser
      if (!user) {
        alert('Please sign in to upload certificates')
        return
      }

      setUploading(true)

      // Upload to Cloudinary
      const uploadResult = await uploadToCloudinary(selectedFile)
      const fileURL = uploadResult.secure_url
      const isPdf = selectedFile.type === 'application/pdf' || selectedFile.name.endsWith('.pdf')

      // Save certificate details in Firestore
      await addDoc(collection(db, 'certifications'), {
        userId: user.uid,
        certificateName: certificateName.trim(),
        fileURL,
        publicId: uploadResult.public_id || '',
        fileType: isPdf ? 'pdf' : (uploadResult.resource_type || 'image'),
        format: uploadResult.format || (isPdf ? 'pdf' : 'jpg'),
        uploadedAt: serverTimestamp(),
      })

      setSuccessMsg('Certificate uploaded successfully!')
      setTimeout(() => setSuccessMsg(''), 3000)

      setCertificateName('')
      setSelectedFile(null)

      await fetchCertificates()
    } catch (error) {
      console.error(error)
      alert('Upload failed. Please check your network and try again.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <PageLayout title="Certifications & Achievements">
      {/* Upload Section */}
      <ScrollReveal className="mb-8">
        <div className="bg-surface rounded-2xl border border-border-subtle p-6 md:p-8 relative overflow-hidden">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-cyan/10 border border-cyan/20 flex items-center justify-center">
              <Award className="w-6 h-6 text-cyan" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-text-primary">
                Upload New Certificate
              </h2>
              <p className="text-text-secondary text-sm">
                Add verified certificates to boost your career progress score & profile credibility
              </p>
            </div>
          </div>

          {successMsg && (
            <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5" />
              <span>{successMsg}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-text-primary block mb-2">
                  Certificate Name / Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. AWS Certified Cloud Practitioner"
                  value={certificateName}
                  onChange={(e) => setCertificateName(e.target.value)}
                  className="w-full px-4 py-3 bg-elevated border border-border-subtle rounded-xl text-text-primary text-sm placeholder:text-text-muted focus:outline-none focus:border-cyan/50 transition-colors"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-text-primary block mb-2">
                  Upload Document (PDF or Image)
                </label>
                <input
                  type="file"
                  accept=".pdf,image/*"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  className="w-full text-sm text-text-secondary file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-cyan/10 file:text-cyan hover:file:bg-cyan/20 transition-all cursor-pointer"
                />
              </div>

              {selectedFile && (
                <div className="p-3 bg-elevated/60 rounded-xl border border-border-subtle flex items-center justify-between text-xs">
                  <span className="text-text-secondary truncate">{selectedFile.name}</span>
                  <span className="text-cyan font-mono">{(selectedFile.size / 1024).toFixed(1)} KB</span>
                </div>
              )}

              <button
                onClick={handleUpload}
                disabled={uploading}
                className="w-full py-3 rounded-xl bg-cyan text-deep font-bold text-sm flex items-center justify-center gap-2 hover:brightness-110 transition-all disabled:opacity-50"
              >
                <Upload className="w-4 h-4" />
                {uploading ? 'Uploading Certificate...' : 'Upload Certificate'}
              </button>
            </div>

            <div className="p-6 rounded-xl bg-elevated/40 border border-border-subtle flex flex-col justify-center">
              <h3 className="text-sm font-semibold text-text-primary mb-3">
                Supported Certificate Types:
              </h3>
              <ul className="space-y-2 text-xs text-text-secondary">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan" />
                  PDF Documents (.pdf) from Coursera, Udemy, edX, LinkedIn
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan" />
                  Images (.jpg, .png, .webp) of diplomas & completion badges
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan" />
                  Direct Cloudinary secure storage with high availability viewing
                </li>
              </ul>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* Uploaded Certificates List */}
      <ScrollReveal>
        <div>
          <h2 className="text-xl font-bold text-text-primary mb-6">
            Your Verified Certificates ({certificates.length})
          </h2>

          {certificates.length === 0 ? (
            <div className="bg-surface rounded-2xl border border-border-subtle p-12 text-center">
              <FileText className="w-14 h-14 text-text-muted mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-text-primary mb-2">
                No Certificates Found
              </h3>
              <p className="text-text-secondary text-sm max-w-md mx-auto">
                Upload your course completion certificates above to start building your career portfolio.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {certificates.map((cert) => {
                const isPdf = cert.fileType === 'pdf' || cert.fileURL?.toLowerCase().includes('.pdf')

                return (
                  <div
                    key={cert.id}
                    className="glass-card rounded-2xl p-6 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-10 h-10 rounded-xl bg-cyan/10 flex items-center justify-center text-cyan">
                          <Award className="w-5 h-5" />
                        </div>
                        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-elevated text-cyan border border-border-subtle uppercase tracking-wider">
                          {isPdf ? 'PDF' : 'IMAGE'}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-text-primary mb-2 line-clamp-2">
                        {cert.certificateName}
                      </h3>
                      <p className="text-xs text-text-muted mb-4">
                        Uploaded to Cloudinary Storage
                      </p>
                    </div>

                    <div className="space-y-2 pt-4 border-t border-border-subtle">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setActivePreview(cert)}
                          className="flex-1 py-2 px-3 rounded-xl bg-cyan/10 hover:bg-cyan/20 text-cyan text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          Preview
                        </button>
                        <a
                          href={cert.fileURL}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="py-2 px-3 rounded-xl bg-elevated hover:bg-elevated/80 text-text-secondary hover:text-text-primary text-xs font-semibold flex items-center gap-1 transition-colors"
                          title="Open Original Link"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                        <button
                          onClick={() => deleteCertificate(cert.id)}
                          className="py-2 px-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-semibold flex items-center gap-1 transition-colors"
                          title="Delete Certificate"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </ScrollReveal>

      {/* Certificate Preview Modal */}
      {activePreview && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-surface border border-border-subtle rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
            <div className="p-4 sm:p-6 border-b border-border-subtle flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-text-primary">
                  {activePreview.certificateName}
                </h3>
                <p className="text-xs text-text-secondary">Certificate Document Viewer</p>
              </div>
              <div className="flex items-center gap-3">
                <a
                  href={activePreview.fileURL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-cyan text-deep text-xs font-bold flex items-center gap-1 hover:brightness-110"
                >
                  Open Full File <ExternalLink className="w-3 h-3" />
                </a>
                <button
                  onClick={() => setActivePreview(null)}
                  className="p-1.5 rounded-lg bg-elevated text-text-muted hover:text-text-primary"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 bg-void p-4 overflow-auto flex items-center justify-center min-h-[400px]">
              {activePreview.fileType === 'pdf' || activePreview.fileURL?.toLowerCase().includes('.pdf') ? (
                <iframe
                  src={activePreview.fileURL}
                  className="w-full h-[600px] rounded-xl border border-border-subtle"
                  title={activePreview.certificateName}
                />
              ) : (
                <img
                  src={activePreview.fileURL}
                  alt={activePreview.certificateName}
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