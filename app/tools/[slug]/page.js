import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ChevronRight, Home, ArrowRight } from 'lucide-react'
import { getToolBySlug, getRelatedTools, getCategory, tools } from '@/lib/tools-registry'
import ToolRenderer from '@/components/tools/tool-renderer'
import ToolCard from '@/components/tool-card'
import AdSlot from '@/components/ad-slot'

export async function generateStaticParams() {
  return tools.map(t => ({ slug: t.slug }))
}

export async function generateMetadata({ params }) {
  const tool = getToolBySlug(params.slug)
  if (!tool) return {}
  return {
    title: `${tool.name} — Free Online ${tool.name}`,
    description: `${tool.description}. Free online ${tool.name.toLowerCase()} tool. No signup required. Works in your browser.`,
    keywords: tool.keywords,
    alternates: { canonical: `/tools/${tool.slug}` },
    openGraph: {
      title: `${tool.name} — ToolBazaar`,
      description: tool.description,
      url: `/tools/${tool.slug}`
    }
  }
}

export default function ToolPage({ params }) {
  const tool = getToolBySlug(params.slug)
  if (!tool) notFound()
  const category = getCategory(tool.category)
  const related = getRelatedTools(tool.slug)
  const Icon = tool.icon

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-6">
        <Link href="/" className="hover:text-foreground flex items-center gap-1"><Home className="h-3.5 w-3.5" /> Home</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link href={`/category/${category.slug}`} className="hover:text-foreground">{category.name}</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-foreground font-medium">{tool.name}</span>
      </nav>

      {/* Header */}
      <div className="flex items-start gap-4 mb-8">
        <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${category.color} text-white shadow-md shrink-0`}>
          <Icon className="h-7 w-7" />
        </div>
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{tool.name}</h1>
          <p className="text-muted-foreground">{tool.description}</p>
        </div>
      </div>

      {/* Tool */}
      <div className="grid lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <div className="rounded-2xl border border-border/60 bg-card p-6 md:p-8 soft-shadow">
            <ToolRenderer slug={tool.slug} />
          </div>
          <AdSlot slot="tool_bottom" className="mt-6" />
        </div>

        {/* Sidebar */}
        <aside className="space-y-4">
          <div className="rounded-2xl border border-border/60 bg-card p-5">
            <h3 className="font-semibold mb-3 text-sm">Related Tools</h3>
            <div className="space-y-2">
              {related.map(t => {
                const I = t.icon
                return (
                  <Link key={t.slug} href={`/tools/${t.slug}`} className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent transition-colors">
                    <I className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium flex-1">{t.name}</span>
                    <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
                  </Link>
                )
              })}
            </div>
          </div>
          <div className="ad-slot" style={{minHeight: 250}}><AdSlot slot="tool_sidebar" style={{minHeight: 250}} /></div>
        </aside>
      </div>

      {/* More from category */}
      <section className="mt-16">
        <h2 className="text-2xl font-bold mb-6">More {category.name}</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {related.map(t => <ToolCard key={t.slug} tool={t} />)}
        </div>
      </section>
    </div>
  )
}
