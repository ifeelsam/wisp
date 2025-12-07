import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getOrCreateUser } from '@/lib/auth';

// Helper to extract Privy user info from headers
// In a real app, you'd use Privy's server-side auth helpers
// For now, we'll use a simple approach with headers
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

    const groceries = await prisma.groceryItem.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(groceries);
  } catch (error) {
    console.error('Error fetching groceries:', error);
    return NextResponse.json(
      { error: 'Failed to fetch groceries' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, quantity, daysLeft, status, health, category } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    const grocery = await prisma.groceryItem.create({
      data: {
        userId: user.id,
        name,
        quantity: quantity || null,
        daysLeft: daysLeft || null,
        status: status || 'ok',
        health: health || 'clean',
        category: category || null,
      },
    });

    return NextResponse.json(grocery, { status: 201 });
  } catch (error) {
    console.error('Error creating grocery:', error);
    return NextResponse.json(
      { error: 'Failed to create grocery item' },
      { status: 500 }
    );
  }
}

