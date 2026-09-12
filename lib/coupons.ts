import { db } from '@/lib/db'
import { coupons } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export interface CouponDiscount {
  couponId: number
  code: string
  discountType: 'percent' | 'fixed'
  discountValue: number
  discount: number
}

// Validates a coupon code against configured rules and computes the discount.
export async function resolveCoupon(code: string | undefined | null, subtotal: number): Promise<{ ok: boolean; error?: string; result?: CouponDiscount }> {
  if (!code || !code.trim()) return { ok: false, error: 'No coupon' }

  const [coupon] = await db.select().from(coupons).where(eq(coupons.code, code.trim().toUpperCase()))
  if (!coupon) return { ok: false, error: 'Invalid coupon code' }
  if (!coupon.isActive) return { ok: false, error: 'This coupon is no longer active' }

  const now = new Date()
  if (coupon.expiresAt && new Date(coupon.expiresAt) < now) return { ok: false, error: 'This coupon has expired' }
  if (coupon.startsAt && new Date(coupon.startsAt) > now) return { ok: false, error: 'This coupon is not active yet' }
  if (coupon.usageLimit && (coupon.usedCount ?? 0) >= coupon.usageLimit) return { ok: false, error: 'This coupon has reached its usage limit' }

  if (coupon.minSubtotal != null && subtotal < Number(coupon.minSubtotal)) {
    return { ok: false, error: `Minimum subtotal of KES ${Number(coupon.minSubtotal).toLocaleString()} required` }
  }

  const value = Number(coupon.discountValue)
  let discount = coupon.discountType === 'percent' ? (subtotal * value) / 100 : value
  if (coupon.maxDiscount != null) discount = Math.min(discount, Number(coupon.maxDiscount))
  discount = Math.min(discount, subtotal)
  discount = Math.max(0, Math.round(discount * 100) / 100)

  return {
    ok: true,
    result: {
      couponId: coupon.id,
      code: coupon.code,
      discountType: coupon.discountType as 'percent' | 'fixed',
      discountValue: value,
      discount,
    },
  }
}