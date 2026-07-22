import cron from "node-cron";
import * as subscriptionService from "./services/subscription.service";

const DAILY_AT_MIDNIGHT = "0 0 * * *";

export function startSubscriptionRenewalCron() {
  cron.schedule(DAILY_AT_MIDNIGHT, async () => {
    try {
      const processedCount = await subscriptionService.processAllDueRenewals();
      console.log(`Subscription renewal cron: processed ${processedCount} due subscription(s)`);
    } catch (error) {
      console.error("Subscription renewal cron failed:", error);
    }
  });
}
