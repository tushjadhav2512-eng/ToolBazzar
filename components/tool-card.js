import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default function ToolCard({ tool }) {
  const Icon = tool.icon
  return (
    <Link
      href={`/tools/${tool.slug}`}
      className="group relative flex flex-col gap-3 rounded-2xl border border-border/60 bg-card p-5 soft-shadow hover-lift"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent text-accent-foreground transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
        <Icon className="h-6 w-6" />
      </div>
      <div className="flex-1">
        <h3 className="font-semibold text-base mb-1 group-hover:text-primary transition-colors">{tool.name}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2">{tool.description}</p>
      </div>
      <div className="flex items-center gap-1 text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
        Use tool <ArrowRight className="h-3.5 w-3.5" />
      </div>
    </Link>
  )
}
