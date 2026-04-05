import OpenAI from 'openai'
import { prisma } from './db'
import { deductCredits, getUserCredits } from './credits'
import { truncatePrompt } from './utils'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

async function openaiWithTimeout(prompt: string, model = 'gpt-4o-mini', timeoutMs = 30000): Promise<string> {
  console.log('START OPENAI CALL');
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  
  try {
    const safePrompt = truncatePrompt(prompt);
    const response = await openai.chat.completions.create({
      model,
      messages: [{ role: 'user', content: safePrompt }],
      temperature: 0.3,
      max_tokens: 4000,
      timeout: timeoutMs,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    console.log('DONE OPENAI CALL');
    return response.choices[0].message.content || '';
  } catch (error: any) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError' || error.message.includes('timeout')) {
      throw new Error('OpenAI call timed out');
    }
    throw error;
  }
}

export async function generateAI(prompt: string, model = 'gpt-4o-mini'): Promise<string> {
  return openaiWithTimeout(prompt, model);
}

export async function generateHSE(userId: string, docType: string, details: any, templateId?: string): Promise<string> {
  if (!process.env.OPENAI_API_KEY) throw new Error('OPENAI_API_KEY not set')
  
  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user?.isPaid) await deductCredits(userId, 5, 'HSE gen')
  
  let prompt = `Generate HSE ${docType} document. Output structured JSON: {
  "title": "string",
  "sections": [
    {"title": "string", "content": "markdown"}
  ],
  "hazards": array,
  "risks": array,
  "controls": array,
  "ppe": array,
  "emergency": "string",
  "responsibilities": array
}. Include hazard identification, risk levels (High/Medium/Low), control measures, PPE, emergency response, responsibility matrix. Details: ${truncatePrompt(JSON.stringify(details))} Professional, editable markdown sections.`
  
  if (templateId) {
    const template = await prisma.template.findUnique({ where: { id: templateId } })
    if (template) prompt = template.content.replace('{details}', truncatePrompt(JSON.stringify(details))) + '\nJSON format required.'
  }
  
  const result = await generateAI(prompt)
  return result
}

// Other funcs...
export async function generateDocument(userId: string, type: string, details: any): Promise<string> {
  const prompt = `Generate ${type} HSE document as structured JSON/markdown. Details: ${truncatePrompt(JSON.stringify(details))}`
  if (!await prisma.user.findFirst({ where: { id: userId, isPaid: true } })) await deductCredits(userId, 5, 'doc gen')
  return generateAI(prompt)
}

