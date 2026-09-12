import { requireAdmin } from '@/lib/admin-guard'
import { db } from '@/lib/db'
import { projects } from '@/lib/db/schema'

export async function GET() {
  const session = await requireAdmin()
  if (!session) return new Response('Unauthorized', { status: 401 })
  try {
    const rows = await db.select().from(projects)
    return Response.json({ projects: rows })
  } catch (err: any) {
    return Response.json({ error: err.message || 'Failed to list projects' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  const session = await requireAdmin()
  if (!session) return new Response('Unauthorized', { status: 401 })
  try {
    const body = await req.json()
    if (!body.slug || !body.title) {
      return Response.json({ error: 'Slug and title are required' }, { status: 400 })
    }
    const [inserted] = await db.insert(projects).values({
      slug: String(body.slug).toLowerCase().replace(/[^a-z0-9-_]/g, '-'),
      title: String(body.title),
      clientName: body.clientName || null,
      location: body.location || null,
      description: body.description || null,
      imageUrl: body.imageUrl || null,
      status: body.status || 'Completed',
      year: body.year || null,
      isActive: body.isActive !== undefined ? Boolean(body.isActive) : true,
      orderPosition: Number(body.orderPosition || 0),
    })
    return Response.json({ success: true, id: inserted.insertId })
  } catch (err: any) {
    if (String(err?.message || '').includes('Duplicate')) {
      return Response.json({ error: 'A project with this slug already exists' }, { status: 409 })
    }
    return Response.json({ error: err.message || 'Failed to create project' }, { status: 500 })
  }
}