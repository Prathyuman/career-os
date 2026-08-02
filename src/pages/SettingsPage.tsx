import { useEffect, useState } from 'react'
import PageLayout from '../components/PageLayout'
import ScrollReveal from '../components/ScrollReveal'
import {
  Bell,
  Shield,
  Palette,
  Save,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react'

export default function SettingsPage() {
  const [notifications, setNotifications] = useState({
    email: true,
    jobAlerts: true,
    courseUpdates: false,
    weeklyDigest: true,
  })

  const [theme, setTheme] = useState(
    localStorage.getItem('theme') || 'dark'
  )

  const [saved, setSaved] = useState(false)

  const toggleNotification = (
    key: keyof typeof notifications
  ) => {
    setNotifications((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  useEffect(() => {
    document.documentElement.classList.remove('light')

    if (theme === 'light') {
      document.documentElement.classList.add('light')
    }

    localStorage.setItem('theme', theme)
  }, [theme])

  const handleSave = () => {
    setSaved(true)

    setTimeout(() => {
      setSaved(false)
    }, 2000)
  }

  return (
    <PageLayout title="Settings">

      {/* Notifications */}
      <ScrollReveal className="mb-6">
        <div className="bg-surface rounded-lg border border-border-subtle p-6">
          <h3 className="font-display font-semibold text-text-primary mb-4 flex items-center gap-2">
            <Bell className="w-4 h-4 text-cyan" />
            Notifications
          </h3>

          <div className="space-y-4">
            {Object.entries(notifications).map(([key, value]) => (
              <div
                key={key}
                className="flex items-center justify-between"
              >
                <span className="text-text-primary text-sm capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </span>

                <button
                  onClick={() =>
                    toggleNotification(
                      key as keyof typeof notifications
                    )
                  }
                  className={value ? 'text-cyan' : 'text-text-muted'}
                >
                  {value ? (
                    <ToggleRight className="w-8 h-8" />
                  ) : (
                    <ToggleLeft className="w-8 h-8" />
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      </ScrollReveal>

      {/* Preferences */}
      <ScrollReveal className="mb-6">
        <div className="bg-surface rounded-lg border border-border-subtle p-6">
          <h3 className="font-display font-semibold text-text-primary mb-4 flex items-center gap-2">
            <Palette className="w-4 h-4 text-cyan" />
            Preferences
          </h3>

          <div className="space-y-4">
            <div>
              <label className="text-text-primary text-sm block mb-2">
                Theme
              </label>

              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                className="w-full bg-background border border-border-subtle rounded-lg px-4 py-3 text-text-primary outline-none"
              >
                <option value="dark">Dark</option>
                <option value="light">Light</option>
              </select>
            </div>

            <div>
              <label className="text-text-primary text-sm block mb-2">
                Language
              </label>

              <select
                className="w-full bg-background border border-border-subtle rounded-lg px-4 py-3 text-text-primary outline-none"
              >
                <option>English</option>
                <option>Tamil</option>
                <option>Hindi</option>
              </select>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* Security */}
      <ScrollReveal className="mb-6">
        <div className="bg-surface rounded-lg border border-border-subtle p-6">
          <h3 className="font-display font-semibold text-text-primary mb-4 flex items-center gap-2">
            <Shield className="w-4 h-4 text-cyan" />
            Security
          </h3>

          <div className="space-y-4">
            <div>
              <div className="text-text-primary text-sm">
                Two-Factor Authentication
              </div>
              <div className="text-text-muted text-xs">
                Coming Soon
              </div>
            </div>

            <div>
              <div className="text-text-primary text-sm">
                Password Management
              </div>
              <div className="text-text-muted text-xs">
                Coming Soon
              </div>
            </div>

            <div>
              <div className="text-text-primary text-sm">
                Connected Accounts
              </div>

              <div className="text-text-muted text-xs mt-1">
                GitHub Connected ✅
              </div>

              <div className="text-text-muted text-xs">
                LinkedIn Integration Coming Soon
              </div>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* Save */}
      <ScrollReveal>
        <div className="flex flex-col items-end">
          <button
            onClick={handleSave}
            className="px-6 py-2.5 rounded-pill bg-cyan text-deep font-semibold text-sm flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Save Changes
          </button>

          {saved && (
            <p className="text-green-400 text-sm mt-3">
              Settings saved successfully!
            </p>
          )}
        </div>
      </ScrollReveal>

    </PageLayout>
  )
}