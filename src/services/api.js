import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || 'https://devconnectbackend-wuej.onrender.com'

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
})

// Inject JWT token on every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Handle 401 globally — clear token and redirect to login
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('authToken')
      localStorage.removeItem('authUser')
      window.location.href = '/'
    }
    return Promise.reject(err)
  }
)

export { BASE_URL }
export default api
