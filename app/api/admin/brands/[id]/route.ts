import { requireAdmin } from '@/lib/admin-guard'
import { db } from '@/lib/db'
import { brands } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

// PUT /api/admin/brands/[id] - Update a brand
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin()
  if (!session) return new Response('Unauthorized', { status: 401 })
  try {
    const { id } = await params
    const body = await req.json()
    const updateData: Record<string, any> = {}
    if (body.slug !== undefined) updateData.slug = String(body.slug).toLowerCase().replace(/[^a-z0-9-_]/g, '-')
    if (body.name !== undefined) updateData.name = body.name
    if (body.logoUrl !== undefined) updateData.logoUrl = body.logoUrl
    if (body.websiteUrl !== undefined) updateData.websiteUrl = body.websiteUrl
    if (body.description !== undefined) updateData.description = body.description
    if (body.orderPosition !== undefined) updateData.orderPosition = Number(body.orderPosition)
    if (body.isActive !== undefined) updateData.isActive = Boolean(body.isActive)
    if (Object.keys(updateData).length === 0) return Response.json({ error: 'Nothing to update' }, { status: 400 })
    await db.update(brands).set(updateData).where(eq(brands.id, parseInt(id)))
    return Response.json({ success: true, message: 'Brand updated' })
  } catch (err: any) {
    return Response.json({ error: err.message || 'Failed to update brand' }, { status: 500 })
  }
}

// DELETE /api/admin/brands/[id] - Delete a brand
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin()
  if (!session) return new Response('Unauthorized', { status: 401 })
  try {
    const { id } = await params
    await db.delete(brands).where(eq(brands.id, parseInt(id)))
    return Response.json({ success: true, message: 'Brand deleted' })
  } catch (err: any) {
    return Response.json({ error: err.message || 'Failed to delete brand' }, { status: 500 })
  }
}