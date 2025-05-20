# Auth Service (TypeScript, Fastify, Prisma)

This is a refactored authentication microservice using Fastify, Prisma ORM, and TypeScript. It handles user registration, login, Discord OAuth, and JWT issuance/validation.

## Project Structure

```
auth-service-ts/
├── prisma/
│   └── schema.prisma         # Prisma DB schema; run migrations here
├── src/
│   ├── config.ts             # Env vars, config loader (dotenv, etc)
│   ├── database.ts           # Prisma client init, DB utilities
│   ├── index.ts              # Main Fastify server bootstrap
│   ├── models/               # (Optional) Type or helper files (rare w/ Prisma, but good for domain-specific logic)
│   ├── routes/
│   │   ├── auth.ts           # Discord OAuth & JWT routes
│   │   └── health.ts         # /healthz or /health route
│   ├── oauth/
│   │   └── discord.ts        # Discord OAuth logic (token exchange, user fetch)
│   └── schemas/              # Zod or JSON schemas for validation
├── .env.example              # Example env vars
├── package.json              # NPM config/deps
├── tsconfig.json             # TypeScript config
└── README.md                 # Project info/instructions
```

## Setup
1. Copy `.env.example` to `.env` and fill in secrets.
2. Install dependencies: `npm install`
3. Run Prisma migrations: `npx prisma migrate dev --name init`
4. Start dev server: `npm run dev`

---
