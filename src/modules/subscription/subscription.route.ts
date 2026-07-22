import { Router } from "express";
import {
  cancelSubscription,
  createSubscription,
  getUserSubscriptions,
} from "./controllers/subscription.controller";

const router = Router();

router.post("/", createSubscription);
router.get("/user/:userId", getUserSubscriptions);
router.patch("/:id/cancel", cancelSubscription);

export default router;