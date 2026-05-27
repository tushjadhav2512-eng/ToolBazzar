'use client'
import dynamic from 'next/dynamic'
import { Loader2 } from 'lucide-react'

const Loader = () => (
  <div className="flex items-center justify-center py-16">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
  </div>
)

const toolMap = {
  'pdf-merge': dynamic(() => import('./pdf-merge'), { ssr: false, loading: Loader }),
  'pdf-split': dynamic(() => import('./pdf-split'), { ssr: false, loading: Loader }),
  'pdf-compress': dynamic(() => import('./pdf-compress'), { ssr: false, loading: Loader }),
  'jpg-to-pdf': dynamic(() => import('./jpg-to-pdf'), { ssr: false, loading: Loader }),
  'png-to-pdf': dynamic(() => import('./jpg-to-pdf'), { ssr: false, loading: Loader }),
  'pdf-to-image': dynamic(() => import('./pdf-to-image'), { ssr: false, loading: Loader }),
  'image-resize': dynamic(() => import('./image-resize'), { ssr: false, loading: Loader }),
  'image-compress': dynamic(() => import('./image-compress'), { ssr: false, loading: Loader }),
  'jpg-to-png': dynamic(() => import('./image-convert').then(m => ({ default: m.JpgToPng })), { ssr: false, loading: Loader }),
  'png-to-jpg': dynamic(() => import('./image-convert').then(m => ({ default: m.PngToJpg })), { ssr: false, loading: Loader }),
  'qr-code-generator': dynamic(() => import('./qr-generator'), { ssr: false, loading: Loader }),
  'barcode-generator': dynamic(() => import('./barcode-generator'), { ssr: false, loading: Loader }),
  'password-generator': dynamic(() => import('./password-generator'), { ssr: false, loading: Loader }),
  'random-name-picker': dynamic(() => import('./random-name-picker'), { ssr: false, loading: Loader }),
  'word-counter': dynamic(() => import('./text-tools').then(m => ({ default: m.WordCounter })), { ssr: false, loading: Loader }),
  'case-converter': dynamic(() => import('./text-tools').then(m => ({ default: m.CaseConverter })), { ssr: false, loading: Loader }),
  'text-compare': dynamic(() => import('./text-tools').then(m => ({ default: m.TextCompare })), { ssr: false, loading: Loader }),
  'json-formatter': dynamic(() => import('./text-tools').then(m => ({ default: m.JsonFormatter })), { ssr: false, loading: Loader }),
  'base64': dynamic(() => import('./text-tools').then(m => ({ default: m.Base64Tool })), { ssr: false, loading: Loader }),
  'emi-calculator': dynamic(() => import('./calc-tools').then(m => ({ default: m.EMICalculator })), { ssr: false, loading: Loader }),
  'sip-calculator': dynamic(() => import('./calc-tools').then(m => ({ default: m.SIPCalculator })), { ssr: false, loading: Loader }),
  'loan-calculator': dynamic(() => import('./calc-tools').then(m => ({ default: m.LoanCalculator })), { ssr: false, loading: Loader }),
  'gst-calculator': dynamic(() => import('./calc-tools').then(m => ({ default: m.GSTCalculator })), { ssr: false, loading: Loader }),
  'age-calculator': dynamic(() => import('./calc-tools').then(m => ({ default: m.AgeCalculator })), { ssr: false, loading: Loader }),
  'percentage-calculator': dynamic(() => import('./calc-tools').then(m => ({ default: m.PercentageCalculator })), { ssr: false, loading: Loader }),
  'bmi-calculator': dynamic(() => import('./calc-tools').then(m => ({ default: m.BMICalculator })), { ssr: false, loading: Loader }),
  'fuel-cost-calculator': dynamic(() => import('./calc-tools').then(m => ({ default: m.FuelCostCalculator })), { ssr: false, loading: Loader }),
  'salary-hike-calculator': dynamic(() => import('./calc-tools').then(m => ({ default: m.SalaryHikeCalculator })), { ssr: false, loading: Loader }),
  'overtime-calculator': dynamic(() => import('./calc-tools').then(m => ({ default: m.OvertimeCalculator })), { ssr: false, loading: Loader }),
  'sheet-metal-calculator': dynamic(() => import('./calc-tools').then(m => ({ default: m.SheetMetalCalculator })), { ssr: false, loading: Loader }),
}

export default function ToolRenderer({ slug }) {
  const Tool = toolMap[slug]
  if (!Tool) return <div className="text-center py-12 text-muted-foreground">Tool coming soon...</div>
  return <Tool />
}
