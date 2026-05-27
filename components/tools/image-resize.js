'use client'
import { useState, useEffect } from 'react'
import FileDropzone from './file-dropzone'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Download, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

export default function ImageResize() {
  const [files, setFiles] = useState([])
  const [width, setWidth] = useState(800)
  const [height, setHeight] = useState(600)
  const [keepRatio, setKeepRatio] = useState(true)
  const [original, setOriginal] = useState({ w: 0, h: 0 })
  const [preview, setPreview] = useState('')
  const [processed, setProcessed] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (!files[0]) { setPreview(''); setProcessed(''); return }
    const url = URL.createObjectURL(files[0])
    setPreview(url)
    const img = new Image()
    img.onload = () => {
      setOriginal({ w: img.width, h: img.height })
      setWidth(img.width); setHeight(img.height)
    }
    img.src = url
    return () => URL.revokeObjectURL(url)
  }, [files])

  const onWidth = (v) => {
    setWidth(v)
    if (keepRatio && original.w) setHeight(Math.round((v / original.w) * original.h))
  }
  const onHeight = (v) => {
    setHeight(v)
    if (keepRatio && original.h) setWidth(Math.round((v / original.h) * original.w))
  }

  const resize = async () => {
    if (!files[0]) return
    setBusy(true)
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = width; canvas.height = height
      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0, width, height)
      canvas.toBlob(blob => {
        setProcessed(URL.createObjectURL(blob))
        setBusy(false)
        toast.success('Image resized!')
      }, files[0].type, 0.92)
    }
    img.src = URL.createObjectURL(files[0])
  }

  return (
    <div className="space-y-6">
      <FileDropzone accept="image/*" files={files} onFiles={setFiles} label="Drop image here or click to upload" />
      {files[0] && (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">Original: {original.w} × {original.h}px</div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Width (px)</Label><Input type="number" value={width} onChange={e => onWidth(Number(e.target.value))} className="mt-2" /></div>
              <div><Label>Height (px)</Label><Input type="number" value={height} onChange={e => onHeight(Number(e.target.value))} className="mt-2" /></div>
            </div>
            <label className="flex items-center gap-2 cursor-pointer"><Checkbox checked={keepRatio} onCheckedChange={setKeepRatio} /> Maintain aspect ratio</label>
            <Button onClick={resize} disabled={busy} className="w-full">{busy ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Resizing...</> : 'Resize Image'}</Button>
            {processed && (
              <Button asChild variant="secondary" className="w-full">
                <a href={processed} download={`resized-${files[0].name}`}><Download className="h-4 w-4 mr-2" /> Download</a>
              </Button>
            )}
          </div>
          <div className="rounded-xl border bg-muted/30 p-3 flex items-center justify-center">
            <img src={processed || preview} alt="preview" className="max-w-full max-h-80 rounded" />
          </div>
        </div>
      )}
    </div>
  )
}
