import { Chat } from "@prisma/client";

export function toChatResponse(chat: Chat) {
  return {
    id: chat.id,
    question: chat.question,
    answer: chat.answer,
    tokensUsed: chat.tokensUsed,
    createdAt: chat.createdAt,
  };
}

export function toChatsResponse(chats: Chat[]) {
  return chats.map(toChatResponse);
}
