import {
  PrismaClient,
  Prisma,
  SubscriptionTier,
  BillingCycle,
} from "@prisma/client";

const prisma = new PrismaClient();

const plans = [
  {
    tier: SubscriptionTier.BASIC,
    billingCycle: BillingCycle.MONTHLY,
    price: new Prisma.Decimal(10),
    maxMessages: 10,
  },
  {
    tier: SubscriptionTier.BASIC,
    billingCycle: BillingCycle.YEARLY,
    price: new Prisma.Decimal(100),
    maxMessages: 120,
  },
  {
    tier: SubscriptionTier.PRO,
    billingCycle: BillingCycle.MONTHLY,
    price: new Prisma.Decimal(25),
    maxMessages: 100,
  },
  {
    tier: SubscriptionTier.PRO,
    billingCycle: BillingCycle.YEARLY,
    price: new Prisma.Decimal(250),
    maxMessages: 1200,
  },
  {
    tier: SubscriptionTier.ENTERPRISE,
    billingCycle: BillingCycle.MONTHLY,
    price: new Prisma.Decimal(99),
    maxMessages: null,
  },
  {
    tier: SubscriptionTier.ENTERPRISE,
    billingCycle: BillingCycle.YEARLY,
    price: new Prisma.Decimal(999),
    maxMessages: null,
  },
];

async function main() {
  for (const plan of plans) {
    await prisma.plan.upsert({
      where: {
        tier_billingCycle: {
          tier: plan.tier,
          billingCycle: plan.billingCycle,
        },
      },
      update: {
        price: plan.price,
        maxMessages: plan.maxMessages,
      },
      create: plan,
    });
  }

  console.log("✅ Plans seeded successfully");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });