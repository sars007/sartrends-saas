'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SelectItem } from "@/components/ui/select-item"
import { Brain, Languages, Bot } from "lucide-react"
import { Bullhorn } from "lucide-react"

interface AIConfig {
  id: string
  provider: string
  systemPrompt: string | null
  languageMode: string
}

export default function AIControl() {
  const [config, setConfig] = useState<AIConfig | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [systemPrompt, setSystemPrompt] = useState('')
  const [provider, setProvider] = useState('openai')
  const [languageMode, setLanguageMode] = useState('auto')

  useEffect(() => {
    fetchConfig()
  }, [])

  const fetchConfig = async () => {
    try {
      const res = await fetch('/api/admin/ai-config', { credentials: 'include' })
      if (res.ok) {
        const data = await res.json()
        setConfig(data)
        if (data.systemPrompt) setSystemPrompt(data.systemPrompt)
        setProvider(data.provider || 'openai')
        setLanguageMode(data.languageMode || 'auto')
      }
    } catch (error) {
      console.error('Failed to fetch AI config')
    } finally {
      setLoading(false)
    }
  }

  const saveConfig = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/admin/ai-config', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          provider, 
          systemPrompt: systemPrompt || null, 
          languageMode 
        }),
        credentials: 'include'
      })
      if (res.ok) {
        fetchConfig()
      }
    } catch (error) {
      console.error('Failed to save config')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div>Loading AI settings...</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Brain className="h-8 w-8 text-purple-600" />
        <h1 className="text-3xl font-bold">AI Control Panel</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>AI Provider Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Provider</label>
            <Select value={provider} onValueChange={setProvider}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="openai">OpenAI</SelectItem>
                <SelectItem value="local">Local Model</SelectItem>
                <SelectItem value="anthropic">Anthropic</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Language Mode</label>
            <Select value={languageMode} onValueChange={setLanguageMode}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="auto">Auto Detect</SelectItem>
                <SelectItem value="manual">Manual</SelectItem>
                <SelectItem value="english">English Only</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500">Auto: Respond in user input language (Urdu, English, Arabic, Hindi, French, Spanish)</p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">System Prompt</label>
            <Textarea
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              placeholder="Default system prompt for all AI requests..."
              rows={4}
            />
            <p className="text-xs text-gray-500">This prompt is prepended to all user requests. Leave empty for default.</p>
          </div>

          <Button onClick={saveConfig} disabled={saving} className="w-full">
            {saving ? 'Saving...' : 'Save AI Configuration'}
          </Button>

          <div className="flex gap-2 p-3 bg-blue-50 rounded-lg">
            <Bot className="h-4 w-4 mt-0.5" />
            <div>
              <p className="font-medium text-sm">Current Status</p>
              <div className="flex gap-2 mt-1">
                <Badge>Provider: {provider.toUpperCase()}</Badge>
                <Badge variant="secondary">Language: {languageMode}</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


