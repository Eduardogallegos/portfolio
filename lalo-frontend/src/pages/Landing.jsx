import { Link } from 'react-router-dom'
import './Landing.css'

export const Landing = () => (
  <main className="landing">
    <img
      src="/work-in-progress.jpg"
      alt="Sitio en construcción"
      className="landing-img"
    />
    <div className="landing-content">
      <h1>Portafolio Eduardo</h1>
      <p>Tutoriales y experimentos — en construcción</p>
      <Link to="/pareja/enigma" className="landing-btn">
        Si eres mi novia, da click aquí 💕
      </Link>
    </div>
  </main>
)
