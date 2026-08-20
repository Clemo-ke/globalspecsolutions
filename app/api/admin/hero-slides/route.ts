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

  const data = await req.json()
  const result = await db.insert(heroSlides).values(data).returning()
  return Response.json(result[0])
}
