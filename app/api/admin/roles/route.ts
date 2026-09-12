import { requireAdmin } from '@/lib/admin-guard'
import { db } from '@/lib/db'
import { roles, rolePermissions } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

// GET /api/admin/roles - List all roles with their permissions
export async function GET() {
  const session = await requireAdmin()
  if (!session) return new Response('Unauthorized', { status: 401 })
  try {
    const allRoles = await db.select().from(roles).orderBy(roles.orderPosition)
    const allPermissions = await db.select().from(rolePermissions)
    const result = allRoles.map((r) => ({
      ...r,
      permissions: allPermissions.filter((p) => p.roleId === r.id).map((p) => p.permission),
    }))
    return Response.json({ roles: result })
  } catch (err: any) {
    return Response.json({ error: err.message || 'Failed to list roles' }, { status: 500 })
  }
}

// POST /api/admin/roles - Create a custom role
export async function POST(req: Request) {
  const session = await requireAdmin()
  if (!session) return new Response('Unauthorized', { status: 401 })
  try {
    const body = await req.json()
    if (!body.slug || !body.name) {
      return Response.json({ error: 'Role slug and name are required' }, { status: 400 })
    }
    const [inserted] = await db.insert(roles).values({
      slug: String(body.slug).toLowerCase().replace(/[^a-z0-9-_]/g, '-'),
      name: String(body.name),
      description: body.description || null,
      isAdmin: Boolean(body.isAdmin),
      isSystem: false,
      orderPosition: Number(body.orderPosition || 0),
    })
    const roleId = inserted.insertId
    const perms = Array.isArray(body.permissions) ? body.permissions : []
    for (const perm of perms) {
      await db.insert(rolePermissions).values({ roleId, permission: String(perm) })
    }
    return Response.json({ success: true, id: roleId, slug: String(body.slug).toLowerCase() })
  } catch (err: any) {
    if (String(err?.message || '').includes('Duplicate')) {
      return Response.json({ error: 'A role with this slug already exists' }, { status: 409 })
    }
    return Response.json({ error: err.message || 'Failed to create role' }, { status: 500 })
  }
}