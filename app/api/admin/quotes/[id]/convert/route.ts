import { requireAdmin } from '@/lib/admin-guard'
import { db } from '@/lib/db'
import { orders, orderItems, quoteRequests, quoteItems, products, customers } from '@/lib/db/schema'
import { eq, inArray } from 'drizzle-orm'

// POST /api/admin/quotes/[id]/convert - Convert an approved quote into a sales order
export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin()
  if (!session) return new Response('Unauthorized', { status: 401 })

  try {
    const { id } = await params
    const quoteId = parseInt(id)

    const [quote] = await db.select().from(quoteRequests).where(eq(quoteRequests.id, quoteId))
    if (!quote) {
      return Response.json({ error: 'Quote not found' }, { status: 404 })
    }
    if (quote.status === 'Converted to Order') {
      return Response.json({ error: 'Quote has already been converted to an order' }, { status: 400 })
    }

    const items = await db.select().from(quoteItems).where(eq(quoteItems.quoteRequestId, quoteId))

    // Resolve pricing from the product catalog (sale price wins over list price)
    const productIds = items.map((it) => it.productId).filter((p): p is number => p != null)
    const productMap = new Map<number, any>()
    if (productIds.length > 0) {
      const rows = await db.select().from(products).where(inArray(products.id, productIds))
      rows.forEach((p) => productMap.set(p.id, p))
    }

    let subtotal = 0
    const orderLineItems = items.map((it) => {
      const product = it.productId != null ? productMap.get(it.productId) : undefined
      const unitPrice = product != null ? parseFloat(product.salePrice || product.price || '0') : 0
      const lineTotal = unitPrice * (it.quantity || 1)
      subtotal += lineTotal
      return {
        productId: it.productId,
        productName: it.productName,
        unitPrice,
        quantity: it.quantity || 1,
        totalPrice: lineTotal,
      }
    })

    const orderNumber = `GSS-${Date.now().toString().slice(-6)}`

    // Resolve customer link if the quote is tied to a customer account
    let resolvedCustomerId: number | null = quote.customerId
    if (!resolvedCustomerId) {
      const [existing] = await db.select().from(customers).where(eq(customers.email, quote.customerEmail))
      resolvedCustomerId = existing?.id ?? null
    }

    const [orderResult] = await db.insert(orders).values({
      orderNumber,
      customerId: resolvedCustomerId,
      customerName: quote.customerName,
      customerPhone: quote.customerPhone,
      customerEmail: quote.customerEmail,
      deliveryLocation: 'From quote ' + quote.quoteNumber,
      deliveryMethod: 'Quote Conversion',
      deliveryCost: '0.00',
      paymentStatus: 'Pending',
      notes: quote.notes || '',
      subtotal: subtotal.toFixed(2),
      total: subtotal.toFixed(2),
      status: 'Pending',
      whatsappStatus: 'Sent',
    })

    const insertedOrderId = orderResult.insertId

    for (const line of orderLineItems) {
      await db.insert(orderItems).values({
        orderId: Number(insertedOrderId),
        productId: line.productId,
        productName: line.productName,
        unitPrice: line.unitPrice.toFixed(2),
        quantity: line.quantity,
        totalPrice: line.totalPrice.toFixed(2),
      })
    }

    await db.update(quoteRequests).set({ status: 'Converted to Order' }).where(eq(quoteRequests.id, quoteId))

    return Response.json({ success: true, orderNumber, orderId: insertedOrderId })
  } catch (err: any) {
    console.error('Quote conversion error:', err)
    return Response.json({ error: err.message || 'Failed to convert quote' }, { status: 500 })
  }
}