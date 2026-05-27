'use client'
import { useState } from 'react'
import { PDFDocument } from 'pdf-lib'
import FileDropzone from './file-dropzone'
import { Button } from '@/components/ui/button'
import { Download, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

export default function PdfCompress() {
  const [files, setFiles] = useState([])
  const [busy, setBusy] = useState(false)
  const [output, setOutput] = useState(null)

  const compress = async () => {
    if (!files[0]) return
    setBusy(true); setOutput(null)
    try {
      const bytes = await files[0].arrayBuffer()
      const pdf = await PDFDocument.load(bytes, { ignoreEncryption: true, updateMetadata: false })
      // Strip metadata, remove unused objects via re-save with object streams
      pdf.setTitle(''); pdf.setAuthor(''); pdf.setSubject('')
      pdf.setKeywords([]); pdf.setProducer(''); pdf.setCreator('')
      const out = await pdf.save({ useObjectStreams: true, addDefaultPage: false })
      const blob = new Blob([out], { type: 'application/pdf' })
      setOutput({ url: URL.createObjectURL(blob), size: blob.size, original: files[0].size })
      toast.success('PDF optimized!')
    } catch (e) { toast.error('Failed: ' + e.message) }
    setBusy(false)
  }

  return (
    <div className="space-y-6">
      <FileDropzone accept="application/pdf" files={files} onFiles={setFiles} label="Drop a PDF file here" />
      {files[0] && <Button onClick={compress} disabled={busy} size="lg">{busy ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Compressing...</> : 'Compress PDF'}</Button>}
      {output && (
        <div className="rounded-xl border bg-card p-5 space-y-3">
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-lg bg-muted/40 p-3 text-center"><div className="text-xs text-muted-foreground">Original</div><div className="font-bold mt-1">{(output.original / 1024).toFixed(0)} KB</div></div>
            <div className="rounded-lg bg-muted/40 p-3 text-center"><div className="text-xs text-muted-foreground">Compressed</div><div className="font-bold mt-1">{(output.size / 1024).toFixed(0)} KB</div></div>
            <div className="rounded-lg bg-emerald-50 dark:bg-emerald-950/30 p-3 text-center"><div className="text-xs text-muted-foreground">Saved</div><div className="font-bold mt-1 text-emerald-600">{Math.max(0, ((1 - output.size / output.original) * 100)).toFixed(1)}%</div></div>
          </div>
          <Button asChild className="w-full"><a href={output.url} download="compressed.pdf"><Download className="h-4 w-4 mr-2" /> Download Compressed PDF</a></Button>
          <p className="text-xs text-muted-foreground">Note: PDF compression depends on content. Text-heavy PDFs see less reduction than image-heavy ones.</p>
        </div>
      )}
    </div>
  )
}
