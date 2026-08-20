export interface ProgressScoreInput {
  careerReadinessScore?: number
  atsScore?: number
  foundSkillsCount?: number
  missingSkillsCount?: number
  totalCourses?: number
  completedCoursesCount?: number
  totalProjects?: number
  completedProjectsCount?: number
  resumeUpdatedAt?: string | number | Date | null
}

export interface ProgressBreakdown {
  score: number
  courseScore: number
  projectScore: number
  resumeScore: number
  coursesProgressStr: string
  projectsProgressStr: string
  resumeStatusStr: string
  gapItems: {
    title: string
    description: string
    actionText: string
    actionHref: string
    completed: boolean
    impact: number
  }[]
}

export function calculateProgressScore(input: ProgressScoreInput): number {
  return getDetailedProgressBreakdown(input).score
}

export function getDetailedProgressBreakdown(input: ProgressScoreInput): ProgressBreakdown {
  // 1. Courses Component (35%)
  const totalC = Math.max(input.totalCourses || 0, 1)
  const compC = Math.min(input.completedCoursesCount || 0, totalC)
  const courseRatio = input.totalCourses ? compC / input.totalCourses : (compC > 0 ? 1 : 0)
  const courseScore = Math.min(100, Math.round(courseRatio * 100))

  // 2. Projects Component (35%)
  const totalP = Math.max(input.totalProjects || 3, 1)
  const compP = Math.min(input.completedProjectsCount || 0, totalP)
  const projectRatio = compP / totalP
  const projectScore = Math.min(100, Math.round(projectRatio * 100))

  // 3. Resume Component (30%)
  let resumeScore = 0
  const baseResume = input.careerReadinessScore || input.atsScore || 0
  if (baseResume > 0) {
    let recencyFactor = 1.0
    if (input.resumeUpdatedAt) {
      const updatedDate = new Date(input.resumeUpdatedAt).getTime()
      const now = Date.now()
      const daysOld = (now - updatedDate) / (1000 * 60 * 60 * 24)
      if (daysOld > 90) recencyFactor = 0.6
      else if (daysOld > 60) recencyFactor = 0.75
      else if (daysOld > 30) recencyFactor = 0.9
    }
    resumeScore = Math.round(baseResume * recencyFactor)
  }

  // Composite Score
  const totalScore = Math.min(
    100,
    Math.max(0, Math.round(courseScore * 0.35 + projectScore * 0.35 + resumeScore * 0.30))
  )

  // Gap closure recommendations
  const gapItems = []

  // Resume check
  const resumeOk = baseResume >= 60
  gapItems.push({
    title: baseResume > 0 ? 'Update Resume & Re-analyze' : 'Upload Your Resume',
    description: baseResume > 0
      ? `Current quality score: ${baseResume}/100. Keep it updated for full recency points.`
      : 'Upload your resume to calculate your baseline ATS score and skill match.',
    actionText: baseResume > 0 ? 'Re-analyze Resume' : 'Upload Resume',
    actionHref: '/resume-analyzer',
    completed: resumeOk,
    impact: Math.round(30 * (1 - (resumeScore / 100))),
  })

  // Courses check
  const coursesNeeded = Math.max(0, Math.ceil(totalC * 0.7) - compC)
  gapItems.push({
    title: `Complete Recommended Courses (${compC}/${input.totalCourses || 5})`,
    description: coursesNeeded > 0
      ? `Complete at least ${coursesNeeded} more free recommended course(s) to close skill gaps.`
      : 'Awesome work on course completions!',
    actionText: 'View Courses',
    actionHref: '/courses',
    completed: coursesNeeded === 0,
    impact: Math.round(35 * (1 - (courseScore / 100))),
  })

  // Projects check
  const projectsNeeded = Math.max(0, Math.ceil(totalP * 0.6) - compP)
  gapItems.push({
    title: `Build Recommended Projects (${compP}/${totalP})`,
    description: projectsNeeded > 0
      ? `Complete at least ${projectsNeeded} more project blueprint(s) to demonstrate technical depth.`
      : 'Great portfolio project progress!',
    actionText: 'Explore Projects',
    actionHref: '/projects',
    completed: projectsNeeded === 0,
    impact: Math.round(35 * (1 - (projectScore / 100))),
  })

  return {
    score: totalScore,
    courseScore,
    projectScore,
    resumeScore,
    coursesProgressStr: `${compC} of ${input.totalCourses || 0} completed`,
    projectsProgressStr: `${compP} of ${totalP} completed`,
    resumeStatusStr: baseResume > 0 ? `Quality: ${baseResume}/100` : 'Not uploaded',
    gapItems,
  }
}
