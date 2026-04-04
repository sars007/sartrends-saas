import { prisma } from './db'
import { deductCredits } from './credits'

const OLLAMA_BASE = 'http://localhost:11434';

export async function generateAI(prompt: string, model = 'llama3', stream = false): Promise<string> {
  const response = await fetch(`${OLLAMA_BASE}/api/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ model, prompt, stream }),
  });
  const data = await response.json();
  return data.response;
}

export async function generateResume(userId: string, details: any, templateId?: string): Promise<string> {
  await deductCredits(userId, 5, 'resume gen');
  let prompt = `Generate professional resume for: ${JSON.stringify(details)}. ATS friendly, English/Urdu.`;
  if (templateId) {
    const template = await prisma.template.findUnique({ where: { id: templateId } });
    if (template) {
      prompt = template.content.replace(/{details}/g, JSON.stringify(details)) + '\\nUse these details to fill the template: ' + JSON.stringify(details);
    }
  }
  return generateAI(prompt);
}

// Add more: coverLetter, HSE doc etc.

// Server-side only functions
export async function generateWithCredit(userId: string, prompt: string, model = 'llama3'): Promise<string> {
  await deductCredits(userId, 5, 'AI generation');
  return generateAI(prompt, model);
}

export async function generateCoverLetter(userId: string, details: any): Promise<string> {
  const prompt = `Generate cover letter for: ${JSON.stringify(details)} professional format.`;
  return generateWithCredit(userId, prompt);
}

export async function generateDocument(userId: string, type: string, details: any): Promise<string> {
  const prompt = `Generate ${type} document: ${JSON.stringify(details)}. HSE compliant if safety, professional format, editable markdown.`;
  return generateWithCredit(userId, prompt);
}

export async function generateHSE(userId: string, docType: 'truck' | 'office' | 'construction', details: any): Promise<string> {
  const prompt = `Generate HSE safety document for ${docType} operations. Details: ${JSON.stringify(details)}. Include risk assessment, PPE, procedures, compliance standards, signatures placeholder. Professional PDF-ready.`;
  return generateWithCredit(userId, prompt);
}

export async function atsCheck(userId: string, resumeText: string, jobDesc: string): Promise<string> {
  const prompt = `Analyze resume for ATS compatibility with job: ${jobDesc}. Resume: ${resumeText}. Score 1-100, improvements list, keyword suggestions.`;
  return generateWithCredit(userId, prompt);
}

export async function* chatStream(userId: string, messages: Array<{role: 'user' | 'assistant', content: string}>, model = 'llama3') {
  await deductCredits(userId, 2, 'chat message');
  const response = await fetch(`${OLLAMA_BASE}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ model, messages, stream: true }),
  });

  const reader = response.body?.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader?.read() ?? { done: true, value: undefined };
    if (done) break;
    buffer += decoder.decode(value, {stream: true});
    const lines = buffer.split('\\n');
    buffer = lines.pop() ?? '';
    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const data = line.slice(6);
        if (data === '[DONE]') break;
        try {
          const parsed = JSON.parse(data);
          if (parsed.message?.content) yield parsed.message.content;
        } catch {}
      }
    }
  }
}

