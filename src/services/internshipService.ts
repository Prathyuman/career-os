const API_KEY = import.meta.env.VITE_RAPIDAPI_KEY

export const fetchInternships = async () => {
  try {
    const response = await fetch(
      'https://jsearch.p.rapidapi.com/search?query=frontend%20developer%20intern%20in%20india&page=1&num_pages=1',
      {
        method: 'GET',
        headers: {
          'x-rapidapi-key': API_KEY,
          'x-rapidapi-host': 'jsearch.p.rapidapi.com',
        },
      }
    )

    const data = await response.json()

   console.log('API RESPONSE FROM RAPID API:', data)

    return data.data || []
  } catch (error) {
    console.log(error)
    return []
  }
}