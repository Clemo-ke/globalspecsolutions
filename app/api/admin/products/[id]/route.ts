import { db } from '@/lib/db'
import { products, productSpecs, productDepartments, inventoryTransactions } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { requireAdmin } from '@/lib/admin-guard'

// PUT /api/admin/products/[id] - Update a product
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin()
  if (!session) return new Response('Unauthorized', { status: 401 })

  try {
    const { id } = await params
    const productId = parseInt(id)
    const body = await req.json()

    const updateData: Record<string, any> = {}
    if (body.name !== undefined) updateData.name = body.name
    if (body.slug !== undefined) updateData.slug = body.slug
    if (body.shortDescription !== undefined) updateData.shortDescription = body.shortDescription
    if (body.description !== undefined) updateData.description = body.description
    if (body.price !== undefined) updateData.price = body.price ? body.price.toString() : null
    if (body.salePrice !== undefined) updateData.salePrice = body.salePrice ? body.salePrice.toString() : null
    if (body.costPrice !== undefined) updateData.costPrice = body.costPrice ? body.costPrice.toString() : null
    if (body.currency !== undefined) updateData.currency = body.currency
    if (body.categoryId !== undefined) updateData.categoryId = Number(body.categoryId)
    if (body.brandId !== undefined) updateData.brandId = body.brandId ? Number(body.brandId) : null
    if (body.imageUrl !== undefined) updateData.imageUrl = body.imageUrl
    if (body.sku !== undefined) updateData.sku = body.sku
    if (body.purchaseType !== undefined) updateData.purchaseType = body.purchaseType
    if (body.stockQuantity !== undefined) updateData.stockQuantity = Number(body.stockQuantity)
    if (body.lowStockThreshold !== undefined) updateData.lowStockThreshold = Number(body.lowStockThreshold)
    if (body.stockStatus !== undefined) updateData.stockStatus = body.stockStatus
    if (body.isFeatured !== undefined) updateData.isFeatured = Boolean(body.isFeatured)
    if (body.isActive !== undefined) updateData.isActive = Boolean(body.isActive)
    if (body.features !== undefined) updateData.features = body.features
    if (body.specifications !== undefined) updateData.specifications = body.specifications

    await db.update(products).set(updateData).where(eq(products.id, productId))

    // Log stock movements as inventory transactions (Part 31)
    if (body.stockQuantity !== undefined || body.stockStatus !== undefined) {
      const noteParts: string[] = []
      if (body.stockQuantity !== undefined) noteParts.push(`adjusted to ${Number(body.stockQuantity)}`)
      if (body.stockStatus !== undefined) noteParts.push(`status → ${body.stockStatus}`)
      await db.insert(inventoryTransactions).values({
        productId,
        type: 'adjustment',
        quantityChange: body.stockQuantity !== undefined ? Number(body.stockQuantity) : 0,
        note: `Manual admin update (${noteParts.join(', ')})`,
      })
    }

    // Replace dynamic specs + department links if provided
    if (Array.isArray(body.specs)) {
      await db.delete(productSpecs).where(eq(productSpecs.productId, productId))
      const specs: { label: string; value: string }[] = body.specs
      for (let i = 0; i < specs.length; i++) {
        const s = specs[i]
        if (s.label && s.value) {
          await db.insert(productSpecs).values({ productId, label: s.label, value: s.value, orderPosition: i })
        }
      }
    }
    if (Array.isArray(body.departmentIds)) {
      await db.delete(productDepartments).where(eq(productDepartments.productId, productId))
      const deptIds: number[] = body.departmentIds.map(Number).filter(Boolean)
      for (const deptId of deptIds) {
        await db.insert(productDepartments).values({ productId, departmentId: deptId })
      }
    }

    return Response.json({ success: true, message: 'Product updated successfully' })
  } catch (err: any) {
    return Response.json({ error: err.message || 'Failed to update product' }, { status: 500 })
  }
}

// DELETE /api/admin/products/[id] - Delete a product
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin()
  if (!session) return new Response('Unauthorized', { status: 401 })

  try {
    const { id } = await params
    const productId = parseInt(id)
    await db.delete(products).where(eq(products.id, productId))
    return Response.json({ success: true, message: 'Product deleted successfully' })
  } catch (err: any) {
    return Response.json({ error: err.message || 'Failed to delete product' }, { status: 500 })
  }
}
