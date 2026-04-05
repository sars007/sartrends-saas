import { prisma } from './db';
import type { User } from '@/lib/prisma';

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

export async function transactionWithTimeout<T>(fn: (tx: typeof prisma) => Promise<T>, timeoutMs = 10000): Promise<T> {
  console.log('START CREDITS TX');
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  
  try {
    const result = await prisma.$transaction(async (tx) => {
      return await Promise.race([
        fn(tx),
        new Promise<never>((_, reject) => setTimeout(() => reject(new Error('TX timeout')), timeoutMs))
      ]);
    }, { timeout: timeoutMs });
    clearTimeout(timeoutId);
    console.log('DONE CREDITS TX');
    return result;
  } catch (error: any) {
    clearTimeout(timeoutId);
    if (error.message.includes('timeout')) {
      throw new Error('Database transaction timeout');
    }
    throw error;
  }
}

export async function deductCredits(userId: string, amount: number, reason: string): Promise<void> {
  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (user?.isPaid) return; // Premium skips credits
  
  await transactionWithTimeout(async (tx) => {
    const currentCredits = await tx.user.findUnique({
      where: { id: userId },
      select: { credits: true }
    })?.credits ?? 0;
    
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
  await transactionWithTimeout(async (tx) => {
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

export async function getUserById(id: string): Promise<User | null> {
  return prisma.user.findUnique({ where: { id } });
}

