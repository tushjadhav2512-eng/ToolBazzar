'use client'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Copy, RefreshCw } from 'lucide-react'
import { toast } from 'sonner'

const UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const LOWER = 'abcdefghijklmnopqrstuvwxyz'
const NUMBERS = '0123456789'
const SYMBOLS = '!@#$%^&*()_+-=[]{}|;:,.<>?'

export default function PasswordGenerator() {
  const [length, setLength] = useState(16)
  const [upper, setUpper] = useState(true)
  const [lower, setLower] = useState(true)
  const [numbers, setNumbers] = useState(true)
  const [symbols, setSymbols] = useState(true)
  const [password, setPassword] = useState('')

  const generate = () => {
    let charset = ''
    if (upper) charset += UPPER
    if (lower) charset += LOWER
    if (numbers) charset += NUMBERS
    if (symbols) charset += SYMBOLS
    if (!charset) { toast.error('Select at least one character type'); return }
    const arr = new Uint32Array(length)
    crypto.getRandomValues(arr)
    let pwd = ''
    for (let i = 0; i < length; i++) pwd += charset[arr[i] % charset.length]
    setPassword(pwd)
  }

  useEffect(() => { generate() }, [length, upper, lower, numbers, symbols])

  const strength = (() => {
    let s = 0
    if (length >= 8) s++
    if (length >= 12) s++
    if (length >= 16) s++
    if (upper && lower) s++
    if (numbers) s++
    if (symbols) s++
    return Math.min(s, 5)
  })()
  const strengthLabel = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'][strength]
  const strengthColor = ['bg-red-500', 'bg-orange-500', 'bg-amber-500', 'bg-yellow-500', 'bg-emerald-500', 'bg-emerald-600'][strength]

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="rounded-2xl border bg-muted/30 p-5 space-y-3">
        <div className="flex items-center gap-2">
          <Input value={password} readOnly className="font-mono text-lg bg-background" />
          <Button size="icon" variant="outline" onClick={generate}><RefreshCw className="h-4 w-4" /></Button>
          <Button size="icon" variant="outline" onClick={() => { navigator.clipboard.writeText(password); toast.success('Copied!') }}><Copy className="h-4 w-4" /></Button>
        </div>
        <div>
          <div className="flex justify-between text-xs text-muted-foreground mb-1">
            <span>Strength</span><span className="font-medium">{strengthLabel}</span>
          </div>
          <div className="h-2 rounded-full bg-muted overflow-hidden">
            <div className={`h-full ${strengthColor} transition-all`} style={{ width: `${(strength / 5) * 100}%` }} />
          </div>
        </div>
      </div>
      <div className="space-y-4">
        <div>
          <div className="flex justify-between mb-2"><Label>Password Length</Label><span className="text-sm font-semibold">{length}</span></div>
          <Input type="range" min={4} max={64} value={length} onChange={e => setLength(Number(e.target.value))} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <label className="flex items-center gap-2 cursor-pointer p-3 rounded-lg border hover:bg-muted/50"><Checkbox checked={upper} onCheckedChange={setUpper} /> <span className="text-sm">Uppercase (A-Z)</span></label>
          <label className="flex items-center gap-2 cursor-pointer p-3 rounded-lg border hover:bg-muted/50"><Checkbox checked={lower} onCheckedChange={setLower} /> <span className="text-sm">Lowercase (a-z)</span></label>
          <label className="flex items-center gap-2 cursor-pointer p-3 rounded-lg border hover:bg-muted/50"><Checkbox checked={numbers} onCheckedChange={setNumbers} /> <span className="text-sm">Numbers (0-9)</span></label>
          <label className="flex items-center gap-2 cursor-pointer p-3 rounded-lg border hover:bg-muted/50"><Checkbox checked={symbols} onCheckedChange={setSymbols} /> <span className="text-sm">Symbols (!@#$)</span></label>
        </div>
      </div>
    </div>
  )
}
