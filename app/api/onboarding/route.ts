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

    const onboarding = await prisma.onboarding.findUnique({
      where: { userId: user.id },
    });

    return NextResponse.json(onboarding || { completed: false });
  } catch (error) {
    console.error('Error fetching onboarding:', error);
    return NextResponse.json(
      { error: 'Failed to fetch onboarding data' },
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
    const {
      householdType,
      householdMembers,
      goals,
      diet,
      ingredients,
      monthlyBudget,
      weeklyBudget,
      dataSources,
      storageMode,
      completed,
    } = body;

    const onboarding = await prisma.onboarding.upsert({
      where: { userId: user.id },
      update: {
        householdType: householdType || undefined,
        householdMembers: householdMembers || undefined,
        goals: goals || [],
        diet: diet || undefined,
        ingredients: ingredients || [],
        monthlyBudget: monthlyBudget || undefined,
        weeklyBudget: weeklyBudget || undefined,
        dataSources: dataSources ? JSON.parse(JSON.stringify(dataSources)) : undefined,
        storageMode: storageMode || undefined,
        completed: completed !== undefined ? completed : true,
      },
      create: {
        userId: user.id,
        householdType: householdType || undefined,
        householdMembers: householdMembers || undefined,
        goals: goals || [],
        diet: diet || undefined,
        ingredients: ingredients || [],
        monthlyBudget: monthlyBudget || undefined,
        weeklyBudget: weeklyBudget || undefined,
        dataSources: dataSources ? JSON.parse(JSON.stringify(dataSources)) : undefined,
        storageMode: storageMode || undefined,
        completed: completed !== undefined ? completed : true,
      },
    });

    return NextResponse.json(onboarding, { status: 201 });
  } catch (error) {
    console.error('Error saving onboarding:', error);
    return NextResponse.json(
      { error: 'Failed to save onboarding data' },
      { status: 500 }
    );
  }
}

