'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Loader2, CreditCard } from 'lucide-react'
import { generateAI } from '@/lib/ai'
import { cn } from '@/lib/utils'

export default function DashboardPage() {
  const [prompt, setPrompt] = useState('')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [credits, setCredits] = useState(10)
  const [error, setError] = useState('')

  const handleGenerate = async () => {
    if (!prompt.trim()) return
    
    setLoading(true)
    setError('')
    
    try {
      const response = await fetch('/api/ai/marketing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      })
      
      const data = await response.json()
      
      if (data.result) {
        setResult(data.result)
        setCredits(prev => prev - 1)
      } else {
        setError('No result returned')
      }
    } catch (err) {
      setError('Generation failed. Check console.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            AI Marketing Generator
          </h1>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-600 mb-8">
            <CreditCard className="h-4 w-4" />
            <span>Credits: {credits}</span>
            <Button variant="outline" size="sm" className="ml-4">
              Subscribe for Unlimited
            </Button>
          </div>
        </div>

        <Card className="card-premium">
          <CardHeader>
            <CardTitle>Enter your product prompt</CardTitle>
            <CardDescription>Describe your product, target audience, or campaign goal</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="prompt">Product Prompt</Label>
              <Textarea
                id="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="E.g. 'Eco-friendly water bottle for fitness enthusiasts, $29.99, BPA-free, 32oz'"
                rows={4}
                className="input-premium resize-none"
              />
            </div>
            <Button 
              onClick={handleGenerate}
              disabled={loading || !prompt.trim()}
              className="w-full btn-primary"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                'Generate Marketing Copy'
              )}
            </Button>
          </CardContent>
        </Card>

        {error && (
          <Card>
            <CardHeader>
              <CardTitle className="text-red-600">Error</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{error}</p>
            </CardContent>
          </Card>
        )}

        {result && (
          <Card className="card-premium">
            <CardHeader>
              <CardTitle>Generated Marketing Copy</CardTitle>
              <CardDescription>Copy, edit, and use!</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 p-6 rounded-xl border">
                <pre className="whitespace-pre-wrap text-gray-900 font-medium">{result}</pre>
              </div>
              <div className="flex gap-2 mt-6">
                <Button className="flex-1 btn-secondary">
                  Copy to Clipboard
                </Button>
                <Button variant="outline" size="sm">
                  New Generation
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

