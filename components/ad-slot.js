'use client'
import Script from 'next/script'
import { useEffect, useState } from 'react'

let cachedSettings = null
let pendingPromise = null

async function loadSettings() {
  if (cachedSettings) return cachedSettings
  if (pendingPromise) return pendingPromise
  pendingPromise = fetch('/api/settings/public').then(r => r.json()).then(d => {
    cachedSettings = d.adsense || { enabled: false, publisherId: '', slots: {} }
    return cachedSettings
  }).catch(() => ({ enabled: false, publisherId: '', slots: {} }))
  return pendingPromise
}

export function AdSenseScript() {
  const [settings, setSettings] = useState(null)
  useEffect(() => { loadSettings().then(setSettings) }, [])
  if (!settings?.enabled || !settings?.publisherId) return null
  return (
    <Script
      id="adsbygoogle"
      async
      strategy="afterInteractive"
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${settings.publisherId}`}
      crossOrigin="anonymous"
    />
  )
}

export default function AdSlot({ slot = 'default', format = 'auto', responsive = true, style, className }) {
  const [settings, setSettings] = useState(null)
  useEffect(() => { loadSettings().then(setSettings) }, [])

  useEffect(() => {
    if (settings?.enabled && settings?.publisherId) {
      try { (window.adsbygoogle = window.adsbygoogle || []).push({}) } catch (e) {}
    }
  }, [settings])

  if (!settings) return null

  if (settings.enabled && settings.publisherId) {
    const slotId = settings.slots?.[slot]
    if (!slotId) {
      // No slot ID configured for this position; render nothing (or placeholder)
      return (
        <div className={`ad-slot ${className || ''}`} style={style}>
          <span>Ad slot “{slot}” not configured</span>
        </div>
      )
    }
    return (
      <ins
        className={`adsbygoogle ${className || ''}`}
        style={{ display: 'block', minHeight: 90, ...(style || {}) }}
        data-ad-client={settings.publisherId}
        data-ad-slot={slotId}
        data-ad-format={format}
        data-full-width-responsive={responsive ? 'true' : 'false'}
      />
    )
  }

  return (
    <div className={`ad-slot ${className || ''}`} style={style}>
      Advertisement space
    </div>
  )
}
