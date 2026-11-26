import { useState, useEffect, useCallback } from 'react'
import { albumAPI } from '../utils/api'

export const useAlbum = () => {
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState(null)

  const fetchEntries = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await albumAPI.getAll()
      setEntries(res.data)
    } catch (e) {
      setError('No se pudo cargar el álbum.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchEntries()
  }, [fetchEntries])

  const uploadPhoto = async (file, title, content) => {
    setUploading(true)
    setError(null)
    try {
      const formData = new FormData()
      if (file) formData.append('photo', file)
      formData.append('title', title)
      if (content) formData.append('content', content)
      const res = await albumAPI.uploadPhoto(formData)
      setEntries(prev => [res.data, ...prev])
      return res.data
    } catch (e) {
      setError(file ? 'Error al subir la foto.' : 'Error al guardar la entrada.')
      throw e
    } finally {
      setUploading(false)
    }
  }

  const deleteEntry = async (id) => {
    try {
      await albumAPI.delete(id)
      setEntries(prev => prev.filter(e => e.id !== id))
    } catch (e) {
      setError('Error al eliminar la entrada.')
      throw e
    }
  }

  return { entries, loading, uploading, error, uploadPhoto, deleteEntry, refetch: fetchEntries }
}
