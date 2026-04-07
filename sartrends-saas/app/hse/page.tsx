'use client'

import { useState, useRef, useEffect } from 'react'
import { getClientSession } from '@/components/ui/auth-utils'
import { exportPDF, exportDocx, exportMarkdown } from '@/lib/export'

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
  const [session, setSession] = useState(null)
  const [credits, setCredits ] = useState(0)
  const [isPaid, setIsPaid ] = useState(false)
  const [docType, setDocType ] = useState('risk')
  const [lowCredits, setLowCredits ] = useState(false)

  useEffect(() => {
    const init = async () => {
      const s = await getClientSession()
      setSession(s)
      if (s?.user?.id) {
        const res = await fetch('/api/user/credits')
        const { credits: c } = await res.json()
        setCredits(c)
        setIsPaid(s.user.isPaid)
        setLowCredits(c < 5 && !s.user.isPaid)
      }
    }
    init()
  }, [])

const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [templates, setTemplates] = useState<any[]>([])
  const previewRef = useRef<HTMLDivElement>(null)


  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { title: '', details: '', templateId: '' }
  })

useEffect(() => {
    if (session?.user?.id) {
      fetch('/api/templates').then(res => res.json()).then(({ templates }) => setTemplates(templates || [])).catch(console.error);
    }
  }, [session]);

const onSubmit = async (data: FormData) => {
    if (lowCredits) {
      setError('Low credits. Upgrade to premium or earn more.')
      return
    }
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        body: JSON.stringify({ type: 'hse', docType, details: data, templateId: data.templateId }),
      })
      if (!res.ok) throw new Error(await res.text())
      const { content } = await res.json()
      setContent(content)
    } catch (e: any) {
      setError('Generation failed: ' + e.message)
    }
    setLoading(false)
  }



  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">HSE Document Generator</h1>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
          <CardContent className="p-6 space-y-4">
            <Input {...form.register('title')} placeholder="Document Title" />
            <Textarea {...form.register('details')} placeholder="Project details, location, activities..." rows={6} />
            <select value={docType} onChange={(e) => setDocType(e.target.value)} className="p-3 border rounded w-full">
              <option value="risk">Risk Assessment</option>
              <option value="method-statement">Method Statement</option>
              <option value="toolbox-talk">Toolbox Talk</option>
              <option value="permit-work">Permit to Work</option>
            </select>
<select {...form.register('templateId')} className="p-3 border rounded w-full">
              <option value="">Auto HSE</option>
              {templates.map((t: any) => (
                <option key={t.id} value={t.id}>{t.name} ({t.type}) {t.isPremium ? '[Premium]' : ''}</option>
              ))}
            </select>
            <Button type="submit" disabled={loading || lowCredits} className="w-full">
              {loading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <Bot className="mr-2 h-4 w-4" />}
              {lowCredits ? 'Low Credits' : 'Generate HSE'}
            </Button>
            {lowCredits && (
              <Card variant="destructive" className="p-4">
                <CardContent className="p-0">
                  <div>Low credits. <a href="/upgrade" className="text-blue-600 underline">Upgrade</a> for unlimited access.</div>
                </CardContent>
              </Card>
            )}
            {error && (
              <Card variant="destructive" className="p-4 mt-4">
                <CardContent className="p-0 space-y-2">
                  <div className="flex items-start gap-2">
                    <Loader2 className="h-4 w-4 animate-spin mt-0.5 text-red-500 flex-shrink-0" />
                    <p>{error}</p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setError('')
                      form.reset()
                      setContent('')
                    }}
                    className="w-full"
                  >
                    Clear & Retry
                  </Button>
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>
      </form>
      {content && (
        <Card className="mt-8">
          <CardContent className="p-6">
            <div ref={previewRef} className="relative prose max-w-none">
              <div dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, '<br>') }} />
              {!isPaid && (
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center pointer-events-none z-10">
                  <div className="text-white/90 text-4xl font-black rotate-[-15deg] tracking-widest uppercase drop-shadow-lg">PREMIUM UPGRADE REQUIRED</div>
                </div>
              )}
            </div>
            <div className="space-y-2 mt-4">
              <Button onClick={() => exportPDF(previewRef.current, form.getValues('title') || 'hse-doc')} disabled={!isPaid || lowCredits} className="w-full">
                <Download className="mr-2 h-4 w-4" /> PDF
              </Button>
              <Button onClick={() => exportDocx(content, form.getValues('title') || 'hse-doc')} disabled={!isPaid || lowCredits} className="w-full" variant="outline">
                DOCX
              </Button>
              <Button onClick={() => exportMarkdown(content, form.getValues('title') || 'hse-doc')} disabled={!isPaid || lowCredits} className="w-full" variant="outline">
                Markdown
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

