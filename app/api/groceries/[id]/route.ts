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

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const grocery = await prisma.groceryItem.findUnique({
      where: { id: params.id },
    });

    if (!grocery) {
      return NextResponse.json(
        { error: 'Grocery item not found' },
        { status: 404 }
      );
    }

    if (grocery.userId !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await prisma.groceryItem.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting grocery:', error);
    return NextResponse.json(
      { error: 'Failed to delete grocery item' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const grocery = await prisma.groceryItem.findUnique({
      where: { id: params.id },
    });

    if (!grocery) {
      return NextResponse.json(
        { error: 'Grocery item not found' },
        { status: 404 }
      );
    }

    if (grocery.userId !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { name, quantity, daysLeft, status, health, category } = body;

    const updated = await prisma.groceryItem.update({
      where: { id: params.id },
      data: {
        ...(name && { name }),
        ...(quantity !== undefined && { quantity }),
        ...(daysLeft !== undefined && { daysLeft }),
        ...(status && { status }),
        ...(health && { health }),
        ...(category !== undefined && { category }),
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating grocery:', error);
    return NextResponse.json(
      { error: 'Failed to update grocery item' },
      { status: 500 }
    );
  }
}

