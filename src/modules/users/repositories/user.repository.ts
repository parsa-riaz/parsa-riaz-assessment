import { prisma } from "../../../config/prisma";
import { env } from "../../../config/env";
import { CreateUserDto } from "../dto/user.dto";

export async function findByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email },
  });
}

export async function findById(id: number) {
  return prisma.user.findUnique({
    where: { id },
    include: {
      quota: true,
    },
  });
}

export async function create(data: CreateUserDto) {
  const now = new Date();

  return prisma.user.create({
    data: {
      ...data,
      quota: {
        create: {
          quotaMonth: now.getMonth() + 1,
          quotaYear: now.getFullYear(),
          allowedMessages: env.freeMonthlyMessageLimit,
        },
      },
    },
    include: {
      quota: true,
    },
  });
}
