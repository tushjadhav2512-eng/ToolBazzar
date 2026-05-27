'use client'
import { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const fmt = (n) => Number(n || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 })
const fmtCurrency = (n, sym = '\u20B9') => `${sym}${fmt(n)}`

const ResultCard = ({ label, value, accent }) => (
  <div className={`rounded-xl p-4 ${accent ? 'bg-gradient-to-br from-indigo-500 to-purple-500 text-white' : 'bg-muted/40 border'}`}>
    <div className={`text-xs ${accent ? 'opacity-90' : 'text-muted-foreground'}`}>{label}</div>
    <div className={`text-2xl font-bold mt-1 ${accent ? '' : ''}`}>{value}</div>
  </div>
)

const FieldNumber = ({ label, value, onChange, min, max, step = 1, suffix }) => (
  <div className="space-y-2">
    <div className="flex items-center justify-between">
      <Label className="text-sm">{label}</Label>
      <div className="flex items-center gap-1">
        <Input type="number" value={value} onChange={e => onChange(e.target.value === '' ? '' : Number(e.target.value))} className="w-24 h-8 text-right" />
        {suffix && <span className="text-xs text-muted-foreground">{suffix}</span>}
      </div>
    </div>
    {min !== undefined && max !== undefined && <Slider value={[Number(value) || min]} min={min} max={max} step={step} onValueChange={v => onChange(v[0])} />}
  </div>
)

export function EMICalculator() {
  const [amount, setAmount] = useState(500000)
  const [rate, setRate] = useState(8.5)
  const [tenure, setTenure] = useState(60)
  const { emi, total, interest } = useMemo(() => {
    const p = Number(amount), r = Number(rate) / 12 / 100, n = Number(tenure)
    if (!p || !n || r < 0) return { emi: 0, total: 0, interest: 0 }
    const emi = r === 0 ? p / n : (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
    const total = emi * n
    return { emi, total, interest: total - p }
  }, [amount, rate, tenure])
  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div className="space-y-6">
        <FieldNumber label="Loan Amount" value={amount} onChange={setAmount} min={10000} max={10000000} step={10000} suffix={'₹'} />
        <FieldNumber label="Interest Rate (% p.a.)" value={rate} onChange={setRate} min={1} max={20} step={0.1} suffix="%" />
        <FieldNumber label="Loan Tenure (months)" value={tenure} onChange={setTenure} min={6} max={360} suffix="mo" />
        <Button variant="outline" onClick={() => { setAmount(500000); setRate(8.5); setTenure(60) }}>Reset</Button>
      </div>
      <div className="space-y-3">
        <ResultCard accent label="Monthly EMI" value={fmtCurrency(emi)} />
        <ResultCard label="Total Interest" value={fmtCurrency(interest)} />
        <ResultCard label="Total Payment" value={fmtCurrency(total)} />
      </div>
    </div>
  )
}

export function SIPCalculator() {
  const [monthly, setMonthly] = useState(5000)
  const [years, setYears] = useState(10)
  const [rate, setRate] = useState(12)
  const { invested, returns, total } = useMemo(() => {
    const m = Number(monthly), n = Number(years) * 12, r = Number(rate) / 12 / 100
    if (!m || !n) return { invested: 0, returns: 0, total: 0 }
    const fv = m * ((Math.pow(1 + r, n) - 1) / r) * (1 + r)
    const invested = m * n
    return { invested, returns: fv - invested, total: fv }
  }, [monthly, years, rate])
  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div className="space-y-6">
        <FieldNumber label="Monthly Investment" value={monthly} onChange={setMonthly} min={500} max={100000} step={500} suffix={'₹'} />
        <FieldNumber label="Time Period (years)" value={years} onChange={setYears} min={1} max={40} suffix="yr" />
        <FieldNumber label="Expected Return (% p.a.)" value={rate} onChange={setRate} min={1} max={30} step={0.5} suffix="%" />
      </div>
      <div className="space-y-3">
        <ResultCard accent label="Future Value" value={fmtCurrency(total)} />
        <ResultCard label="Invested Amount" value={fmtCurrency(invested)} />
        <ResultCard label="Estimated Returns" value={fmtCurrency(returns)} />
      </div>
    </div>
  )
}

