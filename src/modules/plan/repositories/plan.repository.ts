import { prisma } from "../../../config/prisma";

export async function findAll() {
  return prisma.plan.findMany({
    orderBy: [{ tier: "asc" }, { billingCycle: "asc" }],
  });
}
