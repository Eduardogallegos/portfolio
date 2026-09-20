import { useState, useEffect } from 'react'
import { authAPI } from '../utils/api'

export const useAuth = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('access_token')
    const userData = localStorage.getItem('user')
    if (token && userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  const register = async (email, password, role) => {
    setLoading(true)
    setError(null)
    try {
      const response = await authAPI.register(email, password, role)
      setUser(response.data)
      return response.data
    } catch (err) {
      setError(err.response?.data?.detail || 'Error registering')
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
      const { access_token, user } = response.data
      localStorage.setItem('access_token', access_token)
      localStorage.setItem('user', JSON.stringify(user))
      setUser(user)
      return response.data
    } catch (err) {
      setError(err.response?.data?.detail || 'Error logging in')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('user')
    setUser(null)
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
