import { Routes, Route, Navigate, Link } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import { Landing } from './pages/Landing'
import { Blog } from './pages/Blog'
import { BlogPost } from './pages/BlogPost'
import { Login } from './components/Login'
import { ReadWhen } from './pages/ReadWhen'
import { Countdown } from './components/Countdown'
import { DateBooking } from './components/DateBooking'
import { Album } from './pages/Album'
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
          <div className="pareja-nav-links">
            <Link to="/pareja/album" className="album-nav-link">📷 Álbum</Link>
          </div>
          <div className="user-menu">
            <span className="user-email">{user?.email}</span>
            <button onClick={logout} className="btn-secondary">
              Cerrar Sesión
            </button>
          </div>
        </div>
      </nav>

      {/* Mensaje nuevo — competencia */}
      <div className="aniversario-section">
        <div className="aniversario-card">
          <div className="aniversario-flowers" aria-hidden="true">🍀</div>
          <h2 className="aniversario-title">Mi amor 💛</h2>
          <div className="aniversario-body">
            <p>
              Llegó el día de tu competencia, y no sabes el orgullo que sentí cuando te vi ahí.
              Te juro que tu alter ego de bailarina me fascina. Estar compitiendo en otro país,
              otro idioma, todo es distinto y afecta, pero tú lo hacías tan natural que neta es
              de admirarse.
            </p>
            <p>
              Me encanta verte luchar y cumplir tus sueños, te juro no quiero más que impulsarte
              a conseguirlos, puedes apoyarte de mi como necesites para que cumplas las metas que
              te propones, y no solo hablo de bailar, sino en la vida.
            </p>
            <p>Muchas felicidades por lo que has logrado.</p>
          </div>
          <p className="aniversario-signoff">Te amo 🍀</p>
        </div>
      </div>

      <div className="pareja-divider"><span>💌</span></div>

      <ReadWhen />

      <div className="pareja-divider"><span>💕</span></div>

      <Countdown />

      <div className="pareja-divider"><span>🌙</span></div>

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
      <Route path="/blog" element={<Blog />} />
      <Route path="/blog/:slug" element={<BlogPost />} />
      <Route path="/pareja/login" element={<LoginRoute />} />
      <Route path="/pareja" element={<ParejaSection />} />
      <Route path="/pareja/album" element={<Album />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
