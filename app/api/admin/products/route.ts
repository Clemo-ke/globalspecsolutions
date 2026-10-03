import { db } from '@/lib/db'
import { products, productCategories, productSpecs, productDepartments, services, partners, solutions } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { requireAdmin } from '@/lib/admin-guard'
import { normalizeImageUrl } from '@/lib/save-image'

export async function GET() {
  const session = await requireAdmin()
  if (!session) return new Response('Unauthorized', { status: 401 })

  const prods = await db.select().from(products)
  return Response.json(prods)
}

export async function POST(req: Request) {
  const session = await requireAdmin()
  if (!session) return new Response('Unauthorized', { status: 401 })

  try {
    const body = await req.json()

    // ─── Create Category ───────────────────────────────────────────────────
    if (body.type === 'category') {
      const slug = body.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '')
      const imageUrl = body.imageUrl ? await normalizeImageUrl(body.imageUrl, 'categories', 'cat') : ''
      await db.insert(productCategories).values({
        name: body.name,
        slug: body.slug || slug,
        description: body.description || '',
        icon: body.icon || '',
        color: body.color || '#2563eb',
        imageUrl,
      })
      return Response.json({ success: true, message: 'Category created' })
    }

    // ─── Create Service ────────────────────────────────────────────────────
    if (body.type === 'service') {
      const slug = body.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '')
      const imageUrl = body.imageUrl
        ? await normalizeImageUrl(body.imageUrl, 'services', 'service')
        : 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80'
      await db.insert(services).values({
        name: body.name,
        slug: body.slug || slug,
        description: body.description || '',
        details: body.details || body.description || '',
        icon: body.icon || 'Server',
        imageUrl,
      })
      return Response.json({ success: true, message: 'Service created successfully' })
    }

    // ─── Create Solution ───────────────────────────────────────────────────
    if (body.type === 'solution') {
      const slug = (body.title || body.name)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '')
      const imageUrl = body.imageUrl
        ? await normalizeImageUrl(body.imageUrl, 'solutions', 'solution')
        : 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&auto=format&fit=crop&q=80'
      await db.insert(solutions).values({
        title: body.title || body.name,
        slug: body.slug || slug,
        description: body.description || '',
        benefits: body.benefits || '',
        imageUrl,
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
      const logoUrl = body.logoUrl
        ? await normalizeImageUrl(body.logoUrl, 'partners', 'partner')
        : 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=80'
      await db.insert(partners).values({
        name: body.name,
        slug: body.slug || slug,
        logoUrl,
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

    const imageUrl = body.imageUrl
      ? await normalizeImageUrl(body.imageUrl, 'products', 'product')
      : 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&auto=format&fit=crop&q=80'

    await db.insert(products).values({
      name: body.name,
      slug: body.slug || slug,
      shortDescription: body.shortDescription || '',
      description: body.description || '',
      price: body.price ? body.price.toString() : '0',
      salePrice: body.salePrice ? body.salePrice.toString() : null,
      costPrice: body.costPrice ? body.costPrice.toString() : null,
      currency: body.currency || 'KES',
      categoryId: body.categoryId ? Number(body.categoryId) : 1,
      brandId: body.brandId ? Number(body.brandId) : null,
      imageUrl,
      sku: body.sku || `GSS-${Math.floor(Math.random() * 9000 + 1000)}`,
      purchaseType: body.purchaseType || 'buy_online',
      stockQuantity: body.stockQuantity !== undefined ? Number(body.stockQuantity) : 0,
      lowStockThreshold: body.lowStockThreshold !== undefined ? Number(body.lowStockThreshold) : 5,
      stockStatus: body.stockStatus || 'in_stock',
      isFeatured: Boolean(body.isFeatured),
      features: body.features || '',
      specifications: body.specifications || '',
      isActive: true,
    })

    // Attach dynamic specs + department links
    const [created] = await db.select().from(products).where(eq(products.slug, body.slug || slug))
    if (created) {
      const specs: { label: string; value: string }[] = Array.isArray(body.specs) ? body.specs : []
      for (let i = 0; i < specs.length; i++) {
        const s = specs[i]
        if (s.label && s.value) {
          await db.insert(productSpecs).values({ productId: created.id, label: s.label, value: s.value, orderPosition: i })
        }
      }
      const deptIds: number[] = Array.isArray(body.departmentIds) ? body.departmentIds.map(Number).filter(Boolean) : []
      for (const deptId of deptIds) {
        await db.insert(productDepartments).values({ productId: created.id, departmentId: deptId })
      }
    }

    return Response.json({ success: true, message: 'Product created successfully' })
  } catch (err: any) {
    return Response.json({ error: err.message || 'Failed to create item' }, { status: 500 })
  }
}
