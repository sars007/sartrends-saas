'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Global, Palette, Type } from "lucide-react"

interface SiteSetting {
  id: string
  key: string
  value: string
}

export default function SiteEditor() {
  const [settings, setSettings] = useState<SiteSetting[]>([])
  const [loading, setLoading] = useState(true)
  const [editingSetting, setEditingSetting] = useState<SiteSetting | null>(null)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/admin/site-settings', { credentials: 'include' })
      if (res.ok) {
        const data = await res.json()
        setSettings(data)
      }
    } catch (error) {
      console.error('Failed to fetch settings')
    } finally {
      setLoading(false)
    }
  }

  const saveSetting = async (setting: SiteSetting) => {
    try {
      const res = await fetch(`/api/admin/site-settings/${setting.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(setting),
        credentials: 'include'
      })
      if (res.ok) {
        fetchSettings()
        setEditingSetting(null)
      }
    } catch (error) {
      console.error('Failed to save setting')
    }
  }

  const createSetting = async () => {
    // Create new setting
    console.log('Create new setting')
  }

  if (loading) return <div>Loading site settings...</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Globe className="h-8 w-8 text-green-600" />
        <h1 className="text-3xl font-bold">Site Editor</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Homepage Sections</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <span>Hero Title</span>
              <Badge>Editable</Badge>
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <span>Hero Subtitle</span>
              <Badge>Editable</Badge>
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <span>Services Section</span>
              <Badge>Editable</Badge>
            </div>
            <Button className="w-full" variant="outline">
              Manage Homepage Content
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Custom Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {settings.map((setting) => (
              <div key={setting.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{setting.key}</span>
                  <Badge>{typeof JSON.parse(setting.value) === 'object' ? 'JSON' : 'Text'}</Badge>
                </div>
                {editingSetting?.id === setting.id ? (
                  <div className="flex gap-2">
                    <Textarea
                      value={editingSetting.value}
                      onChange={(e) => setEditingSetting({ ...editingSetting, value: e.target.value })}
                      className="flex-1"
                    />
                    <Button onClick={() => saveSetting(editingSetting!)}>Save</Button>
                    <Button variant="outline" onClick={() => setEditingSetting(null)}>Cancel</Button>
                  </div>
                ) : (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setEditingSetting(setting)}
                    className="w-full"
                  >
                    Edit
                  </Button>
                )}
              </div>
            ))}
            <Button onClick={createSetting} variant="outline" className="w-full">
              + Add New Setting
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


