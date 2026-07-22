# Mock AI Chatbot & Subscription Backend

A TypeScript/Express/Prisma backend implementing two modules on a shared PostgreSQL database:

- **Chat module** — accepts a question, returns a mocked AI response, tracks a monthly free-message quota per user, and falls back to paid subscription bundles once the free quota is exhausted.
- **Subscription module** — lets a user create/list/cancel subscription bundles (Basic/Pro/Enterprise, monthly/yearly), with simulated auto-renewal and payment-failure billing.

## Tech stack

- Node.js + TypeScript, Express 5
- PostgreSQL via Prisma ORM
- Zod for request validation
- ESLint + Prettier

## Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment**

   Copy `.env.example` to `.env` and fill in a real database connection string:
   ```bash
   cp .env.example .env
   ```

   | Variable | Purpose | Default |
   |---|---|---|
   | `NODE_ENV` | environment name | `development` |
   | `PORT` | HTTP port | `5000` |
   | `DATABASE_URL` | PostgreSQL connection string | — (required) |
   | `FREE_MONTHLY_MESSAGE_LIMIT` | free messages granted to a new user's monthly quota | `3` |
   | `PAYMENT_FAILURE_RATE` | probability (0–1) that a simulated auto-renewal payment fails | `0.2` |

3. **Run migrations and seed the plan catalog**
   ```bash
   npm run prisma:migrate
   npm run prisma:seed
   ```
   Seeding populates the `plans` table (Basic/Pro/Enterprise × Monthly/Yearly). Nothing else is seeded — users, quotas, subscriptions, and chats are created through the API.

4. **Start the server**
   ```bash
   npm run dev      # ts-node-dev, auto-reload
   # or
   npm run build && npm start   # compiled build
   ```

Other scripts: `npm run lint`, `npm run format`, `npm run prisma:generate`.

## API reference

All routes are mounted under `/api`. Every error response has the shape:
```json
{ "success": false, "message": "..." }
```
(validation errors additionally include an `errors` array of `{ "path", "message" }`).

| Method | Path | Purpose |
|---|---|---|
| POST | `/users` | create a user (also creates their monthly free quota) |
| GET | `/users/:id` | fetch a user + quota |
| GET | `/plans` | list available subscription plans |
| POST | `/subscriptions` | create a subscription |
| GET | `/subscriptions/user/:userId` | list a user's subscriptions |
| PATCH | `/subscriptions/:id/cancel` | cancel a subscription |
| POST | `/chat` | send a message |
| GET | `/chat/history/:userId` | list a user's chat history |

### Users

**`POST /api/users`** — create a user

Request body:
```json
{ "name": "Jane Doe", "email": "jane@example.com" }
```
`name`: string, 3–100 chars. `email`: valid email, must be unique.

Response `201`:
```json
{
  "id": 1,
  "name": "Jane Doe",
  "email": "jane@example.com",
  "quota": {
    "usedFreeMessages": 0,
    "allowedFreeMessages": 3,
    "quotaMonth": 7,
    "quotaYear": 2026
  }
}
```
Errors: `400` validation failed · `409` email already in use

**`GET /api/users/:id`** — fetch a user

Response `200`: same shape as above.
Errors: `400` invalid user id · `404` user not found

### Plans

**`GET /api/plans`** — list all plans (no body)

Response `200`:
```json
[
  {
    "id": 1,
    "tier": "BASIC",
    "billingCycle": "MONTHLY",
    "price": "10",
    "maxMessages": 10,
    "createdAt": "2026-07-22T18:23:38.663Z",
    "updatedAt": "2026-07-22T18:23:38.663Z"
  }
]
```
`tier`: `BASIC` | `PRO` | `ENTERPRISE`. `billingCycle`: `MONTHLY` | `YEARLY`. `maxMessages` is `null` for Enterprise (unlimited).
Errors: `404` no plans found

### Subscriptions

**`POST /api/subscriptions`** — create a subscription

Request body:
```json
{ "userId": 1, "planId": 1, "autoRenew": true }
```
`userId` / `planId`: positive integers, required. `autoRenew`: optional boolean, **defaults to `false`** if omitted.

Response `201`:
```json
{
  "id": 1,
  "planId": 1,
  "status": "ACTIVE",
  "autoRenew": true,
  "remainingMessages": 10,
  "startDate": "2026-07-22T18:18:07.599Z",
  "endDate": "2026-08-22T18:18:07.599Z",
  "renewalDate": "2026-08-22T18:18:07.599Z",
  "createdAt": "2026-07-22T18:18:07.601Z",
  "updatedAt": "2026-07-22T18:18:07.601Z",
  "userId": 1,
  "plan": { "id": 1, "tier": "BASIC", "billingCycle": "MONTHLY", "price": "10", "maxMessages": 10, "...": "..." },
  "user": { "id": 1, "name": "Jane Doe", "email": "jane@example.com", "...": "..." }
}
```
Errors: `400` validation failed · `404` user not found · `404` plan not found

**`GET /api/subscriptions/user/:userId`** — list a user's subscriptions (no body)

Also lazily processes any subscriptions past their `endDate` (auto-renews or deactivates them) before returning.

Response `200`: array of subscription objects (same shape as above, each with `plan` but not `user`).
Errors: `400` invalid user id · `404` user not found · `404` no subscriptions found for this user

**`PATCH /api/subscriptions/:id/cancel`** — cancel a subscription (no body)

`:id` is the subscription's own id (not `userId`/`planId`).

Response `200`: the subscription object with `"status": "CANCELLED"` (no `plan`/`user` nested).
Errors: `400` invalid subscription id · `404` subscription not found

### Chat

**`POST /api/chat`** — send a message

Request body:
```json
{ "userId": 1, "question": "How are you?" }
```
`userId`: positive integer, required. `question`: string, 1–1000 chars, required.

Consumes one message from the user's free quota, then from their subscriptions (fallback across multiple active bundles), before returning a mocked AI reply (with a simulated 300–800ms delay).

Response `201`:
```json
{
  "id": 1,
  "question": "How are you?",
  "answer": "Mock AI Response: How are you?",
  "tokensUsed": 84,
  "createdAt": "2026-07-22T18:18:23.459Z"
}
```
Errors: `400` validation failed · `404` user not found · `403` free quota exhausted (no usable subscription) · `403` subscription quota exhausted

**`GET /api/chat/history/:userId`** — list a user's chat history (no body)

Response `200`: array of chat objects (same shape as above), newest first.
Errors: `404` user not found · `404` no chat history found for this user
