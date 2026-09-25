import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import { Landing } from './pages/Landing'
import { Blog } from './pages/Blog'
import { BlogPost } from './pages/BlogPost'
import { TreasureHunt } from './pages/TreasureHunt'
import { Login } from './components/Login'
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
          <div className="user-menu">
            <span className="user-email">{user?.email}</span>
            <button onClick={logout} className="btn-secondary">
              Cerrar Sesión
            </button>
          </div>
        </div>
      </nav>

      <div className="wip-placeholder">
        <img
          src="/work-in-progress.jpg"
          alt="En construcción"
          className="wip-placeholder-img"
        />
        <p>Esta sección sigue en construcción 🚧</p>

        <div className="pareja-message">
          <p>
            Hace mucho te prometí construir algo así (apenas estábamos saliendo) 
            y lo he estado trabajando en esto desde entonces, pero por
            varios motivos lo había puesto en pausa. Poco a poco le iré
            agregando cositas (sorry, tiene bugs y cosas que iré arreglando)
          </p>
          <p>
            Por lo pronto quiero que sepas que me siento súper orgulloso
            de ti, eres una persona admirable. Que este viaje te sirva
            para seguir creciendo en lo que amas. ¡Disfrútalo!
          </p>
          <p>Hoy es el inicio de esta aventura.</p>
          <p className="pareja-message-signoff">Te amo, preciosa 💜</p>
        </div>
      </div>
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
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
