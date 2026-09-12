import { requireAdmin } from '@/lib/admin-guard'
import { db } from '@/lib/db'
import { orders, refunds } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

// POST /api/admin/orders/[id]/refund - Record a refund for an order
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin()
  if (!session) return new Response('Unauthorized', { status: 401 })

  try {
    const { id } = await params
    const orderId = parseInt(id)
    const body = await req.json()
    const amount = Number(body.amount)
    if (!amount || amount <= 0) {
      return Response.json({ error: 'A valid refund amount is required' }, { status: 400 })
    }

    const orderRes = await db.select().from(orders).where(eq(orders.id, orderId)).limit(1)
    if (orderRes.length === 0) return Response.json({ error: 'Order not found' }, { status: 404 })
    const order = orderRes[0]

    const total = Number(order.total || 0)
    const alreadyRefunded = Number(order.refundedAmount || 0)
    if (alreadyRefunded + amount > total) {
      return Response.json({ error: `Refund exceeds order total (already refunded ${alreadyRefunded.toLocaleString()} of ${total.toLocaleString()})` }, { status: 400 })
    }

    await db.insert(refunds).values({
      orderId,
      amount: amount.toFixed(2),
      reason: body.reason || null,
      refundedAt: new Date(),
    })

    const newRefunded = alreadyRefunded + amount
    let paymentStatus = 'Partially Refunded'
    if (Math.abs(newRefunded - total) < 0.01) {
      paymentStatus = 'Refunded'
    }

    await db.update(orders).set({
      refundedAmount: newRefunded.toFixed(2),
      paymentStatus,
    }).where(eq(orders.id, orderId))

    return Response.json({ success: true, message: `Refund of KES ${amount.toLocaleString()} recorded` })
  } catch (err: any) {
    return Response.json({ error: err.message || 'Failed to record refund' }, { status: 500 })
  }
}