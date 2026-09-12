import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { db } from '@/lib/db'
import { customerAddresses } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'
import { getCustomerByUser, getCustomerByEmail } from '@/lib/db-data'

async function resolve() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) return null
  let customer = await getCustomerByUser(session.user.id)
  if (!customer) customer = await getCustomerByEmail(session.user.email!)
  return customer
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  if (!id) return NextResponse.json({ error: 'Address id required' }, { status: 400 })

  const customer = await resolve()
  if (!customer) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()

  // Set-default shortcut
  if (body.setDefault) {
    await db.update(customerAddresses).set({ isDefault: false }).where(eq(customerAddresses.customerId, customer.id as number))
    await db
      .update(customerAddresses)
      .set({ isDefault: true })
      .where(and(eq(customerAddresses.id, Number(id)), eq(customerAddresses.customerId, customer.id as number)))
    return NextResponse.json({ success: true })
  }

  const { label, addressLine1, addressLine2, city, country, postalCode, isDefault } = body
  if (!addressLine1 || !city) {
    return NextResponse.json({ error: 'Address line 1 and city are required' }, { status: 400 })
  }

  if (isDefault) {
    await db.update(customerAddresses).set({ isDefault: false }).where(eq(customerAddresses.customerId, customer.id as number))
  }

  await db
    .update(customerAddresses)
    .set({
      label: label || 'Address',
      addressLine1,
      addressLine2: addressLine2 || null,
      city,
      country: country || 'Kenya',
      postalCode: postalCode || null,
      isDefault: isDefault ?? undefined,
    })
    .where(and(eq(customerAddresses.id, Number(id)), eq(customerAddresses.customerId, customer.id as number)))

  return NextResponse.json({ success: true })
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  if (!id) return NextResponse.json({ error: 'Address id required' }, { status: 400 })

  const customer = await resolve()
  if (!customer) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  await db
    .delete(customerAddresses)
    .where(and(eq(customerAddresses.id, Number(id)), eq(customerAddresses.customerId, customer.id as number)))

  return NextResponse.json({ success: true })
}