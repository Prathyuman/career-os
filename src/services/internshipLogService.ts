import { db, auth } from '../lib/firebase'
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  deleteDoc,
  doc,
  serverTimestamp,
} from 'firebase/firestore'

export interface InternshipExperience {
  id?: string
  userId: string
  company: string
  role: string
  duration: string
  description: string
  skillsUsed: string[]
  certificateUrl?: string
  createdAt?: any
}

export const fetchUserInternships = async (userId: string): Promise<InternshipExperience[]> => {
  try {
    const q = query(
      collection(db, 'internshipLogs'),
      where('userId', '==', userId)
    )
    const snapshot = await getDocs(q)
    return snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...(docSnap.data() as Omit<InternshipExperience, 'id'>),
    }))
  } catch (error) {
    console.error('Error fetching internship logs:', error)
    return []
  }
}

export const logInternshipExperience = async (
  experience: Omit<InternshipExperience, 'id' | 'userId' | 'createdAt'>
): Promise<string | null> => {
  const user = auth.currentUser
  if (!user) return null

  try {
    const docRef = await addDoc(collection(db, 'internshipLogs'), {
      userId: user.uid,
      ...experience,
      createdAt: serverTimestamp(),
    })
    return docRef.id
  } catch (error) {
    console.error('Error logging internship experience:', error)
    throw error
  }
}

export const deleteInternshipExperience = async (id: string): Promise<boolean> => {
  try {
    await deleteDoc(doc(db, 'internshipLogs', id))
    return true
  } catch (error) {
    console.error('Error deleting internship experience:', error)
    return false
  }
}
