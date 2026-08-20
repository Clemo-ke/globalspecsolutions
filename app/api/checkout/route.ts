import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { orders, orderItems, siteSettings } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { customerName, customerPhone, customerEmail, deliveryLocation, notes, items, subtotal, total } = body

    if (!customerName || !customerPhone || !customerEmail || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Missing required customer or order items data' }, { status: 400 })
    }

    const orderNumber = `GSS-${Date.now().toString().slice(-6)}`

    // Insert main order record
    const [orderResult] = await db.insert(orders).values({
      orderNumber,
      customerName,
      customerPhone,
      customerEmail,
      deliveryLocation: deliveryLocation || '',
      notes: notes || '',
      subtotal: subtotal.toString(),
      total: total.toString(),
      status: 'New',
      whatsappStatus: 'Sent',
    })

    const insertedOrderId = orderResult.insertId

    // Insert order items
    for (const item of items) {
      await db.insert(orderItems).values({
        orderId: Number(insertedOrderId),
        productId: item.id,
        productName: item.name,
        unitPrice: item.price.toString(),
        quantity: item.quantity,
        totalPrice: (item.price * item.quantity).toString(),
      })
    }

    // Get configured WhatsApp number from settings
    const settingsRows = await db.select().from(siteSettings).where(eq(siteSettings.settingKey, 'whatsapp_number'))
    const whatsappNum = settingsRows[0]?.settingValue || '+254721113431'
    const cleanNumber = whatsappNum.replace(/[^0-9]/g, '')

    // Format WhatsApp message
    let messageText = `Hello Global Spec Solutions, I would like to place an order.\n\n`
    messageText += `*Order Number:* ${orderNumber}\n`
    messageText += `*Items:*\n`

    items.forEach((item: any) => {
      messageText += `• ${item.name} (x${item.quantity}) - KES ${(item.price * item.quantity).toLocaleString()}\n`
    })

    messageText += `\n*Total Amount:* KES ${Number(total).toLocaleString()}\n\n`
    messageText += `*Customer Details:*\n`
    messageText += `Name: ${customerName}\n`
    messageText += `Phone: ${customerPhone}\n`
    messageText += `Email: ${customerEmail}\n`
    if (deliveryLocation) messageText += `Location: ${deliveryLocation}\n`
    if (notes) messageText += `Notes: ${notes}\n`
    messageText += `\nPlease confirm and assist me with this order.`

    const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(messageText)}`

    return NextResponse.json({
      success: true,
      orderNumber,
      orderId: insertedOrderId,
      whatsappUrl,
    })
  } catch (error) {
    console.error('Checkout API error:', error)
    return NextResponse.json({ error: 'Failed to process order', details: String(error) }, { status: 500 })
  }
}
