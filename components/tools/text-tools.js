'use client'
import { useState, useMemo } from 'react'
import { Copy, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { toast } from 'sonner'

const copy = async (text) => {
  try { await navigator.clipboard.writeText(text); toast.success('Copied to clipboard') } catch { toast.error('Copy failed') }
}

const StatCard = ({ label, value }) => (
  <div className="rounded-xl border bg-muted/30 p-4 text-center">
    <div className="text-2xl font-bold text-primary">{value}</div>
    <div className="text-xs text-muted-foreground mt-1">{label}</div>
  </div>
)

export function WordCounter() {
  const [text, setText] = useState('')
  const stats = useMemo(() => {
    const trimmed = text.trim()
    const words = trimmed ? trimmed.split(/\s+/).length : 0
    const chars = text.length
    const charsNoSpaces = text.replace(/\s/g, '').length
    const sentences = trimmed ? (trimmed.match(/[.!?]+/g) || []).length || 1 : 0
    const paragraphs = trimmed ? trimmed.split(/\n\s*\n/).length : 0
    const lines = text ? text.split('\n').length : 0
    const readingTime = Math.max(1, Math.ceil(words / 200))
    return { words, chars, charsNoSpaces, sentences, paragraphs, lines, readingTime }
  }, [text])
  return (
    <div className="space-y-4">
      <Textarea value={text} onChange={e => setText(e.target.value)} placeholder="Start typing or paste your text here..." rows={10} className="resize-none" />
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <StatCard label="Words" value={stats.words} />
        <StatCard label="Characters" value={stats.chars} />
        <StatCard label="No Spaces" value={stats.charsNoSpaces} />
        <StatCard label="Sentences" value={stats.sentences} />
        <StatCard label="Paragraphs" value={stats.paragraphs} />
        <StatCard label="Reading min" value={stats.readingTime} />
      </div>
      <Button variant="outline" onClick={() => setText('')}><RotateCcw className="h-4 w-4 mr-2" /> Clear</Button>
    </div>
  )
}

const toTitle = (s) => s.replace(/\w\S*/g, w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
const toSentence = (s) => s.toLowerCase().replace(/(^\s*\w|[.!?]\s+\w)/g, c => c.toUpperCase())
const toAlternating = (s) => s.split('').map((c, i) => i % 2 ? c.toUpperCase() : c.toLowerCase()).join('')

export function CaseConverter() {
  const [text, setText] = useState('')
  const cases = [
    { label: 'UPPERCASE', fn: s => s.toUpperCase() },
    { label: 'lowercase', fn: s => s.toLowerCase() },
    { label: 'Title Case', fn: toTitle },
    { label: 'Sentence case', fn: toSentence },
    { label: 'aLtErNaTiNg', fn: toAlternating },
    { label: 'InVeRsE', fn: s => s.split('').map(c => c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()).join('') },
  ]
  return (
    <div className="space-y-4">
      <Textarea value={text} onChange={e => setText(e.target.value)} placeholder="Type or paste your text..." rows={8} />
      <div className="flex flex-wrap gap-2">
        {cases.map(c => (
          <Button key={c.label} variant="secondary" onClick={() => setText(c.fn(text))}>{c.label}</Button>
        ))}
        <Button variant="outline" onClick={() => copy(text)}><Copy className="h-4 w-4 mr-2" /> Copy</Button>
        <Button variant="outline" onClick={() => setText('')}>Clear</Button>
      </div>
    </div>
  )
}

function diffLines(a, b) {
  const al = a.split('\n'), bl = b.split('\n')
  const max = Math.max(al.length, bl.length)
  const rows = []
  for (let i = 0; i < max; i++) {
    const A = al[i] ?? '', B = bl[i] ?? ''
    rows.push({ i: i + 1, a: A, b: B, same: A === B })
  }
  return rows
}

export function TextCompare() {
  const [a, setA] = useState('')
  const [b, setB] = useState('')
  const rows = useMemo(() => diffLines(a, b), [a, b])
  const diffCount = rows.filter(r => !r.same).length
  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium mb-1.5 block">Original Text</label>
          <Textarea value={a} onChange={e => setA(e.target.value)} rows={8} />
        </div>
        <div>
          <label className="text-sm font-medium mb-1.5 block">Compared Text</label>
          <Textarea value={b} onChange={e => setB(e.target.value)} rows={8} />
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className="text-sm">{diffCount === 0 && (a || b) ? <span className="text-emerald-600 font-medium">✓ Texts are identical</span> : <span className="text-amber-600 font-medium">{diffCount} different line(s)</span>}</div>
        <Button variant="outline" onClick={() => { setA(''); setB('') }}>Clear</Button>
      </div>
      <div className="rounded-xl border bg-card overflow-hidden">
        <div className="grid grid-cols-2 text-xs font-mono">
          {rows.map(r => (
            <div key={r.i} className="contents">
              <div className={`px-4 py-1.5 border-r border-b ${r.same ? '' : 'bg-red-50 dark:bg-red-950/30'}`}>{r.a || <span className="text-muted-foreground">—</span>}</div>
              <div className={`px-4 py-1.5 border-b ${r.same ? '' : 'bg-emerald-50 dark:bg-emerald-950/30'}`}>{r.b || <span className="text-muted-foreground">—</span>}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function JsonFormatter() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const format = (indent) => {
    try {
      const parsed = JSON.parse(input)
      setOutput(JSON.stringify(parsed, null, indent))
      setError('')
    } catch (e) { setError(e.message); setOutput('') }
  }
  const minify = () => {
    try {
      const parsed = JSON.parse(input)
      setOutput(JSON.stringify(parsed))
      setError('')
    } catch (e) { setError(e.message); setOutput('') }
  }
  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium mb-1.5 block">Input JSON</label>
          <Textarea value={input} onChange={e => setInput(e.target.value)} rows={12} className="font-mono text-sm" placeholder='{"hello": "world"}' />
        </div>
        <div>
          <label className="text-sm font-medium mb-1.5 block">Output</label>
          <Textarea readOnly value={output} rows={12} className="font-mono text-sm bg-muted/30" />
        </div>
      </div>
      {error && <div className="rounded-lg bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-300 px-4 py-2 text-sm">Error: {error}</div>}
      <div className="flex flex-wrap gap-2">
        <Button onClick={() => format(2)}>Beautify (2 spaces)</Button>
        <Button variant="secondary" onClick={() => format(4)}>Beautify (4 spaces)</Button>
        <Button variant="secondary" onClick={minify}>Minify</Button>
        <Button variant="outline" onClick={() => copy(output)}><Copy className="h-4 w-4 mr-2" /> Copy</Button>
        <Button variant="outline" onClick={() => { setInput(''); setOutput(''); setError('') }}>Clear</Button>
      </div>
    </div>
  )
}

export function Base64Tool() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const encode = () => {
    try { setOutput(btoa(unescape(encodeURIComponent(input)))); setError('') } catch (e) { setError(e.message) }
  }
  const decode = () => {
    try { setOutput(decodeURIComponent(escape(atob(input)))); setError('') } catch (e) { setError('Invalid Base64 string') }
  }
  return (
    <Tabs defaultValue="encode" className="space-y-4">
      <TabsList>
        <TabsTrigger value="encode">Encode</TabsTrigger>
        <TabsTrigger value="decode">Decode</TabsTrigger>
      </TabsList>
      <TabsContent value="encode" className="space-y-3">
        <Textarea value={input} onChange={e => setInput(e.target.value)} rows={5} placeholder="Type text to encode..." />
        <Button onClick={encode}>Encode to Base64</Button>
        {output && <Textarea readOnly value={output} rows={5} className="font-mono text-sm bg-muted/30" />}
        {output && <Button variant="outline" onClick={() => copy(output)}><Copy className="h-4 w-4 mr-2" /> Copy</Button>}
      </TabsContent>
      <TabsContent value="decode" className="space-y-3">
        <Textarea value={input} onChange={e => setInput(e.target.value)} rows={5} placeholder="Paste Base64 string..." className="font-mono text-sm" />
        <Button onClick={decode}>Decode from Base64</Button>
        {error && <div className="text-sm text-red-600">{error}</div>}
        {output && <Textarea readOnly value={output} rows={5} className="bg-muted/30" />}
        {output && <Button variant="outline" onClick={() => copy(output)}><Copy className="h-4 w-4 mr-2" /> Copy</Button>}
      </TabsContent>
    </Tabs>
  )
}
