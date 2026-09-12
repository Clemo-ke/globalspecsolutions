import { requireAdmin } from '@/lib/admin-guard'
import { db } from '@/lib/db'
import { coupons } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

// PUT /api/admin/coupons/[id] - Update a coupon
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin()
  if (!session) return new Response('Unauthorized', { status: 401 })

  try {
    const { id } = await params
    const couponId = parseInt(id)
    const body = await req.json()

    const updateData: Record<string, any> = {}
    if (body.code !== undefined) updateData.code = String(body.code).toUpperCase()
    if (body.description !== undefined) updateData.description = body.description || null
    if (body.discountType !== undefined) updateData.discountType = body.discountType === 'fixed' ? 'fixed' : 'percent'
    if (body.discountValue !== undefined) updateData.discountValue = String(body.discountValue)
    if (body.minSubtotal !== undefined) updateData.minSubtotal = body.minSubtotal != null ? String(body.minSubtotal) : null
    if (body.maxDiscount !== undefined) updateData.maxDiscount = body.maxDiscount != null ? String(body.maxDiscount) : null
    if (body.usageLimit !== undefined) updateData.usageLimit = Number(body.usageLimit || 0)
    if (body.isActive !== undefined) updateData.isActive = Boolean(body.isActive)
    if (body.startsAt !== undefined) updateData.startsAt = body.startsAt || null
    if (body.expiresAt !== undefined) updateData.expiresAt = body.expiresAt || null

    await db.update(coupons).set(updateData).where(eq(coupons.id, couponId))
    return Response.json({ success: true })
  } catch (err: any) {
    return Response.json({ error: err.message || 'Failed to update coupon' }, { status: 500 })
  }
}

// DELETE /api/admin/coupons/[id] - Delete a coupon
export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin()
  if (!session) return new Response('Unauthorized', { status: 401 })

  try {
    const { id } = await params
    await db.delete(coupons).where(eq(coupons.id, parseInt(id)))
    return Response.json({ success: true })
  } catch (err: any) {
    return Response.json({ error: err.message || 'Failed to delete coupon' }, { status: 500 })
  }
}