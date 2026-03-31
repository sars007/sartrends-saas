export type GenerateAiInput = {
  prompt: string;
  lang?: "english" | "urdu";
};

const fallbackEnglish = `# Professional Resume

## Summary
Results-driven Software Engineer with strong experience in React, Next.js, Node.js, and product-focused development. Proven ability to deliver performant web applications and measurable business outcomes.

## Skills
- React, Next.js, TypeScript
- Node.js, API Design
- Prisma, SQL
- TailwindCSS, UI Systems
- AI-assisted product workflows

## Experience
### Senior Software Engineer
- Built and scaled SaaS modules, improving user retention and reducing onboarding friction.
- Implemented AI-powered generation workflows with strong UX and reliability patterns.

### Full Stack Developer
- Delivered end-to-end features across frontend and backend with measurable performance gains.

## Education
Bachelor's Degree in Computer Science

## Certifications
- Modern Web Development
- Cloud Fundamentals
`;

const fallbackUrdu = `# پروفیشنل ریزیومے

## خلاصہ
نتائج پر مبنی سافٹ ویئر انجینئر جسے React، Next.js، Node.js اور پراڈکٹ ڈویلپمنٹ کا مضبوط تجربہ حاصل ہے۔

## مہارتیں
- React, Next.js, TypeScript
- Node.js, API Design
- Prisma, SQL
- TailwindCSS
- AI ورک فلو

## تجربہ
### سینئر سافٹ ویئر انجینئر
- SaaS ماڈیولز تیار کیے اور بہتر بنائے۔
- AI جنریشن فیچرز نافذ کیے۔

## تعلیم
بیچلر ان کمپیوٹر سائنس
`;

export async function generateAIResponse(input: GenerateAiInput): Promise<string> {
  const prompt = input.prompt?.trim();
  if (!prompt) {
    throw new Error("Prompt is required.");
  }

  const model = process.env.AI_MODEL ?? "llama3.2";
  const ollamaUrl = process.env.OLLAMA_URL ?? "http://127.0.0.1:11434/api/generate";

  try {
    const res = await fetch(ollamaUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model,
        prompt: `${input.lang === "urdu" ? "Respond in Urdu.\n" : "Respond in English.\n"}${prompt}`,
        stream: false,
      }),
    });

    if (!res.ok) throw new Error(`OLLAMA_HTTP_${res.status}`);
    const data = (await res.json()) as { response?: string };
    if (!data?.response) throw new Error("OLLAMA_EMPTY_RESPONSE");
    return data.response;
  } catch {
    return input.lang === "urdu" ? fallbackUrdu : fallbackEnglish;
  }
}
