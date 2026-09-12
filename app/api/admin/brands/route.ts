import { requireAdmin } from '@/lib/admin-guard'
import { db } from '@/lib/db'
import { brands } from '@/lib/db/schema'

// GET /api/admin/brands - List all brands
export async function GET() {
  const session = await requireAdmin()
  if (!session) return new Response('Unauthorized', { status: 401 })
  try {
    const rows = await db.select().from(brands)
    return Response.json({ brands: rows })
  } catch (err: any) {
    return Response.json({ error: err.message || 'Failed to list brands' }, { status: 500 })
  }
}

// POST /api/admin/brands - Create a brand
export async function POST(req: Request) {
  const session = await requireAdmin()
  if (!session) return new Response('Unauthorized', { status: 401 })
  try {
    const body = await req.json()
    if (!body.slug || !body.name) {
      return Response.json({ error: 'Slug and name are required' }, { status: 400 })
    }
    const [inserted] = await db.insert(brands).values({
      slug: String(body.slug).toLowerCase().replace(/[^a-z0-9-_]/g, '-'),
      name: String(body.name),
      logoUrl: body.logoUrl || null,
      websiteUrl: body.websiteUrl || null,
      description: body.description || null,
      isActive: body.isActive !== undefined ? Boolean(body.isActive) : true,
      orderPosition: Number(body.orderPosition || 0),
    })
    return Response.json({ success: true, id: inserted.insertId })
  } catch (err: any) {
    if (String(err?.message || '').includes('Duplicate')) {
      return Response.json({ error: 'A brand with this slug already exists' }, { status: 409 })
    }
    return Response.json({ error: err.message || 'Failed to create brand' }, { status: 500 })
  }
}