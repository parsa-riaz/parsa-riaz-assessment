import { Router } from "express";
import userRoutes from "../modules/users/user.route";
import subscriptionsRoutes from "../modules/subscription/subscription.route";
import planRoutes from "../modules/plan/plan.route";
import chatRoutes from "../modules/chat/chat.route"
const router = Router();

router.use("/users", userRoutes);
router.use("/subscriptions", subscriptionsRoutes);
router.use("/plans", planRoutes);
router.use("/chat", chatRoutes);

export default router;