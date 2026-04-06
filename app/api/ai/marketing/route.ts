export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    return new Response(JSON.stringify({
      result: generateFallback(prompt || "Sample Product")
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
