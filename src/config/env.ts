import dotenv from 'dotenv';

dotenv.config();

const DEFAULT_FREE_MONTHLY_MESSAGE_LIMIT = 3;
const DEFAULT_PAYMENT_FAILURE_RATE = 0.2;

export const env = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: Number(process.env.PORT) || 5000,
  databaseUrl: process.env.DATABASE_URL ?? '',
  freeMonthlyMessageLimit:
    Number(process.env.FREE_MONTHLY_MESSAGE_LIMIT) ||
    DEFAULT_FREE_MONTHLY_MESSAGE_LIMIT,
  paymentFailureRate:
    Number(process.env.PAYMENT_FAILURE_RATE) || DEFAULT_PAYMENT_FAILURE_RATE,
};