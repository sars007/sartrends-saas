import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/db';
import { writeFile } from 'fs/promises';
import path from 'path';
import { promises as fs } from 'fs';

export async function POST(request: NextRequest) {
  try {
    const session = await getSession(cookies);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('screenshot') as File | null;
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const filename = 'screenshot-' + session.user.id + '-' + Date.now() + '.jpg';
    const filepath = path.join(process.cwd(), 'public', 'uploads', filename);

    await fs.mkdir(path.dirname(filepath), { recursive: true });
    await writeFile(filepath, buffer);

    await prisma.subscription.updateMany({
      where: {
        userId: session.user.id,
        status: 'pending'
      },
      data: { screenshotUrl: '/uploads/' + filename }
    });

    return NextResponse.json({ url: '/uploads/' + filename });
  } catch (error) {
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
