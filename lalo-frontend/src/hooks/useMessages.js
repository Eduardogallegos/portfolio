import { useState } from 'react'
import { messagesAPI } from '../utils/api'

export const useMessages = () => {
  // Guardamos mensajes por categoría para no perderlos al cambiar
  const [messagesByCategory, setMessagesByCategory] = useState({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  // seen: { [category]: Set<id> }
  const [seen, setSeen] = useState({})

  // Retorna los mensajes ya cargados de una categoría (o array vacío)
  const getMessages = (category) => messagesByCategory[category] ?? []

  // Hace fetch y retorna los mensajes directamente (sin depender del estado)
  const fetchCategory = async (category) => {
    setLoading(true)
    setError(null)
    try {
      const res = await messagesAPI.getByCategory(category)
      const data = res.data
      setMessagesByCategory((prev) => ({ ...prev, [category]: data }))
      return data
    } catch (err) {
      setError(err.response?.data?.detail || 'Error cargando mensajes')
      return []
    } finally {
      setLoading(false)
    }
  }

  // Devuelve un mensaje no visto de la categoría. Acepta la lista directamente
  // para evitar leer state obsoleto justo después de un fetch.
  const pickUnseen = (category, freshMessages) => {
    const pool = freshMessages ?? messagesByCategory[category] ?? []
    const seenSet = seen[category] ?? new Set()
    const available = pool.filter((m) => !seenSet.has(m.id))
    const candidates = available.length > 0 ? available : pool  // reinicia si los agotó

    if (candidates.length === 0) return null
    const pick = candidates[Math.floor(Math.random() * candidates.length)]

    setSeen((prev) => ({
      ...prev,
      [category]: new Set([...(prev[category] ?? []), pick.id]),
    }))
    return pick
  }

  return { loading, error, getMessages, fetchCategory, pickUnseen }
}
