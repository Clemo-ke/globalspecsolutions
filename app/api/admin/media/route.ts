import { requireAdmin } from '@/lib/admin-guard'
import { db } from '@/lib/db'
import { media } from '@/lib/db/schema'

// POST /api/admin/media - Upload a media item (stored inline as data URL)
export async function POST(req: Request) {
  const session = await requireAdmin()
  if (!session) return new Response('Unauthorized', { status: 401 })

  try {
    const body = await req.json()
    if (!body.url) {
      return Response.json({ error: 'Media URL is required' }, { status: 400 })
    }

    const [inserted] = await db.insert(media).values({
      filename: body.filename || 'upload',
      url: body.url,
      altText: body.altText || null,
      mimeType: body.mimeType || 'image/*',
      size: Number(body.size) || 0,
    })

    return Response.json({
      success: true,
      id: inserted.insertId,
      filename: body.filename || 'upload',
      url: body.url,
      altText: body.altText || null,
      mimeType: body.mimeType || 'image/*',
      size: Number(body.size) || 0,
    })
  } catch (err: any) {
    return Response.json({ error: err.message || 'Failed to upload media' }, { status: 500 })
  }
}