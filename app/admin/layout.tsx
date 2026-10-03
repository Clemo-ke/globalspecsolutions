import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { getRoleBySlug } from '@/lib/permissions'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session?.user) redirect('/sign-in')

  const userEmail = String((session.user as any).email || '').toLowerCase().trim()
  const role = String((session.user as any).role || '').toLowerCase().trim()
  const roleRecord = await getRoleBySlug(role)
  const isAdmin = Boolean(
    roleRecord?.isAdmin ||
    role === 'admin' ||
    role === 'super-admin' ||
    userEmail === 'admin@globalspecsolutions.com' ||
    userEmail.startsWith('admin@')
  )

  if (!isAdmin) redirect('/account')

  return <>{children}</>
}
