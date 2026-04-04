import { prisma } from './db';
import type { User } from '@prisma/client';

export async function getUserCredits(userId: string): Promise<number> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { credits: true }
  });
  return user?.credits ?? 10;
}

export async function hasSufficientCredits(userId: string, amount: number): Promise<boolean> {
  const credits = await getUserCredits(userId);
  return credits >= amount;
}

export async function deductCredits(userId: string, amount: number, reason: string): Promise<void> {
  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (user?.isPaid) return; // Premium skips credits
  
  await prisma.$transaction(async (tx) => {
    const currentCredits = await getUserCredits(userId);
    if (currentCredits < amount) {
      throw new Error('Insufficient credits');
    }
    await tx.creditTransaction.create({
      data: {
        userId,
        amount: -amount,
        type: 'deduct',
        reason,
      },
    });
    const updatedUser = await tx.user.update({
      where: { id: userId },
      data: { credits: { decrement: amount } },
      select: { credits: true }
    });
    if (updatedUser.credits < 0) {
      throw new Error('Insufficient credits after deduction');
    }
  });
}

export async function addCredits(userId: string, amount: number, reason: string): Promise<void> {
  await prisma.$transaction(async (tx) => {
    await tx.creditTransaction.create({
      data: {
        userId,
        amount,
        type: 'earn',
        reason,
      },
    });
    await tx.user.update({
      where: { id: userId },
      data: { credits: { increment: amount } }
    });
  });
}

// Update user.plan etc if needed, but use direct prisma.user.findUnique
export async function getUserById(id: string): Promise<User | null> {
  return prisma.user.findUnique({ where: { id } });
}
