export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    return new Response(JSON.stringify({
      result: generateFallback(prompt)
    }), {
      headers: { "Content-Type": "application/json" }
    });

  } catch (error) {
    return new Response(JSON.stringify({
      error: "Something went wrong"
    }), { status: 500 });
  }
}

function generateFallback(prompt: string) {
  return 
🔥 Marketing Copy

Product: 

This is a high-quality product designed to solve your problems.

👉 Get yours today!
;
}
