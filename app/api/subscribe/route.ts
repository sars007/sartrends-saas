import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getSession } from '@/lib/session';
import { prisma } from '@/lib/db';

export async function POST(request: NextRequest) {
  const cookieStore = cookies();
  const session = await getSession(cookies);
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const data = await request.formData();
  const screenshot = data.get('screenshot') as File;
  const amount = Number(data.get('amount') || 0);

  if (!screenshot) return NextResponse.json({ error: 'Screenshot required' }, { status: 400 });

  try {
    // Upload screenshot (simple base64 for demo, use cloud storage prod)
    const buffer = Buffer.from(await screenshot.arrayBuffer());
    const screenshotUrl = `data:image/png;base64,${buffer.toString('base64')}`; // prod: S3/Vercel blob

    const payment = await prisma.subscription.create({
      data: {
        userId: session.user.id,
        plan: amount > 1000 ? 'premium' : 'basic',
        status: 'pending',
        screenshotUrl,
        paymentMethod: 'easypaisa',
      },
    });

    return NextResponse.json({ success: true, payment });
  } catch (error) {
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}

