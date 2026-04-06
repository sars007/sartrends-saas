export async function POST(req: Request) {
  try {
    const body = await req.json();
    const prompt = body?.prompt || "Sample Product";

    // Try AI (optional)
    let aiResult = null;

    try {
      if (process.env.OPENAI_API_KEY) {
        const res = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + process.env.OPENAI_API_KEY
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [
              { role: "user", content: "Write marketing copy for: " + prompt }
            ]
          })
        });

        const data = await res.json();
        aiResult = data?.choices?.[0]?.message?.content;
      }
    } catch (e) {
      aiResult = null;
    }

    const result = aiResult || generateFallback(prompt);

    return new Response(JSON.stringify({ result }), {
      headers: { "Content-Type": "application/json" }
    });

  } catch (error) {
    return new Response(JSON.stringify({
      result: generateFallback("Default Product")
    }), { status: 200 });
  }
}

function generateFallback(prompt: string) {
  return 
🔥 Marketing Copy

Product: 

✔ High quality
✔ Affordable price
✔ Trusted by customers

👉 Order now before stock runs out!
;
}
