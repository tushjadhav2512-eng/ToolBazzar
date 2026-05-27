'use client'
import { useState, useEffect, useRef } from 'react'
import QRCode from 'qrcode'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Download } from 'lucide-react'
import { toast } from 'sonner'

export default function QrGenerator() {
  const [text, setText] = useState('https://toolbazaar.app')
  const [size, setSize] = useState(300)
  const [color, setColor] = useState('#000000')
  const [bg, setBg] = useState('#ffffff')
  const [level, setLevel] = useState('M')
  const [dataUrl, setDataUrl] = useState('')

  useEffect(() => {
    if (!text) { setDataUrl(''); return }
    QRCode.toDataURL(text, { width: size, color: { dark: color, light: bg }, errorCorrectionLevel: level, margin: 2 })
      .then(setDataUrl).catch(() => setDataUrl(''))
  }, [text, size, color, bg, level])

  const download = (type) => {
    if (!dataUrl) return
    if (type === 'svg') {
      QRCode.toString(text, { type: 'svg', color: { dark: color, light: bg }, errorCorrectionLevel: level, margin: 2 })
        .then(svg => {
          const blob = new Blob([svg], { type: 'image/svg+xml' })
          const url = URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url; a.download = 'qrcode.svg'; a.click()
          URL.revokeObjectURL(url)
        })
    } else {
      const a = document.createElement('a')
      a.href = dataUrl; a.download = 'qrcode.png'; a.click()
    }
    toast.success('Downloaded!')
  }

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div className="space-y-4">
        <div>
          <Label>Text or URL</Label>
          <Textarea value={text} onChange={e => setText(e.target.value)} rows={3} className="mt-2" placeholder="Enter text, URL, or any data..." />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Size: {size}px</Label>
            <Input type="range" min={100} max={800} value={size} onChange={e => setSize(Number(e.target.value))} className="mt-2" />
          </div>
          <div>
            <Label>Error Correction</Label>
            <Select value={level} onValueChange={setLevel}>
              <SelectTrigger className="mt-2"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="L">Low (7%)</SelectItem>
                <SelectItem value="M">Medium (15%)</SelectItem>
                <SelectItem value="Q">Quartile (25%)</SelectItem>
                <SelectItem value="H">High (30%)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Foreground</Label>
            <Input type="color" value={color} onChange={e => setColor(e.target.value)} className="mt-2 h-10" />
          </div>
          <div>
            <Label>Background</Label>
            <Input type="color" value={bg} onChange={e => setBg(e.target.value)} className="mt-2 h-10" />
          </div>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => download('png')} disabled={!dataUrl}><Download className="h-4 w-4 mr-2" /> PNG</Button>
          <Button onClick={() => download('svg')} variant="secondary" disabled={!dataUrl}><Download className="h-4 w-4 mr-2" /> SVG</Button>
        </div>
      </div>
      <div className="flex items-center justify-center rounded-2xl bg-muted/30 border p-6 min-h-[300px]">
        {dataUrl ? <img src={dataUrl} alt="QR" className="max-w-full max-h-96" /> : <p className="text-muted-foreground">Enter text to generate QR code</p>}
      </div>
    </div>
  )
}
