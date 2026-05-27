'use client'
import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { Menu, Search, X, Wrench } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { tools, categories } from '@/lib/tools-registry'
import { useRouter } from 'next/navigation'

export default function Navbar() {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const router = useRouter()

  const results = useMemo(() => {
    if (!query.trim()) return []
    const q = query.toLowerCase()
    return tools.filter(t => t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q) || t.keywords?.some(k => k.includes(q))).slice(0, 6)
  }, [query])

  useEffect(() => {
    const close = () => setOpen(false)
    window.addEventListener('click', close)
    return () => window.removeEventListener('click', close)
  }, [])

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between gap-4 px-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg shrink-0">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-pink-500 text-white shadow-sm">
            <Wrench className="h-5 w-5" />
          </div>
          <span className="gradient-text">ToolBazaar</span>
        </Link>

        <div className="hidden md:flex flex-1 max-w-md relative" onClick={(e) => e.stopPropagation()}>
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search 30+ tools..."
              value={query}
              onChange={(e) => { setQuery(e.target.value); setOpen(true) }}
              onFocus={() => setOpen(true)}
              className="pl-9 h-10 rounded-full bg-muted/50 border-transparent focus-visible:bg-background"
            />
            {query && (
              <button onClick={() => setQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2">
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            )}
          </div>
          {open && results.length > 0 && (
            <div className="absolute top-12 left-0 right-0 bg-popover rounded-xl border shadow-lg overflow-hidden">
              {results.map(t => {
                const Icon = t.icon
                return (
                  <Link
                    key={t.slug}
                    href={`/tools/${t.slug}`}
                    onClick={() => { setQuery(''); setOpen(false) }}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-accent transition-colors"
                  >
                    <Icon className="h-4 w-4 text-primary" />
                    <div className="flex-1">
                      <div className="text-sm font-medium">{t.name}</div>
                      <div className="text-xs text-muted-foreground line-clamp-1">{t.description}</div>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>

        <nav className="hidden lg:flex items-center gap-1">
          {categories.map(c => (
            <Link key={c.slug} href={`/category/${c.slug}`} className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              {c.name.replace(' Tools', '')}
            </Link>
          ))}
        </nav>

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="lg:hidden"><Menu className="h-5 w-5" /></Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-80">
            <div className="flex flex-col gap-2 mt-8">
              <Link href="/" className="py-2 font-semibold">Home</Link>
              {categories.map(c => (
                <Link key={c.slug} href={`/category/${c.slug}`} className="py-2 text-muted-foreground hover:text-foreground">{c.name}</Link>
              ))}
              <div className="h-px bg-border my-2" />
              <Link href="/about" className="py-2 text-muted-foreground">About</Link>
              <Link href="/privacy" className="py-2 text-muted-foreground">Privacy</Link>
              <Link href="/contact" className="py-2 text-muted-foreground">Contact</Link>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
