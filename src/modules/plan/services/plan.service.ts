import { ApiError } from "../../../utils/ApiError";
import * as planRepository from "../repositories/plan.repository";

export async function getAllPlans() {
  const plans = await planRepository.findAll();

  if (plans.length === 0) {
    throw new ApiError(404, "No plans found");
  }

  return plans;
}
