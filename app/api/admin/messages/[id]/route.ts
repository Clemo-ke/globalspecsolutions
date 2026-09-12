import { requireAdmin } from '@/lib/admin-guard'
import { db } from '@/lib/db'
import { contactMessages } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

// PUT /api/admin/messages/[id] - Update inquiry status (New / Read / Replied / Archived)
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin()
  if (!session) return new Response('Unauthorized', { status: 401 })

  try {
    const { id } = await params
    const body = await req.json()
    if (body.status !== undefined) {
      await db.update(contactMessages).set({ status: body.status }).where(eq(contactMessages.id, parseInt(id)))
    }
    return Response.json({ success: true })
  } catch (err: any) {
    return Response.json({ error: err.message || 'Failed to update message' }, { status: 500 })
  }
}

// DELETE /api/admin/messages/[id] - Delete an inquiry
export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin()
  if (!session) return new Response('Unauthorized', { status: 401 })

  try {
    const { id } = await params
    await db.delete(contactMessages).where(eq(contactMessages.id, parseInt(id)))
    return Response.json({ success: true })
  } catch (err: any) {
    return Response.json({ error: err.message || 'Failed to delete message' }, { status: 500 })
  }
}