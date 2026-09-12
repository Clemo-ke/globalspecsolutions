import { requireAdmin } from '@/lib/admin-guard'
import { db } from '@/lib/db'
import { pages } from '@/lib/db/schema'
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
    if (body.content !== undefined) updateData.content = body.content
    if (body.metaTitle !== undefined) updateData.metaTitle = body.metaTitle
    if (body.metaDescription !== undefined) updateData.metaDescription = body.metaDescription
    if (body.ogImage !== undefined) updateData.ogImage = body.ogImage
    if (body.canonicalUrl !== undefined) updateData.canonicalUrl = body.canonicalUrl
    if (body.isActive !== undefined) updateData.isActive = Boolean(body.isActive)
    if (Object.keys(updateData).length === 0) return Response.json({ error: 'Nothing to update' }, { status: 400 })
    await db.update(pages).set(updateData).where(eq(pages.id, parseInt(id)))
    return Response.json({ success: true, message: 'Page updated' })
  } catch (err: any) {
    return Response.json({ error: err.message || 'Failed to update page' }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin()
  if (!session) return new Response('Unauthorized', { status: 401 })
  try {
    const { id } = await params
    await db.delete(pages).where(eq(pages.id, parseInt(id)))
    return Response.json({ success: true, message: 'Page deleted' })
  } catch (err: any) {
    return Response.json({ error: err.message || 'Failed to delete page' }, { status: 500 })
  }
}