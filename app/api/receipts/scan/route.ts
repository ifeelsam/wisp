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

    // Get receipt data from form (already processed by client-side OCR)
    const receiptDataJson = formData.get('receiptData') as string;
    const ocrText = formData.get('ocrText') as string;

    let receiptData: {
      items: Array<{ name: string; quantity?: string; price?: number; category?: string }>;
      store?: string;
      date?: Date;
      total?: number;
    };

    if (receiptDataJson) {
      // Use client-provided parsed data
      receiptData = JSON.parse(receiptDataJson);
      // Convert date string back to Date object
      if (receiptData.date && typeof receiptData.date === 'string') {
        receiptData.date = new Date(receiptData.date);
      }
    } else {
      // Fallback: return empty receipt if no data provided
      receiptData = {
        items: [],
        date: new Date(),
      };
    }

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

