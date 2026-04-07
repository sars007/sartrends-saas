# Sartrends SaaS Completion TODO

## PHASE 1: STABILITY 
- [x] Create this TODO.md
- [x] Update app/layout.tsx (Tailwind, metadata, providers, css types)
- [ ] Prisma db push & generate
- [ ] Test server npm run dev no crash
- [ ] Run test-stability.ts verify APIs

## PHASE 2: AUTH
- [ ] Implement JWT auth
- [ ] Fix /api/auth/login & register (bcrypt, JWT)
- [ ] Fix auth pages UI (login/register)
- [ ] Add session middleware

## PHASE 3: DB
- [ ] Seed admin user
- [ ] Test credits payments models

## PHASE 4: AI
- [ ] Implement /api/ai/marketing full (OpenAI + credits deduct)
- [ ] Update stubs to use lib/ai.ts

## PHASE 5: STRIPE
- [ ] Fix /api/subscribe checkout
- [ ] Add /api/stripe/webhook
- [ ] On success: isPaid=true, credits+=100

## PHASE 6: FRONTEND
- [ ] Full dashboard with AI input, credits display, subscribe btn
- [ ] Loading/error states

## PHASE 7-9: UX/SECURITY/FINAL
- [ ] Middleware protect /dashboard
- [ ] Polish UI
- [ ] No errors test


