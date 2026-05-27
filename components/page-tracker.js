'use client'
import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export default function PageTracker() {
  const pathname = usePathname()
  useEffect(() => {
    if (pathname?.startsWith('/admin')) return
    let visitorId = localStorage.getItem('tb_visitor')
    if (!visitorId) {
      visitorId = (crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2) + Date.now())
      localStorage.setItem('tb_visitor', visitorId)
    }
    fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        path: pathname,
        referer: document.referrer || '',
        visitorId,
        screenWidth: window.innerWidth
      })
    }).catch(() => {})
  }, [pathname])
  return null
}
