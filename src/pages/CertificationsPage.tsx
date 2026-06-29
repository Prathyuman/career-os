import { useState, useEffect } from 'react'
import PageLayout from '../components/PageLayout'
import ScrollReveal from '../components/ScrollReveal'
import { Award, Upload, FileText } from 'lucide-react'

import { auth, db, storage } from '../lib/firebase'

import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  serverTimestamp,
} from 'firebase/firestore'

import {
  ref,
  uploadBytes,
  getDownloadURL,
} from 'firebase/storage'

export default function CertificationsPage() {
  const [certificateName, setCertificateName] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const [uploading, setUploading] = useState(false)
  const [certificates, setCertificates] = useState<any[]>([])

  useEffect(() => {
    fetchCertificates()
  }, [])

  const fetchCertificates = async () => {
    try {
      const user = auth.currentUser

      if (!user) return

      const q = query(
        collection(db, 'certifications'),
        where('userId', '==', user.uid)
      )

      const snapshot = await getDocs(q)

      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))

      setCertificates(data)
    } catch (error) {
      console.log(error)
    }
  }

  const uploadCertificate = async () => {
    try {
      if (!certificateName || !selectedFile) {
        alert('Please enter certificate name and choose a file')
        return
      }

      const user = auth.currentUser

      if (!user) return

      setUploading(true)

      const storageRef = ref(
        storage,
        `certificates/${user.uid}/${Date.now()}_${selectedFile.name}`
      )

      await uploadBytes(storageRef, selectedFile)

      const fileURL = await getDownloadURL(storageRef)

      await addDoc(collection(db, 'certifications'), {
        userId: user.uid,
        certificateName,
        fileURL,
        uploadedAt: serverTimestamp(),
      })

      alert('Certificate uploaded successfully!')

      setCertificateName('')
      setSelectedFile(null)

      fetchCertificates()
    } catch (error) {
      console.log(error)
      alert('Upload failed')
    } finally {
      setUploading(false)
    }
  }

  return (
    <PageLayout title="Certification Tracker">
      {/* Upload Section */}
      <ScrollReveal>
        <div className="bg-surface rounded-lg border border-border-subtle p-6 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <Award className="w-8 h-8 text-cyan" />

            <div>
              <h2 className="text-xl font-semibold text-text-primary">
                Upload Certificate
              </h2>

              <p className="text-text-secondary text-sm">
                Upload certificates for completed courses
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <input
              type="text"
              placeholder="Certificate Name"
              value={certificateName}
              onChange={(e) =>
                setCertificateName(e.target.value)
              }
              className="w-full px-4 py-3 bg-elevated border border-border-subtle rounded-md text-text-primary"
            />

            <input
              type="file"
              accept=".pdf,image/*"
              onChange={(e) =>
                setSelectedFile(
                  e.target.files?.[0] || null
                )
              }
              className="w-full text-text-primary"
            />

            {selectedFile && (
              <div className="bg-elevated rounded-md p-3 border border-border-subtle">
                <p className="text-text-secondary text-sm">
                  Selected File
                </p>

                <p className="text-cyan mt-1">
                  {selectedFile.name}
                </p>
              </div>
            )}

            <button
              onClick={uploadCertificate}
              disabled={uploading}
              className="w-full bg-cyan text-deep py-3 rounded-md font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-all"
            >
              <Upload className="w-5 h-5" />

              {uploading
                ? 'Uploading...'
                : 'Upload Certificate'}
            </button>
          </div>
        </div>
      </ScrollReveal>

      {/* Uploaded Certificates */}
      <ScrollReveal>
        <div>
          <h2 className="text-xl font-semibold text-text-primary mb-6">
            Uploaded Certificates
          </h2>

          {certificates.length === 0 ? (
            <div className="bg-surface rounded-lg border border-border-subtle p-10 text-center">
              <FileText className="w-12 h-12 text-text-muted mx-auto mb-4" />

              <h3 className="text-lg font-semibold text-text-primary mb-2">
                No Certificates Uploaded
              </h3>

              <p className="text-text-secondary">
                Upload your first certificate to track your achievements.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {certificates.map((cert) => (
                <div
                  key={cert.id}
                  className="bg-surface rounded-lg border border-border-subtle p-6 hover:border-cyan/50 transition-all"
                >
                  <Award className="w-10 h-10 text-cyan mb-4" />

                  <h3 className="text-lg font-semibold text-text-primary mb-3">
                    {cert.certificateName}
                  </h3>

                  <a
                    href={cert.fileURL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cyan hover:underline"
                  >
                    View Certificate
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      </ScrollReveal>
    </PageLayout>
  )
}