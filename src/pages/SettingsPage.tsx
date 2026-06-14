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
              <label className="block text-xs text-text-muted mb-1">Full Name</label>
              <input
                type="text"
                defaultValue="John Doe"
                className="w-full px-3 py-2 bg-elevated border border-border-subtle rounded-md text-text-primary text-sm focus:outline-none focus:border-cyan/50 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs text-text-muted mb-1">Email</label>
              <input
                type="email"
                defaultValue="john@example.com"
                className="w-full px-3 py-2 bg-elevated border border-border-subtle rounded-md text-text-primary text-sm focus:outline-none focus:border-cyan/50 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs text-text-muted mb-1">Location</label>
              <input
                type="text"
                defaultValue="San Francisco, CA"
                className="w-full px-3 py-2 bg-elevated border border-border-subtle rounded-md text-text-primary text-sm focus:outline-none focus:border-cyan/50 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs text-text-muted mb-1">Target Role</label>
              <input
                type="text"
                defaultValue="Senior Software Engineer"
                className="w-full px-3 py-2 bg-elevated border border-border-subtle rounded-md text-text-primary text-sm focus:outline-none focus:border-cyan/50 transition-colors"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs text-text-muted mb-1">Bio</label>
              <textarea
                defaultValue="Full-stack developer passionate about building scalable web applications and open-source contributions."
                rows={3}
                className="w-full px-3 py-2 bg-elevated border border-border-subtle rounded-md text-text-primary text-sm focus:outline-none focus:border-cyan/50 transition-colors resize-none"
              />
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* Notification Settings */}
      <ScrollReveal className="mb-6">
        <div className="bg-surface rounded-lg border border-border-subtle p-6">
          <h3 className="font-display font-semibold text-text-primary mb-4 flex items-center gap-2">
            <Bell className="w-4 h-4 text-cyan" />
            Notifications
          </h3>
          <div className="space-y-4">
            {Object.entries(notifications).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between py-2">
                <div>
                  <div className="text-text-primary text-sm capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</div>
                  <div className="text-text-muted text-xs">
                    {key === 'email' && 'Receive general email notifications'}
                    {key === 'jobAlerts' && 'Get notified about new job matches'}
                    {key === 'courseUpdates' && 'Updates about enrolled courses'}
                    {key === 'weeklyDigest' && 'Weekly summary of your progress'}
                  </div>
                </div>
                <button
                  onClick={() => toggleNotification(key as keyof typeof notifications)}
                  className={`transition-colors ${value ? 'text-cyan' : 'text-text-muted'}`}
                >
                  {value ? <ToggleRight className="w-8 h-8" /> : <ToggleLeft className="w-8 h-8" />}
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-text-muted mb-1">Theme</label>
              <select className="w-full px-3 py-2 bg-elevated border border-border-subtle rounded-md text-text-primary text-sm focus:outline-none focus:border-cyan/50 transition-colors">
                <option>Dark (Default)</option>
                <option>Light</option>
                <option>System</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-text-muted mb-1">Language</label>
              <select className="w-full px-3 py-2 bg-elevated border border-border-subtle rounded-md text-text-primary text-sm focus:outline-none focus:border-cyan/50 transition-colors">
                <option>English</option>
                <option>Spanish</option>
                <option>French</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-text-muted mb-1">Timezone</label>
              <select className="w-full px-3 py-2 bg-elevated border border-border-subtle rounded-md text-text-primary text-sm focus:outline-none focus:border-cyan/50 transition-colors">
                <option>Pacific Time (PT)</option>
                <option>Eastern Time (ET)</option>
                <option>UTC</option>
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
            <div className="flex items-center justify-between py-2">
              <div>
                <div className="text-text-primary text-sm">Two-Factor Authentication</div>
                <div className="text-text-muted text-xs">Add an extra layer of security</div>
              </div>
              <button className="px-3 py-1.5 rounded-md border border-cyan text-cyan text-xs font-medium hover:bg-cyan/10 transition-all">
                Enable
              </button>
            </div>
            <div className="flex items-center justify-between py-2">
              <div>
                <div className="text-text-primary text-sm">Change Password</div>
                <div className="text-text-muted text-xs">Last changed 3 months ago</div>
              </div>
              <button className="px-3 py-1.5 rounded-md border border-cyan text-cyan text-xs font-medium hover:bg-cyan/10 transition-all">
                Update
              </button>
            </div>
            <div className="flex items-center justify-between py-2">
              <div>
                <div className="text-text-primary text-sm">Connected Accounts</div>
                <div className="text-text-muted text-xs">GitHub, LinkedIn connected</div>
              </div>
              <button className="px-3 py-1.5 rounded-md border border-cyan text-cyan text-xs font-medium hover:bg-cyan/10 transition-all">
                Manage
              </button>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* Save */}
      <ScrollReveal>
        <div className="flex justify-end">
          <button className="px-6 py-2.5 rounded-pill bg-cyan text-deep font-semibold text-sm hover:brightness-110 transition-all flex items-center gap-2">
            <Save className="w-4 h-4" />
            Save Changes
          </button>
        </div>
      </ScrollReveal>
    </PageLayout>
  )
}
