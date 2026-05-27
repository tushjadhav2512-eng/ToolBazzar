import { tools, categories } from '@/lib/tools-registry'

export default function sitemap() {
  const base = process.env.NEXT_PUBLIC_BASE_URL || 'https://toolbazaar.app'
  const staticPages = [
    { url: `${base}/`, lastModified: new Date(), priority: 1 },
    { url: `${base}/about`, lastModified: new Date(), priority: 0.5 },
    { url: `${base}/privacy`, lastModified: new Date(), priority: 0.3 },
    { url: `${base}/contact`, lastModified: new Date(), priority: 0.5 },
  ]
  const categoryPages = categories.map(c => ({
    url: `${base}/category/${c.slug}`,
    lastModified: new Date(),
    priority: 0.8
  }))
  const toolPages = tools.map(t => ({
    url: `${base}/tools/${t.slug}`,
    lastModified: new Date(),
    priority: 0.7
  }))
  return [...staticPages, ...categoryPages, ...toolPages]
}
