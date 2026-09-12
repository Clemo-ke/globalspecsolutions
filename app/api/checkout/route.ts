import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { orders, orderItems, siteSettings, customerAddresses, coupons } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { getOrCreateCustomer, getCustomerAddresses } from '@/lib/db-data'
import { resolveCoupon } from '@/lib/coupons'

interface CheckoutItem {
  id: number
  name: string
  quantity: number
  price: number
}

interface CheckoutBody {
  customerId?: number
  userId?: string
  customerName: string
  customerPhone: string
  customerEmail: string
  companyName?: string
  deliveryLocation?: string
  shippingAddress?: {
    label?: string
    addressLine1?: string
    addressLine2?: string
    city?: string
    country?: string
    postalCode?: string
  }
  saveAddress?: boolean
  deliveryMethod?: { id: string; name: string; cost: number } | null
  paymentMethod?: { id: string; name: string } | null
  couponCode?: string
  notes?: string
  items: CheckoutItem[]
  subtotal: number
  total: number
}

export async function POST(req: NextRequest) {
  try {
    const body: CheckoutBody = await req.json()
    const {
      customerId,
      userId,
      customerName,
      customerPhone,
      customerEmail,
      companyName,
      deliveryLocation,
      shippingAddress,
      deliveryMethod,
paymentMethod,
  couponCode,
  notes,
  items,
  subtotal,
  total,
  saveAddress,
} = body

    if (!customerName || !customerPhone || !customerEmail || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Missing required customer or order items data' }, { status: 400 })
    }

    const orderNumber = `GSS-${Date.now().toString().slice(-6)}`

    // Validate coupon server-side (never trust the client total)
    let discountAmount = 0
    let appliedCoupon: string | null = null
    if (couponCode) {
      const couponRes = await resolveCoupon(couponCode, subtotal)
      if (couponRes.ok && couponRes.result) {
        discountAmount = couponRes.result.discount
        appliedCoupon = couponRes.result.code
      }
    }

    // Upsert customer record (links to auth user when signed in)
    let cust = customerId ? { id: customerId } : null
    if (!cust) {
      try {
        cust = await getOrCreateCustomer({
          userId: userId || null,
          name: customerName,
          email: customerEmail,
          phone: customerPhone,
          company: companyName || null,
        })
      } catch (e) {
        console.error('Customer upsert failed (continuing without link):', e)
        cust = null
      }
    }

    const shippingText = shippingAddress
      ? [
          `${shippingAddress.addressLine1 || ''} ${shippingAddress.addressLine2 || ''}`.trim(),
          shippingAddress.city || '',
          shippingAddress.postalCode || '',
          shippingAddress.country || 'Kenya',
        ]
          .filter(Boolean)
          .join(', ')
      : deliveryLocation || ''

    // Save address to the customer's account when requested
    if (cust && saveAddress && shippingAddress && (shippingAddress.addressLine1 || '')?.trim()) {
      const existing = await getCustomerAddresses(cust.id as number)
      const alreadySaved = existing.some(
        (a) =>
          a.addressLine1 === (shippingAddress.addressLine1 || '') &&
          a.city === (shippingAddress.city || '')
      )
      if (!alreadySaved) {
        const { label, ...rest } = shippingAddress
        const [addrResult] = await db
          .insert(customerAddresses)
          .values({
            customerId: cust.id as number,
            label: label || (existing.length === 0 ? 'Default' : 'Checkout'),
            addressLine1: rest.addressLine1 || '',
            addressLine2: rest.addressLine2 || null,
            city: rest.city || '',
            country: rest.country || 'Kenya',
            postalCode: rest.postalCode || null,
            isDefault: existing.length === 0,
          })
        void addrResult
      }
    }

    // Insert main order record
    const [orderResult] = await db.insert(orders).values({
      orderNumber,
      customerId: cust?.id || null,
      customerName,
      customerPhone,
      customerEmail,
      deliveryLocation: deliveryLocation || '',
      deliveryMethod: deliveryMethod?.name || null,
      deliveryCost: deliveryMethod ? deliveryMethod.cost.toString() : null,
      shippingAddress: shippingText,
      paymentMethod: paymentMethod?.name || null,
      paymentStatus: 'Pending',
      notes: notes || '',
      subtotal: subtotal.toString(),
      discountAmount: discountAmount.toFixed(2),
      couponCode: appliedCoupon,
      total: total.toString(),
      status: 'Pending',
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

    // Increment coupon usage counter when an order uses it
    if (appliedCoupon) {
      const [used] = await db.select().from(coupons).where(eq(coupons.code, appliedCoupon))
      if (used) {
        await db.update(coupons).set({ usedCount: (used.usedCount ?? 0) + 1 }).where(eq(coupons.code, appliedCoupon))
      }
    }

    // Get configured WhatsApp number from settings
    const settingsRows = await db.select().from(siteSettings).where(eq(siteSettings.settingKey, 'whatsapp_number'))
    const whatsappNum = settingsRows[0]?.settingValue || '+254721113431'
    const cleanNumber = whatsappNum.replace(/[^0-9]/g, '')

    // Format WhatsApp message
    let messageText = `Hello Global Spec Solutions, I would like to place an order.\n\n`
    messageText += `*Order Number:* ${orderNumber}\n`
    messageText += `*Items:*\n`

    items.forEach((item) => {
      messageText += `• ${item.name} (x${item.quantity}) - KES ${(item.price * item.quantity).toLocaleString()}\n`
    })

    if (deliveryMethod) {
      messageText += `\n*Delivery:* ${deliveryMethod.name} (KES ${Number(deliveryMethod.cost).toLocaleString()})\n`
    }
    if (paymentMethod) {
      messageText += `*Payment:* ${paymentMethod.name} (pending confirmation)\n`
    }
    if (appliedCoupon) {
      messageText += `\n*Coupon:* ${appliedCoupon} (−KES ${discountAmount.toLocaleString()})\n`
    }
    messageText += `\n*Total Amount:* KES ${Number(total).toLocaleString()}\n\n`
    messageText += `*Customer Details:*\n`
    messageText += `Name: ${customerName}\n`
    messageText += `Phone: ${customerPhone}\n`
    messageText += `Email: ${customerEmail}\n`
    if (companyName) messageText += `Company: ${companyName}\n`
    if (shippingText) messageText += `Delivery Address: ${shippingText}\n`
    if (notes) messageText += `Notes: ${notes}\n`
    messageText += `\nPlease confirm and assist me with this order.`

    const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(messageText)}`

    return NextResponse.json({
      success: true,
      orderNumber,
      orderId: insertedOrderId,
      customerId: cust?.id || null,
      whatsappUrl,
    })
  } catch (error) {
    console.error('Checkout API error:', error)
    return NextResponse.json({ error: 'Failed to process order', details: String(error) }, { status: 500 })
  }
}