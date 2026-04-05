'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, Check } from 'lucide-react'
import { getClientSession } from '@/components/ui/auth-utils'

export default function UpgradePage() {
  const [screenshot, setScreenshot] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [session, setSession] = useState<any>(null)

  useEffect(() => {
    getClientSession().then((s: any) => setSession(s))
  }, [])

  const handleScreenshot = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) setScreenshot(file)
  }

  const handleSubscribe = async () => {
    if (!screenshot) {
      setError('Please upload payment screenshot')
      return
    }
    setLoading(true)
    setError('')
    const formData = new FormData()
    formData.append('screenshot', screenshot)
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        body: formData
      })
      if (res.ok) {
        setSuccess(true)
        setTimeout(() => {
          window.location.href = '/dashboard'
        }, 1500)
        return
      } else {
        setError('Upload failed. Please check your screenshot and try again.')
      }
    } catch (err) {
      setError('Network error. Please check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center">Upgrade to Premium</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center py-8">
              <h2 className="text-2xl font-bold mb-2">Unlimited HSE Generation</h2>
              <p className="text-lg text-gray-600 mb-4">Rs. 999/month</p>
              <ul className="text-left max-w-md mx-auto space-y-2 text-sm">
                <li>✓ No credits needed</li>
                <li>✓ Watermark-free exports</li>
                <li>✓ All templates unlocked</li>
                <li>✓ Priority support</li>
              </ul>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Payment Method: EasyPaisa</label>
              <p className="text-sm text-gray-600 mb-4">Send Rs. 999 to 0300-1234567 (Sartrends AI Premium), reference your email: {session?.user?.email}</p>
            </div>
            {error && (
              <Card className="border-red-200 bg-red-50 p-4 mb-4">
                <CardContent className="p-0 space-y-2">
                  <div className="flex items-start gap-2">
                    <Loader2 className="h-4 w-4 animate-spin mt-0.5 text-red-500 flex-shrink-0" />
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setError('')
                      setScreenshot(null)
                    }}
                    className="w-full"
                  >
                    Clear & Retry
                  </Button>
                </CardContent>
              </Card>
            )}
            {success && (
              <Card className="border-green-200 bg-green-50 p-4 mb-4">
                <CardContent className="p-0 space-y-2">
                  <div className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-green-700">Payment submitted successfully! Wait for admin approval. Redirecting to dashboard...</p>
                  </div>
                </CardContent>
              </Card>
            )}
            <div>
              <label className="text-sm font-medium mb-2 block">Upload Payment Screenshot *</label>
              <Input 
                type="file" 
                accept="image/*" 
                onChange={handleScreenshot} 
                className="mb-4" 
              />
            </div>
            <Button 
              onClick={handleSubscribe} 
              disabled={loading || !screenshot} 
              className="w-full bg-gradient-to-r from-green-500 to-emerald-500"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                'Submit Payment'
              )}
            </Button>
            <p className="text-xs text-gray-500 text-center">Admin will verify within 24 hours and activate premium.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

