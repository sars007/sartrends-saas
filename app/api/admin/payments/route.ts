export const dynamic = 'force-dynamic'

export async function GET() {
  return Response.json({ ok: true, payments: [] })
}

export async function POST() {
  return Response.json({ ok: true })
}
