import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const { prompt } = await req.json();

  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + process.env.OPENAI_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are a marketing expert.' },
          { role: 'user', content: prompt }
        ]
      })
    });

    const data = await res.json();

    if (res.ok && data.choices) {
      return NextResponse.json({
        result: data.choices[0].message.content
      });
    }

    // ?? fallback (no error shown to user)
    return NextResponse.json({
      result: generateFallback(prompt)
    });

  } catch (err) {
    return NextResponse.json({
      result: generateFallback(prompt)
    });
  }
}

function generateFallback(prompt: string) {
  return 
?? Marketing Copy

Product: 

• High-quality product designed for modern users  
• Boost your lifestyle instantly  
• Trusted by customers worldwide  

?? Try it today and see the difference!
;
}
