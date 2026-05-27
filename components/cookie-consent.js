'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Cookie, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

const KEY = 'tb_cookie_consent'

export default function CookieConsent() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const v = localStorage.getItem(KEY)
    if (!v) setShow(true)
  }, [])

  const decide = (value) => {
    localStorage.setItem(KEY, value)
    localStorage.setItem(KEY + '_at', new Date().toISOString())
    setShow(false)
    // Signal Google's TCF/consent for personalized ads
    if (typeof window !== 'undefined') {
      window.gtag?.('consent', 'update', {
        ad_storage: value === 'accept' ? 'granted' : 'denied',
        ad_user_data: value === 'accept' ? 'granted' : 'denied',
        ad_personalization: value === 'accept' ? 'granted' : 'denied',
        analytics_storage: value === 'accept' ? 'granted' : 'denied'
      })
    }
  }

  if (!show) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:bottom-6 md:max-w-md z-50 animate-in slide-in-from-bottom-4">
      <div className="rounded-2xl border bg-card p-5 shadow-2xl">
        <div className="flex items-start gap-3 mb-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-white">
            <Cookie className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-sm">We value your privacy</h3>
            <p className="text-xs text-muted-foreground mt-1">
              We use cookies and similar technologies to provide and improve our services. With your consent, our partners (including Google AdSense) may use cookies for personalized advertising. See our <Link href="/privacy" className="underline text-foreground">Privacy Policy</Link>.
            </p>
          </div>
          <button onClick={() => decide('reject')} className="text-muted-foreground hover:text-foreground" aria-label="Close">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => decide('reject')} variant="outline" size="sm" className="flex-1">Reject</Button>
          <Button onClick={() => decide('accept')} size="sm" className="flex-1">Accept All</Button>
        </div>
      </div>
    </div>
  )
}
