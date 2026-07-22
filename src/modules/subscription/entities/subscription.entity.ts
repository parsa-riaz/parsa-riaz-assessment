import { Plan, Subscription, User } from "@prisma/client";

type SubscriptionWithRelations = Subscription & {
  plan?: Plan;
  user?: User;
};

export function toSubscriptionResponse(subscription: SubscriptionWithRelations) {
  return subscription;
}

export function toSubscriptionsResponse(subscriptions: SubscriptionWithRelations[]) {
  return subscriptions.map(toSubscriptionResponse);
}
