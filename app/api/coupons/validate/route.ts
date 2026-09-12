import { NextRequest, NextResponse } from 'next/server'
import { resolveCoupon } from '@/lib/coupons'

// GET /api/coupons/validate?code=SAVE10&subtotal=120000
export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code') || ''
  const subtotal = parseFloat(req.nextUrl.searchParams.get('subtotal') || '0') || 0

  const res = await resolveCoupon(code, subtotal)
  if (!res.ok) {
    return NextResponse.json({ valid: false, error: res.error }, { status: 400 })
  }

  return NextResponse.json({ valid: true, ...res.result })
}