export function LoanCalculator() { return <EMICalculator /> }

export function GSTCalculator() {
  const [amount, setAmount] = useState(1000)
  const [rate, setRate] = useState(18)
  const [type, setType] = useState('exclusive')
  const { base, gst, total } = useMemo(() => {
    const a = Number(amount), r = Number(rate)
    if (type === 'exclusive') {
      const g = a * r / 100
      return { base: a, gst: g, total: a + g }
    } else {
      const b = a / (1 + r / 100)
      return { base: b, gst: a - b, total: a }
    }
  }, [amount, rate, type])
  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div className="space-y-5">
        <div>
          <Label>Type</Label>
          <Tabs value={type} onValueChange={setType} className="mt-2">
            <TabsList className="w-full">
              <TabsTrigger value="exclusive" className="flex-1">Add GST</TabsTrigger>
              <TabsTrigger value="inclusive" className="flex-1">Remove GST</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <div>
          <Label>Amount</Label>
          <Input type="number" value={amount} onChange={e => setAmount(e.target.value)} className="mt-2" />
        </div>
        <div>
          <Label>GST Rate</Label>
          <Select value={String(rate)} onValueChange={v => setRate(Number(v))}>
            <SelectTrigger className="mt-2"><SelectValue /></SelectTrigger>
            <SelectContent>
              {[0, 3, 5, 12, 18, 28].map(r => <SelectItem key={r} value={String(r)}>{r}%</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="space-y-3">
        <ResultCard accent label="Total Amount" value={fmtCurrency(total)} />
        <ResultCard label="Base Amount" value={fmtCurrency(base)} />
        <ResultCard label="GST Amount" value={fmtCurrency(gst)} />
      </div>
    </div>
  )
}

export function AgeCalculator() {
  const [dob, setDob] = useState('')
  const today = new Date().toISOString().split('T')[0]
  const result = useMemo(() => {
    if (!dob) return null
    const b = new Date(dob), n = new Date()
    if (b > n) return { error: 'Date cannot be in future' }
    let y = n.getFullYear() - b.getFullYear()
    let m = n.getMonth() - b.getMonth()
    let d = n.getDate() - b.getDate()
    if (d < 0) { m--; d += new Date(n.getFullYear(), n.getMonth(), 0).getDate() }
    if (m < 0) { y--; m += 12 }
    const totalDays = Math.floor((n - b) / 86400000)
    return { y, m, d, totalDays, totalMonths: y * 12 + m, totalHours: totalDays * 24 }
  }, [dob])
  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div className="space-y-4">
        <div>
          <Label>Date of Birth</Label>
          <Input type="date" max={today} value={dob} onChange={e => setDob(e.target.value)} className="mt-2" />
        </div>
        <Button variant="outline" onClick={() => setDob('')}>Reset</Button>
      </div>
      <div className="space-y-3">
        {result?.error && <div className="text-red-600 text-sm">{result.error}</div>}
        {result && !result.error && (
          <>
            <ResultCard accent label="Your Age" value={`${result.y}y ${result.m}m ${result.d}d`} />
            <div className="grid grid-cols-2 gap-3">
              <ResultCard label="Total Months" value={fmt(result.totalMonths)} />
              <ResultCard label="Total Days" value={fmt(result.totalDays)} />
              <ResultCard label="Total Hours" value={fmt(result.totalHours)} />
              <ResultCard label="Total Minutes" value={fmt(result.totalHours * 60)} />
            </div>
          </>
        )}
        {!result && <div className="text-muted-foreground text-sm">Select your date of birth to see your age</div>}
      </div>
    </div>
  )
}

