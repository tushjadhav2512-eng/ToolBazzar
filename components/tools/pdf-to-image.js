'use client'
import { useState } from 'react'
import FileDropzone from './file-dropzone'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Download, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

export default function PdfToImage() {
  const [files, setFiles] = useState([])
  const [busy, setBusy] = useState(false)
  const [pages, setPages] = useState([])
  const [progress, setProgress] = useState(0)
  const [format, setFormat] = useState('png')
  const [scale, setScale] = useState('2')

  const convert = async () => {
    if (!files[0]) return
    setBusy(true); setPages([]); setProgress(0)
    try {
      const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs')
      pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs'
      const buf = await files[0].arrayBuffer()
      const pdf = await pdfjs.getDocument({
        data: buf,
        cMapUrl: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@4.7.76/cmaps/',
        cMapPacked: true,
      }).promise
      const out = []
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i)
        const viewport = page.getViewport({ scale: Number(scale) || 2 })
        const canvas = document.createElement('canvas')
        canvas.width = viewport.width; canvas.height = viewport.height
        const ctx = canvas.getContext('2d')
        await page.render({ canvasContext: ctx, viewport }).promise
        const mime = format === 'jpg' ? 'image/jpeg' : 'image/png'
        const url = canvas.toDataURL(mime, 0.92)
        out.push({ page: i, url, ext: format === 'jpg' ? 'jpg' : 'png' })
        setProgress(Math.round((i / pdf.numPages) * 100))
      }
      setPages(out)
      toast.success(`Converted ${out.length} page(s)`)
    } catch (e) {
      console.error(e)
      toast.error('Failed: ' + e.message)
    }
    setBusy(false)
  }

  const downloadAll = async () => {
    for (const p of pages) {
      const a = document.createElement('a')
      a.href = p.url; a.download = `page-${p.page}.${p.ext}`; a.click()
      await new Promise(r => setTimeout(r, 150))
    }
  }

  return (
    <div className="space-y-6">
      <FileDropzone accept="application/pdf" files={files} onFiles={setFiles} label="Drop a PDF file here" />
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Image format</Label>
          <Select value={format} onValueChange={setFormat}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="png">PNG</SelectItem>
              <SelectItem value="jpg">JPG</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Output quality</Label>
          <Select value={scale} onValueChange={setScale}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="1.5">Standard</SelectItem>
              <SelectItem value="2">High</SelectItem>
              <SelectItem value="3">Extra high</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      {files[0] && <Button onClick={convert} disabled={busy} size="lg">{busy ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Converting... {progress}%</> : 'Convert to Images'}</Button>}
      {pages.length > 0 && (
        <>
          <Button onClick={downloadAll} variant="secondary"><Download className="h-4 w-4 mr-2" /> Download All</Button>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {pages.map(p => (
              <div key={p.page} className="rounded-xl border bg-card overflow-hidden">
                <img src={p.url} alt={`Page ${p.page}`} className="w-full" />
                <div className="p-2 flex items-center justify-between">
                  <span className="text-xs font-medium">Page {p.page}</span>
                  <a href={p.url} download={`page-${p.page}.${p.ext}`} className="text-xs text-primary hover:underline">Download</a>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
