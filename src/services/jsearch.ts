import { extractSkillsFromText } from './extractSkills'

export const fetchJSearchInternships = async (searchQuery?: string) => {
  try {
    const queryText = searchQuery?.trim()
      ? `${searchQuery.trim()} internship`
      : 'software internship'

    const response = await fetch(
      `https://jsearch.p.rapidapi.com/search?query=${encodeURIComponent(
        queryText
      )}&num_pages=1`,
      {
        method: "GET",
        headers: {
          "X-RapidAPI-Key": import.meta.env.VITE_RAPIDAPI_KEY,
          "X-RapidAPI-Host": import.meta.env.VITE_RAPIDAPI_HOST,
        },
      }
    )

    const result = await response.json()

    return (result.data || []).map((job: any) => ({
      company: job.employer_name || "Unknown Company",
      role: job.job_title || "Intern",
      category: "Software Engineering",
      location: job.job_city || job.job_country || "Remote",
      stipend: "Not Disclosed",
      skills: extractSkillsFromText(job.job_description || ""),
      applyLink: job.job_apply_link || "#",
    }))
  } catch (error) {
    console.error("JSearch Error:", error)
    return []
  }
}