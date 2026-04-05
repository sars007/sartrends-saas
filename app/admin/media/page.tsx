'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Upload, Image, Video, Trash2 } from "lucide-react"
import { Input } from "@/components/ui/input"

export default function MediaManager() {
  const [files, setFiles] = useState<any[]>([])
  const [uploading, setUploading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const handleUpload = async () => {
    if (!selectedFile) return

    setUploading(true)
    const formData = new FormData()
    formData.append('file', selectedFile)

    try {
      const res = await fetch('/api/admin/media', {
        method: 'POST',
        body: formData,
        credentials: 'include'
      })
      if (res.ok) {
        // Refresh list
        console.log('Uploaded:', await res.json())
      }
    } catch (error) {
      console.error('Upload failed')
    } finally {
      setUploading(false)
      setSelectedFile(null)
    }
  }

  const deleteMedia = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/media/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      })
      if (res.ok) {
        // Refresh list
        console.log('Deleted')
      }
    } catch (error) {
      console.error('Delete failed')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Image className="h-8 w-8 text-blue-600" />
        <h1 className="text-3xl font-bold">Media Library</h1>
      </div>

      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle>Upload New Media</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Input
              type="file"
              accept="image/*,video/*"
              onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
              className="flex-1"
            />
            <Button onClick={handleUpload} disabled={!selectedFile || uploading}>
              {uploading ? 'Uploading...' : 'Upload'}
              <Upload className="ml-2 h-4 w-4" />
            </Button>
          </div>
          <p className="text-sm text-gray-500">Supports images and videos. Max 10MB.</p>
        </CardContent>
      </Card>

      {/* Media Grid */}
      <Card>
        <CardHeader>
          <CardTitle>Library ({files.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {files.map((file) => (
              <div key={file.id} className="border rounded-lg p-3 hover:shadow-md group">
                <div className="relative aspect-video bg-gray-100 rounded overflow-hidden mb-2">
                  {file.type === 'image' ? (
                    <img src={file.url} alt="media" className="w-full h-full object-cover" />
                  ) : (
  <Film className="w-full h-full object-cover absolute inset-0" />
                  )}
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition"
                    onClick={() => deleteMedia(file.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
                <div className="space-y-1">
                  <p className="font-medium truncate">{file.name || file.url.split('/').pop()}</p>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{file.type}</Badge>
                    <Badge>{new Date(file.createdAt).toLocaleDateString()}</Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {files.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No media uploaded yet. Upload your first image or video!
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}