export function PercentageCalculator() {
  const [a, setA] = useState(50)
  const [b, setB] = useState(200)
  return (
    <Tabs defaultValue="of" className="space-y-6">
      <TabsList>
        <TabsTrigger value="of">X% of Y</TabsTrigger>
        <TabsTrigger value="is">X is what % of Y</TabsTrigger>
        <TabsTrigger value="change">% Change</TabsTrigger>
      </TabsList>
      <TabsContent value="of" className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div><Label>Percentage (%)</Label><Input type="number" value={a} onChange={e => setA(Number(e.target.value))} className="mt-2" /></div>
          <div><Label>Of Value</Label><Input type="number" value={b} onChange={e => setB(Number(e.target.value))} className="mt-2" /></div>
        </div>
        <ResultCard accent label={`${a}% of ${b}`} value={fmt((a * b) / 100)} />
      </TabsContent>
      <TabsContent value="is" className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div><Label>Value</Label><Input type="number" value={a} onChange={e => setA(Number(e.target.value))} className="mt-2" /></div>
          <div><Label>Of Total</Label><Input type="number" value={b} onChange={e => setB(Number(e.target.value))} className="mt-2" /></div>
        </div>
        <ResultCard accent label={`${a} is what % of ${b}`} value={b ? fmt((a / b) * 100) + '%' : '0%'} />
      </TabsContent>
      <TabsContent value="change" className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div><Label>From</Label><Input type="number" value={a} onChange={e => setA(Number(e.target.value))} className="mt-2" /></div>
          <div><Label>To</Label><Input type="number" value={b} onChange={e => setB(Number(e.target.value))} className="mt-2" /></div>
        </div>
        <ResultCard accent label="Percentage Change" value={a ? fmt(((b - a) / a) * 100) + '%' : '0%'} />
      </TabsContent>
    </Tabs>
  )
}

export function BMICalculator() {
  const [unit, setUnit] = useState('metric')
  const [height, setHeight] = useState(170)
  const [weight, setWeight] = useState(70)
  const bmi = useMemo(() => {
    const h = Number(height), w = Number(weight)
    if (!h || !w) return 0
    if (unit === 'metric') return w / Math.pow(h / 100, 2)
    return (w / (h * h)) * 703
  }, [height, weight, unit])
  const category = bmi < 18.5 ? { label: 'Underweight', color: 'text-blue-600' } :
    bmi < 25 ? { label: 'Normal', color: 'text-emerald-600' } :
      bmi < 30 ? { label: 'Overweight', color: 'text-amber-600' } : { label: 'Obese', color: 'text-red-600' }
  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div className="space-y-5">
        <Tabs value={unit} onValueChange={setUnit}>
          <TabsList className="w-full">
            <TabsTrigger value="metric" className="flex-1">Metric (cm, kg)</TabsTrigger>
            <TabsTrigger value="imperial" className="flex-1">Imperial (in, lb)</TabsTrigger>
          </TabsList>
        </Tabs>
        <div>
          <Label>Height ({unit === 'metric' ? 'cm' : 'inches'})</Label>
          <Input type="number" value={height} onChange={e => setHeight(e.target.value)} className="mt-2" />
        </div>
        <div>
          <Label>Weight ({unit === 'metric' ? 'kg' : 'lbs'})</Label>
          <Input type="number" value={weight} onChange={e => setWeight(e.target.value)} className="mt-2" />
        </div>
      </div>
      <div className="space-y-3">
        <ResultCard accent label="Your BMI" value={bmi.toFixed(1)} />
        <div className="rounded-xl border bg-card p-4">
          <div className="text-sm text-muted-foreground mb-1">Category</div>
          <div className={`text-2xl font-bold ${category.color}`}>{bmi > 0 ? category.label : '—'}</div>
        </div>
        <div className="text-xs text-muted-foreground space-y-1 mt-4">
          <div>&lt; 18.5 — Underweight</div>
          <div>18.5 — 24.9 Normal</div>
          <div>25 — 29.9 Overweight</div>
          <div>≥ 30 Obese</div>
        </div>
      </div>
    </div>
  )
}

