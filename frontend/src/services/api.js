const API_URL = import.meta.env.VITE_API_URL

async function apiRequest(path, options = {}) {
  
  const token = localStorage.getItem("token")

  const response = await fetch(
    `${API_URL}${path}`,
    {
      ...options,

      headers: {
        ...(options.body
          ? {
              "Content-Type":
                "application/json",
            }
          : {}),

        ...(token
          ? {
              Authorization:
                `Bearer ${token}`,
            }
          : {}),

        ...options.headers,
      },
    }
  )

  const responseData =
    await response.json().catch(() => null)

  if (!response.ok) {
    throw new Error(
      responseData?.message ||
        responseData?.error ||
        `Request failed with status ${response.status}`
    )
  }

  return responseData
}

export default apiRequest