-- RenameTable
ALTER TABLE "Subscription" RENAME CONSTRAINT "Subscription_pkey" TO "subscriptions_pkey";
ALTER TABLE "Subscription" RENAME CONSTRAINT "Subscription_userId_fkey" TO "subscriptions_userId_fkey";
ALTER TABLE "Subscription" RENAME CONSTRAINT "Subscription_planId_fkey" TO "subscriptions_planId_fkey";
ALTER TABLE "Subscription" RENAME TO "subscriptions";
