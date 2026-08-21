import { db } from '@/lib/db'
import { quoteRequests, quoteItems } from '@/lib/db/schema'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { customerName, companyName, customerEmail, customerPhone, notes, items } = body

    if (!customerName || !customerEmail || !customerPhone) {
      return NextResponse.json({ error: 'Missing required customer details' }, { status: 400 })
    }

    // Generate unique Quote Reference
    const quoteNumber = `GSS-RFQ-${Date.now().toString().slice(-6)}`

    const [inserted] = await db.insert(quoteRequests).values({
      quoteNumber,
      customerName,
      companyName,
      customerEmail,
      customerPhone,
      notes,
      status: 'New',
    })

    const quoteId = (inserted as any).insertId || inserted.id

    if (items && Array.isArray(items) && items.length > 0) {
      for (const item of items) {
        await db.insert(quoteItems).values({
          quoteRequestId: quoteId,
          productId: item.id || null,
          productName: item.name || 'Custom Engineering Spec',
          quantity: item.quantity || 1,
          notes: item.notes || null,
        })
      }
    }

    return NextResponse.json({
      success: true,
      quoteNumber,
      message: 'Quote request submitted successfully. Our engineering team will contact you shortly.',
    })
  } catch (error) {
    console.error('Quote submission error:', error)
    return NextResponse.json({ error: 'Failed to submit quote request' }, { status: 500 })
  }
}
