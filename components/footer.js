import Link from 'next/link'
import { Wrench, Github, Twitter } from 'lucide-react'
import { categories } from '@/lib/tools-registry'

export default function Footer() {
  return (
    <footer className="border-t border-border/60 bg-muted/30 mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="flex items-center gap-2 font-bold text-lg">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-pink-500 text-white">
                <Wrench className="h-5 w-5" />
              </div>
              <span className="gradient-text">ToolBazaar</span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground max-w-xs">
              Free online utility tools for everyday tasks. Fast, secure, and no signup required.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-3 text-sm">Categories</h3>
            <ul className="space-y-2 text-sm">
              {categories.map(c => (
                <li key={c.slug}>
                  <Link href={`/category/${c.slug}`} className="text-muted-foreground hover:text-foreground transition-colors">
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-3 text-sm">Company</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="text-muted-foreground hover:text-foreground">About</Link></li>
              <li><Link href="/privacy" className="text-muted-foreground hover:text-foreground">Privacy Policy</Link></li>
              <li><Link href="/contact" className="text-muted-foreground hover:text-foreground">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-3 text-sm">Connect</h3>
            <div className="flex gap-2">
              <a href="#" className="h-9 w-9 rounded-full bg-muted flex items-center justify-center hover:bg-accent"><Github className="h-4 w-4" /></a>
              <a href="#" className="h-9 w-9 rounded-full bg-muted flex items-center justify-center hover:bg-accent"><Twitter className="h-4 w-4" /></a>
            </div>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-border/60 flex flex-col md:flex-row items-center justify-between gap-3 text-sm text-muted-foreground">
          <div>© {new Date().getFullYear()} <span className="font-semibold text-foreground">ToolBazaar</span>. All rights reserved.</div>
          <div>Owned & operated by <span className="font-semibold text-foreground">Tushar Jadhav</span></div>
        </div>
      </div>
    </footer>
  )
}
