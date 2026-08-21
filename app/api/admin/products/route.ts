import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { products, productCategories } from '@/lib/db/schema'
import { headers } from 'next/headers'

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) return new Response('Unauthorized', { status: 401 })

  const prods = await db.select().from(products)
  return Response.json(prods)
}

export async function POST(req: Request) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) return new Response('Unauthorized', { status: 401 })

  try {
    const body = await req.json()

    if (body.type === 'category') {
      const slug = body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
      await db.insert(productCategories).values({
        name: body.name,
        slug: body.slug || slug,
        description: body.description || '',
      })
      return Response.json({ success: true, message: 'Category created' })
    }

    const slug = body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
    await db.insert(products).values({
      name: body.name,
      slug: body.slug || slug,
      description: body.description || '',
      shortDescription: body.shortDescription || body.description?.slice(0, 150) || '',
      price: body.price ? body.price.toString() : '0',
      comparePrice: body.comparePrice ? body.comparePrice.toString() : null,
      categoryId: body.categoryId ? Number(body.categoryId) : null,
      imageUrl: body.imageUrl || 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&auto=format&fit=crop&q=80',
      sku: body.sku || `GS-${Math.floor(Math.random() * 9000 + 1000)}`,
      stock: body.stock ? Number(body.stock) : 10,
      stockStatus: body.stockStatus || 'In Stock',
    })

    return Response.json({ success: true, message: 'Product created successfully' })
  } catch (err: any) {
    return Response.json({ error: err.message || 'Failed to create item' }, { status: 500 })
  }
}
