import { useEffect, useState } from 'react'
import PageLayout from '../components/PageLayout'
import ScrollReveal from '../components/ScrollReveal'
import {
  Briefcase,
  MapPin,
  IndianRupee,
  Trash2,
} from 'lucide-react'

import { auth, db } from '../lib/firebase'

import {
  collection,
  getDocs,
  query,
  where,
  deleteDoc,
  doc,
} from 'firebase/firestore'

export default function SavedInternshipsPage() {
  const [savedInternships, setSavedInternships] =
    useState<any[]>([])

  const fetchSavedInternships = async () => {
    try {
      const user = auth.currentUser

      if (!user) return

      const q = query(
        collection(db, 'savedInternships'),
        where('userId', '==', user.uid)
      )

      const snapshot = await getDocs(q)

      const data = snapshot.docs.map((document) => ({
        id: document.id,
        ...document.data(),
      }))

      setSavedInternships(data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchSavedInternships()
  }, [])

  const removeBookmark = async (id: string) => {
    try {
      const confirmDelete = window.confirm(
        'Remove this internship from saved list?'
      )

      if (!confirmDelete) return

      await deleteDoc(
        doc(db, 'savedInternships', id)
      )

      fetchSavedInternships()

      alert(
        'Internship removed successfully!'
      )
    } catch (error) {
      console.log(error)
      alert('Failed to remove internship')
    }
  }

  return (
    <PageLayout title="Saved Internships">
      <ScrollReveal>
        {savedInternships.length === 0 ? (
          <div className="bg-surface rounded-lg border border-border-subtle p-10 text-center">
            <Briefcase className="w-12 h-12 text-text-muted mx-auto mb-4" />

            <h2 className="text-xl font-semibold text-text-primary mb-2">
              No Saved Internships
            </h2>

            <p className="text-text-secondary">
              Bookmark internships from the Internship Finder page.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedInternships.map(
              (internship) => (
                <div
                  key={internship.id}
                  className="bg-surface rounded-lg border border-border-subtle p-6 hover:border-cyan/50 transition-all"
                >
                  <Briefcase className="w-10 h-10 text-cyan mb-4" />

                  <h2 className="text-lg font-semibold text-text-primary">
                    {internship.role}
                  </h2>

                  <p className="text-text-secondary mt-1">
                    {internship.company}
                  </p>

                  <div className="mt-4 space-y-3">
                    <div className="flex items-center gap-2 text-text-secondary text-sm">
                      <MapPin className="w-4 h-4" />
                      {internship.location}
                    </div>

                    <div className="flex items-center gap-2 text-text-secondary text-sm">
                      <IndianRupee className="w-4 h-4" />
                      {internship.stipend}
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {internship.skills?.map(
                      (
                        skill: string,
                        index: number
                      ) => (
                        <span
                          key={index}
                          className="bg-cyan/10 text-cyan px-2 py-1 rounded-full text-xs"
                        >
                          {skill}
                        </span>
                      )
                    )}
                  </div>

                  <div className="mt-6 flex flex-col gap-3">
                    <button className="w-full bg-cyan text-deep py-2.5 rounded-md font-semibold hover:opacity-90 transition-all">
                      Apply Now
                    </button>

                    <button
                      onClick={() =>
                        removeBookmark(
                          internship.id
                        )
                      }
                      className="w-full bg-red-500 text-white py-2.5 rounded-md font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />

                      Remove Bookmark
                    </button>
                  </div>
                </div>
              )
            )}
          </div>
        )}
      </ScrollReveal>
    </PageLayout>
  )
}