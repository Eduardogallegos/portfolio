import { Link } from 'react-router-dom'
import { SiteNav } from '../components/SiteNav'
import './Landing.css'

export const Landing = () => (
  <main className="landing">
    <SiteNav />

    <div className="landing-bg" aria-hidden="true">
      <span className="landing-glow landing-glow-a" />
      <span className="landing-glow landing-glow-b" />
      <div className="landing-grid" />
    </div>

    <div className="landing-content">
      <p className="landing-tag">// portafolio &amp; experimentos</p>
      <h1>
        Eduardo <span className="landing-accent">Gallegos</span>
      </h1>
      <p className="landing-desc">
        Construyendo cosas, rompiendo cosas, aprendiendo en el camino.
      </p>

      <Link to="/pareja/enigma" className="landing-btn">
        <span className="landing-btn-prompt">$</span>
        Si eres mi novia, da click aquí 💕
      </Link>
    </div>
  </main>
)
