import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { getCustomerByUser, getCustomerByEmail } from '@/lib/db-data'
import { ProfileClient } from '@/components/profile-client'

export default async function AccountProfilePage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) return null

  let customer = await getCustomerByUser(session.user.id)
  if (!customer) customer = await getCustomerByEmail(session.user.email!)

  return (
    <div className="max-w-xl space-y-5">
      <div>
        <h2 className="text-xl font-bold">Profile</h2>
        <p className="text-sm text-muted-foreground">Manage your contact details used at checkout.</p>
      </div>
      <ProfileClient
        customer={{
          id: customer?.id || null,
          name: customer?.name || session.user.name || '',
          phone: customer?.phone || '',
          company: customer?.company || '',
          email: customer?.email || session.user.email || '',
        }}
      />
    </div>
  )
}