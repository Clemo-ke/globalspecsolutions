import { requireAdmin } from '@/lib/admin-guard'
import { db } from '@/lib/db'
import { user, userPermissions } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

// GET /api/admin/users - List all registered users with roles & grants
export async function GET() {
  const session = await requireAdmin()
  if (!session) return new Response('Unauthorized', { status: 401 })
  try {
    const users = await db.select().from(user).orderBy(user.createdAt)
    const grants = await db.select().from(userPermissions)
    const result = users.map((u) => ({
      ...u,
      permissions: grants.filter((g) => g.userId === u.id).map((g) => g.permission),
    }))
    return Response.json({ users: result })
  } catch (err: any) {
    return Response.json({ error: err.message || 'Failed to list users' }, { status: 500 })
  }
}