import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { partners } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { headers } from 'next/headers'

// PUT /api/admin/partners/[id] - Update a partner
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) return new Response('Unauthorized', { status: 401 })

  try {
    const { id } = await params
    const partnerId = parseInt(id)
    const body = await req.json()

    const updateData: Record<string, any> = {}
    if (body.name !== undefined) updateData.name = body.name
    if (body.slug !== undefined) updateData.slug = body.slug
    if (body.category !== undefined) updateData.category = body.category
    if (body.logoUrl !== undefined) updateData.logoUrl = body.logoUrl
    if (body.websiteUrl !== undefined) updateData.websiteUrl = body.websiteUrl
    if (body.description !== undefined) updateData.description = body.description
    if (body.isFeatured !== undefined) updateData.isFeatured = Boolean(body.isFeatured)
    if (body.isActive !== undefined) updateData.isActive = Boolean(body.isActive)

    await db.update(partners).set(updateData).where(eq(partners.id, partnerId))

    return Response.json({ success: true, message: 'Partner updated successfully' })
  } catch (err: any) {
    return Response.json({ error: err.message || 'Failed to update partner' }, { status: 500 })
  }
}

// DELETE /api/admin/partners/[id] - Delete a partner
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) return new Response('Unauthorized', { status: 401 })

  try {
    const { id } = await params
    const partnerId = parseInt(id)
    await db.delete(partners).where(eq(partners.id, partnerId))
    return Response.json({ success: true, message: 'Partner deleted successfully' })
  } catch (err: any) {
    return Response.json({ error: err.message || 'Failed to delete partner' }, { status: 500 })
  }
}
