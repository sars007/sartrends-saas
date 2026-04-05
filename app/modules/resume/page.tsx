'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { Textarea } from '../../../components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card'
import { Loader2, Download, Bot, FileText, CheckCircle, Copy, Star } from 'lucide-react'
import { cn } from '../../../lib/utils'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import { getClientSession } from '../../../components/ui/auth-utils'

const resumeSchema = z.object({
  personal: z.object({
    name: z.string().min(1),
    email: z.string().email(),
    phone: z.string(),
    location: z.string(),
  }),
  experience: z.array(z.object({
    title: z.string(),
    company: z.string(),
    dates: z.string(),
    description: z.string(),
  })).min(1),
  education: z.array(z.object({
    degree: z.string(),
    school: z.string(),
    dates: z.string(),
  })).min(1),
  skills: z.array(z.string()).min(1),
})

type ResumeForm = z.infer<typeof resumeSchema>
type TabType = 'builder' | 'cover-letter' | 'ats-check'

export default function ResumeBuilder() {
const [activeTab, setActiveTab] = useState<TabType>('builder')
  const [generatedResume, setGeneratedResume] = useState('')
  const [generatedCoverLetter, setGeneratedCoverLetter] = useState('')
  const [atsResult, setAtsResult] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState('')
  const [preview, setPreview] = useState(false)
  const [templates, setTemplates] = useState([])
  const [selectedTemplateId, setSelectedTemplateId] = useState('')
  const previewRef = useRef<HTMLDivElement>(null)
  const coverLetterRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const [session, setSession] = useState<any>(null)
  const [isLoadingSession, setIsLoadingSession] = useState(true)
  const [coverLetterData, setCoverLetterData] = useState({ name: '', position: '', company: '', experience: '', skills: '' })
  const [atsData, setAtsData] = useState({ resumeText: '', jobDesc: '' })

  useEffect(() => {
    const checkSession = async () => {
      const s = await getClientSession()
      setSession(s)
      setIsLoadingSession(false)
      if (!s?.user?.id) router.push('/login')
    }
    checkSession()
  }, [router])

  useEffect(() => {
    fetch('/api/templates')
      .then(res => res.json())
      .then(data => {
        const resumeTemplates = data.templates?.filter((t: any) => t.type === 'resume') || []
        setTemplates(resumeTemplates)
        if (resumeTemplates.length > 0) setSelectedTemplateId(resumeTemplates[0].id)
      })
      .catch(console.error)
  }, [])

  if (isLoadingSession) return (<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100"><Loader2 className="h-8 w-8 animate-spin text-blue-500" /></div>)
  if (!session?.user?.id) return null

  const form = useForm<ResumeForm>({
    resolver: zodResolver(resumeSchema),
    defaultValues: {
      personal: { name: '', email: '', phone: '', location: '' },
      experience: [{ title: '', company: '', dates: '', description: '' }],
      education: [{ degree: '', school: '', dates: '' }],
      skills: [''],
    },
  })

  const { fields: expFields, append: appendExp, remove: removeExp } = useFieldArray({ control: form.control, name: 'experience' })
  const { fields: eduFields, append: appendEdu, remove: removeEdu } = useFieldArray({ control: form.control, name: 'education' })
  const { fields: skillFields, append: appendSkill, remove: removeSkill } = useFieldArray({ control: form.control, name: 'skills' })

  const onSubmit = form.handleSubmit(async (data) => {
    setIsGenerating(true)
    setError('')
    try {
      const response = await fetch('/api/ai/resume', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ details: data, templateId: selectedTemplateId }) })
      if (!response.ok) throw new Error(await response.text())
      const { resume } = await response.json()
      setGeneratedResume(resume)
      setPreview(true)
    } catch (error: any) { 
      setError('Error generating resume: ' + error.message) 
    }
    finally { setIsGenerating(false) }
  })

  const handleCoverLetter = async () => {
    if (!coverLetterData.name || !coverLetterData.position) { 
      setError('Please fill in required fields'); 
      return 
    }
    setIsGenerating(true)
    setError('')
    try {
      const response = await fetch('/api/ai/cover-letter', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ details: coverLetterData }) })
      if (!response.ok) throw new Error(await response.text())
      const { coverLetter } = await response.json()
      setGeneratedCoverLetter(coverLetter)
    } catch (error: any) { 
      setError('Error generating cover letter: ' + error.message) 
    }
    finally { setIsGenerating(false) }
  }

  const handleAtsCheck = async () => {
    if (!atsData.resumeText || !atsData.jobDesc) { 
      setError('Please provide both resume and job description'); 
      return 
    }
    setIsGenerating(true)
    setError('')
    try {
      const response = await fetch('/api/ai/ats', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(atsData) })
      if (!response.ok) throw new Error(await response.text())
      const { result } = await response.json()
      setAtsResult(result)
    } catch (error: any) { 
      setError('Error running ATS check: ' + error.message) 
    }
    finally { setIsGenerating(false) }
  }

  const downloadPDF = (ref: HTMLDivElement, filename: string) => {
    if (!ref) return
    html2canvas(ref).then(canvas => {
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF('p', 'mm', 'a4')
      const imgWidth = 210, pageHeight = 295, imgHeight = (canvas.height * imgWidth) / canvas.width
      let heightLeft = imgHeight, position = 0
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight
      while (heightLeft >= 0) { position = heightLeft - imgHeight; pdf.addPage(); pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight); heightLeft -= pageHeight }
      pdf.save(filename)
    })
  }

  const copyToClipboard = (text: string) => { navigator.clipboard.writeText(text); /* alert('Copied!') */ }

  const tabs = [{ id: 'builder', label: 'Resume Builder', icon: FileText }, { id: 'cover-letter', label: 'Cover Letter', icon: Star }, { id: 'ats-check', label: 'ATS Check', icon: CheckCircle }] as const

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8"><h1 className="text-3xl font-bold text-gray-900 mb-2">Resume & Career Tools</h1><p className="text-gray-600">Build professional resumes, cover letters, and check ATS compatibility</p></div>
        {error && (
          <Card variant="destructive" className="p-4 mb-6">
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
                }}
                className="w-full"
              >
                Clear Error
              </Button>
            </CardContent>
          </Card>
        )}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {tabs.map((tab) => (<Button key={tab.id} variant={activeTab === tab.id ? 'default' : 'outline'} onClick={() => setActiveTab(tab.id)} className={cn('gap-2 whitespace-nowrap', activeTab === tab.id && 'bg-gradient-to-r from-blue-600 to-purple-600')}><tab.icon className="h-4 w-4" />{tab.label}</Button>))}
        </div>

        {activeTab === 'builder' && (
          <div className="grid lg:grid-cols-2 gap-8">
            <Card><CardHeader><CardTitle>1. Enter Your Details</CardTitle></CardHeader><CardContent className="p-6"><form onSubmit={onSubmit} className="space-y-6">
              <div><label className="text-sm font-medium mb-2 block">Personal Information</label><div className="grid grid-cols-2 gap-2"><Input {...form.register('personal.name')} placeholder="Full Name" /><Input {...form.register('personal.email')} placeholder="Email" type="email" /><Input {...form.register('personal.phone')} placeholder="Phone" /><Input {...form.register('personal.location')} placeholder="Location" /></div></div>
              <Card><CardHeader><CardTitle>Experience</CardTitle></CardHeader><CardContent className="space-y-4 p-6">{expFields.map((field, index) => (<div key={field.id} className="flex gap-2 items-end"><Input {...form.register(`experience.${index}.title`)} placeholder="Job Title" /><Input {...form.register(`experience.${index}.company`)} placeholder="Company" /><Input {...form.register(`experience.${index}.dates`)} placeholder="Dates" /><Button type="button" variant="destructive" onClick={() => removeExp(index)} size="sm">Remove</Button></div>))}<Button type="button" variant="outline" onClick={() => appendExp({ title: '', company: '', dates: '', description: '' })} className="w-full">Add Experience</Button></CardContent></Card>
              <Card><CardHeader><CardTitle>Education</CardTitle></CardHeader><CardContent className="space-y-4 p-6">{eduFields.map((field, index) => (<div key={field.id} className="flex gap-2 items-end"><Input {...form.register(`education.${index}.degree`)} placeholder="Degree" /><Input {...form.register(`education.${index}.school`)} placeholder="School" /><Input {...form.register(`education.${index}.dates`)} placeholder="Dates" /><Button type="button" variant="destructive" onClick={() => removeEdu(index)} size="sm">Remove</Button></div>))}<Button type="button" variant="outline" onClick={() => appendEdu({ degree: '', school: '', dates: '' })} className="w-full">Add Education</Button></CardContent></Card>
              <div><label className="text-sm font-medium mb-2 block">Skills</label>{skillFields.map((field, index) => (<div key={field.id} className="flex gap-2 mb-2"><Input {...form.register(`skills.${index}`)} placeholder="e.g. React, Node.js" /><Button type="button" variant="destructive" onClick={() => removeSkill(index)} size="sm">Remove</Button></div>))}<Button type="button" variant="outline" onClick={() => appendSkill('')} className="w-full">Add Skill</Button></div>
              <Card><CardHeader><CardTitle>Template</CardTitle></CardHeader><CardContent className="p-6"><select value={selectedTemplateId} onChange={(e) => setSelectedTemplateId(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg bg-white"><option value="">Auto...</option>{templates.map((t: any) => (<option key={t.id} value={t.id}>{t.name} {t.isPremium ? '(Premium)' : ''}</option>))}</select></CardContent></Card>
              <Button className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white">{isGenerating ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Generating...</> : <><Bot className="mr-2 h-4 w-4" />Generate Resume</>}</Button>
            </form></CardContent></Card>
            <div><Card className="lg:sticky lg:top-8 h-fit"><CardHeader><CardTitle>2. Preview & Download</CardTitle></CardHeader><CardContent className="p-6">{preview || generatedResume ? (<div><div ref={previewRef} className="bg-white p-8 rounded-lg shadow-lg min-h-[600px]"><div dangerouslySetInnerHTML={{ __html: generatedResume.replace(/\n/g, '<br>') }} /></div><div className="flex gap-2 mt-4"><Button onClick={() => downloadPDF(previewRef.current!, 'resume.pdf')} className="flex-1"><Download className="mr-2 h-4 w-4" />Download PDF</Button><Button variant="outline" onClick={() => setPreview(false)}>Edit</Button></div></div>) : (<div className="text-center text-gray-500 py-12"><FileText className="mx-auto h-12 w-12 mb-4 opacity-40" /><p>Generated resume will appear here</p></div>)}</CardContent></Card></div>
          </div>)}

        {activeTab === 'cover-letter' && (
          <div className="grid lg:grid-cols-2 gap-8">
            <Card><CardHeader><CardTitle>Cover Letter Generator</CardTitle></CardHeader><CardContent className="p-6 space-y-4">
              <div><label className="text-sm font-medium mb-2 block">Your Name *</label><Input value={coverLetterData.name} onChange={(e) => setCoverLetterData({...coverLetterData, name: e.target.value})} placeholder="John Doe" /></div>
              <div><label className="text-sm font-medium mb-2 block">Position *</label><Input value={coverLetterData.position} onChange={(e) => setCoverLetterData({...coverLetterData, position: e.target.value})} placeholder="Software Engineer" /></div>
              <div><label className="text-sm font-medium mb-2 block">Company</label><Input value={coverLetterData.company} onChange={(e) => setCoverLetterData({...coverLetterData, company: e.target.value})} placeholder="Tech Company" /></div>
              <div><label className="text-sm font-medium mb-2 block">Experience</label><Textarea value={coverLetterData.experience} onChange={(e) => setCoverLetterData({...coverLetterData, experience: e.target.value})} placeholder="5 years experience..." rows={4} /></div>
              <div><label className="text-sm font-medium mb-2 block">Skills</label><Textarea value={coverLetterData.skills} onChange={(e) => setCoverLetterData({...coverLetterData, skills: e.target.value})} placeholder="JavaScript, React..." rows={3} /></div>
              <Button onClick={handleCoverLetter} disabled={isGenerating} className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white">{isGenerating ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Generating...</> : <><Star className="mr-2 h-4 w-4" />Generate Cover Letter</>}</Button>
            </CardContent></Card>
            <Card className="lg:sticky lg:top-8 h-fit"><CardHeader className="flex flex-row items-center justify-between"><CardTitle>Generated Cover Letter</CardTitle>{generatedCoverLetter && (<div className="flex gap-2"><Button variant="outline" size="sm" onClick={() => copyToClipboard(generatedCoverLetter)}><Copy className="h-4 w-4 mr-1" />Copy</Button><Button size="sm" onClick={() => downloadPDF(coverLetterRef.current!, 'cover-letter.pdf')}><Download className="h-4 w-4 mr-1" />PDF</Button></div>)}</CardHeader><CardContent className="p-6">{generatedCoverLetter ? (<div ref={coverLetterRef} className="bg-white p-8 rounded-lg shadow-lg min-h-[500px]"><div className="whitespace-pre-wrap">{generatedCoverLetter}</div></div>) : (<div className="text-center text-gray-500 py-12"><FileText className="mx-auto h-12 w-12 mb-4 opacity-40" /><p>Your cover letter will appear here</p></div>)}</CardContent></Card>
          </div>)}

        {activeTab === 'ats-check' && (
          <div className="grid lg:grid-cols-2 gap-8">
            <Card><CardHeader><CardTitle>ATS Compatibility Check</CardTitle></CardHeader><CardContent className="p-6 space-y-4">
              <div><label className="text-sm font-medium mb-2 block">Resume Text *</label><Textarea value={atsData.resumeText} onChange={(e) => setAtsData({...atsData, resumeText: e.target.value})} placeholder="Paste your resume..." rows={10} /></div>
              <div><label className="text-sm font-medium mb-2 block">Job Description *</label><Textarea value={atsData.jobDesc} onChange={(e) => setAtsData({...atsData, jobDesc: e.target.value})} placeholder="Paste job description..." rows={6} /></div>
              <Button onClick={handleAtsCheck} disabled={isGenerating} className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white">{isGenerating ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Analyzing...</> : <><CheckCircle className="mr-2 h-4 w-4" />Check ATS Compatibility</>}</Button>
            </CardContent></Card>
            <Card className="lg:sticky lg:top-8 h-fit"><CardHeader><CardTitle>Analysis Results</CardTitle></CardHeader><CardContent className="p-6">{atsResult ? (<div className="bg-white p-6 rounded-lg shadow-lg whitespace-pre-wrap">{atsResult}</div>) : (<div className="text-center text-gray-500 py-12"><CheckCircle className="mx-auto h-12 w-12 mb-4 opacity-40" /><p>ATS results will appear here</p></div>)}</CardContent></Card>
          </div>)}
      </div>
    </div>
  )
}

