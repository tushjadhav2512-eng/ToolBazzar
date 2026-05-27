'use client'
import { useState } from 'react'
import FileDropzone from './file-dropzone'
import { Button } from '@/components/ui/button'
import { Download, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

function createConverter(targetType, ext) {
  return function Converter() {
    const [files, setFiles] = useState([])
    const [results, setResults] = useState([])
    const [busy, setBusy] = useState(false)

    const convert = async () => {
      if (!files.length) return
      setBusy(true); setResults([])
      const out = []
      for (const file of files) {
        const url = URL.createObjectURL(file)
        const img = new Image()
        await new Promise((res) => {
          img.onload = () => {
            const canvas = document.createElement('canvas')
            canvas.width = img.width; canvas.height = img.height
            const ctx = canvas.getContext('2d')
            if (targetType === 'image/jpeg') { ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, canvas.width, canvas.height) }
            ctx.drawImage(img, 0, 0)
            canvas.toBlob(blob => {
              const name = file.name.replace(/\.[^.]+$/, '') + '.' + ext
              out.push({ name, url: URL.createObjectURL(blob), size: blob.size })
              URL.revokeObjectURL(url)
              res()
            }, targetType, 0.92)
          }
          img.src = url
        })
      }
      setResults(out); setBusy(false)
      toast.success(`Converted ${out.length} image(s)`)
    }

    const acceptType = targetType === 'image/png' ? 'image/jpeg,image/jpg' : 'image/png'
    const label = targetType === 'image/png' ? 'Drop JPG images here' : 'Drop PNG images here'

    return (
      <div className="space-y-6">
        <FileDropzone accept={acceptType} multiple files={files} onFiles={setFiles} label={label} />
        {files.length > 0 && (
          <Button onClick={convert} disabled={busy} size="lg">{busy ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Converting...</> : `Convert ${files.length} image(s)`}</Button>
        )}
        {results.length > 0 && (
          <div className="space-y-2">
            {results.map((r, i) => (
              <div key={i} className="flex items-center gap-4 rounded-xl border bg-card p-4">
                <img src={r.url} alt="" className="h-14 w-14 rounded object-cover" />
                <div className="flex-1"><div className="font-medium text-sm truncate">{r.name}</div><div className="text-xs text-muted-foreground">{(r.size / 1024).toFixed(0)} KB</div></div>
                <Button asChild variant="outline" size="sm"><a href={r.url} download={r.name}><Download className="h-4 w-4" /></a></Button>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }
}

export const JpgToPng = createConverter('image/png', 'png')
export const PngToJpg = createConverter('image/jpeg', 'jpg')
