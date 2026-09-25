import { parseFrontmatter, markdownToHtml } from './markdown'

const modules = import.meta.glob('../content/posts/*.md', {
  eager: true,
  query: '?raw',
  import: 'default',
})

function slugFromPath(path) {
  const filename = path.split('/').pop().replace(/\.md$/, '')
  // admite "2026-09-25-mi-post.md" -> slug "mi-post"
  return filename.replace(/^\d{4}-\d{2}-\d{2}-/, '')
}

const posts = Object.entries(modules)
  .map(([path, raw]) => {
    const { data, content } = parseFrontmatter(raw)
    return {
      slug: slugFromPath(path),
      title: data.title || slugFromPath(path),
      date: data.date || '',
      excerpt: data.excerpt || '',
      html: markdownToHtml(content),
    }
  })
  .sort((a, b) => (a.date < b.date ? 1 : -1))

export function getAllPosts() {
  return posts
}

export function getPostBySlug(slug) {
  return posts.find((post) => post.slug === slug)
}
