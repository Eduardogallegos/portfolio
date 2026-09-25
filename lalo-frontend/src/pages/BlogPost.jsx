import { Link, useParams } from 'react-router-dom'
import { getPostBySlug } from '../utils/posts'
import { SiteNav } from '../components/SiteNav'
import './Blog.css'

export const BlogPost = () => {
  const { slug } = useParams()
  const post = getPostBySlug(slug)

  if (!post) {
    return (
      <main className="blog">
        <SiteNav />

        <div className="blog-header">
          <Link to="/blog" className="blog-back">← Blog</Link>
          <h1>Post no encontrado</h1>
        </div>
      </main>
    )
  }

  return (
    <main className="blog">
      <SiteNav />

      <article className="blog-post">
        <Link to="/blog" className="blog-back">← Blog</Link>
        <span className="blog-card-date">{post.date}</span>
        <h1>{post.title}</h1>
        <div
          className="blog-post-content"
          dangerouslySetInnerHTML={{ __html: post.html }}
        />
      </article>
    </main>
  )
}
