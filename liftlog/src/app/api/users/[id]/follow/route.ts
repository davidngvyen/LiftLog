import { NextResponse } from 'next/server'
import { enforceRateLimit } from '@/lib/security/ratelimit'

export async function POST(req: Request) {
  const limited = await enforceRateLimit({ req, category: 'write' })
  if (limited) return limited

  return NextResponse.json({ ok: true })
}
