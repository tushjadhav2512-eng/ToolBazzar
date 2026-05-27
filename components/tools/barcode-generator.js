'use client'
import { useState, useEffect, useRef } from 'react'
import JsBarcode from 'jsbarcode'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Download } from 'lucide-react'
import { toast } from 'sonner'

export default function BarcodeGenerator() {
  const [text, setText] = useState('123456789012')
  const [format, setFormat] = useState('CODE128')
  const [width, setWidth] = useState(2)
  const [height, setHeight] = useState(100)
  const [error, setError] = useState('')
  const svgRef = useRef(null)

  useEffect(() => {
    if (!svgRef.current || !text) return
    try {
      JsBarcode(svgRef.current, text, { format, width, height, displayValue: true, fontSize: 16, margin: 10, background: '#ffffff' })
      setError('')
    } catch (e) { setError(e.message || 'Invalid input for selected format') }
  }, [text, format, width, height])

  const download = (type) => {
    if (!svgRef.current || error) return
    if (type === 'svg') {
      const blob = new Blob([svgRef.current.outerHTML], { type: 'image/svg+xml' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a'); a.href = url; a.download = 'barcode.svg'; a.click()
      URL.revokeObjectURL(url)
    } else {
      const svgData = new XMLSerializer().serializeToString(svgRef.current)
      const canvas = document.createElement('canvas')
      const img = new Image()
      img.onload = () => {
        canvas.width = img.width; canvas.height = img.height
        const ctx = canvas.getContext('2d')
        ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.drawImage(img, 0, 0)
        const a = document.createElement('a'); a.href = canvas.toDataURL('image/png'); a.download = 'barcode.png'; a.click()
      }
      img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)))
    }
    toast.success('Downloaded!')
  }

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div className="space-y-4">
        <div>
          <Label>Data</Label>
          <Input value={text} onChange={e => setText(e.target.value)} className="mt-2" />
        </div>
        <div>
          <Label>Format</Label>
          <Select value={format} onValueChange={setFormat}>
            <SelectTrigger className="mt-2"><SelectValue /></SelectTrigger>
            <SelectContent>
              {['CODE128', 'CODE39', 'EAN13', 'EAN8', 'UPC', 'ITF14', 'MSI', 'pharmacode'].map(f => (
                <SelectItem key={f} value={f}>{f}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div><Label>Bar Width: {width}</Label><Input type="range" min={1} max={5} value={width} onChange={e => setWidth(Number(e.target.value))} className="mt-2" /></div>
          <div><Label>Height: {height}</Label><Input type="range" min={40} max={200} value={height} onChange={e => setHeight(Number(e.target.value))} className="mt-2" /></div>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => download('png')} disabled={!!error}><Download className="h-4 w-4 mr-2" /> PNG</Button>
          <Button onClick={() => download('svg')} variant="secondary" disabled={!!error}><Download className="h-4 w-4 mr-2" /> SVG</Button>
        </div>
        {error && <div className="text-sm text-red-600">{error}</div>}
      </div>
      <div className="flex items-center justify-center rounded-2xl bg-white border p-6 min-h-[200px]">
        <svg ref={svgRef} />
      </div>
    </div>
  )
}
