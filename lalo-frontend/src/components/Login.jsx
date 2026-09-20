import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import './Auth.css'

export const Login = ({ onSuccess }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { login, loading, error } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await login(email, password)
      onSuccess()
    } catch (err) {
      // Error manejado por el hook
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Iniciar Sesión</h1>
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? <span className="loading"></span> : 'Iniciar Sesión'}
          </button>
        </form>
      </div>
    </div>
  )
}
