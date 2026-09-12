import { requireAdmin } from '@/lib/admin-guard'
import { db } from '@/lib/db'
import { resources } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin()
  if (!session) return new Response('Unauthorized', { status: 401 })
  try {
    const { id } = await params
    const body = await req.json()
    const updateData: Record<string, any> = {}
    if (body.slug !== undefined) updateData.slug = String(body.slug).toLowerCase().replace(/[^a-z0-9-_]/g, '-')
    if (body.title !== undefined) updateData.title = body.title
    if (body.category !== undefined) updateData.category = body.category
    if (body.description !== undefined) updateData.description = body.description
    if (body.fileUrl !== undefined) updateData.fileUrl = body.fileUrl
    if (body.fileSize !== undefined) updateData.fileSize = body.fileSize
    if (body.thumbnailUrl !== undefined) updateData.thumbnailUrl = body.thumbnailUrl
    if (body.isFeatured !== undefined) updateData.isFeatured = Boolean(body.isFeatured)
    if (body.isActive !== undefined) updateData.isActive = Boolean(body.isActive)
    if (Object.keys(updateData).length === 0) return Response.json({ error: 'Nothing to update' }, { status: 400 })
    await db.update(resources).set(updateData).where(eq(resources.id, parseInt(id)))
    return Response.json({ success: true, message: 'Resource updated' })
  } catch (err: any) {
    return Response.json({ error: err.message || 'Failed to update resource' }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin()
  if (!session) return new Response('Unauthorized', { status: 401 })
  try {
    const { id } = await params
    await db.delete(resources).where(eq(resources.id, parseInt(id)))
    return Response.json({ success: true, message: 'Resource deleted' })
  } catch (err: any) {
    return Response.json({ error: err.message || 'Failed to delete resource' }, { status: 500 })
  }
}