import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ result: 'API key missing' });
    }

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

    if (!res.ok) {
      return NextResponse.json({
        result: 'OpenAI error: ' + JSON.stringify(data)
      });
    }

    return NextResponse.json({
      result: data.choices?.[0]?.message?.content || 'No response'
    });

  } catch (err: any) {
    return NextResponse.json({
      result: 'Server error: ' + err.message
    });
  }
}
