'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { getClientSession } from '@/components/ui/auth-utils'
import { prisma } from '@/lib/db' // client side fetch

export default function TemplatesPage() {
  const [templates, setTemplates] = useState([])
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const init = async () => {
      const s = await getClientSession()
      setSession(s)
      if (s?.user?.id) {
        const res = await fetch('/api/templates')
        const { templates: t } = await res.json()
        setTemplates(t || [])
      }
      setLoading(false)
    }
    init()
  }, [])

  if (loading) return <div className="p-8">Loading templates...</div>

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Templates Library</h1>
        <Link href="/hse">
          <Button size="lg">Generate HSE Doc</Button>
        </Link>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template: any) => (
          <Card key={template.id} className="group hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {template.name}
                <Badge variant={template.isPremium ? 'secondary' : 'default'}>
                  {template.isPremium ? 'Premium' : 'Free'}
                </Badge>
              </CardTitle>
              <p className="text-sm text-gray-600">{template.type.toUpperCase()}</p>
            </CardHeader>
            <CardContent>
              <p className="text-sm mb-4 line-clamp-3">{template.content.substring(0, 100)}...</p>
              <Link href={`/hse?templateId=${template.id}`}>
                <Button className="w-full group-hover:bg-primary/90 transition">
                  Use Template
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
      {!session && (
        <div className="mt-12 text-center p-12 bg-blue-50 rounded-3xl">
          <h2 className="text-2xl font-bold mb-4">Unlock All Templates</h2>
          <Link href="/upgrade">
            <Button size="lg">Upgrade to Premium</Button>
          </Link>
        </div>
      )}
    </div>
  )
}


