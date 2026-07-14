import { useState } from 'react'
import PageLayout from '../components/PageLayout'
import ScrollReveal from '../components/ScrollReveal'
import {
  Search,
  Briefcase,
  MapPin,
  IndianRupee,
  Bookmark,
} from 'lucide-react'

const filters = [
  'All',
  'Software Engineering',
  'Data Science',
  'Product',
  'DevOps',
  'Design',
]

const internships = [
  
    {
  company: 'Google',
  role: 'Frontend Developer Intern',
  category: 'Software Engineering',
  location: 'Remote',
  stipend: '₹30,000/month',
  skills: ['React', 'JavaScript', 'CSS'],
},
  
  {
  company: 'Microsoft',
  role: 'Software Engineer Intern',
  category: 'Software Engineering',
  location: 'Hybrid - Bangalore',
  stipend: '₹45,000/month',
  skills: ['Java', 'DSA', 'SQL'],
},
  {
  company: 'Flipkart',
  role: 'Data Science Intern',
  category: 'Data Science',
  location: 'Bangalore',
  stipend: '₹25,000/month',
  skills: ['Python', 'Pandas', 'Machine Learning'],
},
 {
  company: 'Amazon',
  role: 'DevOps Intern',
  category: 'DevOps',
  location: 'Chennai',
  stipend: '₹35,000/month',
  skills: ['Docker', 'AWS', 'Linux'],
},
 {
  company: 'Swiggy',
  role: 'Product Intern',
  category: 'Product',
  location: 'Remote',
  stipend: '₹20,000/month',
  skills: ['Product Management', 'Analytics', 'Communication'],
},
  {
  company: 'Zomato',
  role: 'UI/UX Design Intern',
  category: 'Design',
  location: 'Hybrid - Chennai',
  stipend: '₹18,000/month',
  skills: ['Figma', 'UI Design', 'UX Research'],
},
]

export default function InternshipsPage() {
  const [activeFilter, setActiveFilter] = useState('All')
  const [search, setSearch] = useState('')

  const [savedInternships, setSavedInternships] =
  useState<string[]>([])
const userSkills = [
  'React',
  'JavaScript',
  'Firebase',
  'Python',
] 

const calculateMatchScore = (requiredSkills: string[]) => {
  const matchedSkills = requiredSkills.filter((skill) =>
    userSkills.includes(skill)
  )

  return Math.round(
    (matchedSkills.length / requiredSkills.length) * 100
  )
}

const getMissingSkills = (requiredSkills: string[]) => {
  return requiredSkills.filter(
    (skill) => !userSkills.includes(skill)
  )
}
const toggleBookmark = (internshipName: string) => {
  if (savedInternships.includes(internshipName)) {
    setSavedInternships(
      savedInternships.filter(
        (item) => item !== internshipName
      )
    )
  } else {
    setSavedInternships([
      ...savedInternships,
      internshipName,
    ])
  }
}
  const filteredInternships = internships.filter((internship) => {
    const matchesFilter =
      activeFilter === 'All' ||
      internship.category === activeFilter

    const matchesSearch =
      internship.role
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      internship.company
        .toLowerCase()
        .includes(search.toLowerCase())

    return matchesFilter && matchesSearch
  })

  return (
    <PageLayout title="Internship Finder">
      {/* Search Section */}
      <ScrollReveal>
        <div className="bg-surface rounded-lg border border-border-subtle p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search internships..."
                className="w-full pl-10 pr-4 py-2.5 bg-elevated border border-border-subtle rounded-md text-text-primary text-sm placeholder:text-text-muted focus:outline-none focus:border-cyan/50"
              />
            </div>

            <div className="flex gap-2 flex-wrap">
              {filters.map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-3 py-2 rounded-md text-xs font-medium transition-all ${
                    activeFilter === filter
                      ? 'bg-cyan text-deep'
                      : 'bg-elevated text-text-secondary border border-border-subtle'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* Internship Cards */}
      <ScrollReveal>
        {filteredInternships.length === 0 ? (
          <div className="bg-surface rounded-lg border border-border-subtle p-10 text-center">
            <Briefcase className="w-12 h-12 text-text-muted mx-auto mb-4" />

            <h2 className="font-display text-xl font-semibold text-text-primary mb-2">
              No Internships Found
            </h2>

            <p className="text-text-secondary text-sm">
              Try changing your search or filter.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredInternships.map((internship, index) => {
  const matchScore = calculateMatchScore(
    internship.skills
  )
const missingSkills = getMissingSkills(
  internship.skills
)
  return (
              <div
                key={index}
                className="bg-surface rounded-lg border border-border-subtle p-6 hover:border-cyan/50 transition-all hover:-translate-y-1"
              >
                <div className="flex items-center justify-between mb-4">
  <Briefcase className="w-10 h-10 text-cyan" />

  <div className="flex items-center gap-3">
    <button
      onClick={() => toggleBookmark(internship.role)}
    >
      <Bookmark
        className={`w-5 h-5 transition-all ${
          savedInternships.includes(
            internship.role
          )
            ? 'fill-yellow-400 text-yellow-400'
            : 'text-text-muted'
        }`}
      />
    </button>

    <span className="bg-cyan/10 text-cyan px-3 py-1 rounded-full text-xs">
      {internship.category}
    </span>
  </div>
</div>

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

<div className="mt-4">
  <div className="flex justify-between text-sm mb-2">
    <span className="text-text-secondary">
      Match Score
    </span>

    <span className="text-green-400 font-semibold">
      {matchScore}%
    </span>
  </div>

  <div className="w-full bg-elevated rounded-full h-2">
    <div
      className="bg-green-400 h-2 rounded-full transition-all duration-500"
      style={{
        width: `${matchScore}%`,
      }}
    ></div>
  </div>
</div>

<div className="mt-4 flex flex-wrap gap-2">
  {internship.skills.map((skill, skillIndex) => (
    <span
      key={skillIndex}
      className={`px-2 py-1 rounded-full text-xs ${
        userSkills.includes(skill)
          ? 'bg-green-500/20 text-green-400'
          : 'bg-elevated text-text-secondary'
      }`}
    >
      {skill}
    </span>
  ))}
</div>
{missingSkills.length > 0 && (
  <div className="mt-4">
    <p className="text-red-400 text-sm font-semibold mb-2">
      Missing Skills
    </p>

    <div className="flex flex-wrap gap-2">
      {missingSkills.map((skill, index) => (
        <span
          key={index}
          className="bg-red-500/20 text-red-400 px-2 py-1 rounded-full text-xs"
        >
          {skill}
        </span>
      ))}
    </div>
  </div>
)}
<button className="w-full mt-6 bg-cyan text-deep py-2.5 rounded-md font-semibold hover:opacity-90 transition-all">
  Apply Now
</button>
              </div>
  )
})}
          </div>
        )}
      </ScrollReveal>
    </PageLayout>
  )
}