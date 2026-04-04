'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, Download, Bot, CheckCircle } from 'lucide-react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

const schema = z.object({
  title: z.string(),
  details: z.string(),
  templateId: z.string().optional(),
})

type FormData = z.infer<typeof schema>

export default function HSEGenerator() {
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [templates, setTemplates] = useState<any[]>([])
  const previewRef = useRef<HTMLDivElement>(null)

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { title: '', details: '', templateId: '' }
  })

  // Fetch templates
  // useEffect...

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        body: JSON.stringify({ type: 'hse', docType: 'risk', details: data, templateId: data.templateId }),
      })
      const { content } = await res.json()
      setContent(content)
    } catch {}
    setLoading(false)
  }

  const downloadPDF = () => {
    if (!previewRef.current) return
    html2canvas(previewRef.current).then(canvas => {
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF()
      pdf.addImage(imgData, 'PNG', 0, 0)
      pdf.save('hse-doc.pdf')
    })
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">HSE Document Generator</h1>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
          <CardContent className="p-6 space-y-4">
            <Input {...form.register('title')} placeholder="Document Title" />
            <Textarea {...form.register('details')} placeholder="Project details, location, activities..." rows={6} />
            <select {...form.register('templateId')} className="p-3 border rounded w-full">
              <option value="">Auto HSE</option>
              <option value="risk">Risk Assessment</option>
              {/* templates */}
            </select>
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? <Loader2 className="animate-spin" /> : <Bot />}
              Generate
            </Button>
          </CardContent>
        </Card>
      </form>
      {content && (
        <Card className="mt-8">
          <CardContent>
            <div ref={previewRef} className="prose max-w-none">
              <div dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, '<br>') }} />
            </div>
            <Button onClick={downloadPDF} className="mt-4">
              <Download />
              PDF
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

