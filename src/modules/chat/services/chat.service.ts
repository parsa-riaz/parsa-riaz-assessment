import { SubscriptionTier } from "@prisma/client";
import { ApiError } from "../../../utils/ApiError";
import * as subscriptionRepository from "../../subscription/repositories/subscription.repository";
import * as subscriptionService from "../../subscription/services/subscription.service";
import { SendMessageDto } from "../dto/chat.dto";
import * as chatRepository from "../repositories/chat.repository";

const MOCK_RESPONSE_MIN_DELAY_MS = 300;
const MOCK_RESPONSE_MAX_DELAY_MS = 800;

async function resetQuotaIfNeeded(userId: number) {
  const quota = await chatRepository.findUserQuota(userId);

  if (!quota) {
    throw new ApiError(404, "User quota not found");
  }

  const today = new Date();
  const currentMonth = today.getMonth() + 1;
  const currentYear = today.getFullYear();

  if (
    quota.quotaMonth !== currentMonth ||
    quota.quotaYear !== currentYear
  ) {
    await chatRepository.resetQuota(
      userId,
      currentMonth,
      currentYear
    );

    quota.usedFreeMessages = 0;
    quota.quotaMonth = currentMonth;
    quota.quotaYear = currentYear;
  }

  return quota;
}

async function consumeQuota(userId: number) {
  const quota = await resetQuotaIfNeeded(userId);

  if (quota.usedFreeMessages < quota.allowedMessages) {
    await chatRepository.incrementFreeQuota(userId);
    return;
  }

  await subscriptionService.processDueRenewals(userId);

  const subscriptions = await subscriptionRepository.findActiveByUserId(userId);

  if (subscriptions.length === 0) {
    throw new ApiError(403, "Free quota exhausted. Please subscribe a bundle");
  }

  const usable = subscriptions.find(
    (subscription) =>
      subscription.plan.tier === SubscriptionTier.ENTERPRISE ||
      (subscription.remainingMessages !== null &&
        subscription.remainingMessages > 0)
  );

  if (!usable) {
    throw new ApiError(403, "Subscription quota exhausted.");
  }

  // Enterprise = unlimited
  if (usable.plan.tier === SubscriptionTier.ENTERPRISE) {
    return;
  }

  await subscriptionRepository.decrementRemainingMessages(usable.id);
}

async function generateMockResponse(question: string) {
  const delayMs =
    MOCK_RESPONSE_MIN_DELAY_MS +
    Math.random() * (MOCK_RESPONSE_MAX_DELAY_MS - MOCK_RESPONSE_MIN_DELAY_MS);

  await new Promise((resolve) => setTimeout(resolve, delayMs));

  return {
    answer: `Mock AI Response: ${question}`,
    tokensUsed: Math.floor(Math.random() * 100) + 20,
  };
}

export async function sendMessage(dto: SendMessageDto) {
  const user = await chatRepository.findUserById(dto.userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  await consumeQuota(dto.userId);

  const ai = await generateMockResponse(dto.question);

  const chat = await chatRepository.createChat({
    question: dto.question,
    answer: ai.answer,
    tokensUsed: ai.tokensUsed,
    user: {
      connect: {
        id: dto.userId,
      },
    },
  });

  return chat;
}

export async function getHistory(userId: number) {
  const user = await chatRepository.findUserById(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const history = await chatRepository.getHistory(userId);

  if (history.length === 0) {
    throw new ApiError(404, "No chat history found for this user");
  }

  return history;
}
