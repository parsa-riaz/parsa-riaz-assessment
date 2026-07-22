import { BillingCycle } from "@prisma/client";
import { env } from "../../../config/env";
import { ApiError } from "../../../utils/ApiError";
import { CreateSubscriptionDto } from "../dto/subscription.dto";
import * as subscriptionRepository from "../repositories/subscription.repository";

function calculateEndDate(billingCycle: BillingCycle) {
  const endDate = new Date();

  if (billingCycle === BillingCycle.MONTHLY) {
    endDate.setMonth(endDate.getMonth() + 1);
  } else {
    endDate.setFullYear(endDate.getFullYear() + 1);
  }

  return endDate;
}

export async function createSubscription(data: CreateSubscriptionDto) {
  const user = await subscriptionRepository.findUserById(data.userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const plan = await subscriptionRepository.findPlanById(data.planId);

  if (!plan) {
    throw new ApiError(404, "Plan not found");
  }

  const startDate = new Date();
  const endDate = calculateEndDate(plan.billingCycle);

  return subscriptionRepository.create({
    userId: data.userId,
    planId: data.planId,
    autoRenew: data.autoRenew,
    remainingMessages: plan.maxMessages,
    startDate,
    endDate,
    renewalDate: endDate,
  });
}

export async function processDueRenewals(userId: number) {
  const due = await subscriptionRepository.findDueForRenewal(userId, new Date());

  for (const subscription of due) {
    if (!subscription.autoRenew) {
      await subscriptionRepository.deactivate(subscription.id);
      continue;
    }

    const paymentSucceeded = Math.random() >= env.paymentFailureRate;

    if (!paymentSucceeded) {
      await subscriptionRepository.deactivate(subscription.id);
      continue;
    }

    const renewalDate = calculateEndDate(subscription.plan.billingCycle);

    await subscriptionRepository.renew(subscription.id, {
      endDate: renewalDate,
      renewalDate,
      remainingMessages: subscription.plan.maxMessages,
    });
  }
}

export async function getUserSubscriptions(userId: number) {
  const user = await subscriptionRepository.findUserById(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  await processDueRenewals(userId);

  const subscriptions = await subscriptionRepository.findByUserId(userId);

  if (subscriptions.length === 0) {
    throw new ApiError(404, "No subscriptions found for this user");
  }

  return subscriptions;
}

export async function cancelSubscription(id: number) {
  const subscription = await subscriptionRepository.findById(id);

  if (!subscription) {
    throw new ApiError(404, "Subscription not found");
  }

  return subscriptionRepository.cancel(id);
}
