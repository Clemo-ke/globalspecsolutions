import { db } from '@/lib/db'
import { productCategories } from '@/lib/db/schema'
import { requireAdmin } from '@/lib/admin-guard'

export async function GET() {
  const session = await requireAdmin()
  if (!session) return new Response('Unauthorized', { status: 401 })

  const cats = await db.select().from(productCategories).orderBy(productCategories.orderPosition)
  return Response.json(cats)
}
