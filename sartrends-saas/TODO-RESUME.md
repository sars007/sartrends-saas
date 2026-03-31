# TODO - Resume Module Recovery

## Objective
Resume the interrupted implementation by reconstructing the missing AI/credits backend flow used by `app/modules/resume/page.tsx`.

## Current State
- Resume page exists and sends `POST /api/ai` with `{ prompt, lang }`.
- Prisma is configured and includes `User.credits`.
- Missing backend/app utility files were preventing end-to-end flow.

## Task Checklist

- [x] Reconstruct task context from existing files
- [x] Create a normalized progress tracker (`TODO.md`)
- [ ] Add `lib/ai.ts`
- [ ] Add `lib/credits.ts`
- [ ] Add `app/api/ai/route.ts`
- [ ] Add `middleware.ts` baseline
- [ ] Validate response contract used by resume page

## API Contract Required by Resume Page
- Success:
```json
{
  "response": "generated content",
  "credits": 9
}
```
- Error:
```json
{
  "error": "message"
}
```

## Notes
- Default implementation will use a local fallback model response when external AI provider is unavailable.
- Credit deduction logic is centralized in `lib/credits.ts`.
