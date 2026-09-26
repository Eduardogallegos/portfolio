import { useState } from 'react'
import { useMessages } from '../hooks/useMessages'
import './ReadWhen.css'

const CATEGORIES = [
  { slug: 'sola',        emoji: '🌙', label: '…te sientes sola' },
  { slug: 'triste',      emoji: '🌧️', label: '…estás triste' },
  { slug: 'nos-extranas', emoji: '💭', label: '…me extrañas' },
  { slug: 'riete',       emoji: '😄', label: '…quieres reírte' },
  { slug: 'empujon',     emoji: '🔥', label: '…necesitas un empujón' },
  { slug: 'sorpresa',    emoji: '✨', label: '…no sabes qué necesitas' },
]

export function ReadWhen() {
  const { loading, error, fetchCategory, pickUnseen } = useMessages()
  const [activeCategory, setActiveCategory] = useState(null)
  const [currentMessage, setCurrentMessage] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [fetched, setFetched] = useState(new Set()) // categorías ya cargadas

  const handleCategoryClick = async (cat) => {
    setActiveCategory(cat.slug)

    // Solo hace fetch si no lo había traído antes
    if (!fetched.has(cat.slug)) {
      await fetchCategory(cat.slug)
      setFetched((prev) => new Set([...prev, cat.slug]))
    }

    const msg = pickUnseen(cat.slug)
    setCurrentMessage(msg)
    setModalOpen(true)
  }

  const handleOtro = () => {
    const msg = pickUnseen(activeCategory)
    setCurrentMessage(msg)
  }

  const handleClose = () => {
    setModalOpen(false)
    setCurrentMessage(null)
    setActiveCategory(null)
  }

  return (
    <section className="read-when">
      <h2 className="read-when-title">Lee cuando</h2>

      <div className="read-when-grid">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.slug}
            className="rw-card"
            onClick={() => handleCategoryClick(cat)}
            disabled={loading}
          >
            <span className="rw-card-emoji">{cat.emoji}</span>
            <span className="rw-card-label">{cat.label}</span>
          </button>
        ))}
      </div>

      {modalOpen && (
        <div className="rw-overlay" onClick={handleClose}>
          <div className="rw-modal" onClick={(e) => e.stopPropagation()}>
            <button className="rw-close" onClick={handleClose}>×</button>

            {loading && <p className="rw-loading">Cargando…</p>}

            {error && <p className="rw-error">{error}</p>}

            {!loading && currentMessage && (
              <>
                {currentMessage.image_url && (
                  <img
                    className="rw-image"
                    src={currentMessage.image_url}
                    alt=""
                  />
                )}
                <p className="rw-content">{currentMessage.content}</p>
                <button className="rw-otro" onClick={handleOtro}>
                  otro 💌
                </button>
              </>
            )}

            {!loading && !currentMessage && !error && (
              <p className="rw-empty">No hay mensajes aquí todavía 🌱</p>
            )}
          </div>
        </div>
      )}
    </section>
  )
}
