import {
  FilePlus2, Scissors, FileArchive, FileImage, ImagePlus, Files,
  Image as ImageIcon, Minimize2, RefreshCw, ArrowLeftRight,
  QrCode, Barcode, KeyRound, Shuffle,
  Type, CaseSensitive, GitCompare, Braces, Binary,
  Calculator, TrendingUp, Landmark, Receipt, CalendarDays, Percent, HeartPulse, Fuel, BadgePercent, Clock, Ruler
} from 'lucide-react'

export const categories = [
  { slug: 'pdf', name: 'PDF Tools', description: 'Merge, split, compress and convert PDF files', color: 'from-rose-500 to-red-500', icon: 'FileText' },
  { slug: 'image', name: 'Image Tools', description: 'Resize, compress and convert images instantly', color: 'from-emerald-500 to-green-500', icon: 'Image' },
  { slug: 'text', name: 'Text Tools', description: 'Count, convert, compare and format text', color: 'from-blue-500 to-cyan-500', icon: 'Type' },
  { slug: 'generator', name: 'Generator Tools', description: 'QR codes, barcodes, passwords and more', color: 'from-violet-500 to-purple-500', icon: 'Sparkles' },
  { slug: 'calculator', name: 'Calculator Tools', description: 'EMI, SIP, BMI, GST and finance calculators', color: 'from-amber-500 to-orange-500', icon: 'Calculator' }
]

