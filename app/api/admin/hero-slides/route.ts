import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { heroSlides } from '@/lib/db/schema'
import { headers } from 'next/headers'

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) return new Response('Unauthorized', { status: 401 })

  const slides = await db.select().from(heroSlides).orderBy(heroSlides.orderPosition)
  return Response.json(slides)
}

export async function POST(req: Request) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) return new Response('Unauthorized', { status: 401 })

  const body = await req.json()

  await db.insert(heroSlides).values({
    title: body.title,
    subtitle: body.subtitle || null,
    description: body.description || null,
    imageUrl: body.imageUrl || null,
    ctaText: body.ctaText || 'Learn More',
    ctaLink: body.ctaLink || '/shop',
    orderPosition: body.orderPosition !== undefined ? parseInt(body.orderPosition, 10) : 0,
    isActive: body.isActive !== undefined ? Boolean(body.isActive) : true,
  })

  return Response.json({ success: true })
}
