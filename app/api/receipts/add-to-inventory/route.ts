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

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { receiptId } = body;

    if (!receiptId) {
      return NextResponse.json(
        { error: 'Receipt ID is required' },
        { status: 400 }
      );
    }

    // Get receipt with items
    const receipt = await prisma.receipt.findUnique({
      where: { id: receiptId },
      include: { items: true },
    });

    if (!receipt) {
      return NextResponse.json({ error: 'Receipt not found' }, { status: 404 });
    }

    if (receipt.userId !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Add each receipt item to grocery inventory
    const groceryItems = await Promise.all(
      receipt.items.map(item =>
        prisma.groceryItem.create({
          data: {
            userId: user.id,
            name: item.name,
            quantity: item.quantity || null,
            category: item.category || null,
            status: 'ok',
            health: 'clean',
          },
        })
      )
    );

    // Mark receipt as processed
    await prisma.receipt.update({
      where: { id: receiptId },
      data: { processed: true },
    });

    return NextResponse.json({ 
      success: true, 
      itemsAdded: groceryItems.length,
      items: groceryItems,
    });
  } catch (error) {
    console.error('Error adding receipt to inventory:', error);
    return NextResponse.json(
      { error: 'Failed to add items to inventory' },
      { status: 500 }
    );
  }
}

