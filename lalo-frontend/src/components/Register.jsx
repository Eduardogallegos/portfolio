import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import './Auth.css'

export const Register = ({ onSuccess }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('pareja')
  const { register, loading, error } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await register(email, password, role)
      onSuccess()
    } catch (err) {
      // Error manejado por el hook
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Crear Cuenta</h1>
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
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="pareja">Soy la Pareja</option>
            <option value="lalo">Soy Lalo</option>
          </select>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? <span className="loading"></span> : 'Crear Cuenta'}
          </button>
        </form>
      </div>
    </div>
  )
}
