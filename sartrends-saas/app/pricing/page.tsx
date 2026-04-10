'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function Pricing() {
  const [file, setFile] = useState<File | null>(null)
  const [plan, setPlan] = useState<'single' | 'team' | 'agency'>('single')

  const handleUpload = async () => {
    if (!file) return
    const formData = new FormData()
    formData.append('screenshot', file)
    formData.append('plan', plan)
    formData.append('amount', plan === 'single' ? '30' : plan === 'team' ? '100' : '500')

    const res = await fetch('/api/upload-screenshot', { method: 'POST', body: formData })
    if (res.ok) alert('Payment submitted, await admin approval')
  }

  const plans = [
    { name: 'Single', price: '$30/month', sessions: 1, desc: '1 device' },
    { name: 'Team', price: '$100/month', sessions: 5, desc: '5 devices' },
    { name: 'Agency', price: '$500/month', sessions: 'Unlimited' },
  ]

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Pricing</h1>
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {plans.map((p) => (
          <Card key={p.name} onClick={() => setPlan(p.name.toLowerCase() as any)} className={plan === p.name.toLowerCase() ? 'border-blue-500' : ''}>
            <CardHeader>
              <CardTitle>{p.name}</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-bold">{p.price}</CardContent>
            <CardContent>{p.desc}</CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Make Payment for {plan.toUpperCase()}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>EasyPaisa: <strong>+923454837460</strong></p>
          <p>Meezan Bank IBAN: <strong>PK59MEZN00777010105779192</strong></p>
          <Input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
          <Button onClick={handleUpload}>Upload Screenshot & Submit</Button>
        </CardContent>
      </Card>
    </div>
  )
}

