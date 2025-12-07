import { prisma } from './prisma';

export async function getOrCreateUser(privyId: string, email: string) {
  let user = await prisma.user.findUnique({
    where: { privyId },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        privyId,
        email,
      },
    });
  } else if (user.email !== email) {
    // Update email if it changed
    user = await prisma.user.update({
      where: { id: user.id },
      data: { email },
    });
  }

  return user;
}