export function FuelCostCalculator() {
  const [distance, setDistance] = useState(100)
  const [mileage, setMileage] = useState(15)
  const [price, setPrice] = useState(100)
  const litres = distance / mileage
  const cost = litres * price
  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div className="space-y-4">
        <div><Label>Trip Distance (km)</Label><Input type="number" value={distance} onChange={e => setDistance(Number(e.target.value))} className="mt-2" /></div>
        <div><Label>Mileage (km/litre)</Label><Input type="number" value={mileage} onChange={e => setMileage(Number(e.target.value))} className="mt-2" /></div>
        <div><Label>Fuel Price (per litre)</Label><Input type="number" value={price} onChange={e => setPrice(Number(e.target.value))} className="mt-2" /></div>
      </div>
      <div className="space-y-3">
        <ResultCard accent label="Total Fuel Cost" value={fmtCurrency(cost)} />
        <ResultCard label="Fuel Required" value={`${litres.toFixed(2)} L`} />
        <ResultCard label="Cost per km" value={fmtCurrency(cost / distance || 0)} />
      </div>
    </div>
  )
}

export function SalaryHikeCalculator() {
  const [current, setCurrent] = useState(50000)
  const [hike, setHike] = useState(15)
  const newSalary = current * (1 + hike / 100)
  const increase = newSalary - current
  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div className="space-y-4">
        <div><Label>Current Salary</Label><Input type="number" value={current} onChange={e => setCurrent(Number(e.target.value))} className="mt-2" /></div>
        <div><Label>Hike Percentage (%)</Label><Input type="number" value={hike} onChange={e => setHike(Number(e.target.value))} className="mt-2" /></div>
      </div>
      <div className="space-y-3">
        <ResultCard accent label="New Salary" value={fmtCurrency(newSalary)} />
        <ResultCard label="Increase Amount" value={fmtCurrency(increase)} />
        <ResultCard label="Annual Increase" value={fmtCurrency(increase * 12)} />
      </div>
    </div>
  )
}

export function OvertimeCalculator() {
  const [hourly, setHourly] = useState(200)
  const [hours, setHours] = useState(10)
  const [rate, setRate] = useState(1.5)
  const overtimePay = hourly * hours * rate
  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div className="space-y-4">
        <div><Label>Hourly Rate</Label><Input type="number" value={hourly} onChange={e => setHourly(Number(e.target.value))} className="mt-2" /></div>
        <div><Label>Overtime Hours</Label><Input type="number" value={hours} onChange={e => setHours(Number(e.target.value))} className="mt-2" /></div>
        <div><Label>Multiplier (e.g. 1.5x)</Label><Input type="number" step="0.1" value={rate} onChange={e => setRate(Number(e.target.value))} className="mt-2" /></div>
      </div>
      <div className="space-y-3">
        <ResultCard accent label="Overtime Pay" value={fmtCurrency(overtimePay)} />
        <ResultCard label="Effective Rate per Hour" value={fmtCurrency(hourly * rate)} />
      </div>
    </div>
  )
}

