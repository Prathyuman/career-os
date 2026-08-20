import { useEffect, useState } from 'react'
import PageLayout from '../components/PageLayout'
import ScrollReveal from '../components/ScrollReveal'
import {
  Bell,
  Shield,
  Save,
  ToggleLeft,
  ToggleRight,
  User,
  CheckCircle2,
  Key,
} from 'lucide-react'
import { auth, db } from '../lib/firebase'
import { onAuthStateChanged, updateProfile, sendPasswordResetEmail } from 'firebase/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'

export default function SettingsPage() {
  const [displayName, setDisplayName] = useState('')
  const [targetRole, setTargetRole] = useState('')
  const [email, setEmail] = useState('')
  const [bio, setBio] = useState('')

  const [notifications, setNotifications] = useState({
    email: true,
    jobAlerts: true,
    courseUpdates: true,
    weeklyDigest: false,
  })

  const [theme] = useState(
    localStorage.getItem('theme') || 'dark'
  )

  const [saving, setSaving] = useState(false)
  const [savedMsg, setSavedMsg] = useState('')
  const [pwResetMsg, setPwResetMsg] = useState('')

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setDisplayName(user.displayName || '')
        setEmail(user.email || '')

        // Fetch saved user profile & settings from Firestore
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid))
          if (userDoc.exists()) {
            const data = userDoc.data()
            if (data.targetRole) setTargetRole(data.targetRole)
            if (data.bio) setBio(data.bio)
          }

          const settingsDoc = await getDoc(doc(db, 'userSettings', user.uid))
          if (settingsDoc.exists()) {
            const sData = settingsDoc.data()
            if (sData.notifications) setNotifications(sData.notifications)
          }
        } catch (e) {
          console.error('Error fetching settings:', e)
        }
      }
    })
    return () => unsubscribe()
  }, [])

  useEffect(() => {
    document.documentElement.classList.remove('light')
    if (theme === 'light') {
      document.documentElement.classList.add('light')
    }
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleNotification = (key: keyof typeof notifications) => {
    setNotifications((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  const handleSaveChanges = async () => {
    const user = auth.currentUser
    if (!user) {
      alert('Please sign in to save settings.')
      return
    }

    setSaving(true)
    try {
      // 1. Update Firebase Auth Display Name
      if (displayName !== user.displayName) {
        await updateProfile(user, { displayName })
      }

      // 2. Save profile information to Firestore
      await setDoc(
        doc(db, 'users', user.uid),
        {
          displayName,
          targetRole,
          bio,
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      )

      // 3. Save notifications settings to Firestore
      await setDoc(
        doc(db, 'userSettings', user.uid),
        {
          notifications,
          theme,
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      )

      setSavedMsg('Settings saved successfully!')
      setTimeout(() => setSavedMsg(''), 3000)
    } catch (e) {
      console.error(e)
      alert('Failed to save settings. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleSendPasswordReset = async () => {
    const user = auth.currentUser
    if (!user || !user.email) return

    try {
      await sendPasswordResetEmail(auth, user.email)
      setPwResetMsg(`Password reset link sent to ${user.email}`)
      setTimeout(() => setPwResetMsg(''), 4000)
    } catch (e) {
      console.error(e)
      alert('Failed to send password reset email.')
    }
  }

  return (
    <PageLayout title="Account & Preference Settings">
      {savedMsg && (
        <ScrollReveal className="mb-6">
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5" />
            <span>{savedMsg}</span>
          </div>
        </ScrollReveal>
      )}

      {/* Profile Details */}
      <ScrollReveal className="mb-6">
        <div className="glass-card rounded-2xl p-6 md:p-8">
          <h3 className="font-display font-bold text-text-primary text-lg mb-6 flex items-center gap-2">
            <User className="w-5 h-5 text-cyan" />
            Personal Profile Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-xs font-bold text-text-primary uppercase tracking-wider block mb-2">
                Display Name
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Your Full Name"
                className="w-full px-4 py-3 bg-elevated border border-border-subtle rounded-xl text-text-primary text-sm outline-none focus:border-cyan/50"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-text-primary uppercase tracking-wider block mb-2">
                Target Career Role
              </label>
              <input
                type="text"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                placeholder="e.g. Full Stack Engineer / AI Specialist"
                className="w-full px-4 py-3 bg-elevated border border-border-subtle rounded-xl text-text-primary text-sm outline-none focus:border-cyan/50"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-xs font-bold text-text-primary uppercase tracking-wider block mb-2">
                Email Address (Firebase Authenticated)
              </label>
              <input
                type="email"
                value={email}
                disabled
                className="w-full px-4 py-3 bg-elevated/40 border border-border-subtle rounded-xl text-text-muted text-sm cursor-not-allowed"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-xs font-bold text-text-primary uppercase tracking-wider block mb-2">
                Short Career Bio / Summary
              </label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Brief summary of your career objectives, skills, and goals..."
                className="w-full p-4 bg-elevated border border-border-subtle rounded-xl text-text-primary text-sm outline-none focus:border-cyan/50 resize-none"
              />
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* Notifications */}
      <ScrollReveal className="mb-6">
        <div className="glass-card rounded-2xl p-6 md:p-8">
          <h3 className="font-display font-bold text-text-primary text-lg mb-6 flex items-center gap-2">
            <Bell className="w-5 h-5 text-cyan" />
            Notification Alerts
          </h3>

          <div className="space-y-4">
            {Object.entries(notifications).map(([key, value]) => (
              <div
                key={key}
                className="flex items-center justify-between p-3 rounded-xl bg-elevated/40 border border-border-subtle"
              >
                <div>
                  <p className="text-text-primary text-sm font-bold capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </p>
                  <p className="text-xs text-text-muted">
                    Receive alert emails for {key}
                  </p>
                </div>

                <button
                  onClick={() => toggleNotification(key as keyof typeof notifications)}
                  className={value ? 'text-cyan' : 'text-text-muted'}
                >
                  {value ? (
                    <ToggleRight className="w-9 h-9" />
                  ) : (
                    <ToggleLeft className="w-9 h-9" />
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      </ScrollReveal>

      {/* Security & Password */}
      <ScrollReveal className="mb-6">
        <div className="glass-card rounded-2xl p-6 md:p-8">
          <h3 className="font-display font-bold text-text-primary text-lg mb-6 flex items-center gap-2">
            <Shield className="w-5 h-5 text-cyan" />
            Security & Authentication
          </h3>

          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-elevated/40 border border-border-subtle flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <p className="text-text-primary text-sm font-bold flex items-center gap-2">
                  <Key className="w-4 h-4 text-cyan" /> Password Reset & Security Link
                </p>
                <p className="text-xs text-text-muted mt-0.5">
                  Send an official password reset email to your registered account.
                </p>
              </div>

              <button
                onClick={handleSendPasswordReset}
                className="px-4 py-2.5 rounded-xl bg-elevated border border-border-subtle hover:border-cyan/50 text-text-primary text-xs font-bold transition-all"
              >
                Send Reset Email
              </button>
            </div>

            {pwResetMsg && (
              <p className="text-xs text-emerald-400 font-semibold">{pwResetMsg}</p>
            )}
          </div>
        </div>
      </ScrollReveal>

      {/* Save Button */}
      <ScrollReveal>
        <div className="flex items-center justify-end">
          <button
            onClick={handleSaveChanges}
            disabled={saving}
            className="px-8 py-3.5 rounded-xl bg-cyan text-deep font-bold text-sm flex items-center gap-2 hover:brightness-110 disabled:opacity-50 transition-all shadow-lg"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving Settings...' : 'Save All Preferences'}
          </button>
        </div>
      </ScrollReveal>
    </PageLayout>
  )
}