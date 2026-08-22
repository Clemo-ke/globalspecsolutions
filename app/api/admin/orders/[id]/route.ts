import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { orders } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { headers } from 'next/headers'

// PUT /api/admin/orders/[id] - Update order status or details
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) return new Response('Unauthorized', { status: 401 })

  try {
    const { id } = await params
    const orderId = parseInt(id)
    const body = await req.json()

    const updateData: Record<string, any> = {}
    if (body.status !== undefined) updateData.status = body.status
    if (body.whatsappStatus !== undefined) updateData.whatsappStatus = body.whatsappStatus
    if (body.notes !== undefined) updateData.notes = body.notes

    await db.update(orders).set(updateData).where(eq(orders.id, orderId))

    return Response.json({ success: true, message: 'Order updated successfully' })
  } catch (err: any) {
    return Response.json({ error: err.message || 'Failed to update order' }, { status: 500 })
  }
}

// DELETE /api/admin/orders/[id] - Delete an order
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) return new Response('Unauthorized', { status: 401 })

  try {
    const { id } = await params
    const orderId = parseInt(id)
    await db.delete(orders).where(eq(orders.id, orderId))
    return Response.json({ success: true, message: 'Order deleted successfully' })
  } catch (err: any) {
    return Response.json({ error: err.message || 'Failed to delete order' }, { status: 500 })
  }
}
