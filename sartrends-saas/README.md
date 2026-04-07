# Sartrends SaaS

AI-powered SaaS platform with modules for AI studio, resume builder, orders, studio, documents, subscriptions.

## Setup
1. cd sartrends-saas
2. cp .env.example .env.local
3. Set DATABASE_URL in .env.local
4. npm install
5. npx prisma generate && npx prisma db push
6. npm run dev

## Deploy
Vercel (root dir: sartrends-saas)

