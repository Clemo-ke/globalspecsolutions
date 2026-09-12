import { requireAdmin } from '@/lib/admin-guard'
import { db } from '@/lib/db'
import { media } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

// PUT /api/admin/media/[id] - Update media metadata
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin()
  if (!session) return new Response('Unauthorized', { status: 401 })

  try {
    const { id } = await params
    const body = await req.json()
    const updateData: Record<string, any> = {}
    if (body.altText !== undefined) updateData.altText = body.altText
    if (body.filename !== undefined) updateData.filename = body.filename
    await db.update(media).set(updateData).where(eq(media.id, parseInt(id)))
    return Response.json({ success: true })
  } catch (err: any) {
    return Response.json({ error: err.message || 'Failed to update media' }, { status: 500 })
  }
}

// DELETE /api/admin/media/[id] - Delete a media item
export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin()
  if (!session) return new Response('Unauthorized', { status: 401 })

  try {
    const { id } = await params
    await db.delete(media).where(eq(media.id, parseInt(id)))
    return Response.json({ success: true })
  } catch (err: any) {
    return Response.json({ error: err.message || 'Failed to delete media' }, { status: 500 })
  }
}