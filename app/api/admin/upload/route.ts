import { requireAdmin } from '@/lib/admin-guard'
import { NextRequest } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

// Central image upload endpoint — used by all admin image pickers
export async function POST(req: NextRequest) {
  const session = await requireAdmin()
  if (!session) return new Response('Unauthorized', { status: 401 })

  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null
    const folder = (formData.get('folder') as string | null) || 'uploads'

    if (!file) {
      return Response.json({ error: 'No file provided' }, { status: 400 })
    }

    // Validate image type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml', 'image/avif']
    if (!allowedTypes.includes(file.type)) {
      return Response.json({ error: `File type '${file.type}' is not allowed. Use JPEG, PNG, WebP, GIF or SVG.` }, { status: 400 })
    }

    // 10 MB max for images
    const MAX_SIZE = 10 * 1024 * 1024
    if (file.size > MAX_SIZE) {
      return Response.json({ error: 'Image exceeds 10 MB limit' }, { status: 400 })
    }

    // Sanitise filename
    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
    const baseName = file.name
      .replace(/\.[^.]+$/, '')
      .replace(/[^a-zA-Z0-9_-]/g, '-')
      .slice(0, 60)
    const filename = `${baseName}-${Date.now()}.${ext}`

    // Save to public/images/<folder>/
    const uploadDir = path.join(process.cwd(), 'public', 'images', folder)
    await mkdir(uploadDir, { recursive: true })
    await writeFile(path.join(uploadDir, filename), Buffer.from(await file.arrayBuffer()))

    return Response.json({
      success: true,
      url: `/images/${folder}/${filename}`,
      filename,
    })
  } catch (err: any) {
    console.error('[IMAGE UPLOAD]', err)
    return Response.json({ error: err.message || 'Upload failed' }, { status: 500 })
  }
}
