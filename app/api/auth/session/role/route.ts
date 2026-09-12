import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { getRoleBySlug } from '@/lib/permissions'

export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: await headers() }).catch(() => null)
    if (!session?.user) {
      return Response.json({ isAdmin: false, role: '' })
    }

    const roleSlug = String((session.user as any).role || '').toLowerCase().trim()
    const role = await getRoleBySlug(roleSlug)
    const isAdmin = Boolean(role?.isAdmin || roleSlug === 'admin' || roleSlug === 'super-admin')

    return Response.json({ isAdmin, role: roleSlug })
  } catch {
    return Response.json({ isAdmin: false, role: '' })
  }
}
