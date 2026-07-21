import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || '/api'

const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' }
})

// Attach token to every request
api.interceptors.request.use(config => {
  const token = localStorage.getItem('organ_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Handle 401 globally
api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('organ_token')
      localStorage.removeItem('organ_user')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

// Auth
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  me: () => api.get('/auth/me'),
}

// Organs
export const organsAPI = {
  getAll: (params) => api.get('/organs', { params }),
  create: (data) => api.post('/organs', data),
  update: (id, data) => api.put(`/organs/${id}`, data),
  delete: (id) => api.delete(`/organs/${id}`),
}

// Predictions
export const predictionsAPI = {
  create: (data) => api.post('/predictions', data),
  getAll: (params) => api.get('/predictions', { params }),
  getById: (id) => api.get(`/predictions/${id}`),
  delete: (id) => api.delete(`/predictions/${id}`),
}

// Patients
export const patientsAPI = {
  getAll: (params) => api.get('/patients', { params }),
  create: (data) => api.post('/patients', data),
  update: (id, data) => api.put(`/patients/${id}`, data),
  delete: (id) => api.delete(`/patients/${id}`),
}

// Hospitals
export const hospitalsAPI = {
  getAll: (params) => api.get('/hospitals', { params }),
  create: (data) => api.post('/hospitals', data),
  update: (id, data) => api.put(`/hospitals/${id}`, data),
  delete: (id) => api.delete(`/hospitals/${id}`),
}

// Analytics
export const analyticsAPI = {
  dashboard: () => api.get('/analytics/dashboard'),
  demand: (params) => api.get('/analytics/demand', { params }),
  availability: () => api.get('/analytics/availability'),
  insights: () => api.get('/analytics/insights'),
}

export default api
