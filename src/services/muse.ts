export const fetchMuseInternships = async () => {
  try {
    const response = await fetch(
      'https://www.themuse.com/api/public/jobs?page=1'
    )

    const data = await response.json()

    console.log("Muse API Full Response:", data)
    console.log("Results Count:", data.results?.length)
    console.log(
      "First Job:",
      JSON.stringify(data.results?.[0], null, 2)
    )

    return (data.results || []).map((job: any) => {

      const title = job.name?.toLowerCase() || ""

      let category = "Other"

      if (
        title.includes("software") ||
        title.includes("developer") ||
        title.includes("frontend") ||
        title.includes("backend") ||
        title.includes("full stack") ||
        title.includes("engineer")
      ) {
        category = "Software Engineering"
      }
      else if (
        title.includes("data") ||
        title.includes("machine learning") ||
        title.includes("ai")
      ) {
        category = "Data Science"
      }
      else if (
        title.includes("devops") ||
        title.includes("cloud") ||
        title.includes("aws")
      ) {
        category = "DevOps"
      }
      else if (title.includes("product")) {
        category = "Product"
      }
      else if (
        title.includes("design") ||
        title.includes("designer") ||
        title.includes("ui") ||
        title.includes("ux")
      ) {
        category = "Design"
      }

      return {
        company: job.company?.name || "Unknown Company",
        role: job.name || "Intern",
        category,
        location: job.locations?.[0]?.name || "Remote",
        stipend: "Not Disclosed",
        skills: [],
        applyLink: job.refs?.landing_page || "#",
      }
    })

  } catch (error) {
    console.log(error)
    return []
  }
}