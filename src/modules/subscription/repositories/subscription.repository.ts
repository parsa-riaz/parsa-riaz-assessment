import { SubscriptionStatus } from "@prisma/client";
import { prisma } from "../../../config/prisma";

export async function findUserById(userId: number) {
  return prisma.user.findUnique({
    where: { id: userId },
  });
}

export async function findPlanById(planId: number) {
  return prisma.plan.findUnique({
    where: { id: planId },
  });
}

export async function create(data: {
  userId: number;
  planId: number;
  autoRenew: boolean;
  remainingMessages: number | null;
  startDate: Date;
  endDate: Date;
  renewalDate: Date;
}) {
  return prisma.subscription.create({
    data,
    include: {
      plan: true,
      user: true,
    },
  });
}

export async function findById(id: number) {
  return prisma.subscription.findUnique({
    where: { id },
    include: {
      plan: true,
    },
  });
}

export async function findByUserId(userId: number) {
  return prisma.subscription.findMany({
    where: { userId },
    include: {
      plan: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function findActiveByUserId(userId: number) {
  return prisma.subscription.findMany({
    where: {
      userId,
      status: SubscriptionStatus.ACTIVE,
    },
    include: {
      plan: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function findDueForRenewal(userId: number, now: Date) {
  return prisma.subscription.findMany({
    where: {
      userId,
      status: SubscriptionStatus.ACTIVE,
      endDate: { lte: now },
    },
    include: {
      plan: true,
    },
  });
}

export async function renew(
  id: number,
  data: { endDate: Date; renewalDate: Date; remainingMessages: number | null }
) {
  return prisma.subscription.update({
    where: { id },
    data,
  });
}

export async function deactivate(id: number) {
  return prisma.subscription.update({
    where: { id },
    data: {
      status: SubscriptionStatus.INACTIVE,
    },
  });
}

export async function decrementRemainingMessages(id: number) {
  return prisma.subscription.update({
    where: { id },
    data: {
      remainingMessages: {
        decrement: 1,
      },
    },
  });
}

export async function cancel(id: number) {
  return prisma.subscription.update({
    where: { id },
    data: {
      status: SubscriptionStatus.CANCELLED,
    },
  });
}
