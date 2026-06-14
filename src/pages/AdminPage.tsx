import PageLayout from '../components/PageLayout'
import ScrollReveal from '../components/ScrollReveal'
import {
  Users,
  TrendingUp,
  Activity,
  DollarSign,
  Search,
  MoreHorizontal,
  ArrowUp,
  ArrowDown,
} from 'lucide-react'

const stats = [
  { label: 'Total Users', value: '12,847', change: '+12%', up: true, icon: Users, color: 'text-cyan' },
  { label: 'Active Today', value: '3,241', change: '+8%', up: true, icon: Activity, color: 'text-blue' },
  { label: 'Premium Subs', value: '2,156', change: '+18%', up: true, icon: DollarSign, color: 'text-violet' },
  { label: 'Churn Rate', value: '2.4%', change: '-0.5%', up: false, icon: TrendingUp, color: 'text-coral' },
]

const recentUsers = [
  { name: 'Alice Johnson', email: 'alice@stanford.edu', role: 'Student', status: 'active', joined: '2 hours ago' },
  { name: 'Bob Smith', email: 'bob@gmail.com', role: 'Professional', status: 'active', joined: '5 hours ago' },
  { name: 'Carol White', email: 'carol@mit.edu', role: 'Student', status: 'pending', joined: '1 day ago' },
  { name: 'David Lee', email: 'david@techcorp.com', role: 'Professional', status: 'active', joined: '2 days ago' },
  { name: 'Eva Martinez', email: 'eva@berkeley.edu', role: 'Student', status: 'inactive', joined: '3 days ago' },
]

const topFeatures = [
  { feature: 'Resume Analyzer', usage: '4,231', trend: '+15%' },
  { feature: 'Skill Gap Analysis', usage: '3,876', trend: '+22%' },
  { feature: 'Interview Coach', usage: '3,421', trend: '+18%' },
  { feature: 'Job Finder', usage: '3,156', trend: '+12%' },
  { feature: 'GitHub Analyzer', usage: '2,987', trend: '+25%' },
]

export default function AdminPage() {
  return (
    <PageLayout title="Admin Dashboard">
      {/* Stats */}
      <ScrollReveal stagger={0.1} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-surface rounded-lg border border-border-subtle p-5">
            <div className="flex items-center justify-between mb-3">
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
              <span className={`text-xs flex items-center gap-0.5 ${stat.up ? 'text-cyan' : 'text-coral'}`}>
                {stat.up ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                {stat.change}
              </span>
            </div>
            <div className="font-display text-2xl font-bold text-text-primary">{stat.value}</div>
            <div className="text-text-muted text-xs">{stat.label}</div>
          </div>
        ))}
      </ScrollReveal>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Users Table */}
        <ScrollReveal className="lg:col-span-2">
          <div className="bg-surface rounded-lg border border-border-subtle p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-semibold text-text-primary flex items-center gap-2">
                <Users className="w-4 h-4 text-cyan" />
                Recent Users
              </h3>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted" />
                <input
                  type="text"
                  placeholder="Search users..."
                  className="pl-8 pr-3 py-1.5 bg-elevated border border-border-subtle rounded-md text-text-primary text-xs placeholder:text-text-muted focus:outline-none focus:border-cyan/50 transition-colors"
                />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border-subtle">
                    <th className="text-left text-xs text-text-muted font-medium py-2 pr-4">User</th>
                    <th className="text-left text-xs text-text-muted font-medium py-2 pr-4">Role</th>
                    <th className="text-left text-xs text-text-muted font-medium py-2 pr-4">Status</th>
                    <th className="text-left text-xs text-text-muted font-medium py-2 pr-4">Joined</th>
                    <th className="text-right text-xs text-text-muted font-medium py-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {recentUsers.map((user) => (
                    <tr key={user.email} className="border-b border-border-subtle last:border-0">
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-cyan/20 flex items-center justify-center text-cyan text-xs font-bold">
                            {user.name.split(' ').map((n) => n[0]).join('')}
                          </div>
                          <div>
                            <div className="text-text-primary text-sm">{user.name}</div>
                            <div className="text-text-muted text-xs">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 pr-4">
                        <span className="text-text-secondary text-xs bg-elevated px-2 py-0.5 rounded-md">{user.role}</span>
                      </td>
                      <td className="py-3 pr-4">
                        <span className={`text-xs px-2 py-0.5 rounded-pill ${
                          user.status === 'active' ? 'bg-cyan/10 text-cyan' :
                          user.status === 'pending' ? 'bg-violet/10 text-violet' :
                          'bg-coral/10 text-coral'
                        }`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="py-3 pr-4 text-text-muted text-xs">{user.joined}</td>
                      <td className="py-3 text-right">
                        <button className="text-text-muted hover:text-text-primary transition-colors">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </ScrollReveal>

        {/* Feature Usage */}
        <ScrollReveal>
          <div className="bg-surface rounded-lg border border-border-subtle p-6">
            <h3 className="font-display font-semibold text-text-primary mb-4 flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan" />
              Feature Usage
            </h3>
            <div className="space-y-4">
              {topFeatures.map((f) => (
                <div key={f.feature}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-text-primary">{f.feature}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-text-muted text-xs">{f.usage}</span>
                      <span className="text-cyan text-xs">{f.trend}</span>
                    </div>
                  </div>
                  <div className="h-1.5 bg-elevated rounded-full overflow-hidden">
                    <div
                      className="h-full bg-cyan rounded-full"
                      style={{ width: `${(Number(f.usage.replace(',', '')) / 5000) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </PageLayout>
  )
}
