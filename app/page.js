import Link from 'next/link'
import { ArrowRight, Sparkles, Shield, Zap, Heart, FileText, Image as ImageIcon, Type, Calculator } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { categories, tools, getPopularTools } from '@/lib/tools-registry'
import ToolCard from '@/components/tool-card'
import AdSlot from '@/components/ad-slot'

const categoryIcons = {
  pdf: FileText,
  image: ImageIcon,
  text: Type,
  generator: Sparkles,
  calculator: Calculator
}

export default function HomePage() {
  const popular = getPopularTools()
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden gradient-bg">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-1/2 -translate-x-1/2 h-72 w-[40rem] rounded-full bg-primary/20 blur-3xl" />
        </div>
        <div className="container mx-auto px-4 py-20 md:py-28 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-background/80 border border-border/60 text-xs font-medium mb-6">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <span>30+ free tools • No signup required</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 max-w-4xl mx-auto">
            Free Online Tools — <span className="gradient-text">PDF, Image, Text & Calculator</span> Tools
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            100% free tools for everyday tasks. Fast, secure, and works right in your browser.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" className="rounded-full px-6">
              <Link href="#categories">Browse All Tools <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-full px-6">
              <Link href="#popular">Popular Tools</Link>
            </Button>
          </div>
          <div className="mt-12 grid grid-cols-3 gap-4 max-w-md mx-auto text-sm">
            <div className="flex flex-col items-center gap-1">
              <Zap className="h-5 w-5 text-primary" />
              <span className="font-semibold">Lightning Fast</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Shield className="h-5 w-5 text-primary" />
              <span className="font-semibold">100% Private</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Heart className="h-5 w-5 text-primary" />
              <span className="font-semibold">Always Free</span>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section id="categories" className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">Tool Categories</h2>
          <p className="text-muted-foreground">Pick a category to explore tools</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {categories.map(c => {
            const Icon = categoryIcons[c.slug]
            const count = tools.filter(t => t.category === c.slug).length
            return (
              <Link key={c.slug} href={`/category/${c.slug}`} className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card p-6 soft-shadow hover-lift">
                <div className={`absolute -right-8 -top-8 h-32 w-32 rounded-full bg-gradient-to-br ${c.color} opacity-10 group-hover:opacity-20 transition-opacity`} />
                <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${c.color} text-white shadow-md mb-4`}>
                  <Icon className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-bold mb-2">{c.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">{c.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground">{count} tools</span>
                  <ArrowRight className="h-4 w-4 text-primary transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      {/* Ad slot */}
      <div className="container mx-auto px-4">
        <AdSlot slot="home_top" />
      </div>

      {/* Popular Tools */}
      <section id="popular" className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">Most Popular Tools</h2>
          <p className="text-muted-foreground">Trusted by thousands every day</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {popular.map(t => <ToolCard key={t.slug} tool={t} />)}
        </div>
      </section>

      {/* All Tools quick grid */}
      <section className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">All Tools</h2>
        {categories.map(c => {
          const catTools = tools.filter(t => t.category === c.slug)
          return (
            <div key={c.slug} className="mb-10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">{c.name}</h3>
                <Link href={`/category/${c.slug}`} className="text-sm text-primary hover:underline">View all →</Link>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {catTools.map(t => <ToolCard key={t.slug} tool={t} />)}
              </div>
            </div>
          )
        })}
      </section>

      {/* FAQ */}
      <section className="container mx-auto px-4 py-16 max-w-3xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">Frequently Asked Questions</h2>
          <p className="text-muted-foreground">Everything you need to know</p>
        </div>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="1">
            <AccordionTrigger>Are all tools really free?</AccordionTrigger>
            <AccordionContent>Yes! Every tool on ToolBazaar is 100% free, unlimited and without watermarks. No subscription or signup required.</AccordionContent>
          </AccordionItem>
          <AccordionItem value="2">
            <AccordionTrigger>Is my data safe?</AccordionTrigger>
            <AccordionContent>Absolutely. All tools run entirely in your browser. Your files and data never leave your device or get uploaded to a server.</AccordionContent>
          </AccordionItem>
          <AccordionItem value="3">
            <AccordionTrigger>Do I need to install anything?</AccordionTrigger>
            <AccordionContent>No installation required. ToolBazaar works directly in your browser on desktop, tablet and mobile.</AccordionContent>
          </AccordionItem>
          <AccordionItem value="4">
            <AccordionTrigger>What file size limits apply?</AccordionTrigger>
            <AccordionContent>Since processing happens locally on your device, limits depend only on your device’s memory. Most modern phones can easily handle files up to 50MB.</AccordionContent>
          </AccordionItem>
          <AccordionItem value="5">
            <AccordionTrigger>Can I use these tools commercially?</AccordionTrigger>
            <AccordionContent>Yes, all outputs generated by ToolBazaar can be used for personal or commercial purposes.</AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>
    </>
  )
}
