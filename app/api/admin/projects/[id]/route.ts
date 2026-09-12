import { requireAdmin } from '@/lib/admin-guard'
import { db } from '@/lib/db'
import { projects } from '@/lib/db/schema'
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
    if (body.clientName !== undefined) updateData.clientName = body.clientName
    if (body.location !== undefined) updateData.location = body.location
    if (body.description !== undefined) updateData.description = body.description
    if (body.imageUrl !== undefined) updateData.imageUrl = body.imageUrl
    if (body.status !== undefined) updateData.status = body.status
    if (body.year !== undefined) updateData.year = body.year
    if (body.orderPosition !== undefined) updateData.orderPosition = Number(body.orderPosition)
    if (body.isActive !== undefined) updateData.isActive = Boolean(body.isActive)
    if (Object.keys(updateData).length === 0) return Response.json({ error: 'Nothing to update' }, { status: 400 })
    await db.update(projects).set(updateData).where(eq(projects.id, parseInt(id)))
    return Response.json({ success: true, message: 'Project updated' })
  } catch (err: any) {
    return Response.json({ error: err.message || 'Failed to update project' }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin()
  if (!session) return new Response('Unauthorized', { status: 401 })
  try {
    const { id } = await params
    await db.delete(projects).where(eq(projects.id, parseInt(id)))
    return Response.json({ success: true, message: 'Project deleted' })
  } catch (err: any) {
    return Response.json({ error: err.message || 'Failed to delete project' }, { status: 500 })
  }
}