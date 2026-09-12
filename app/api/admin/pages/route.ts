import { requireAdmin } from '@/lib/admin-guard'
import { db } from '@/lib/db'
import { pages } from '@/lib/db/schema'

export async function GET() {
  const session = await requireAdmin()
  if (!session) return new Response('Unauthorized', { status: 401 })
  try {
    const rows = await db.select().from(pages)
    return Response.json({ pages: rows })
  } catch (err: any) {
    return Response.json({ error: err.message || 'Failed to list pages' }, { status: 500 })
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
    const [inserted] = await db.insert(pages).values({
      slug: String(body.slug).toLowerCase().replace(/[^a-z0-9-_]/g, '-'),
      title: String(body.title),
      content: body.content || null,
      metaTitle: body.metaTitle || null,
      metaDescription: body.metaDescription || null,
      ogImage: body.ogImage || null,
      canonicalUrl: body.canonicalUrl || null,
      isActive: body.isActive !== undefined ? Boolean(body.isActive) : true,
    })
    return Response.json({ success: true, id: inserted.insertId })
  } catch (err: any) {
    if (String(err?.message || '').includes('Duplicate')) {
      return Response.json({ error: 'A page with this slug already exists' }, { status: 409 })
    }
    return Response.json({ error: err.message || 'Failed to create page' }, { status: 500 })
  }
}