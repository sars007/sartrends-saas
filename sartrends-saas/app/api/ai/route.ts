import { NextRequest, NextResponse } from "next/server";
import { consumeOneCredit } from "../../../lib/credits";
import { generateAIResponse } from "../../../lib/ai";

type Body = {
  prompt?: string;
  lang?: "english" | "urdu";
};

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Body;
    const prompt = body.prompt?.trim();
    const lang = body.lang ?? "english";

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required." }, { status: 400 });
    }

    const creditResult = await consumeOneCredit();
    if (!creditResult.ok) {
      return NextResponse.json(
        { error: creditResult.error, credits: creditResult.credits },
        { status: 402 }
      );
    }

    const response = await generateAIResponse({ prompt, lang });

    return NextResponse.json({
      response,
      credits: creditResult.credits,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to process AI request.",
      },
      { status: 500 }
    );
  }
}
