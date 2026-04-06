export async function POST(req: Request) {
  try {
    const body = await req.json();
    const prompt = body?.prompt || "Sample Product";

    return new Response(JSON.stringify({
      result: generateFallback(prompt)
    }), {
      headers: { "Content-Type": "application/json" }
    });

  } catch (error) {
    return new Response(JSON.stringify({
      result: generateFallback("Default Product")
    }), { status: 200 });
  }
}

function generateFallback(prompt: string) {
  return 🔥 Marketing Copy

Product: 

✔ High quality
✔ Affordable price
✔ Trusted by customers

👉 Order now before stock runs out!;
}
