import { Prisma } from "@prisma/client";
import { prisma } from "../../../config/prisma";

export async function findUserById(userId: number) {
  return prisma.user.findUnique({
    where: { id: userId },
  });
}

export async function findUserQuota(userId: number) {
  return prisma.userFreeQuota.findUnique({
    where: { userId },
  });
}

export async function resetQuota(
  userId: number,
  month: number,
  year: number
) {
  return prisma.userFreeQuota.update({
    where: { userId },
    data: {
      usedFreeMessages: 0,
      quotaMonth: month,
      quotaYear: year,
    },
  });
}

export async function incrementFreeQuota(userId: number) {
  return prisma.userFreeQuota.update({
    where: { userId },
    data: {
      usedFreeMessages: {
        increment: 1,
      },
    },
  });
}

export async function createChat(data: Prisma.ChatCreateInput) {
  return prisma.chat.create({
    data,
  });
}

export async function getHistory(userId: number) {
  return prisma.chat.findMany({
    where: {
      user: {
        id: userId,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}
