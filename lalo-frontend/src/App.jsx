import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import { Landing } from './pages/Landing'
import { Login } from './components/Login'
import { DateBooking } from './components/DateBooking'
import './App.css'

function ParejaSection() {
  const { user, logout, isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/pareja/login" replace />
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

function LoginRoute() {
  const { isAuthenticated } = useAuth()

  if (isAuthenticated) {
    return <Navigate to="/pareja" replace />
  }

  return (
    <div className="app">
      <Login onSuccess={() => {}} />
    </div>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/pareja/login" element={<LoginRoute />} />
      <Route path="/pareja" element={<ParejaSection />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
