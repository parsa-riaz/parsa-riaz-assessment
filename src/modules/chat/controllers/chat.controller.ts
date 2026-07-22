import { sendMessageSchema } from "../dto/chat.dto";
import * as chatService from "../services/chat.service";
import { toChatResponse, toChatsResponse } from "../entities/chat.entity";
import { asyncHandler } from "../../../middlewares/asyncHandler";

export const sendMessage = asyncHandler(async (req, res) => {
  const body = sendMessageSchema.parse(req.body ?? {});
  const chat = await chatService.sendMessage(body);
  res.status(201).json(toChatResponse(chat));
});

export const getHistory = asyncHandler(async (req, res) => {
  const chats = await chatService.getHistory(
    Number(req.params.userId)
  );

  res.json(toChatsResponse(chats));
});
