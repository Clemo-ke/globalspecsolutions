import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { db } from '@/lib/db'
import { customerAddresses } from '@/lib/db/schema'
import { eq, desc } from 'drizzle-orm'
import { getOrCreateCustomer } from '@/lib/db-data'

async function requireCustomer() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) return null
  return getOrCreateCustomer({
    userId: session.user.id,
    name: session.user.name || session.user.email!.split('@')[0],
    email: session.user.email!,
  })
}

export async function GET() {
  const customer = await requireCustomer()
  if (!customer) return NextResponse.json([])

  const rows = await db
    .select()
    .from(customerAddresses)
    .where(eq(customerAddresses.customerId, customer.id))
    .orderBy(desc(customerAddresses.isDefault))
  return NextResponse.json(rows)
}

export async function POST(req: NextRequest) {
  const customer = await requireCustomer()
  if (!customer) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { label, addressLine1, addressLine2, city, country, postalCode, isDefault } = body
  if (!addressLine1 || !city) {
    return NextResponse.json({ error: 'Address line 1 and city are required' }, { status: 400 })
  }

  const willBeDefault = Boolean(isDefault) || null

  if (willBeDefault) {
    await db.update(customerAddresses).set({ isDefault: false }).where(eq(customerAddresses.customerId, customer.id))
  }

  const [inserted] = await db.insert(customerAddresses).values({
    customerId: customer.id as number,
    label: label || 'Address',
    addressLine1,
    addressLine2: addressLine2 || null,
    city,
    country: country || 'Kenya',
    postalCode: postalCode || null,
    isDefault: willBeDefault ?? undefined,
  })

  return NextResponse.json({ success: true, id: inserted.insertId })
}