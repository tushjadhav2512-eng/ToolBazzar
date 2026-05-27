'use client'
import { useState, useEffect } from 'react'
import { PDFDocument } from 'pdf-lib'
import FileDropzone from './file-dropzone'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Download, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

export default function PdfSplit() {
  const [files, setFiles] = useState([])
  const [pageCount, setPageCount] = useState(0)
  const [mode, setMode] = useState('all')
  const [range, setRange] = useState('1-3')
  const [busy, setBusy] = useState(false)
  const [outputs, setOutputs] = useState([])

  useEffect(() => {
    setOutputs([])
    if (!files[0]) { setPageCount(0); return }
    files[0].arrayBuffer().then(buf => PDFDocument.load(buf, { ignoreEncryption: true })).then(p => setPageCount(p.getPageCount()))
  }, [files])

  const parseRanges = () => {
    const parts = range.split(',').map(s => s.trim()).filter(Boolean)
    const out = []
    for (const p of parts) {
      if (p.includes('-')) {
        const [a, b] = p.split('-').map(n => parseInt(n))
        if (a && b) for (let i = a; i <= b; i++) out.push(i - 1)
      } else { const n = parseInt(p); if (n) out.push(n - 1) }
    }
    return out.filter(i => i >= 0 && i < pageCount)
  }

  const split = async () => {
    if (!files[0]) return
    setBusy(true); setOutputs([])
    try {
      const bytes = await files[0].arrayBuffer()
      const src = await PDFDocument.load(bytes, { ignoreEncryption: true })
      const out = []
      if (mode === 'all') {
        for (let i = 0; i < pageCount; i++) {
          const doc = await PDFDocument.create()
          const [page] = await doc.copyPages(src, [i])
          doc.addPage(page)
          const b = await doc.save()
          out.push({ name: `page-${i + 1}.pdf`, url: URL.createObjectURL(new Blob([b], { type: 'application/pdf' })) })
        }
      } else {
        const indices = parseRanges()
        const doc = await PDFDocument.create()
        const pages = await doc.copyPages(src, indices)
        pages.forEach(p => doc.addPage(p))
        const b = await doc.save()
        out.push({ name: 'extracted.pdf', url: URL.createObjectURL(new Blob([b], { type: 'application/pdf' })) })
      }
      setOutputs(out)
      toast.success('Done!')
    } catch (e) { toast.error('Split failed: ' + e.message) }
    setBusy(false)
  }

  return (
    <div className="space-y-6">
      <FileDropzone accept="application/pdf" files={files} onFiles={setFiles} label="Drop a PDF file here" />
      {pageCount > 0 && (
        <>
          <div className="text-sm">PDF has <strong>{pageCount}</strong> page(s)</div>
          <RadioGroup value={mode} onValueChange={setMode} className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer p-3 rounded-lg border"><RadioGroupItem value="all" /> Extract all pages (one PDF per page)</label>
            <label className="flex items-center gap-2 cursor-pointer p-3 rounded-lg border"><RadioGroupItem value="range" /> Extract custom range</label>
          </RadioGroup>
          {mode === 'range' && (
            <div>
              <Label>Page ranges (e.g. 1-3, 5, 7-9)</Label>
              <Input value={range} onChange={e => setRange(e.target.value)} className="mt-2" />
            </div>
          )}
          <Button onClick={split} disabled={busy}>{busy ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Splitting...</> : 'Split PDF'}</Button>
        </>
      )}
      {outputs.length > 0 && (
        <div className="space-y-2">
          {outputs.map((o, i) => (
            <div key={i} className="flex items-center justify-between rounded-xl border bg-card p-3">
              <span className="text-sm font-medium">{o.name}</span>
              <Button asChild size="sm" variant="outline"><a href={o.url} download={o.name}><Download className="h-4 w-4 mr-1" /> Download</a></Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
