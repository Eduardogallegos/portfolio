import axios from 'axios'

const API_BASE_URL = 'http://localhost:8000'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptor para agregar token JWT
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Auth API
export const authAPI = {
  register: (email, password, role) =>
    api.post('/auth/register', { email, password, role }),
  login: (email, password) =>
    api.post('/auth/login', { email, password }),
  getMe: () => api.get('/auth/me'),
}

// Planes API
export const planesAPI = {
  getAll: () => api.get('/planes'),
  create: (nombre, descripcion, duracion_minutos) =>
    api.post('/planes', { nombre, descripcion, duracion_minutos }),
  update: (id, nombre, descripcion, duracion_minutos) =>
    api.put(`/planes/${id}`, { nombre, descripcion, duracion_minutos }),
  delete: (id) => api.delete(`/planes/${id}`),
}

// Bookings API
export const bookingsAPI = {
  getAll: () => api.get('/bookings'),
  create: (plan_id, fecha, hora_inicio) =>
    api.post('/bookings', { plan_id, fecha, hora_inicio }),
  getById: (id) => api.get(`/bookings/${id}`),
}

export default api