export const tools = [
  // PDF
  { slug: 'pdf-merge', name: 'PDF Merge', category: 'pdf', icon: FilePlus2, description: 'Combine multiple PDFs into one file', keywords: ['merge pdf', 'combine pdf', 'join pdf'], popular: true },
  { slug: 'pdf-split', name: 'PDF Split', category: 'pdf', icon: Scissors, description: 'Split a PDF into separate pages', keywords: ['split pdf', 'extract pdf pages'] },
  { slug: 'pdf-compress', name: 'PDF Compress', category: 'pdf', icon: FileArchive, description: 'Reduce PDF file size while preserving quality', keywords: ['compress pdf', 'reduce pdf size'], popular: true },
  { slug: 'jpg-to-pdf', name: 'JPG to PDF', category: 'pdf', icon: FileImage, description: 'Convert JPG images to a single PDF', keywords: ['jpg to pdf', 'image to pdf'] },
  { slug: 'png-to-pdf', name: 'PNG to PDF', category: 'pdf', icon: ImagePlus, description: 'Convert PNG images to a single PDF', keywords: ['png to pdf'] },
  { slug: 'pdf-to-image', name: 'PDF to Image', category: 'pdf', icon: Files, description: 'Convert each PDF page to PNG image', keywords: ['pdf to image', 'pdf to png', 'pdf to jpg'] },
  // Image
  { slug: 'image-resize', name: 'Image Resize', category: 'image', icon: ImageIcon, description: 'Resize images to any dimensions', keywords: ['resize image'], popular: true },
  { slug: 'image-compress', name: 'Image Compress', category: 'image', icon: Minimize2, description: 'Compress images without losing quality', keywords: ['compress image', 'optimize image'], popular: true },
  { slug: 'jpg-to-png', name: 'JPG to PNG', category: 'image', icon: RefreshCw, description: 'Convert JPG images to PNG format', keywords: ['jpg to png'] },
  { slug: 'png-to-jpg', name: 'PNG to JPG', category: 'image', icon: ArrowLeftRight, description: 'Convert PNG images to JPG format', keywords: ['png to jpg'] },
  // Generator
  { slug: 'qr-code-generator', name: 'QR Code Generator', category: 'generator', icon: QrCode, description: 'Create custom QR codes for any text or URL', keywords: ['qr code', 'qr generator'], popular: true },
  { slug: 'barcode-generator', name: 'Barcode Generator', category: 'generator', icon: Barcode, description: 'Generate barcodes in multiple formats', keywords: ['barcode generator'] },
  { slug: 'password-generator', name: 'Password Generator', category: 'generator', icon: KeyRound, description: 'Generate strong secure passwords', keywords: ['password generator'], popular: true },
  { slug: 'random-name-picker', name: 'Random Name Picker', category: 'generator', icon: Shuffle, description: 'Pick a random name from a list', keywords: ['name picker', 'random picker'] },
  // Text
  { slug: 'word-counter', name: 'Word Counter', category: 'text', icon: Type, description: 'Count words, characters and sentences', keywords: ['word counter', 'character counter'], popular: true },
  { slug: 'case-converter', name: 'Case Converter', category: 'text', icon: CaseSensitive, description: 'Convert text to upper, lower, title case', keywords: ['case converter'] },
  { slug: 'text-compare', name: 'Text Compare', category: 'text', icon: GitCompare, description: 'Compare two texts and find differences', keywords: ['text diff', 'diff checker'] },
  { slug: 'json-formatter', name: 'JSON Formatter', category: 'text', icon: Braces, description: 'Format, validate and beautify JSON', keywords: ['json formatter', 'json validator'], popular: true },
  { slug: 'base64', name: 'Base64 Encode/Decode', category: 'text', icon: Binary, description: 'Encode or decode Base64 strings', keywords: ['base64'] },
  // Calculators
  { slug: 'emi-calculator', name: 'EMI Calculator', category: 'calculator', icon: Calculator, description: 'Calculate monthly EMI for any loan', keywords: ['emi calculator'], popular: true },
  { slug: 'sip-calculator', name: 'SIP Calculator', category: 'calculator', icon: TrendingUp, description: 'Estimate returns from your SIP investments', keywords: ['sip calculator'], popular: true },
  { slug: 'loan-calculator', name: 'Loan Calculator', category: 'calculator', icon: Landmark, description: 'Calculate loan payments and interest', keywords: ['loan calculator'] },
  { slug: 'gst-calculator', name: 'GST Calculator', category: 'calculator', icon: Receipt, description: 'Calculate GST inclusive and exclusive amounts', keywords: ['gst calculator'] },
  { slug: 'age-calculator', name: 'Age Calculator', category: 'calculator', icon: CalendarDays, description: 'Calculate exact age in years, months, days', keywords: ['age calculator'] },
  { slug: 'percentage-calculator', name: 'Percentage Calculator', category: 'calculator', icon: Percent, description: 'Calculate percentages quickly', keywords: ['percentage calculator'] },
  { slug: 'bmi-calculator', name: 'BMI Calculator', category: 'calculator', icon: HeartPulse, description: 'Calculate Body Mass Index instantly', keywords: ['bmi calculator'], popular: true },
  { slug: 'fuel-cost-calculator', name: 'Fuel Cost Calculator', category: 'calculator', icon: Fuel, description: 'Calculate fuel cost for any trip', keywords: ['fuel cost calculator'] },
  { slug: 'salary-hike-calculator', name: 'Salary Hike Calculator', category: 'calculator', icon: BadgePercent, description: 'Calculate salary hike percentage', keywords: ['salary hike calculator'] },
  { slug: 'overtime-calculator', name: 'Overtime Calculator', category: 'calculator', icon: Clock, description: 'Calculate overtime pay quickly', keywords: ['overtime calculator'] },
  { slug: 'sheet-metal-calculator', name: 'Sheet Metal Calculator', category: 'calculator', icon: Ruler, description: 'Calculate flat pattern, bend allowance, weight and cost', keywords: ['sheet metal calculator', 'bend allowance', 'flat pattern', 'sheet metal weight'], popular: true }
]

export const getToolBySlug = (slug) => tools.find(t => t.slug === slug)
export const getToolsByCategory = (cat) => tools.filter(t => t.category === cat)
export const getCategory = (slug) => categories.find(c => c.slug === slug)
export const getPopularTools = () => tools.filter(t => t.popular)
export const getRelatedTools = (slug, limit = 4) => {
  const tool = getToolBySlug(slug)
  if (!tool) return []
  return tools.filter(t => t.category === tool.category && t.slug !== slug).slice(0, limit)
}
