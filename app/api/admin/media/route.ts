import { requireAdmin } from '@/lib/admin-guard'
import { db } from '@/lib/db'
import { media } from '@/lib/db/schema'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { normalizeImageUrl } from '@/lib/save-image'

// POST /api/admin/media - Upload a media item (supports both multipart/form-data and JSON)
export async function POST(req: Request) {
  const session = await requireAdmin()
  if (!session) return new Response('Unauthorized', { status: 401 })

  try {
    const contentType = req.headers.get('content-type') || ''

    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData()
      const file = formData.get('file') as File | null
      const altText = (formData.get('altText') as string | null) || ''
      if (!file) {
        return Response.json({ error: 'No file provided' }, { status: 400 })
      }

      const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
      const baseName = file.name
        .replace(/\.[^.]+$/, '')
        .replace(/[^a-zA-Z0-9_-]/g, '-')
        .slice(0, 60)
      const filename = `${baseName}-${Date.now()}.${ext}`

      const uploadDir = path.join(process.cwd(), 'public', 'images', 'media')
      await mkdir(uploadDir, { recursive: true })
      await writeFile(path.join(uploadDir, filename), Buffer.from(await file.arrayBuffer()))

      const url = `/images/media/${filename}`
      const [inserted] = await db.insert(media).values({
        filename: file.name,
        url,
        altText: altText || file.name.replace(/\.[^.]+$/, ''),
        mimeType: file.type || `image/${ext}`,
        size: file.size || 0,
      })

      return Response.json({
        success: true,
        id: inserted.insertId,
        filename: file.name,
        url,
        altText: altText || file.name.replace(/\.[^.]+$/, ''),
        mimeType: file.type || `image/${ext}`,
        size: file.size || 0,
      })
    } else {
      const body = await req.json()
      if (!body.url) {
        return Response.json({ error: 'Media URL is required' }, { status: 400 })
      }

      const cleanUrl = await normalizeImageUrl(body.url, 'media', 'media')
      const [inserted] = await db.insert(media).values({
        filename: body.filename || 'upload',
        url: cleanUrl,
        altText: body.altText || null,
        mimeType: body.mimeType || 'image/*',
        size: Number(body.size) || 0,
      })

      return Response.json({
        success: true,
        id: inserted.insertId,
        filename: body.filename || 'upload',
        url: cleanUrl,
        altText: body.altText || null,
        mimeType: body.mimeType || 'image/*',
        size: Number(body.size) || 0,
      })
    }
  } catch (err: any) {
    console.error('[MEDIA POST ERROR]', err)
    return Response.json({ error: err.message || 'Failed to upload media' }, { status: 500 })
  }
}