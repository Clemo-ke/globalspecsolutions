import { requireAdmin } from '@/lib/admin-guard'
import { db } from '@/lib/db'
import { coupons } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

// POST /api/admin/coupons - Create a coupon
export async function POST(req: Request) {
  const session = await requireAdmin()
  if (!session) return new Response('Unauthorized', { status: 401 })

  try {
    const body = await req.json()
    if (!body.code || body.discountValue == null) {
      return Response.json({ error: 'Code and discount value are required' }, { status: 400 })
    }

    const [inserted] = await db.insert(coupons).values({
      code: String(body.code).toUpperCase(),
      description: body.description || null,
      discountType: body.discountType === 'fixed' ? 'fixed' : 'percent',
      discountValue: String(body.discountValue),
      minSubtotal: body.minSubtotal != null ? String(body.minSubtotal) : null,
      maxDiscount: body.maxDiscount != null ? String(body.maxDiscount) : null,
      usageLimit: Number(body.usageLimit || 0),
      isActive: body.isActive !== undefined ? Boolean(body.isActive) : true,
      startsAt: body.startsAt || null,
      expiresAt: body.expiresAt || null,
    })

    return Response.json({ success: true, id: inserted.insertId })
  } catch (err: any) {
    if (String(err?.message || '').includes('Duplicate')) {
      return Response.json({ error: 'A coupon with this code already exists' }, { status: 409 })
    }
    return Response.json({ error: err.message || 'Failed to create coupon' }, { status: 500 })
  }
}