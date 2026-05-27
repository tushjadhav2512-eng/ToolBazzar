'use client'
import { useState } from 'react'
import imageCompression from 'browser-image-compression'
import FileDropzone from './file-dropzone'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Download, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

export default function ImageCompress() {
  const [files, setFiles] = useState([])
  const [quality, setQuality] = useState(0.7)
  const [maxSize, setMaxSize] = useState(1)
  const [results, setResults] = useState([])
  const [busy, setBusy] = useState(false)

  const compress = async () => {
    if (!files.length) return
    setBusy(true); setResults([])
    const out = []
    for (const file of files) {
      try {
        const compressed = await imageCompression(file, {
          maxSizeMB: maxSize,
          initialQuality: quality,
          useWebWorker: true,
          maxWidthOrHeight: 2400
        })
        out.push({
          original: file,
          compressed,
          originalSize: file.size,
          compressedSize: compressed.size,
          url: URL.createObjectURL(compressed)
        })
      } catch (e) { toast.error(`Failed: ${file.name}`) }
    }
    setResults(out)
    setBusy(false)
    toast.success(`Compressed ${out.length} image(s)`)
  }

  return (
    <div className="space-y-6">
      <FileDropzone accept="image/*" multiple files={files} onFiles={setFiles} label="Drop images here (multiple allowed)" />
      {files.length > 0 && (
        <div className="grid md:grid-cols-2 gap-3">
          <div>
            <Label>Quality: {Math.round(quality * 100)}%</Label>
            <Input type="range" min={0.1} max={1} step={0.05} value={quality} onChange={e => setQuality(Number(e.target.value))} className="mt-2" />
          </div>
          <div>
            <Label>Max Size: {maxSize} MB</Label>
            <Input type="range" min={0.1} max={10} step={0.1} value={maxSize} onChange={e => setMaxSize(Number(e.target.value))} className="mt-2" />
          </div>
        </div>
      )}
      {files.length > 0 && (
        <Button onClick={compress} disabled={busy} size="lg" className="w-full md:w-auto">
          {busy ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Compressing...</> : `Compress ${files.length} image(s)`}
        </Button>
      )}
      {results.length > 0 && (
        <div className="space-y-2">
          {results.map((r, i) => {
            const saving = ((1 - r.compressedSize / r.originalSize) * 100).toFixed(1)
            return (
              <div key={i} className="flex items-center gap-4 rounded-xl border bg-card p-4">
                <img src={r.url} alt="" className="h-14 w-14 rounded object-cover" />
                <div className="flex-1">
                  <div className="font-medium text-sm truncate">{r.original.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {(r.originalSize / 1024).toFixed(0)} KB → {(r.compressedSize / 1024).toFixed(0)} KB
                    <span className="ml-2 font-semibold text-emerald-600">−{saving}%</span>
                  </div>
                </div>
                <Button asChild variant="outline" size="sm"><a href={r.url} download={`compressed-${r.original.name}`}><Download className="h-4 w-4" /></a></Button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
