import { useState } from 'react'
import PageLayout from '../components/PageLayout'
import ScrollReveal from '../components/ScrollReveal'
import {
  User,
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

  const toggleNotification = (key: keyof typeof notifications) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <PageLayout title="Settings">
      {/* Profile Settings */}
      <ScrollReveal className="mb-6">
        <div className="bg-surface rounded-lg border border-border-subtle p-6">
          <h3 className="font-display font-semibold text-text-primary mb-4 flex items-center gap-2">
            <User className="w-4 h-4 text-cyan" />
            Profile
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-text-muted mb-1">
                Full Name
              </label>
              <input
                type="text"
                placeholder="Enter your name"
                className="w-full px-3 py-2 bg-elevated border border-border-subtle rounded-md text-text-primary text-sm focus:outline-none focus:border-cyan/50"
              />
            </div>

            <div>
              <label className="block text-xs text-text-muted mb-1">
                Email
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-3 py-2 bg-elevated border border-border-subtle rounded-md text-text-primary text-sm focus:outline-none focus:border-cyan/50"
              />
            </div>

            <div>
              <label className="block text-xs text-text-muted mb-1">
                Location
              </label>
              <input
                type="text"
                placeholder="Enter your location"
                className="w-full px-3 py-2 bg-elevated border border-border-subtle rounded-md text-text-primary text-sm focus:outline-none focus:border-cyan/50"
              />
            </div>

            <div>
              <label className="block text-xs text-text-muted mb-1">
                Target Role
              </label>
              <input
                type="text"
                placeholder="Enter your target role"
                className="w-full px-3 py-2 bg-elevated border border-border-subtle rounded-md text-text-primary text-sm focus:outline-none focus:border-cyan/50"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs text-text-muted mb-1">
                Bio
              </label>
              <textarea
                rows={3}
                placeholder="Tell us about yourself"
                className="w-full px-3 py-2 bg-elevated border border-border-subtle rounded-md text-text-primary text-sm resize-none focus:outline-none focus:border-cyan/50"
              />
            </div>
          </div>
        </div>
      </ScrollReveal>

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
                    toggleNotification(key as keyof typeof notifications)
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

          <p className="text-text-secondary text-sm">
            Theme, language, and personalization settings will be available
            after backend integration.
          </p>
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
                Coming soon
              </div>
            </div>

            <div>
              <div className="text-text-primary text-sm">
                Password Management
              </div>
              <div className="text-text-muted text-xs">
                Coming soon
              </div>
            </div>

            <div>
              <div className="text-text-primary text-sm">
                Connected Accounts
              </div>
              <div className="text-text-muted text-xs">
                No connected accounts
              </div>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* Save */}
      <ScrollReveal>
        <div className="flex justify-end">
          <button className="px-6 py-2.5 rounded-pill bg-cyan text-deep font-semibold text-sm flex items-center gap-2">
            <Save className="w-4 h-4" />
            Save Changes
          </button>
        </div>
      </ScrollReveal>
    </PageLayout>
  )
}