import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { db } from '@/lib/db'
import { customers } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { getCustomerByUser, getCustomerByEmail } from '@/lib/db-data'

export async function PUT(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { name, phone, company } = body
    if (!name || !phone) {
      return NextResponse.json({ error: 'Name and phone are required' }, { status: 400 })
    }

    const email = session.user.email!
    let customer = await getCustomerByUser(session.user.id)
    if (!customer) customer = await getCustomerByEmail(email)

    if (customer) {
      await db
        .update(customers)
        .set({ name, phone, company: company || null, userId: session.user.id })
        .where(eq(customers.id, customer.id))
    } else {
      const [inserted] = await db.insert(customers).values({
        userId: session.user.id,
        name,
        email,
        phone,
        company: company || null,
      })
      void inserted
    }

    return NextResponse.json({ success: true, message: 'Profile updated' })
  } catch (error) {
    console.error('Profile update error:', error)
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
  }
}