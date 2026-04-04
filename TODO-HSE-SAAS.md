# HSE AI SaaS Implementation TODO

## 1. Database Updates [x]
- [x] Edit prisma/schema.prisma: Add Payment model
- [x] npx prisma generate && npx prisma db push
- [x] HSE templates seeded

## 2. AI Integration [x]
- [x] Edit lib/ai.ts: OpenAI + HSE gen
- [ ] Create lib/export.ts

## 3. API Routes [x]
- [ ] Edit app/api/ai/route.ts: HSE gen (check premium/credits, save Document, use OpenAI)
- [x] Edit app/api/templates/route.ts: Seed HSE templates
- [x] Edit app/api/subscribe/route.ts: EasyPaisa upload
- [ ] Edit app/api/admin/verify/route.ts: Approve payments

## 4. Frontend Pages [ ]
- [ ] Refactor app/modules/resume/page.tsx -> app/hse/page.tsx: HSE selector, form, gen/premium lock, export buttons
- [ ] Create app/templates/page.tsx: List templates w/premium badge
- [ ] Create app/upgrade/page.tsx: EasyPaisa details, screenshot upload
- [ ] Create app/admin/payments/page.tsx: List pending payments, approve button

## 5. Premium Logic [x]
- [x] Update lib/credits.ts: Skip deduct if isPaid=true
- [ ] UI: Watermark free, export only premium/full

## 6. Dependencies [ ]
- [ ] npm i openai docx jszip file-saver @types/docx
- [ ] npm i -D @types/jspdf

## 7. Test & Deploy [ ]
- [ ] Local test: npm run dev, register, gen HSE, payment flow
- [ ] GitHub: cd sartrends-saas && git init/add/commit/push
- [ ] Vercel: vercel --prod, set env OPENAI_API_KEY DATABASE_URL

## Progress Tracking
- Current step: ____

