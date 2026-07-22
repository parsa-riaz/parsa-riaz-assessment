import { createSubscriptionSchema } from "../dto/subscription.dto";
import * as subscriptionService from "../services/subscription.service";
import {
  toSubscriptionResponse,
  toSubscriptionsResponse,
} from "../entities/subscription.entity";
import { asyncHandler } from "../../../middlewares/asyncHandler";
import { ApiError } from "../../../utils/ApiError";

export const createSubscription = asyncHandler(async (req, res) => {
  const body = createSubscriptionSchema.parse(req.body ?? {});

  const subscription = await subscriptionService.createSubscription(body);

  res.status(201).json(toSubscriptionResponse(subscription));
});

export const getUserSubscriptions = asyncHandler(async (req, res) => {
  const userId = Number(req.params.userId);

  if (!Number.isInteger(userId)) {
    throw new ApiError(400, "Invalid user id");
  }

  const subscriptions = await subscriptionService.getUserSubscriptions(userId);

  res.json(toSubscriptionsResponse(subscriptions));
});

export const cancelSubscription = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id)) {
    throw new ApiError(400, "Invalid subscription id");
  }

  const subscription = await subscriptionService.cancelSubscription(id);

  res.json(toSubscriptionResponse(subscription));
});
