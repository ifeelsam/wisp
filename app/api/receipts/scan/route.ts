import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getOrCreateUser } from '@/lib/auth';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

async function getAuthUser(request: NextRequest) {
  const privyId = request.headers.get('x-privy-user-id');
  const email = request.headers.get('x-privy-user-email');

  if (!privyId || !email) {
    return null;
  }

  return await getOrCreateUser(privyId, email);
}

// Simple OCR simulation - in production, use a real OCR service like Tesseract.js or cloud API
async function extractReceiptData(imageBuffer: Buffer): Promise<{
  items: Array<{ name: string; quantity?: string; price?: number; category?: string }>;
  store?: string;
  date?: Date;
  total?: number;
}> {
  // This is a placeholder - in production, you'd use actual OCR
  // For now, return mock data to demonstrate the flow
  return {
    items: [
      { name: 'Rolled Oats', quantity: '1', price: 4.99, category: 'Staples' },
      { name: 'Whole Milk', quantity: '2L', price: 3.49, category: 'Dairy' },
      { name: 'Bananas', quantity: '6', price: 2.99, category: 'Produce' },
    ],
    store: 'Whole Foods',
    date: new Date(),
    total: 11.47,
  };
}

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('receipt') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Save image file
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), 'public', 'uploads', 'receipts');
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    // Generate unique filename
    const filename = `${user.id}-${Date.now()}-${file.name}`;
    const filepath = join(uploadsDir, filename);
    await writeFile(filepath, buffer);

    const imageUrl = `/uploads/receipts/${filename}`;

    // Extract receipt data (OCR simulation)
    const receiptData = await extractReceiptData(buffer);

    // Create receipt with items
    const receipt = await prisma.receipt.create({
      data: {
        userId: user.id,
        imageUrl,
        store: receiptData.store,
        date: receiptData.date,
        total: receiptData.total,
        items: {
          create: receiptData.items.map(item => ({
            name: item.name,
            quantity: item.quantity || null,
            price: item.price || null,
            category: item.category || null,
          })),
        },
      },
      include: {
        items: true,
      },
    });

    return NextResponse.json(receipt, { status: 201 });
  } catch (error) {
    console.error('Error processing receipt:', error);
    return NextResponse.json(
      { error: 'Failed to process receipt' },
      { status: 500 }
    );
  }
}

