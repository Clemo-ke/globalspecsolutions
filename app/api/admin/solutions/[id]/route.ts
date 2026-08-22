import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { solutions } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { headers } from 'next/headers'

// PUT /api/admin/solutions/[id] - Update a solution
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) return new Response('Unauthorized', { status: 401 })

  try {
    const { id } = await params
    const solutionId = parseInt(id)
    const body = await req.json()

    const updateData: Record<string, any> = {}
    if (body.title !== undefined) updateData.title = body.title
    if (body.slug !== undefined) updateData.slug = body.slug
    if (body.description !== undefined) updateData.description = body.description
    if (body.imageUrl !== undefined) updateData.imageUrl = body.imageUrl
    if (body.benefits !== undefined) updateData.benefits = body.benefits
    if (body.orderPosition !== undefined) updateData.orderPosition = Number(body.orderPosition)
    if (body.isActive !== undefined) updateData.isActive = Boolean(body.isActive)

    await db.update(solutions).set(updateData).where(eq(solutions.id, solutionId))

    return Response.json({ success: true, message: 'Solution updated successfully' })
  } catch (err: any) {
    return Response.json({ error: err.message || 'Failed to update solution' }, { status: 500 })
  }
}

// DELETE /api/admin/solutions/[id] - Delete a solution
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) return new Response('Unauthorized', { status: 401 })

  try {
    const { id } = await params
    const solutionId = parseInt(id)
    await db.delete(solutions).where(eq(solutions.id, solutionId))
    return Response.json({ success: true, message: 'Solution deleted successfully' })
  } catch (err: any) {
    return Response.json({ error: err.message || 'Failed to delete solution' }, { status: 500 })
  }
}
