// Shared skill dictionary used to tag internship/job postings with
// relevant skills, since neither JSearch nor Muse return a structured
// "required skills" field — only free-text descriptions.
const KNOWN_SKILLS = [
  'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'Go', 'Rust',
  'React', 'React Native', 'Angular', 'Vue', 'Next.js', 'Node.js', 'Express',
  'HTML', 'CSS', 'Tailwind', 'Redux', 'GraphQL', 'REST API',
  'MongoDB', 'MySQL', 'PostgreSQL', 'Firebase', 'Redis', 'SQL',
  'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'CI/CD', 'DevOps', 'Linux',
  'Git', 'GitHub', 'Machine Learning', 'Deep Learning', 'TensorFlow',
  'PyTorch', 'Pandas', 'NumPy', 'Data Analysis', 'Data Science',
  'Figma', 'UI Design', 'UX Research', 'Product Management', 'Agile', 'Scrum',
  'Excel', 'Communication', 'Project Management', 'Spring Boot', 'Django',
  'Flask', 'Kotlin', 'Swift', 'Flutter', 'Android', 'iOS',
]

export const extractSkillsFromText = (text: string, limit = 8): string[] => {
  if (!text) return []

  const lowerText = text.toLowerCase()

  const matched = KNOWN_SKILLS.filter((skill) =>
    lowerText.includes(skill.toLowerCase())
  )

  return matched.slice(0, limit)
}