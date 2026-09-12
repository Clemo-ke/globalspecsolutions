import { requireAdmin } from '@/lib/admin-guard'
import { db } from '@/lib/db'
import { resources } from '@/lib/db/schema'

export async function GET() {
  const session = await requireAdmin()
  if (!session) return new Response('Unauthorized', { status: 401 })
  try {
    const rows = await db.select().from(resources)
    return Response.json({ resources: rows })
  } catch (err: any) {
    return Response.json({ error: err.message || 'Failed to list resources' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  const session = await requireAdmin()
  if (!session) return new Response('Unauthorized', { status: 401 })
  try {
    const body = await req.json()
    if (!body.slug || !body.title || !body.category || !body.fileUrl) {
      return Response.json({ error: 'Slug, title, category and file URL are required' }, { status: 400 })
    }
    const [inserted] = await db.insert(resources).values({
      title: String(body.title),
      slug: String(body.slug).toLowerCase().replace(/[^a-z0-9-_]/g, '-'),
      category: String(body.category),
      description: body.description || null,
      fileUrl: String(body.fileUrl),
      fileSize: body.fileSize || null,
      thumbnailUrl: body.thumbnailUrl || null,
      isFeatured: Boolean(body.isFeatured),
      isActive: body.isActive !== undefined ? Boolean(body.isActive) : true,
    })
    return Response.json({ success: true, id: inserted.insertId })
  } catch (err: any) {
    if (String(err?.message || '').includes('Duplicate')) {
      return Response.json({ error: 'A resource with this slug already exists' }, { status: 409 })
    }
    return Response.json({ error: err.message || 'Failed to create resource' }, { status: 500 })
  }
}