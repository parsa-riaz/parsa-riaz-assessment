import { Router } from "express";
import { getAllPlans } from "./controllers/plan.controller";

const router = Router();

router.get("/", getAllPlans);

export default router;
