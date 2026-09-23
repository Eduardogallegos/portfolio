import { useState } from 'react'
import { useAuth } from './hooks/useAuth'
import { Login } from './components/Login'
import { DateBooking } from './components/DateBooking'
import './App.css'

function App() {
  const { user, logout, isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return (
      <div className="app">
        <Login onSuccess={() => {}} />
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