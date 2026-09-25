import { Link } from 'react-router-dom'
import './SiteNav.css'

export const SiteNav = () => (
  <header className="site-nav">
    <Link to="/" className="site-nav-brand">
      Eduardo Gallegos
    </Link>
    <nav className="site-nav-links">
      <Link to="/blog">Blog</Link>
    </nav>
  </header>
)
