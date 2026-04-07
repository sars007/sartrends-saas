'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { ToggleLeft, ToggleRight, Settings } from "lucide-react"
import { Input } from "@/components/ui/input"

interface Flag {
  id: string
  key: string
  value: boolean
}

export default function FeatureManager() {
  const [flags, setFlags] = useState<Flag[]>([])
  const [loading, setLoading] = useState(true)
  const [editingKey, setEditingKey] = useState('')

  useEffect(() => {
    fetchFlags()
  }, [])

  const fetchFlags = async () => {
    try {
      const res = await fetch('/api/admin/flags', { credentials: 'include' })
      if (res.ok) {
        const data = await res.json()
        setFlags(data)
      }
    } catch (error) {
      console.error('Failed to fetch flags')
    } finally {
      setLoading(false)
    }
  }

  const toggleFlag = async (id: string, currentValue: boolean) => {
    try {
      const res = await fetch(`/api/admin/flags/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value: !currentValue }),
        credentials: 'include'
      })
      if (res.ok) {
        fetchFlags()
      }
    } catch (error) {
      console.error('Failed to toggle flag')
    }
  }

  const updateKey = async (id: string) => {
    if (!editingKey.trim()) return
    try {
      const res = await fetch(`/api/admin/flags/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: editingKey }),
        credentials: 'include'
      })
      if (res.ok) {
        fetchFlags()
        setEditingKey('')
      }
    } catch (error) {
      console.error('Failed to update key')
    }
  }

  const createFlag = async () => {
    // Implementation for create new flag
    console.log('Create new flag')
  }

  if (loading) return <div>Loading features...</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Settings className="h-8 w-8 text-blue-600" />
        <h1 className="text-3xl font-bold">Feature Flags</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Existing Flags</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {flags.map((flag) => (
            <div key={flag.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-4 flex-1">
                <Switch 
                  checked={flag.value}
                  onCheckedChange={() => toggleFlag(flag.id, flag.value)}
                  className="data-[state=checked]:bg-green-600"
                />
                {editingKey === flag.key ? (
                  <div className="flex items-center gap-2">
                    <Input
                      value={editingKey}
                      onChange={(e) => setEditingKey(e.target.value)}
                      onBlur={() => updateKey(flag.id)}
                      onKeyDown={(e) => e.key === 'Enter' && updateKey(flag.id)}
                      className="max-w-48"
                    />
                    <Button variant="outline" size="sm" onClick={() => setEditingKey('')}>
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <div className="min-w-0 flex-1">
                    <p className="font-medium truncate">{flag.key}</p>
                  </div>
                )}
              </div>
              <Badge variant={flag.value ? "default" : "secondary"}>
                {flag.value ? "ON" : "OFF"}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Add New Flag</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input placeholder="flag_key" className="flex-1" />
            <Button onClick={createFlag}>Create</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


