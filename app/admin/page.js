'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Users, Eye, TrendingUp, Smartphone, LogOut, Save, Settings as SettingsIcon,
  BarChart3, Globe, Monitor, Tablet, Loader2, ExternalLink
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { toast } from 'sonner'
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, CartesianGrid, PieChart, Pie, Cell, Legend
} from 'recharts'

const StatCard = ({ icon: Icon, label, value, sub, color = 'from-indigo-500 to-purple-500' }) => (
  <div className="rounded-2xl border bg-card p-5 soft-shadow">
    <div className="flex items-start justify-between">
      <div>
        <div className="text-xs uppercase tracking-wide text-muted-foreground">{label}</div>
        <div className="text-3xl font-bold mt-2">{value}</div>
        {sub && <div className="text-xs text-muted-foreground mt-1">{sub}</div>}
      </div>
      <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${color} text-white shadow-sm`}>
        <Icon className="h-5 w-5" />
      </div>
    </div>
  </div>
)

const PIE_COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#3b82f6']

export default function AdminDashboard() {
  const router = useRouter()
  const [authed, setAuthed] = useState(null)
  const [email, setEmail] = useState('')
  const [analytics, setAnalytics] = useState(null)
  const [days, setDays] = useState(30)
  const [settings, setSettings] = useState(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch('/api/auth/me').then(r => r.json()).then(d => {
      if (!d.authenticated) { router.replace('/admin/login'); return }
      setAuthed(true); setEmail(d.email)
    })
  }, [router])

  useEffect(() => {
    if (!authed) return
    fetch(`/api/admin/analytics?days=${days}`).then(r => r.json()).then(setAnalytics)
    fetch('/api/admin/settings').then(r => r.json()).then(d => setSettings(d.adsense))
  }, [authed, days])

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.replace('/admin/login')
  }

  const save = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      })
      if (!res.ok) throw new Error()
      toast.success('Settings saved! Reload site to see changes.')
    } catch { toast.error('Failed to save') }
    setSaving(false)
  }

  if (authed === null) return <div className="flex items-center justify-center min-h-[60vh]"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
  if (!authed) return null

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-sm text-muted-foreground">Signed in as <span className="font-medium text-foreground">{email}</span></p>
        </div>
        <Button variant="outline" onClick={logout}><LogOut className="h-4 w-4 mr-2" /> Sign Out</Button>
      </div>

      <Tabs defaultValue="analytics" className="space-y-6">
        <TabsList>
          <TabsTrigger value="analytics"><BarChart3 className="h-4 w-4 mr-2" /> Analytics</TabsTrigger>
          <TabsTrigger value="adsense"><SettingsIcon className="h-4 w-4 mr-2" /> AdSense</TabsTrigger>
        </TabsList>

        {/* ANALYTICS TAB */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Traffic Overview</h2>
            <select value={days} onChange={e => setDays(Number(e.target.value))} className="h-9 rounded-md border bg-background px-3 text-sm">
              <option value={7}>Last 7 days</option>
              <option value={30}>Last 30 days</option>
              <option value={90}>Last 90 days</option>
            </select>
          </div>

          {!analytics ? (
            <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
          ) : (
            <>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard icon={Eye} label="Total Page Views" value={analytics.totalViews.toLocaleString()} sub="All time" color="from-indigo-500 to-purple-500" />
                <StatCard icon={Users} label="Unique Visitors" value={analytics.totalUnique.toLocaleString()} sub="All time" color="from-emerald-500 to-green-500" />
                <StatCard icon={TrendingUp} label="Today" value={analytics.todayViews.toLocaleString()} sub={`Yesterday: ${analytics.yesterdayViews}`} color="from-amber-500 to-orange-500" />
                <StatCard icon={BarChart3} label={`Last ${days} days`} value={analytics.byDay.reduce((s, d) => s + d.views, 0).toLocaleString()} sub="page views" color="from-pink-500 to-rose-500" />
              </div>

              {/* Time series */}
              <div className="rounded-2xl border bg-card p-5 soft-shadow">
                <h3 className="font-semibold mb-4">Views over time</h3>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={analytics.byDay}>
                      <defs>
                        <linearGradient id="grad1" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366f1" stopOpacity={0.5} />
                          <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis dataKey="date" fontSize={12} />
                      <YAxis fontSize={12} />
                      <Tooltip />
                      <Area type="monotone" dataKey="views" stroke="#6366f1" fill="url(#grad1)" strokeWidth={2} />
                      <Area type="monotone" dataKey="uniqueVisitors" stroke="#10b981" fill="transparent" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                {/* Top pages */}
                <div className="rounded-2xl border bg-card p-5 soft-shadow">
                  <h3 className="font-semibold mb-4 flex items-center gap-2"><BarChart3 className="h-4 w-4" /> Top Pages</h3>
                  {analytics.topPages.length === 0 ? (
                    <p className="text-sm text-muted-foreground py-8 text-center">No data yet. Visit some pages to see stats.</p>
                  ) : (
                    <div className="space-y-2">
                      {analytics.topPages.map((p, i) => (
                        <div key={i} className="flex items-center gap-3 text-sm">
                          <span className="text-xs font-mono text-muted-foreground w-6">{i + 1}</span>
                          <span className="flex-1 font-mono text-xs truncate">{p.path}</span>
                          <span className="font-semibold">{p.count.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Devices */}
                <div className="rounded-2xl border bg-card p-5 soft-shadow">
                  <h3 className="font-semibold mb-4 flex items-center gap-2"><Smartphone className="h-4 w-4" /> Devices</h3>
                  {analytics.devices.length === 0 ? (
                    <p className="text-sm text-muted-foreground py-8 text-center">No data yet.</p>
                  ) : (
                    <div className="h-56">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={analytics.devices} dataKey="count" nameKey="device" cx="50%" cy="50%" outerRadius={70} label>
                            {analytics.devices.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </div>

                {/* Top referers */}
                <div className="rounded-2xl border bg-card p-5 soft-shadow">
                  <h3 className="font-semibold mb-4 flex items-center gap-2"><ExternalLink className="h-4 w-4" /> Top Referrers</h3>
                  {analytics.topReferers.length === 0 ? (
                    <p className="text-sm text-muted-foreground py-8 text-center">No referrer data yet.</p>
                  ) : (
                    <div className="space-y-2">
                      {analytics.topReferers.map((r, i) => (
                        <div key={i} className="flex items-center gap-3 text-sm">
                          <span className="flex-1 truncate text-xs">{r.referer}</span>
                          <span className="font-semibold">{r.count}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Countries */}
                <div className="rounded-2xl border bg-card p-5 soft-shadow">
                  <h3 className="font-semibold mb-4 flex items-center gap-2"><Globe className="h-4 w-4" /> Top Countries</h3>
                  {analytics.countries.length === 0 ? (
                    <p className="text-sm text-muted-foreground py-8 text-center">No country data yet.</p>
                  ) : (
                    <div className="space-y-2">
                      {analytics.countries.map((c, i) => (
                        <div key={i} className="flex items-center gap-3 text-sm">
                          <span className="flex-1 font-medium">{c.country || 'Unknown'}</span>
                          <span className="font-semibold">{c.count}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </TabsContent>

        {/* ADSENSE TAB */}
        <TabsContent value="adsense" className="space-y-6">
          <div className="rounded-2xl border bg-card p-6 soft-shadow">
            <h2 className="text-xl font-semibold mb-1">Google AdSense Settings</h2>
            <p className="text-sm text-muted-foreground mb-6">Configure your AdSense publisher ID and ad slot IDs. Get these from your <a href="https://adsense.google.com" target="_blank" rel="noopener" className="text-primary underline">AdSense account</a>.</p>

            {settings && (
              <div className="space-y-5">
                <div className="flex items-center justify-between p-4 rounded-xl border bg-muted/30">
                  <div>
                    <Label className="font-semibold">Enable AdSense</Label>
                    <p className="text-xs text-muted-foreground mt-0.5">Inject AdSense script & ad units sitewide</p>
                  </div>
                  <Switch checked={settings.enabled} onCheckedChange={v => setSettings({ ...settings, enabled: v })} />
                </div>

                <div>
                  <Label>Publisher ID (ca-pub-xxxxxxxxxxxxxxxx)</Label>
                  <Input
                    value={settings.publisherId || ''}
                    onChange={e => setSettings({ ...settings, publisherId: e.target.value })}
                    placeholder="ca-pub-1234567890123456"
                    className="mt-2 font-mono"
                  />
                  <p className="text-xs text-muted-foreground mt-1">Found in AdSense → Account → Account information</p>
                </div>

                <div>
                  <Label className="mb-3 block">Ad Slot IDs (per placement)</Label>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {[
                      { key: 'home_top', label: 'Homepage banner' },
                      { key: 'tool_top', label: 'Tool page banner' },
                      { key: 'tool_sidebar', label: 'Tool page sidebar' },
                      { key: 'tool_bottom', label: 'Tool page bottom' },
                      { key: 'category_top', label: 'Category page banner' },
                      { key: 'default', label: 'Default / fallback' }
                    ].map(s => (
                      <div key={s.key}>
                        <Label className="text-xs">{s.label}</Label>
                        <Input
                          value={settings.slots?.[s.key] || ''}
                          onChange={e => setSettings({ ...settings, slots: { ...(settings.slots || {}), [s.key]: e.target.value } })}
                          placeholder="1234567890"
                          className="mt-1 font-mono text-sm"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl border bg-amber-50 dark:bg-amber-950/20">
                  <div>
                    <Label className="font-medium">Auto Ads (recommended)</Label>
                    <p className="text-xs text-muted-foreground mt-0.5">Let Google auto-place ads. You can still use slot IDs above for manual placements.</p>
                  </div>
                  <Switch checked={settings.autoAds ?? true} onCheckedChange={v => setSettings({ ...settings, autoAds: v })} />
                </div>

                <div className="flex gap-3 pt-2">
                  <Button onClick={save} disabled={saving} size="lg">
                    {saving ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Saving...</> : <><Save className="h-4 w-4 mr-2" /> Save Settings</>}
                  </Button>
                  <Button variant="outline" size="lg" onClick={() => window.open('/', '_blank')}>Preview Site</Button>
                </div>

                <div className="mt-6 rounded-xl border border-blue-200 bg-blue-50 dark:bg-blue-950/20 p-4 text-sm">
                  <p className="font-semibold mb-2">📋 Quick Setup Guide</p>
                  <ol className="list-decimal pl-5 space-y-1 text-muted-foreground">
                    <li>Sign in to <a className="text-primary underline" href="https://adsense.google.com" target="_blank" rel="noopener">Google AdSense</a> and add your site for review.</li>
                    <li>Copy your <strong>Publisher ID</strong> (format: <code className="bg-muted px-1 rounded">ca-pub-...</code>) from Account info, paste it above.</li>
                    <li>Toggle <strong>Enable AdSense</strong> ON and click Save. AdSense will start verifying your site.</li>
                    <li>Once approved, create ad units in AdSense, copy their slot IDs and paste in the fields above for manual placement.</li>
                    <li>Or just keep <strong>Auto Ads</strong> enabled and Google handles placement automatically.</li>
                  </ol>
                </div>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
