import './globals.css'
import { Toaster } from '@/components/ui/sonner'
import LayoutShell from '@/components/layout-shell'
import PageTracker from '@/components/page-tracker'
import CookieConsent from '@/components/cookie-consent'
import { AdSenseScript } from '@/components/ad-slot'

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://github.com/tushjadhav2512-eng/ToolBazzar'),
  title: {
    default: 'ToolBazaar — Free Online Tools: PDF, Image, Text & Calculator Tools',
    template: '%s | ToolBazaar'
  },
  description: '100% free online utility tools for everyday tasks. Merge PDFs, compress images, generate QR codes, calculate EMI and much more. Fast, secure, no signup required.',
  keywords: ['free online tools', 'pdf tools', 'image tools', 'text tools', 'calculator tools', 'qr code generator', 'pdf merge', 'image compress', 'word counter', 'EMI calculator'],
  authors: [{ name: 'ToolBazaar' }],
  openGraph: {
    title: 'ToolBazaar — Free Online Tools',
    description: '100% free utility tools for PDF, Image, Text, Generators and Calculators.',
    url: '/',
    siteName: 'ToolBazaar',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ToolBazaar — Free Online Tools',
    description: '100% free utility tools for PDF, Image, Text, Generators and Calculators.'
  },
  robots: { index: true, follow: true }
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href={`${process.env.NODE_ENV === 'production' ? '/ToolsBazzar-main' : ''}/favicon.svg`} type="image/svg+xml" />
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1207754989377229" crossOrigin="anonymous"></script>
        <meta name="google-adsense-account" content="ca-pub-1207754989377229" />
        <script dangerouslySetInnerHTML={{__html:'window.addEventListener("error",function(e){if(e.error instanceof DOMException&&e.error.name==="DataCloneError"&&e.message&&e.message.includes("PerformanceServerTiming")){e.stopImmediatePropagation();e.preventDefault()}},true);'}} />
      </head>
      <body className="min-h-screen bg-background text-foreground antialiased">
        <LayoutShell>{children}</LayoutShell>
        <PageTracker />
        <CookieConsent />
        <AdSenseScript />
        <Toaster richColors position="top-right" />
      </body>
    </html>
  )
}
