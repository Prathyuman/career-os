import { fetchJSearchInternships } from "./jsearch"
import { fetchAdzunaInternships } from "./adzuna"
import { fetchRemotiveInternships } from "./remotive"
import { fetchMuseInternships } from "./muse"

export const getInternships = async (searchQuery?: string) => {
  try {
    const data = await fetchJSearchInternships(searchQuery)

    if (data.length > 0) {
      console.log("Using JSearch API")
      return data
    }
  } catch (error) {
    console.log("JSearch Failed:", error)
  }

  try {
    const data = await fetchAdzunaInternships()

    if (data.length > 0) {
      console.log("Using Adzuna API")
      return data
    }
  } catch (error) {
    console.log("Adzuna Failed:", error)
  }

  try {
    const data = await fetchRemotiveInternships()

    if (data.length > 0) {
      console.log("Using Remotive API")
      return data
    }
  } catch (error) {
    console.log("Remotive Failed:", error)
  }

  console.log("Using Muse API")
  return await fetchMuseInternships(searchQuery)
}