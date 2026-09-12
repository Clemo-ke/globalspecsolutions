import { requireAdmin } from '@/lib/admin-guard'
import { db } from '@/lib/db'
import { applications } from '@/lib/db/schema'

export async function GET() {
  const session = await requireAdmin()
  if (!session) return new Response('Unauthorized', { status: 401 })
  try {
    const rows = await db.select().from(applications)
    return Response.json({ applications: rows })
  } catch (err: any) {
    return Response.json({ error: err.message || 'Failed to list applications' }, { status: 500 })
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
    const [inserted] = await db.insert(applications).values({
      slug: String(body.slug).toLowerCase().replace(/[^a-z0-9-_]/g, '-'),
      name: String(body.name),
      description: body.description || null,
      icon: body.icon || null,
      imageUrl: body.imageUrl || null,
      isActive: body.isActive !== undefined ? Boolean(body.isActive) : true,
      orderPosition: Number(body.orderPosition || 0),
    })
    return Response.json({ success: true, id: inserted.insertId })
  } catch (err: any) {
    if (String(err?.message || '').includes('Duplicate')) {
      return Response.json({ error: 'An application with this slug already exists' }, { status: 409 })
    }
    return Response.json({ error: err.message || 'Failed to create application' }, { status: 500 })
  }
}