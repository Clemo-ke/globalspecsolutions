import { requireAdmin } from '@/lib/admin-guard'
import { db } from '@/lib/db'
import { user, userPermissions } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

// PUT /api/admin/users/[id] - Update a user's role or granular permissions
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin()
  if (!session) return new Response('Unauthorized', { status: 401 })
  try {
    const { id } = await params
    const body = await req.json()

    const updateData: Record<string, any> = {}
    if (body.role !== undefined) updateData.role = String(body.role).toLowerCase()
    if (body.name !== undefined) updateData.name = body.name
    if (Object.keys(updateData).length > 0) {
      await db.update(user).set(updateData).where(eq(user.id, id))
    }

    if (Array.isArray(body.permissions)) {
      await db.delete(userPermissions).where(eq(userPermissions.userId, id))
      for (const perm of body.permissions) {
        await db.insert(userPermissions).values({ userId: id, permission: String(perm) })
      }
    }

    return Response.json({ success: true, message: 'User updated successfully' })
  } catch (err: any) {
    return Response.json({ error: err.message || 'Failed to update user' }, { status: 500 })
  }
}

// DELETE /api/admin/users/[id] - Delete a user (cannot delete own account)
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin()
  if (!session) return new Response('Unauthorized', { status: 401 })
  try {
    const { id } = await params
    if (id === session.user.id && (session.user as any).email?.toLowerCase?.() === 'admin@globalspecsolutions.com') {
      return Response.json({ error: 'The primary admin account cannot be deleted' }, { status: 400 })
    }
    await db.delete(userPermissions).where(eq(userPermissions.userId, id))
    await db.delete(user).where(eq(user.id, id))
    return Response.json({ success: true, message: 'User deleted successfully' })
  } catch (err: any) {
    return Response.json({ error: err.message || 'Failed to delete user' }, { status: 500 })
  }
}