import { useState, useEffect } from 'react'
import { planesAPI } from '../utils/api'

export const usePlans = () => {
  const [planes, setPlanes] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchPlanes = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await planesAPI.getAll()
      setPlanes(response.data)
    } catch (err) {
      setError(err.response?.data?.detail || 'Error fetching planes')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPlanes()
  }, [])

  const createPlan = async (nombre, descripcion, duracion_minutos) => {
    setLoading(true)
    setError(null)
    try {
      const response = await planesAPI.create(nombre, descripcion, duracion_minutos)
      setPlanes([...planes, response.data])
      return response.data
    } catch (err) {
      setError(err.response?.data?.detail || 'Error creating plan')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const updatePlan = async (id, nombre, descripcion, duracion_minutos) => {
    setLoading(true)
    setError(null)
    try {
      const response = await planesAPI.update(id, nombre, descripcion, duracion_minutos)
      setPlanes(planes.map(p => p.id === id ? response.data : p))
      return response.data
    } catch (err) {
      setError(err.response?.data?.detail || 'Error updating plan')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const deletePlan = async (id) => {
    setLoading(true)
    setError(null)
    try {
      await planesAPI.delete(id)
      setPlanes(planes.filter(p => p.id !== id))
    } catch (err) {
      setError(err.response?.data?.detail || 'Error deleting plan')
      throw err
    } finally {
      setLoading(false)
    }
  }

  return {
    planes,
    loading,
    error,
    fetchPlanes,
    createPlan,
    updatePlan,
    deletePlan,
  }
}
