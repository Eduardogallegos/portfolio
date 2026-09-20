import { useState } from 'react'
import { useAuth } from './hooks/useAuth'
import { Login } from './components/Login'
import { Register } from './components/Register'
import { DateBooking } from './components/DateBooking'
import './App.css'

function App() {
  const { user, logout, isAuthenticated } = useAuth()
  const [showRegister, setShowRegister] = useState(false)

  if (!isAuthenticated) {
    return (
      <div className="app">
        {showRegister ? (
          <>
            <Register onSuccess={() => setShowRegister(false)} />
            <div className="auth-toggle">
              <p>¿Ya tienes cuenta? 
                <button onClick={() => setShowRegister(false)} className="link-btn">
                  Inicia sesión aquí
                </button>
              </p>
            </div>
          </>
        ) : (
          <>
            <Login onSuccess={() => {}} />
            <div className="auth-toggle">
              <p>¿No tienes cuenta? 
                <button onClick={() => setShowRegister(true)} className="link-btn">
                  Regístrate aquí
                </button>
              </p>
            </div>
          </>
        )}
      </div>
    )
  }

  return (
    <div className="app">
      <nav className="navbar">
        <div className="navbar-content">
          <h2>💕 Date Booking App</h2>
          <div className="user-menu">
            <span className="user-email">{user?.email}</span>
            <button onClick={logout} className="btn-secondary">
              Cerrar Sesión
            </button>
          </div>
        </div>
      </nav>

      <DateBooking />
    </div>
  )
}

export default App
