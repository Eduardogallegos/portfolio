import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../components/Auth.css'
import './TreasureHunt.css'

const BIRTHDAY = '1998-11-05'
const ANNIVERSARY = '2026-08-01'

export const TreasureHunt = () => {
  const [birthday, setBirthday] = useState('')
  const [anniversary, setAnniversary] = useState('')
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()

    if (birthday === BIRTHDAY && anniversary === ANNIVERSARY) {
      localStorage.setItem('hunt_passed', 'true')
      navigate('/pareja/login')
      return
    }

    setError('Alguna fecha no es correcta. Inténtalo de nuevo 💭')
  }

  return (
    <div className="auth-container">
      <div className="auth-card hunt-card">
        <h1>Antes de entrar... 🔍</h1>
        <p className="hunt-subtitle">
          Responde bien las dos preguntas para llegar al login
        </p>
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <label className="hunt-label">
            ¿Cuál es mi fecha de nacimiento?
            <input
              type="date"
              value={birthday}
              onChange={(e) => setBirthday(e.target.value)}
              required
            />
          </label>
          <label className="hunt-label">
            ¿Qué día nos hicimos novios?
            <input
              type="date"
              value={anniversary}
              onChange={(e) => setAnniversary(e.target.value)}
              required
            />
          </label>
          <button type="submit" className="btn-primary">
            Comprobar 💕
          </button>
        </form>
      </div>
    </div>
  )
}
