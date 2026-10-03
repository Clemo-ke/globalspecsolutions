import { db } from '@/lib/db'
import { heroSlides } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { requireAdmin } from '@/lib/admin-guard'

import { normalizeImageUrl } from '@/lib/save-image'

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAdmin()
  if (!session) return new Response('Unauthorized', { status: 401 })

  const resolvedParams = await params
  const id = parseInt(resolvedParams.id, 10)
  if (isNaN(id)) return new Response('Invalid ID', { status: 400 })

  const body = await req.json()
  const imageUrl = body.imageUrl ? await normalizeImageUrl(body.imageUrl, 'hero', `hero-${id}`) : body.imageUrl

  await db
    .update(heroSlides)
    .set({
      title: body.title,
      subtitle: body.subtitle,
      description: body.description,
      imageUrl,
      ctaText: body.ctaText,
      ctaLink: body.ctaLink,
      orderPosition: body.orderPosition !== undefined ? parseInt(body.orderPosition, 10) : 0,
      isActive: body.isActive !== undefined ? Boolean(body.isActive) : true,
      updatedAt: new Date(),
    })
    .where(eq(heroSlides.id, id))

  return Response.json({ success: true })
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAdmin()
  if (!session) return new Response('Unauthorized', { status: 401 })

  const resolvedParams = await params
  const id = parseInt(resolvedParams.id, 10)
  if (isNaN(id)) return new Response('Invalid ID', { status: 400 })

  await db.delete(heroSlides).where(eq(heroSlides.id, id))
  return Response.json({ success: true })
}
