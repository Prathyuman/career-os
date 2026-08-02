export const fetchJSearchInternships = async () => {
  try {
    const response = await fetch(
      "https://jsearch.p.rapidapi.com/search?query=software%20internship&num_pages=1",
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
      skills: [],
      applyLink: job.job_apply_link || "#",
    }))
  } catch (error) {
    console.error("JSearch Error:", error)
    return []
  }
}