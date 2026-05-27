import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ChevronRight, Home } from 'lucide-react'
import { getCategory, getToolsByCategory, categories } from '@/lib/tools-registry'
import ToolCard from '@/components/tool-card'

export async function generateStaticParams() {
  return categories.map(c => ({ slug: c.slug }))
}

export async function generateMetadata({ params }) {
  const cat = getCategory(params.slug)
  if (!cat) return {}
  return {
    title: `${cat.name} — Free Online ${cat.name}`,
    description: `${cat.description}. All ${cat.name.toLowerCase()} are 100% free and work in your browser.`,
    alternates: { canonical: `/category/${cat.slug}` }
  }
}

export default function CategoryPage({ params }) {
  const cat = getCategory(params.slug)
  if (!cat) notFound()
  const catTools = getToolsByCategory(cat.slug)
  return (
    <div className="container mx-auto px-4 py-8">
      <nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-6">
        <Link href="/" className="hover:text-foreground flex items-center gap-1"><Home className="h-3.5 w-3.5" /> Home</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-foreground font-medium">{cat.name}</span>
      </nav>
      <div className={`rounded-3xl bg-gradient-to-br ${cat.color} p-8 md:p-12 text-white mb-10 soft-shadow`}>
        <h1 className="text-3xl md:text-5xl font-bold mb-3">{cat.name}</h1>
        <p className="text-lg opacity-95 max-w-2xl">{cat.description}</p>
        <p className="text-sm opacity-80 mt-2">{catTools.length} tools available</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {catTools.map(t => <ToolCard key={t.slug} tool={t} />)}
      </div>
    </div>
  )
}
