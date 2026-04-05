export const dynamic = 'force-dynamic'

export async function GET() {
  return Response.json({ ok: true, users: [] })
}

export async function POST() {
  return Response.json({ ok: true })
}
