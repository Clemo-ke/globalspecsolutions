import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { productCategories } from '@/lib/db/schema'
import { headers } from 'next/headers'

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) return new Response('Unauthorized', { status: 401 })

  const cats = await db.select().from(productCategories).orderBy(productCategories.orderPosition)
  return Response.json(cats)
}
