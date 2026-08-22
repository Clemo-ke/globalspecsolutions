import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { products } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { headers } from 'next/headers'

// PUT /api/admin/products/[id] - Update a product
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) return new Response('Unauthorized', { status: 401 })

  try {
    const { id } = await params
    const productId = parseInt(id)
    const body = await req.json()

    const updateData: Record<string, any> = {}
    if (body.name !== undefined) updateData.name = body.name
    if (body.slug !== undefined) updateData.slug = body.slug
    if (body.description !== undefined) updateData.description = body.description
    if (body.price !== undefined) updateData.price = body.price ? body.price.toString() : null
    if (body.salePrice !== undefined) updateData.salePrice = body.salePrice ? body.salePrice.toString() : null
    if (body.categoryId !== undefined) updateData.categoryId = Number(body.categoryId)
    if (body.imageUrl !== undefined) updateData.imageUrl = body.imageUrl
    if (body.sku !== undefined) updateData.sku = body.sku
    if (body.stockStatus !== undefined) updateData.stockStatus = body.stockStatus
    if (body.isFeatured !== undefined) updateData.isFeatured = Boolean(body.isFeatured)
    if (body.isActive !== undefined) updateData.isActive = Boolean(body.isActive)
    if (body.features !== undefined) updateData.features = body.features
    if (body.specifications !== undefined) updateData.specifications = body.specifications

    await db.update(products).set(updateData).where(eq(products.id, productId))

    return Response.json({ success: true, message: 'Product updated successfully' })
  } catch (err: any) {
    return Response.json({ error: err.message || 'Failed to update product' }, { status: 500 })
  }
}

// DELETE /api/admin/products/[id] - Delete a product
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) return new Response('Unauthorized', { status: 401 })

  try {
    const { id } = await params
    const productId = parseInt(id)
    await db.delete(products).where(eq(products.id, productId))
    return Response.json({ success: true, message: 'Product deleted successfully' })
  } catch (err: any) {
    return Response.json({ error: err.message || 'Failed to delete product' }, { status: 500 })
  }
}
