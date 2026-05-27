'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Shuffle, Trophy } from 'lucide-react'

export default function RandomNamePicker() {
  const [names, setNames] = useState('Alice\nBob\nCharlie\nDiana\nEva\nFrank')
  const [picked, setPicked] = useState('')
  const [history, setHistory] = useState([])
  const [spinning, setSpinning] = useState(false)

  const pick = () => {
    const list = names.split('\n').map(n => n.trim()).filter(Boolean)
    if (!list.length) return
    setSpinning(true)
    let i = 0
    const interval = setInterval(() => {
      setPicked(list[Math.floor(Math.random() * list.length)])
      i++
      if (i > 15) {
        clearInterval(interval)
        const final = list[Math.floor(Math.random() * list.length)]
        setPicked(final)
        setHistory(prev => [final, ...prev].slice(0, 5))
        setSpinning(false)
      }
    }, 80)
  }

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div className="space-y-3">
        <label className="text-sm font-medium">Names (one per line)</label>
        <Textarea value={names} onChange={e => setNames(e.target.value)} rows={10} placeholder="Enter names, one per line" />
        <Button onClick={pick} disabled={spinning} className="w-full" size="lg">
          <Shuffle className="h-4 w-4 mr-2" /> {spinning ? 'Picking...' : 'Pick Random Name'}
        </Button>
      </div>
      <div className="space-y-4">
        <div className="rounded-2xl bg-gradient-to-br from-amber-400 to-pink-500 p-8 text-white text-center min-h-[200px] flex flex-col items-center justify-center">
          <Trophy className="h-10 w-10 mb-3 opacity-90" />
          <div className="text-sm opacity-90">Winner</div>
          <div className="text-4xl font-bold mt-2">{picked || '?'}</div>
        </div>
        {history.length > 0 && (
          <div className="rounded-xl border p-4">
            <div className="text-xs text-muted-foreground mb-2">Recent picks</div>
            <div className="flex flex-wrap gap-2">
              {history.map((h, i) => <span key={i} className="rounded-full bg-muted px-3 py-1 text-xs font-medium">{h}</span>)}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
