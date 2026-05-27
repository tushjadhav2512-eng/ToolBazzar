'use client'
import { useState } from 'react'
import { PDFDocument } from 'pdf-lib'
import FileDropzone from './file-dropzone'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Download, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

const PAGE_SIZES = { A4: [595, 842], Letter: [612, 792], Legal: [612, 1008] }

export default function JpgToPdf() {
  const [files, setFiles] = useState([])
  const [size, setSize] = useState('A4')
  const [orient, setOrient] = useState('portrait')
  const [busy, setBusy] = useState(false)
  const [output, setOutput] = useState('')

  const convert = async () => {
    if (!files.length) return
    setBusy(true)
    try {
      const doc = await PDFDocument.create()
      let [pw, ph] = PAGE_SIZES[size]
      if (orient === 'landscape') [pw, ph] = [ph, pw]
      for (const f of files) {
        const bytes = new Uint8Array(await f.arrayBuffer())
        let img
        if (f.type.includes('png')) img = await doc.embedPng(bytes)
        else img = await doc.embedJpg(bytes)
        const page = doc.addPage([pw, ph])
        const scale = Math.min(pw / img.width, ph / img.height) * 0.95
        const w = img.width * scale, h = img.height * scale
        page.drawImage(img, { x: (pw - w) / 2, y: (ph - h) / 2, width: w, height: h })
      }
      const bytes = await doc.save()
      setOutput(URL.createObjectURL(new Blob([bytes], { type: 'application/pdf' })))
      toast.success('PDF created!')
    } catch (e) { toast.error('Failed: ' + e.message) }
    setBusy(false)
  }

  return (
    <div className="space-y-6">
      <FileDropzone accept="image/jpeg,image/png" multiple files={files} onFiles={setFiles} label="Drop images here (JPG/PNG)" />
      {files.length > 0 && (
        <>
          <div className="grid grid-cols-2 gap-3 max-w-md">
            <div>
              <Label>Page Size</Label>
              <Select value={size} onValueChange={setSize}><SelectTrigger className="mt-2"><SelectValue /></SelectTrigger><SelectContent>{Object.keys(PAGE_SIZES).map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select>
            </div>
            <div>
              <Label>Orientation</Label>
              <Select value={orient} onValueChange={setOrient}><SelectTrigger className="mt-2"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="portrait">Portrait</SelectItem><SelectItem value="landscape">Landscape</SelectItem></SelectContent></Select>
            </div>
          </div>
          <Button onClick={convert} disabled={busy} size="lg">{busy ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Converting...</> : `Convert to PDF`}</Button>
        </>
      )}
      {output && <Button asChild variant="secondary" size="lg"><a href={output} download="images.pdf"><Download className="h-4 w-4 mr-2" /> Download PDF</a></Button>}
    </div>
  )
}
