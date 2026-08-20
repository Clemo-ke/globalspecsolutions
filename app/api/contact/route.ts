import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { contactMessages } from '@/lib/db/schema'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, phone, subject, message } = body

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Name, email, and message are required' }, { status: 400 })
    }

    await db.insert(contactMessages).values({
      name,
      email,
      phone: phone || '',
      subject: subject || 'Website Inquiry',
      message,
      status: 'New',
    })

    return NextResponse.json({ success: true, message: 'Your message has been received. Thank you!' })
  } catch (error) {
    console.error('Contact API error:', error)
    return NextResponse.json({ error: 'Failed to submit message', details: String(error) }, { status: 500 })
  }
}
