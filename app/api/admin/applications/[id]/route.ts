import { requireAdmin } from '@/lib/admin-guard'
import { db } from '@/lib/db'
import { applications, productApplications } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin()
  if (!session) return new Response('Unauthorized', { status: 401 })
  try {
    const { id } = await params
    const body = await req.json()
    const updateData: Record<string, any> = {}
    if (body.slug !== undefined) updateData.slug = String(body.slug).toLowerCase().replace(/[^a-z0-9-_]/g, '-')
    if (body.name !== undefined) updateData.name = body.name
    if (body.description !== undefined) updateData.description = body.description
    if (body.icon !== undefined) updateData.icon = body.icon
    if (body.imageUrl !== undefined) updateData.imageUrl = body.imageUrl
    if (body.orderPosition !== undefined) updateData.orderPosition = Number(body.orderPosition)
    if (body.isActive !== undefined) updateData.isActive = Boolean(body.isActive)
    if (Object.keys(updateData).length === 0) return Response.json({ error: 'Nothing to update' }, { status: 400 })
    await db.update(applications).set(updateData).where(eq(applications.id, parseInt(id)))
    return Response.json({ success: true, message: 'Application updated' })
  } catch (err: any) {
    return Response.json({ error: err.message || 'Failed to update application' }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin()
  if (!session) return new Response('Unauthorized', { status: 401 })
  try {
    const { id } = await params
    const appId = parseInt(id)
    await db.delete(productApplications).where(eq(productApplications.applicationId, appId))
    await db.delete(applications).where(eq(applications.id, appId))
    return Response.json({ success: true, message: 'Application deleted' })
  } catch (err: any) {
    return Response.json({ error: err.message || 'Failed to delete application' }, { status: 500 })
  }
}