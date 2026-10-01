import { Routes, Route, Navigate, Link } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import { Landing } from './pages/Landing'
import { Blog } from './pages/Blog'
import { BlogPost } from './pages/BlogPost'
import { TreasureHunt } from './pages/TreasureHunt'
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

      {/* Mensaje de aniversario — 2 meses */}
      <div className="aniversario-section">
        <div className="aniversario-card">
          <div className="aniversario-flowers" aria-hidden="true">🌻</div>
          <p className="aniversario-label">— 01 de octubre, 2026 —</p>
          <h2 className="aniversario-title">Felices dos meses!! 💛</h2>
          <div className="aniversario-body">
            <p>
              Que rápido se me pasó el tiempo, pero hoy cumplimos dos meses!! Está cañón como
              en el tiempo que llevo de conocerte he tenido experiencias increíbles, momentos de
              mucha felicidad y alegría.
            </p>
            <p>
              Esta vez nos toca celebrar desde lejos, pero no quise que pasara desapercibida la
              fecha. Estás en un viaje que desde hace mucho tenías presente y hoy estás cumpliendo.
              En las videollamadas te ves super feliz y eso me pone feliz a mi también porque,
              aunque te extraño muchísimo y muero por un abrazo tuyo, me encanta verte luchando
              por tus sueños.
            </p>
            <p>
              Felices dos meses, gracias por venir a cambiar muchos aspectos de mi vida. Te amo
              como no he amado a nadie nunca y como amaré a nadie jamás.
            </p>
            <p>
              Sobre la página, espero que te guste lo que he estado trabajando. Tiene varios bugs
              y muy probablemente no te gusten mis dotes de diseñador pero justo la construí
              pensando en que sea un espacio para los dos. Así que, cualquier queja, idea,
              sugerencia o experimento es bienvenido.
            </p>
            <p>
              Alguna vez prometí construir una página para agendar citas, pero en el camino han
              surgido algunas ideas extras, espero te guste.
            </p>
          </div>
          <p className="aniversario-signoff">Te amo.<br /><em>Tu tontito</em> 🌻</p>
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
  const huntPassed = localStorage.getItem('hunt_passed') === 'true'

  if (isAuthenticated) {
    return <Navigate to="/pareja" replace />
  }

  if (!huntPassed) {
    return <Navigate to="/pareja/enigma" replace />
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
      <Route path="/pareja/enigma" element={<TreasureHunt />} />
      <Route path="/pareja/login" element={<LoginRoute />} />
      <Route path="/pareja" element={<ParejaSection />} />
      <Route path="/pareja/album" element={<Album />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
