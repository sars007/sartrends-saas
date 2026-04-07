# Sartrends SaaS - UI Polish & SEO TODO

## Status
- ✅ Dev server stable, test-stability.ts passed (no hangs, JSON responses)
- Server: localhost:3000 running
- APIs: 500 auth expected without session

## Steps

### 1. Loading/Error States [ ]
- Add loading spinner to app/hse/page.tsx gen button
- Ensure all modules have setError/setLoading

### 2. Admin Dashboard Polish [ ]
- app/admin/payments/page.tsx: Add table, sort by date, filter pending

### 3. Mobile Responsiveness [ ]
- Inspect /hse/page.tsx, /modules/resume/page.tsx in mobile view
- Add Tailwind responsive classes (sm:, md:)

### 4. SEO Meta Tags [ ]
- app/layout.tsx: Add title, description, og:image
- HSE specific metas

### 5. Test Manual Flow [ ]
- Register /auth/register
- Login -> dashboard -> /hse gen (may need credits/premium)
- Export PDF

### 6. Empire Prep [ ]
- Create TODO-EMPIRE.md

Next: Implement 1-2
