import { Router } from "express";
import {
  getHistory,
  sendMessage,
} from "./controllers/chat.controller";

const router = Router();

router.post("/", sendMessage);
router.get("/history/:userId", getHistory);

export default router;