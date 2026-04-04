'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { getClientSession } from '@/components/ui/auth-utils'

export default function AdminPayments() {
  const [payments, setPayments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
const [session, setSession] = useState<any>(null)

  useEffect(() => {
    const init = async () => {
      const s = await getClientSession()
      setSession(s)
      if (s?.user && s.user.email === 'admin@sartrends.ai') { // simple admin check
        const res = await fetch('/api/admin/payments') // assume api
        const data = await res.json()
        setPayments(data.payments || [])
      }
      setLoading(false)
    }
    init()
  }, [])

  const approvePayment = async (id: string) => {
    await fetch(`/api/admin/verify`, {
      method: 'POST',
      body: JSON.stringify({ id })
    })
    setPayments(payments.filter(p => p.id !== id))
  }

  if (session?.user?.email !== 'admin@sartrends.ai') {
    return <div className="p-8 text-center">Admin only</div>
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Pending Payments</h1>
      {loading ? (
        <p>Loading...</p>
      ) : payments.length === 0 ? (
        <p>No pending payments</p>
      ) : (
        <div className="space-y-4">
          {payments.map((p: any) => (
            <Card key={p.id}>
              <CardHeader>
                <CardTitle>{p.userEmail}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>Amount: Rs. 999</div>
                <div>Screenshot: <img src={p.screenshotUrl} alt="payment" className="max-w-xs" /></div>
                <Button onClick={() => approvePayment(p.id)} className="w-full">
                  Approve &amp; Activate Premium
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

