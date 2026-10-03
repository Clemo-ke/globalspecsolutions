import { db } from '@/lib/db'
import { heroSlides } from '@/lib/db/schema'
import { requireAdmin } from '@/lib/admin-guard'

import { normalizeImageUrl } from '@/lib/save-image'

export async function GET() {
  const session = await requireAdmin()
  if (!session) return new Response('Unauthorized', { status: 401 })

  const slides = await db.select().from(heroSlides).orderBy(heroSlides.orderPosition)
  return Response.json(slides)
}

export async function POST(req: Request) {
  const session = await requireAdmin()
  if (!session) return new Response('Unauthorized', { status: 401 })

  const body = await req.json()
  const imageUrl = body.imageUrl ? await normalizeImageUrl(body.imageUrl, 'hero', 'hero') : null

  await db.insert(heroSlides).values({
    title: body.title,
    subtitle: body.subtitle || null,
    description: body.description || null,
    imageUrl,
    ctaText: body.ctaText || 'Learn More',
    ctaLink: body.ctaLink || '/shop',
    orderPosition: body.orderPosition !== undefined ? parseInt(body.orderPosition, 10) : 0,
    isActive: body.isActive !== undefined ? Boolean(body.isActive) : true,
  })

  return Response.json({ success: true })
}
