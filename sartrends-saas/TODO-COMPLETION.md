# SaaS Completion TODO

## Steps:
- [ ] 1. Install deps (lucia-prisma-adapter, stripe, @stripe/stripe-js)
- [ ] 2. Fix lib/auth.ts (Prisma adapter)
- [ ] 3. Fix /api/ai/marketing/route.ts (real auth, remove mock)
- [ ] 4. Implement /api/user/credits/route.ts
- [ ] 5. Implement Stripe /api/subscribe/route.ts + /api/stripe/webhook/route.ts
- [ ] 6. Create middleware.ts (protect /dashboard /api)
- [ ] 7. Update app/providers.tsx + wrap SessionProvider
- [ ] 8. Update app/dashboard/page.tsx (real credits/user, copy, subscribe)
- [ ] 9. Fix auth routes (/api/auth/login/register)
- [ ] 10. npx prisma db push --accept-data-loss
- [ ] 11. Update prisma/seed.ts + npx prisma db seed
- [ ] 12. npm run build && no errors
- [ ] 13. Test full flow: register → login → dashboard → AI → subscribe sim
- [x] Plan created ✅

Current: Step 1 next.

