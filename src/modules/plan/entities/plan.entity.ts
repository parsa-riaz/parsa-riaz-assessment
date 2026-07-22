import { Plan } from "@prisma/client";

export function toPlanResponse(plan: Plan) {
  return plan;
}

export function toPlansResponse(plans: Plan[]) {
  return plans.map(toPlanResponse);
}
