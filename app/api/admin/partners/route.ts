import { db } from '@/lib/db'
import { partners } from '@/lib/db/schema'
import { requireAdmin } from '@/lib/admin-guard'
import { normalizeImageUrl } from '@/lib/save-image'

export async function GET() {
  const session = await requireAdmin()
  if (!session) return new Response('Unauthorized', { status: 401 })

  const allPartners = await db.select().from(partners)
  return Response.json(allPartners)
}

export async function POST(req: Request) {
  const session = await requireAdmin()
  if (!session) return new Response('Unauthorized', { status: 401 })

  try {
    const body = await req.json()
    if (!body.name) {
      return Response.json({ error: 'Partner name is required' }, { status: 400 })
    }

    const slug = (body.slug || body.name)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '')

    let logoUrl = body.logoUrl || ''
    if (logoUrl) {
      logoUrl = await normalizeImageUrl(logoUrl, 'partners', 'partner')
    }

    const [inserted] = await db.insert(partners).values({
      name: body.name,
      slug,
      logoUrl: logoUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=80',
      websiteUrl: body.websiteUrl || '',
      description: body.description || '',
      category: body.category || 'Technology Partner',
      isFeatured: body.isFeatured !== undefined ? Boolean(body.isFeatured) : true,
      isActive: body.isActive !== undefined ? Boolean(body.isActive) : true,
    })

    return Response.json({
      success: true,
      id: inserted.insertId,
      message: 'Partner created successfully',
    })
  } catch (err: any) {
    console.error('[CREATE PARTNER ERROR]', err)
    return Response.json({ error: err.message || 'Failed to create partner' }, { status: 500 })
  }
}
