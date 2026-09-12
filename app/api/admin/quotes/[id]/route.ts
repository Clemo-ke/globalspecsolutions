import { requireAdmin } from '@/lib/admin-guard'
import { db } from '@/lib/db'
import { quoteRequests } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

// PUT /api/admin/quotes/[id] - Update quote status or notes
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin()
  if (!session) return new Response('Unauthorized', { status: 401 })

  try {
    const { id } = await params
    const quoteId = parseInt(id)
    const body = await req.json()

    const updateData: Record<string, any> = {}
    if (body.status !== undefined) updateData.status = body.status
    if (body.notes !== undefined) updateData.notes = body.notes

    await db.update(quoteRequests).set(updateData).where(eq(quoteRequests.id, quoteId))

    return Response.json({ success: true, message: 'Quote updated successfully' })
  } catch (err: any) {
    return Response.json({ error: err.message || 'Failed to update quote' }, { status: 500 })
  }
}

// DELETE /api/admin/quotes/[id] - Delete a quote request
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin()
  if (!session) return new Response('Unauthorized', { status: 401 })

  try {
    const { id } = await params
    const quoteId = parseInt(id)
    await db.delete(quoteRequests).where(eq(quoteRequests.id, quoteId))
    return Response.json({ success: true, message: 'Quote deleted successfully' })
  } catch (err: any) {
    return Response.json({ error: err.message || 'Failed to delete quote' }, { status: 500 })
  }
}