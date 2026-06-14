import { useEffect, useState } from 'react'
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
  Star,
  Award,
  Briefcase,
  GraduationCap,
} from 'lucide-react'

const skills = [
  { name: 'JavaScript', level: 90, category: 'Technical' },
  { name: 'React', level: 85, category: 'Technical' },
  { name: 'TypeScript', level: 75, category: 'Technical' },
  { name: 'Node.js', level: 70, category: 'Technical' },
  { name: 'Python', level: 65, category: 'Technical' },
  { name: 'Leadership', level: 80, category: 'Soft' },
  { name: 'Communication', level: 85, category: 'Soft' },
  { name: 'Problem Solving', level: 90, category: 'Soft' },
]

const experience = [
  { role: 'Senior Frontend Engineer', company: 'TechCorp', period: '2022 - Present', description: 'Leading frontend development for core product features.' },
  { role: 'Frontend Developer', company: 'StartupXYZ', period: '2020 - 2022', description: 'Built responsive web applications using React and TypeScript.' },
]

const education = [
  { degree: 'B.S. Computer Science', school: 'Stanford University', year: '2016 - 2020' },
]

const certifications = [
  { name: 'AWS Solutions Architect', issuer: 'Amazon Web Services', date: 'Dec 2024' },
  { name: 'React Developer Certification', issuer: 'Meta', date: 'Aug 2024' },
]

export default function ProfilePage() {
  const [editing, setEditing] = useState(false)

  const [userData, setUserData] = useState({
    name: 'User',
    email: '',
    photoURL: '',
  })

  useEffect(() => {
    const user = auth.currentUser

    if (user) {
      setUserData({
        name: user.displayName || 'User',
        email: user.email || '',
        photoURL: user.photoURL || '',
      })
    }
  }, [])

  return (
    <PageLayout title="Profile">
      {/* Profile Header */}
      <ScrollReveal>
        <div className="bg-surface rounded-lg border border-border-subtle p-6 mb-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
           <div className="w-20 h-20 rounded-full overflow-hidden bg-cyan/20">
  {userData.photoURL ? (
    <img
      src={userData.photoURL}
      alt="Profile"
      className="w-full h-full object-cover"
    />
  ) : (
    <div className="w-full h-full flex items-center justify-center text-cyan font-display text-2xl font-bold">
      {userData.name.charAt(0)}
    </div>
  )}
</div>
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h2 className="font-display text-xl font-bold text-text-primary">
  {userData.name}
</h2>
                <button
                  onClick={() => setEditing(!editing)}
                  className="px-3 py-1 rounded-md bg-elevated text-text-secondary text-xs hover:text-cyan transition-colors flex items-center gap-1"
                >
                  {editing ? <Save className="w-3 h-3" /> : <Edit3 className="w-3 h-3" />}
                  {editing ? 'Save' : 'Edit'}
                </button>
              </div>
              <p className="text-text-secondary text-sm mt-1">
  Career OS User
</p>
              <div className="flex flex-wrap items-center gap-4 mt-3 text-text-muted text-xs">
                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />Not Set</span>
                <span className="flex items-center gap-1">
  <Mail className="w-3 h-3" /> {userData.email}
</span>
                <span className="flex items-center gap-1"><LinkIcon className="w-3 h-3" />Coming Soon</span>
              </div>
            </div>
            <div className="flex gap-2">
              <a href="#" className="w-9 h-9 rounded-lg bg-elevated flex items-center justify-center text-text-muted hover:text-cyan hover:border-cyan/30 border border-transparent transition-colors">
                <Github className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-lg bg-elevated flex items-center justify-center text-text-muted hover:text-cyan hover:border-cyan/30 border border-transparent transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-lg bg-elevated flex items-center justify-center text-text-muted hover:text-cyan hover:border-cyan/30 border border-transparent transition-colors">
                <Globe className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </ScrollReveal>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Skills */}
        <ScrollReveal className="lg:col-span-2">
          <div className="bg-surface rounded-lg border border-border-subtle p-6">
            <h3 className="font-display font-semibold text-text-primary mb-4 flex items-center gap-2">
              <Star className="w-4 h-4 text-cyan" />
              Skills
            </h3>
            <div className="space-y-3">
              {skills.map((skill) => (
                <div key={skill.name}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-text-primary">{skill.name}</span>
                    <span className="text-text-muted">{skill.level}%</span>
                  </div>
                  <div className="h-2 bg-elevated rounded-full overflow-hidden">
                    <div
                      className="h-full bg-cyan rounded-full transition-all duration-500"
                      style={{ width: `${skill.level}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* Sidebar info */}
        <div className="space-y-6">
          <ScrollReveal>
            <div className="bg-surface rounded-lg border border-border-subtle p-6">
              <h3 className="font-display font-semibold text-text-primary mb-4 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-cyan" />
                Experience
              </h3>
              <div className="space-y-4">
                {experience.map((exp) => (
                  <div key={exp.role} className="border-l-2 border-cyan/30 pl-4">
                    <div className="text-text-primary text-sm font-medium">{exp.role}</div>
                    <div className="text-text-secondary text-xs mt-0.5">{exp.company}</div>
                    <div className="text-text-muted text-xs">{exp.period}</div>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal>
            <div className="bg-surface rounded-lg border border-border-subtle p-6">
              <h3 className="font-display font-semibold text-text-primary mb-4 flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-cyan" />
                Education
              </h3>
              <div className="space-y-3">
                {education.map((edu) => (
                  <div key={edu.degree}>
                    <div className="text-text-primary text-sm font-medium">{edu.degree}</div>
                    <div className="text-text-secondary text-xs">{edu.school}</div>
                    <div className="text-text-muted text-xs">{edu.year}</div>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal>
            <div className="bg-surface rounded-lg border border-border-subtle p-6">
              <h3 className="font-display font-semibold text-text-primary mb-4 flex items-center gap-2">
                <Award className="w-4 h-4 text-cyan" />
                Certifications
              </h3>
              <div className="space-y-3">
                {certifications.map((cert) => (
                  <div key={cert.name} className="flex items-start gap-3">
                    <Award className="w-4 h-4 text-violet flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="text-text-primary text-sm">{cert.name}</div>
                      <div className="text-text-muted text-xs">{cert.issuer} — {cert.date}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </PageLayout>
  )
}
