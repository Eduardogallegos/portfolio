import { useState } from 'react'
import { messagesAPI } from '../utils/api'

export const useMessages = () => {
  const [messages, setMessages] = useState([])   // mensajes de la categoría activa
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  // seen: { [category]: Set<id> } — persiste mientras no recargue
  const [seen, setSeen] = useState({})

  const fetchCategory = async (category) => {
    setLoading(true)
    setError(null)
    try {
      const res = await messagesAPI.getByCategory(category)
      setMessages(res.data)
    } catch (err) {
      setError(err.response?.data?.detail || 'Error cargando mensajes')
    } finally {
      setLoading(false)
    }
  }

  // Devuelve un mensaje no visto de la lista actual. Si los agotó, reinicia.
  const pickUnseen = (category) => {
    const seenSet = seen[category] ?? new Set()
    const available = messages.filter((m) => !seenSet.has(m.id))
    const pool = available.length > 0 ? available : messages  // reiniciar si los vio todos

    if (pool.length === 0) return null
    const pick = pool[Math.floor(Math.random() * pool.length)]

    setSeen((prev) => ({
      ...prev,
      [category]: new Set([...(prev[category] ?? []), pick.id]),
    }))
    return pick
  }

  return { messages, loading, error, fetchCategory, pickUnseen }
}
