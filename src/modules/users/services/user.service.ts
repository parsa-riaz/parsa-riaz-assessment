import * as userRepository from "../repositories/user.repository";
import { CreateUserDto } from "../dto/user.dto";
import { ApiError } from "../../../utils/ApiError";

export async function create(data: CreateUserDto) {
  const existing = await userRepository.findByEmail(data.email);

  if (existing) {
    throw new ApiError(409, "Email already in use");
  }

  return userRepository.create(data);
}

export async function getById(id: number) {
  const user = await userRepository.findById(id);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return user;
}
