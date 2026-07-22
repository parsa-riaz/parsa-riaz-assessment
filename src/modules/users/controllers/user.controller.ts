import { Request, Response } from "express";
import { asyncHandler } from "../../../middlewares/asyncHandler";
import { createUserSchema } from "../dto/user.dto";
import * as userService from "../services/user.service";
import { toUserResponse } from "../entities/user.entity";
import { ApiError } from "../../../utils/ApiError";

export const createUser = asyncHandler(async (req: Request, res: Response) => {
  const data = createUserSchema.parse(req.body ?? {});
  const user = await userService.create(data);
 res.status(201).json(toUserResponse(user));
});

export const getUser = asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id)) {
    throw new ApiError(400, "Invalid user id");
  }

  const user = await userService.getById(id);

  res.json(toUserResponse(user));
});
