import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { getRoleBySlug } from '@/lib/permissions'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session?.user) redirect('/sign-in')

  const role = String((session.user as any).role || '').toLowerCase()
  const roleRecord = await getRoleBySlug(role)
  if (!roleRecord?.isAdmin && role !== 'admin' && role !== 'super-admin') redirect('/account')

  return <>{children}</>
}