export function SheetMetalCalculator() {
  const [unit, setUnit] = useState('mm')
  const [length, setLength] = useState(1000)
  const [width, setWidth] = useState(500)
  const [thickness, setThickness] = useState(2)
  const [density, setDensity] = useState(7.85)
  const [bends, setBends] = useState(1)
  const [angle, setAngle] = useState(90)
  const [radius, setRadius] = useState(2)
  const [kFactor, setKFactor] = useState(0.33)
  const [price, setPrice] = useState(85)

  const result = useMemo(() => {
    const toMm = unit === 'in' ? 25.4 : 1
    const l = Number(length) * toMm
    const w = Number(width) * toMm
    const t = Number(thickness) * toMm
    const r = Number(radius) * toMm
    const b = Number(bends)
    const a = Number(angle)
    const k = Number(kFactor)
    const d = Number(density)
    const p = Number(price)

    if (!l || !w || !t || !d) {
      return { area: 0, weight: 0, bendAllowance: 0, flatLength: 0, cost: 0 }
    }

    const bendAllowance = (Math.PI / 180) * a * (r + k * t) * b
    const flatLength = l + bendAllowance
    const area = (flatLength * w) / 1000000
    const weight = area * t * d
    const cost = weight * p

    return { area, weight, bendAllowance, flatLength, cost }
  }, [unit, length, width, thickness, density, bends, angle, radius, kFactor, price])

  return (
    <div className="grid lg:grid-cols-5 gap-8">
      <div className="lg:col-span-3 space-y-5">
        <Tabs value={unit} onValueChange={setUnit}>
          <TabsList className="w-full">
            <TabsTrigger value="mm" className="flex-1">Metric (mm)</TabsTrigger>
            <TabsTrigger value="in" className="flex-1">Imperial (in)</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="grid sm:grid-cols-2 gap-4">
          <div><Label>Part Length ({unit})</Label><Input type="number" value={length} onChange={e => setLength(Number(e.target.value))} className="mt-2" /></div>
          <div><Label>Part Width ({unit})</Label><Input type="number" value={width} onChange={e => setWidth(Number(e.target.value))} className="mt-2" /></div>
          <div><Label>Thickness ({unit})</Label><Input type="number" step="0.1" value={thickness} onChange={e => setThickness(Number(e.target.value))} className="mt-2" /></div>
          <div><Label>Density (g/cm3)</Label><Input type="number" step="0.01" value={density} onChange={e => setDensity(Number(e.target.value))} className="mt-2" /></div>
          <div><Label>Number of Bends</Label><Input type="number" min="0" value={bends} onChange={e => setBends(Number(e.target.value))} className="mt-2" /></div>
          <div><Label>Bend Angle (degrees)</Label><Input type="number" value={angle} onChange={e => setAngle(Number(e.target.value))} className="mt-2" /></div>
          <div><Label>Inside Radius ({unit})</Label><Input type="number" step="0.1" value={radius} onChange={e => setRadius(Number(e.target.value))} className="mt-2" /></div>
          <div><Label>K-Factor</Label><Input type="number" min="0" max="0.5" step="0.01" value={kFactor} onChange={e => setKFactor(Number(e.target.value))} className="mt-2" /></div>
          <div className="sm:col-span-2"><Label>Material Price (per kg)</Label><Input type="number" value={price} onChange={e => setPrice(Number(e.target.value))} className="mt-2" /></div>
        </div>
        <Button variant="outline" onClick={() => { setUnit('mm'); setLength(1000); setWidth(500); setThickness(2); setDensity(7.85); setBends(1); setAngle(90); setRadius(2); setKFactor(0.33); setPrice(85) }}>Reset</Button>
      </div>
      <div className="lg:col-span-2 space-y-3">
        <ResultCard accent label="Estimated Weight" value={`${fmt(result.weight)} kg`} />
        <ResultCard label="Flat Pattern Length" value={`${fmt(result.flatLength)} mm`} />
        <ResultCard label="Bend Allowance" value={`${fmt(result.bendAllowance)} mm`} />
        <ResultCard label="Sheet Area" value={`${fmt(result.area)} m2`} />
        <ResultCard label="Material Cost" value={fmtCurrency(result.cost)} />
        <div className="rounded-xl border bg-muted/30 p-4 text-xs text-muted-foreground leading-relaxed">
          Uses bend allowance = angle x (inside radius + K-factor x thickness). Final manufacturing values can vary by tooling, material grade and bend method.
        </div>
      </div>
    </div>
  )
}
