import { prisma } from "./db";

const DEFAULT_USER_EMAIL = process.env.DEMO_USER_EMAIL ?? "demo@sartrends.ai";
const DEFAULT_STARTING_CREDITS = 10;

async function ensureDemoUser() {
  const existing = await prisma.user.findUnique({
    where: { email: DEFAULT_USER_EMAIL },
    select: { id: true, credits: true, email: true },
  });

  if (existing) return existing;

  return prisma.user.create({
    data: {
      email: DEFAULT_USER_EMAIL,
      credits: DEFAULT_STARTING_CREDITS,
      plan: "free",
    },
    select: { id: true, credits: true, email: true },
  });
}

export async function getUserCredits() {
  const user = await ensureDemoUser();
  return {
    userId: user.id,
    email: user.email,
    credits: user.credits,
  };
}

export async function consumeOneCredit() {
  const user = await ensureDemoUser();

  if (user.credits <= 0) {
    return {
      ok: false as const,
      credits: user.credits,
      error: "No credits remaining. Please upgrade your plan.",
    };
  }

  const updated = await prisma.user.update({
    where: { id: user.id },
    data: { credits: { decrement: 1 } },
    select: { credits: true },
  });

  return {
    ok: true as const,
    credits: updated.credits,
  };
}
