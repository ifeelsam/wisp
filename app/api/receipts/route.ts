import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getOrCreateUser } from '@/lib/auth';

async function getAuthUser(request: NextRequest) {
  const privyId = request.headers.get('x-privy-user-id');
  const email = request.headers.get('x-privy-user-email');

  if (!privyId || !email) {
    return null;
  }

  return await getOrCreateUser(privyId, email);
}

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const receipts = await prisma.receipt.findMany({
      where: { userId: user.id },
      include: {
        items: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(receipts);
  } catch (error) {
    console.error('Error fetching receipts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch receipts' },
      { status: 500 }
    );
  }
}

