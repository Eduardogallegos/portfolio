import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import './Auth.css'

// Registro solo por invitación: el código viene en el link que Lalo comparte.
// El rol (pareja) lo asigna el backend; aquí no se elige.
export const Register = ({ inviteCode }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [localError, setLocalError] = useState(null)
  const { register, loading, error } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLocalError(null)
    if (password.length < 8) {
      setLocalError('La contraseña debe tener al menos 8 caracteres')
      return
    }
    if (password !== confirm) {
      setLocalError('Las contraseñas no coinciden')
      return
    }
    try {
      await register(email, password, inviteCode)
    } catch (err) {
      // Error manejado por el hook
    }
  }

  const shownError = localError || error

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Crea tu cuenta 💚</h1>
        {shownError && <div className="alert alert-error">{shownError}</div>}
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Tu correo"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Contraseña (mínimo 8 caracteres)"
            autoComplete="new-password"
            minLength={8}
            maxLength={72}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Repite la contraseña"
            autoComplete="new-password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
          />
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? <span className="loading"></span> : 'Crear cuenta'}
          </button>
        </form>
      </div>
    </div>
  )
}
