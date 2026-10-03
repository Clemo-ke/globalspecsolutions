import { db } from '@/lib/db'
import { partners } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { requireAdmin } from '@/lib/admin-guard'
import { normalizeImageUrl } from '@/lib/save-image'

// PUT /api/admin/partners/[id] - Update a partner
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin()
  if (!session) return new Response('Unauthorized', { status: 401 })

  try {
    const { id } = await params
    const partnerId = parseInt(id)
    const body = await req.json()

    const updateData: Record<string, any> = {}
    if (body.name !== undefined) updateData.name = body.name
    if (body.slug !== undefined && body.slug.trim() !== '') {
      updateData.slug = body.slug.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
    } else if (body.name) {
      updateData.slug = body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
    }
    if (body.category !== undefined) updateData.category = body.category
    if (body.logoUrl !== undefined) {
      updateData.logoUrl = await normalizeImageUrl(body.logoUrl, 'partners', `partner-${partnerId}`)
    }
    if (body.websiteUrl !== undefined) updateData.websiteUrl = body.websiteUrl
    if (body.description !== undefined) updateData.description = body.description
    if (body.isFeatured !== undefined) updateData.isFeatured = Boolean(body.isFeatured)
    if (body.isActive !== undefined) updateData.isActive = Boolean(body.isActive)

    await db.update(partners).set(updateData).where(eq(partners.id, partnerId))

    return Response.json({ success: true, message: 'Partner updated successfully' })
  } catch (err: any) {
    console.error('[PARTNER UPDATE ERROR]', err)
    return Response.json({ error: err.message || 'Failed to update partner' }, { status: 500 })
  }
}

// DELETE /api/admin/partners/[id] - Delete a partner
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin()
  if (!session) return new Response('Unauthorized', { status: 401 })

  try {
    const { id } = await params
    const partnerId = parseInt(id)
    await db.delete(partners).where(eq(partners.id, partnerId))
    return Response.json({ success: true, message: 'Partner deleted successfully' })
  } catch (err: any) {
    return Response.json({ error: err.message || 'Failed to delete partner' }, { status: 500 })
  }
}
