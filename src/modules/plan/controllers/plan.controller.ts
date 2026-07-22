import { asyncHandler } from "../../../middlewares/asyncHandler";
import * as planService from "../services/plan.service";
import { toPlansResponse } from "../entities/plan.entity";

export const getAllPlans = asyncHandler(async (req, res) => {
  const plans = await planService.getAllPlans();

  res.json(toPlansResponse(plans));
});
