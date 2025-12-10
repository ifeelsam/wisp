import { prisma } from './prisma';

export async function getOrCreateUser(privyId: string, email: string) {
  if (!privyId || !email) {
    throw new Error('privyId and email are required');
  }

  try {
    let user = await prisma.user.findUnique({
      where: { privyId },
    });

    if (!user) {
      console.log('Creating new user:', { privyId, email });
      user = await prisma.user.create({
        data: {
          privyId,
          email,
        },
      });
      console.log('User created successfully:', { id: user.id, email: user.email });
    } else if (user.email !== email) {
      // Update email if it changed
      console.log('Updating user email:', { userId: user.id, oldEmail: user.email, newEmail: email });
      user = await prisma.user.update({
        where: { id: user.id },
        data: { email },
      });
    } else {
      console.log('User found:', { id: user.id, email: user.email });
    }

    return user;
  } catch (error) {
    console.error('Database error in getOrCreateUser:', error);
    throw error;
  }
}

