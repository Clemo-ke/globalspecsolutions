import { db } from '@/lib/db'
import { productCategories } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { requireAdmin } from '@/lib/admin-guard'

import { normalizeImageUrl } from '@/lib/save-image'

// PUT /api/admin/categories/[id] - Update a category
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin()
  if (!session) return new Response('Unauthorized', { status: 401 })

  try {
    const { id } = await params
    const catId = parseInt(id)
    const body = await req.json()

    const updateData: Record<string, any> = {}
    if (body.name !== undefined) updateData.name = body.name
    if (body.slug !== undefined) updateData.slug = body.slug
    if (body.description !== undefined) updateData.description = body.description
    if (body.icon !== undefined) updateData.icon = body.icon
    if (body.color !== undefined) updateData.color = body.color
    if (body.imageUrl !== undefined) {
      updateData.imageUrl = await normalizeImageUrl(body.imageUrl, 'categories', `cat-${catId}`)
    }
    if (body.isActive !== undefined) updateData.isActive = Boolean(body.isActive)

    await db.update(productCategories).set(updateData).where(eq(productCategories.id, catId))

    return Response.json({ success: true, message: 'Category updated successfully' })
  } catch (err: any) {
    return Response.json({ error: err.message || 'Failed to update category' }, { status: 500 })
  }
}

// DELETE /api/admin/categories/[id] - Delete a category
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin()
  if (!session) return new Response('Unauthorized', { status: 401 })

  try {
    const { id } = await params
    const catId = parseInt(id)
    await db.delete(productCategories).where(eq(productCategories.id, catId))
    return Response.json({ success: true, message: 'Category deleted successfully' })
  } catch (err: any) {
    return Response.json({ error: err.message || 'Failed to delete category' }, { status: 500 })
  }
}
