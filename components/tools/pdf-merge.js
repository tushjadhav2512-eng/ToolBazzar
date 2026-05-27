'use client'
import { useState } from 'react'
import { PDFDocument } from 'pdf-lib'
import FileDropzone from './file-dropzone'
import { Button } from '@/components/ui/button'
import { Download, Loader2, ArrowUp, ArrowDown } from 'lucide-react'
import { toast } from 'sonner'

export default function PdfMerge() {
  const [files, setFiles] = useState([])
  const [busy, setBusy] = useState(false)
  const [output, setOutput] = useState('')

  const move = (i, dir) => {
    const next = [...files]
    const target = i + dir
    if (target < 0 || target >= next.length) return
    ;[next[i], next[target]] = [next[target], next[i]]
    setFiles(next)
  }

  const merge = async () => {
    if (files.length < 2) { toast.error('Add at least 2 PDFs'); return }
    setBusy(true)
    try {
      const merged = await PDFDocument.create()
      for (const f of files) {
        const bytes = await f.arrayBuffer()
        const pdf = await PDFDocument.load(bytes, { ignoreEncryption: true })
        const pages = await merged.copyPages(pdf, pdf.getPageIndices())
        pages.forEach(p => merged.addPage(p))
      }
      const out = await merged.save()
      const blob = new Blob([out], { type: 'application/pdf' })
      setOutput(URL.createObjectURL(blob))
      toast.success('PDFs merged successfully!')
    } catch (e) { toast.error('Merge failed: ' + e.message) }
    setBusy(false)
  }

  return (
    <div className="space-y-6">
      <FileDropzone accept="application/pdf" multiple files={[]} onFiles={(f) => setFiles([...files, ...f])} label="Drop PDF files here (multiple)" />
      {files.length > 0 && (
        <div className="space-y-2">
          <div className="text-sm font-medium">Order ({files.length} files)</div>
          {files.map((f, i) => (
            <div key={i} className="flex items-center gap-3 rounded-xl border bg-card p-3">
              <span className="font-mono text-sm text-muted-foreground w-6">{i + 1}</span>
              <div className="flex-1 min-w-0"><div className="text-sm font-medium truncate">{f.name}</div></div>
              <Button size="icon" variant="ghost" onClick={() => move(i, -1)} disabled={i === 0}><ArrowUp className="h-4 w-4" /></Button>
              <Button size="icon" variant="ghost" onClick={() => move(i, 1)} disabled={i === files.length - 1}><ArrowDown className="h-4 w-4" /></Button>
              <Button size="icon" variant="ghost" onClick={() => setFiles(files.filter((_, j) => j !== i))}>×</Button>
            </div>
          ))}
        </div>
      )}
      <div className="flex gap-3">
        <Button onClick={merge} disabled={busy || files.length < 2} size="lg">{busy ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Merging...</> : 'Merge PDFs'}</Button>
        {output && <Button asChild variant="secondary" size="lg"><a href={output} download="merged.pdf"><Download className="h-4 w-4 mr-2" /> Download Merged PDF</a></Button>}
      </div>
    </div>
  )
}
