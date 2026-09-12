import { requireAdmin } from '@/lib/admin-guard'
import { db } from '@/lib/db'
import { departments } from '@/lib/db/schema'

export async function GET() {
  const session = await requireAdmin()
  if (!session) return new Response('Unauthorized', { status: 401 })
  try {
    const rows = await db.select().from(departments)
    return Response.json({ departments: rows })
  } catch (err: any) {
    return Response.json({ error: err.message || 'Failed to list departments' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  const session = await requireAdmin()
  if (!session) return new Response('Unauthorized', { status: 401 })
  try {
    const body = await req.json()
    if (!body.slug || !body.name) {
      return Response.json({ error: 'Slug and name are required' }, { status: 400 })
    }
    const [inserted] = await db.insert(departments).values({
      slug: String(body.slug).toLowerCase().replace(/[^a-z0-9-_]/g, '-'),
      name: String(body.name),
      mainFunction: body.mainFunction || null,
      description: body.description || null,
      capabilities: body.capabilities || null,
      icon: body.icon || null,
      imageUrl: body.imageUrl || null,
      isActive: body.isActive !== undefined ? Boolean(body.isActive) : true,
      orderPosition: Number(body.orderPosition || 0),
    })
    return Response.json({ success: true, id: inserted.insertId })
  } catch (err: any) {
    if (String(err?.message || '').includes('Duplicate')) {
      return Response.json({ error: 'A department with this slug already exists' }, { status: 409 })
    }
    return Response.json({ error: err.message || 'Failed to create department' }, { status: 500 })
  }
}