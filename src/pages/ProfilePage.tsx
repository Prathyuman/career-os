import { useEffect, useState } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { auth } from '../lib/firebase'
import PageLayout from '../components/PageLayout'
import ScrollReveal from '../components/ScrollReveal'
import {
  Mail,
  MapPin,
  Link as LinkIcon,
  Github,
  Linkedin,
  Globe,
  Edit3,
  Save,
} from 'lucide-react'
export default function ProfilePage() {
  const [editing, setEditing] = useState(false)

  const [userData, setUserData] = useState({
    name: 'User',
    email: '',
    photoURL: '',
  })

  const [profile, setProfile] = useState({
  college: '',
  branch: '',
  year: '',
  bio: '',
  location: '',
  github: '',
  linkedin: '',
  portfolio: '',
  role: '',
})

  useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, async (user) => {
    if (user) {
      setUserData({
        name: user.displayName || 'User',
        email: user.email || '',
        photoURL: user.photoURL || '',
      })

      const docRef = doc(db, 'users', user.uid)
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        const data = docSnap.data()

        setProfile({
  college: data.college || '',
  branch: data.branch || '',
  year: data.year || '',
  bio: data.bio || '',
  location: data.location || '',
  github: data.github || '',
  linkedin: data.linkedin || '',
  portfolio: data.portfolio || '',
  role: data.role || '',
})
      }
    } else {
      setUserData({
        name: 'User',
        email: '',
        photoURL: '',
      })
    }
  })

  return () => unsubscribe()
}, [])
  return (
    <PageLayout title="Profile">
      <ScrollReveal>
        <div className="bg-surface rounded-lg border border-border-subtle p-6 mb-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="w-20 h-20 rounded-full overflow-hidden bg-cyan/20">
              <img
  src={
    userData.photoURL ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      userData.name
    )}&background=0D8ABC&color=fff`
  }
  alt="Profile"
  referrerPolicy="no-referrer"
  className="w-full h-full object-cover"
/>
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h2 className="font-display text-xl font-bold text-text-primary">
                  {userData.name}
                </h2>

                <button
  onClick={async () => {
    if (editing) {
      const user = auth.currentUser
      if (!user) return

      await setDoc(
        doc(db, 'users', user.uid),
        profile,
        { merge: true }
      )
    }

    setEditing(!editing)
  }}
  className="px-3 py-1 rounded-md bg-elevated text-text-secondary text-xs hover:text-cyan transition-colors flex items-center gap-1"
>
  {editing ? <Save className="w-3 h-3" /> : <Edit3 className="w-3 h-3" />}
  {editing ? 'Save' : 'Edit'}
</button>
              </div>

              <p className="text-text-secondary text-sm mt-1">
  {profile.role || "Add Role"}
</p>

              <div className="flex flex-wrap items-center gap-4 mt-3 text-text-muted text-xs">
                <span className="flex items-center gap-1">
  <MapPin className="w-3 h-3" />
  {profile.location || "Add Location"}
</span>

                <span className="flex items-center gap-1">
                  <Mail className="w-3 h-3" />
                  {userData.email}
                </span>

                <span className="flex items-center gap-1">
  <LinkIcon className="w-3 h-3" />
  {profile.github ? (
    <a
      href={profile.github}
      target="_blank"
      rel="noreferrer"
      className="text-cyan hover:underline"
    >
      GitHub
    </a>
  ) : (
    "Add GitHub"
  )}
</span>
              </div>
            </div>

            <div className="flex gap-2">
              <a
  href={profile.github || "#"}
  target="_blank"
  rel="noreferrer"
  className="w-9 h-9 rounded-lg bg-elevated flex items-center justify-center"
>
  <Github className="w-4 h-4" />
</a>

              <a href="#" className="w-9 h-9 rounded-lg bg-elevated flex items-center justify-center">
                <Linkedin className="w-4 h-4" />
              </a>

              <a href="#" className="w-9 h-9 rounded-lg bg-elevated flex items-center justify-center">
                <Globe className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </ScrollReveal>

      <div className="grid grid-cols-1 gap-6">
        <div className="bg-surface rounded-lg border border-border-subtle p-6">
          <h3 className="text-lg font-bold mb-4">
            Profile Information
          </h3>

          <div className="space-y-3">
            {editing ? (
  <input
    value={profile.role}
    onChange={(e) =>
      setProfile({ ...profile, role: e.target.value })
    }
    placeholder="Role"
    className="w-full p-2 rounded bg-elevated"
  />
) : (
  <p>
    <strong>Role:</strong> {profile.role || 'Not Set'}
  </p>
)}
            {editing ? (
  <input
    value={profile.college}
    onChange={(e) =>
      setProfile({ ...profile, college: e.target.value })
    }
    placeholder="College"
    className="w-full p-2 rounded bg-elevated"
  />
) : (
  <p>
    <strong>College:</strong> {profile.college || 'Not Set'}
  </p>
)}

            {editing ? (
  <input
    value={profile.branch}
    onChange={(e) =>
      setProfile({ ...profile, branch: e.target.value })
    }
    placeholder="Branch"
    className="w-full p-2 rounded bg-elevated"
  />
) : (
  <p>
    <strong>Branch:</strong> {profile.branch || 'Not Set'}
  </p>
)}
{editing ? (
  <input
    value={profile.year}
    onChange={(e) =>
      setProfile({ ...profile, year: e.target.value })
    }
    placeholder="Year"
    className="w-full p-2 rounded bg-elevated"
  />
) : (
  <p>
    <strong>Year:</strong> {profile.year || 'Not Set'}
  </p>
)}
{editing ? (
  <input
    value={profile.location}
    onChange={(e) =>
      setProfile({ ...profile, location: e.target.value })
    }
    placeholder="Location"
    className="w-full p-2 rounded bg-elevated"
  />
) : (
  <p>
    <strong>Location:</strong> {profile.location || 'Not Set'}
  </p>
)}
{editing ? (
  <textarea
    value={profile.bio}
    onChange={(e) =>
      setProfile({ ...profile, bio: e.target.value })
    }
    placeholder="Bio"
    className="w-full p-2 rounded bg-elevated"
  />
) : (
  <p>
    <strong>Bio:</strong> {profile.bio || 'Not Set'}
  </p>
)}
{editing ? (
  <input
    value={profile.github}
    onChange={(e) =>
      setProfile({ ...profile, github: e.target.value })
    }
    placeholder="GitHub URL"
    className="w-full p-2 rounded bg-elevated"
  />
) : (
  <p>
    <strong>GitHub:</strong> {profile.github || 'Not Set'}
  </p>
)}
          </div>
          
        </div>
      </div>
    </PageLayout>
  )
}








