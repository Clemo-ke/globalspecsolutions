import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { getCustomerByUser, getCustomerByEmail, getCustomerAddresses } from '@/lib/db-data'
import { AddressesClient } from '@/components/addresses-client'

export default async function AccountAddressesPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) return null

  let customer = await getCustomerByUser(session.user.id)
  if (!customer) customer = await getCustomerByEmail(session.user.email!)
  const addresses = customer ? await getCustomerAddresses(customer.id) : []

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold">Addresses</h2>
        <p className="text-sm text-muted-foreground">Saved delivery addresses are available at checkout.</p>
      </div>
      <AddressesClient customerId={customer?.id || null} initialAddresses={addresses} />
    </div>
  )
}