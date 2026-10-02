import { NextResponse } from 'next/server'
import { ensureDefaultAdminUser } from '@/lib/seed'

export async function POST() {
  try {
    await ensureDefaultAdminUser()
    return NextResponse.json({ ok: true, message: 'Admin account ready' })
  } catch (error: any) {
    return NextResponse.json(
      { ok: false, error: error?.message || 'Failed to ensure admin account' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return POST()
}
