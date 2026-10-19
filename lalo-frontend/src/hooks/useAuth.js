import { useState } from 'react'
import { authAPI } from '../utils/api'

// Verifica que el JWT no haya expirado (claim "exp" en segundos)
const isTokenValid = (token) => {
  try {
    const payload = JSON.parse(
      atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/'))
    )
    return typeof payload.exp === 'number' && payload.exp * 1000 > Date.now()
  } catch (e) {
    return false
  }
}

const clearSession = () => {
  localStorage.removeItem('access_token')
  localStorage.removeItem('user')
}

export const useAuth = () => {
  const [user, setUser] = useState(() => {
    try {
      const token = localStorage.getItem('access_token')
      const userData = localStorage.getItem('user')
      if (token && userData && isTokenValid(token)) {
        return JSON.parse(userData)
      }
      // Sesión vencida o incompleta: limpiar para que se pida login
      clearSession()
      return null
    } catch (e) {
      console.error('Error parsing user data:', e)
      clearSession()
      return null
    }
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const register = async (email, password, role) => {
    setLoading(true)
    setError(null)
    try {
      const response = await authAPI.register(email, password, role)
      console.log('Register response:', response.data)
      setUser(response.data)
      localStorage.setItem('user', JSON.stringify(response.data))
      return response.data
    } catch (err) {
      const errorMsg = err.response?.data?.detail || 'Error registering'
      console.error('Register error:', errorMsg)
      setError(errorMsg)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, password) => {
    setLoading(true)
    setError(null)
    try {
      const response = await authAPI.login(email, password)
      console.log('Login response:', response.data)
      const { access_token, user } = response.data
      
      localStorage.setItem('access_token', access_token)
      localStorage.setItem('user', JSON.stringify(user))
      setUser(user)
      
      // Recargar en la sección protegida para que todo lea la nueva sesión
      window.location.href = '/pareja'
      
      return response.data
    } catch (err) {
      const errorMsg = err.response?.data?.detail || 'Error logging in'
      console.error('Login error:', errorMsg)
      setError(errorMsg)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    clearSession()
    setUser(null)
    window.location.href = '/'
  }

  return {
    user,
    loading,
    error,
    register,
    login,
    logout,
    isAuthenticated: !!user,
  }
}