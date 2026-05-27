'use client'
import { useState } from 'react'
import { Mail, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const submit = (e) => {
    e.preventDefault()
    toast.success('Thanks! We\u2019ll get back to you soon.')
    setForm({ name: '', email: '', message: '' })
  }
  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <div className="text-center mb-10">
        <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-accent mb-4">
          <Mail className="h-7 w-7 text-primary" />
        </div>
        <h1 className="text-4xl font-bold mb-3">Contact Us</h1>
        <p className="text-muted-foreground">Have a question, suggestion, or feedback? Drop us a message.</p>
      </div>
      <form onSubmit={submit} className="space-y-4 rounded-2xl border border-border/60 bg-card p-8 soft-shadow">
        <div>
          <label className="text-sm font-medium mb-1.5 block">Name</label>
          <Input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Your name" />
        </div>
        <div>
          <label className="text-sm font-medium mb-1.5 block">Email</label>
          <Input required type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" />
        </div>
        <div>
          <label className="text-sm font-medium mb-1.5 block">Message</label>
          <Textarea required rows={5} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} placeholder="How can we help you?" />
        </div>
        <Button type="submit" className="w-full" size="lg"><Send className="h-4 w-4 mr-2" /> Send Message</Button>
      </form>
    </div>
  )
}
