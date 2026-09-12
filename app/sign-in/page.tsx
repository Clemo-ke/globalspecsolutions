import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { AuthForm } from '@/components/auth-form'
import { getRoleBySlug } from '@/lib/permissions'

export default async function SignInPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (session?.user) {
    const role = String((session.user as any).role || '').toLowerCase()
    const roleRecord = await getRoleBySlug(role)
    if (roleRecord?.isAdmin || role === 'admin' || role === 'super-admin') {
      redirect('/admin')
    }
    redirect('/account')
  }
  return <AuthForm mode="sign-in" />
}