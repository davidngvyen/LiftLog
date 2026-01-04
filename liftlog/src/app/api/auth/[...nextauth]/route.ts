import { NextResponse } from 'next/server'
import { enforceRateLimit } from '@/lib/security/ratelimit'

export async function GET(req: Request) {
  const limited = await enforceRateLimit({ req, category: 'auth' })
  if (limited) return limited

  return NextResponse.json({ ok: true })
}
