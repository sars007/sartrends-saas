# Sartrends SaaS

AI-powered SaaS platform with modules for AI studio, resume builder, orders, studio, documents, subscriptions.

## Setup
1. cp .env.example .env.local (if exists)
2. Set DATABASE_URL in .env.local (PostgreSQL)
3. npm install
4. npx prisma generate && npx prisma db push
5. npm run dev

## Deploy
Vercel (root dir: . )
