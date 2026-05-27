'use client'
import { useRef, useState } from 'react'
import { Upload, X, File as FileIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

export default function FileDropzone({ accept, multiple = false, files = [], onFiles, label = 'Drop files here or click to browse', maxSize }) {
  const ref = useRef(null)
  const [drag, setDrag] = useState(false)

  const handleFiles = (list) => {
    const arr = Array.from(list)
    onFiles(multiple ? [...files, ...arr] : arr.slice(0, 1))
  }

  const remove = (i) => {
    const next = [...files]
    next.splice(i, 1)
    onFiles(next)
  }

  return (
    <div className="space-y-3">
      <div
        onClick={() => ref.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDrag(true) }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => { e.preventDefault(); setDrag(false); handleFiles(e.dataTransfer.files) }}
        className={cn(
          'flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed p-10 cursor-pointer transition-colors',
          drag ? 'border-primary bg-accent' : 'border-border bg-muted/30 hover:bg-muted/50 hover:border-primary/50'
        )}
      >
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
          <Upload className="h-7 w-7 text-primary" />
        </div>
        <div className="text-center">
          <p className="font-medium">{label}</p>
          <p className="text-xs text-muted-foreground mt-1">{accept ? `Accepted: ${accept}` : 'All file types'}</p>
        </div>
        <input
          ref={ref}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
        />
      </div>
      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((f, i) => (
            <div key={i} className="flex items-center gap-3 rounded-xl border bg-card p-3">
              <FileIcon className="h-5 w-5 text-primary shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{f.name}</p>
                <p className="text-xs text-muted-foreground">{(f.size / 1024).toFixed(1)} KB</p>
              </div>
              <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); remove(i) }}><X className="h-4 w-4" /></Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
