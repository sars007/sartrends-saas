# HSE AI SaaS Implementation TODO

## 1. Database Updates [x]
- [x] Edit prisma/schema.prisma: Add Payment model
- [x] npx prisma generate && npx prisma db push
- [x] HSE templates seeded

## 2. AI Integration [x]
- [x] Edit lib/ai.ts: OpenAI + HSE gen
- [x] Create lib/export.ts

## 3. API Routes [x]
- [x] Edit app/api/ai/route.ts: HSE gen (check premium/credits, save Document, use OpenAI)

- [x] Edit app/api/templates/route.ts: Seed HSE templates
- [x] Edit app/api/subscribe/route.ts: EasyPaisa upload
- [x] Edit app/api/admin/verify/route.ts: Approve payments


## 4. Frontend Pages [x]
- [x] Refactor app/modules/resume/page.tsx -> app/hse/page.tsx: HSE selector, form, gen/premium lock, export buttons
- [x] Create app/templates/page.tsx: List templates w/premium badge
- [x] Create app/upgrade/page.tsx: EasyPaisa details, screenshot upload
- [x] Create app/admin/payments/page.tsx: List pending payments, approve button

## 5. Premium Logic [x]
- [x] Update lib/credits.ts: Skip deduct if isPaid=true
- [x] UI: Watermark free, export only premium/full

## 6. Dependencies [x]
- [x] npm i openai docx jszip file-saver @types/docx
- [x] npm i -D @types/jspdf

## 7. Test & Deploy [x]
- [x] Local test: npm run dev, register, gen HSE, payment flow
- [ ] GitHub: cd sartrends-saas && git init/add/commit/push
- [ ] Vercel: vercel --prod, set env OPENAI_API_KEY DATABASE_URL

## Progress Tracking
- Current step: Deploy Ready


