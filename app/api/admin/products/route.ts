import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { products, productCategories, services, partners, solutions } from '@/lib/db/schema'
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

    // ─── Create Category ───────────────────────────────────────────────────
    if (body.type === 'category') {
      const slug = body.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '')
      await db.insert(productCategories).values({
        name: body.name,
        slug: body.slug || slug,
        description: body.description || '',
        icon: body.icon || '',
        color: body.color || '#2563eb',
        imageUrl: body.imageUrl || '',
      })
      return Response.json({ success: true, message: 'Category created' })
    }

    // ─── Create Service ────────────────────────────────────────────────────
    if (body.type === 'service') {
      const slug = body.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '')
      await db.insert(services).values({
        name: body.name,
        slug: body.slug || slug,
        description: body.description || '',
        details: body.details || body.description || '',
        icon: body.icon || 'Server',
        imageUrl:
          body.imageUrl ||
          'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80',
      })
      return Response.json({ success: true, message: 'Service created successfully' })
    }

    // ─── Create Solution ───────────────────────────────────────────────────
    if (body.type === 'solution') {
      const slug = (body.title || body.name)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '')
      await db.insert(solutions).values({
        title: body.title || body.name,
        slug: body.slug || slug,
        description: body.description || '',
        benefits: body.benefits || '',
        imageUrl:
          body.imageUrl ||
          'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&auto=format&fit=crop&q=80',
        isActive: true,
      })
      return Response.json({ success: true, message: 'Solution created successfully' })
    }

    // ─── Create Partner ────────────────────────────────────────────────────
    if (body.type === 'partner') {
      const slug = body.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '')
      await db.insert(partners).values({
        name: body.name,
        slug: body.slug || slug,
        logoUrl:
          body.logoUrl ||
          'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=80',
        websiteUrl: body.websiteUrl || '',
        description: body.description || '',
        category: body.category || 'Technology Partner',
      })
      return Response.json({ success: true, message: 'Partner created successfully' })
    }

    // ─── Create Product ────────────────────────────────────────────────────
    const slug = body.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '')

    await db.insert(products).values({
      name: body.name,
      slug: body.slug || slug,
      description: body.description || '',
      price: body.price ? body.price.toString() : '0',
      salePrice: body.salePrice ? body.salePrice.toString() : null,
      categoryId: body.categoryId ? Number(body.categoryId) : 1,
      imageUrl:
        body.imageUrl ||
        'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&auto=format&fit=crop&q=80',
      sku: body.sku || `GSS-${Math.floor(Math.random() * 9000 + 1000)}`,
      stockStatus: body.stockStatus || 'in_stock',
      isFeatured: Boolean(body.isFeatured),
      features: body.features || '',
      specifications: body.specifications || '',
      isActive: true,
    })

    return Response.json({ success: true, message: 'Product created successfully' })
  } catch (err: any) {
    return Response.json({ error: err.message || 'Failed to create item' }, { status: 500 })
  }
}
