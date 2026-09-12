import { requireAdmin } from '@/lib/admin-guard'
import { db } from '@/lib/db'
import { roles, rolePermissions } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

// PUT /api/admin/roles/[id] - Update a role (name, description, isAdmin, permissions)
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin()
  if (!session) return new Response('Unauthorized', { status: 401 })
  try {
    const { id } = await params
    const roleId = parseInt(id)
    const body = await req.json()

    const updateData: Record<string, any> = {}
    if (body.name !== undefined) updateData.name = body.name
    if (body.description !== undefined) updateData.description = body.description
    if (body.isAdmin !== undefined) updateData.isAdmin = Boolean(body.isAdmin)
    if (body.orderPosition !== undefined) updateData.orderPosition = Number(body.orderPosition)
    if (Object.keys(updateData).length > 0) {
      await db.update(roles).set(updateData).where(eq(roles.id, roleId))
    }

    if (Array.isArray(body.permissions)) {
      await db.delete(rolePermissions).where(eq(rolePermissions.roleId, roleId))
      for (const perm of body.permissions) {
        await db.insert(rolePermissions).values({ roleId, permission: String(perm) })
      }
    }

    return Response.json({ success: true, message: 'Role updated successfully' })
  } catch (err: any) {
    return Response.json({ error: err.message || 'Failed to update role' }, { status: 500 })
  }
}

// DELETE /api/admin/roles/[id] - Delete a non-system role
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin()
  if (!session) return new Response('Unauthorized', { status: 401 })
  try {
    const { id } = await params
    const roleId = parseInt(id)
    const roleRes = await db.select().from(roles).where(eq(roles.id, roleId)).limit(1)
    if (roleRes.length === 0) return Response.json({ error: 'Role not found' }, { status: 404 })
    if (roleRes[0].isSystem) {
      return Response.json({ error: 'System roles cannot be deleted' }, { status: 400 })
    }
    await db.delete(rolePermissions).where(eq(rolePermissions.roleId, roleId))
    await db.delete(roles).where(eq(roles.id, roleId))
    return Response.json({ success: true, message: 'Role deleted successfully' })
  } catch (err: any) {
    return Response.json({ error: err.message || 'Failed to delete role' }, { status: 500 })
  }
}