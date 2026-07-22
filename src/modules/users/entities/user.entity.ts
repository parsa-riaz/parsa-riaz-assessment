import { Prisma } from "@prisma/client";

type UserWithQuota = Prisma.UserGetPayload<{ include: { quota: true } }>;

export function toUserResponse(user: UserWithQuota) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    ...(user.quota && {
      quota: {
        usedFreeMessages: user.quota.usedFreeMessages,
        allowedFreeMessages: user.quota.allowedMessages,
        quotaMonth: user.quota.quotaMonth,
        quotaYear: user.quota.quotaYear,
      },
    }),
  };
}
