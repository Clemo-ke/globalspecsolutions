import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { getRoleBySlug, getUserPermissions, type Permission } from '@/lib/permissions'

// Returns the session when the signed-in user is an admin, otherwise null.
// An admin is a user whose role is marked `isAdmin` in the roles table, or has
// a role flagged as an admin-capable legacy value ('admin').
export async function requireAdmin() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) return null
  const roleSlug = String((session.user as any).role || '').toLowerCase()
  if (roleSlug === 'customer') return null
  const role = await getRoleBySlug(roleSlug)
  if (role?.isAdmin || roleSlug === 'admin' || roleSlug === 'super-admin') return session
  return null
}

// Returns the session when the signed-in user is signed in and has the given
// permission (either via their role, or via a user-specific grant). Returns
// admin session for permissions implicitly granted to admins.
export async function requirePermission(permission: Permission) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) return null
  const roleSlug = String((session.user as any).role || '').toLowerCase()
  const role = await getRoleBySlug(roleSlug)
  if (role?.isAdmin || roleSlug === 'admin') return session
  const permissions = await getUserPermissions(session.user.id)
  if (permissions.includes(permission)) return session
  return null
}