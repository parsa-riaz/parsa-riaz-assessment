import app from "./app";
import { env } from "./config/env";
import { connectDB } from "./config/prisma";
import { startSubscriptionRenewalCron } from "./modules/subscription/subscription.cron";

const PORT = env.port || 5000;
connectDB()
startSubscriptionRenewalCron();
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});