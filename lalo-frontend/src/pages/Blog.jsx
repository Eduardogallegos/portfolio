import { Link } from 'react-router-dom'
import { getAllPosts } from '../utils/posts'
import { SiteNav } from '../components/SiteNav'
import './Blog.css'

export const Blog = () => {
  const posts = getAllPosts()

  return (
    <main className="blog">
      <SiteNav />

      <div className="blog-header">
        <Link to="/" className="blog-back">← Inicio</Link>
        <h1>Blog</h1>
        <p>Tutoriales, apuntes y experimentos.</p>
      </div>

      <div className="blog-list">
        {posts.length === 0 && <p className="blog-empty">Todavía no hay posts.</p>}
        {posts.map((post) => (
          <Link key={post.slug} to={`/blog/${post.slug}`} className="blog-card">
            <span className="blog-card-date">{post.date}</span>
            <h2>{post.title}</h2>
            {post.excerpt && <p>{post.excerpt}</p>}
          </Link>
        ))}
      </div>
    </main>
  )
}
