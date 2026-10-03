import { requireAdmin } from '@/lib/admin-guard'
import { NextRequest } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

export async function POST(req: NextRequest) {
  const session = await requireAdmin()
  if (!session) return new Response('Unauthorized', { status: 401 })

  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return Response.json({ error: 'No file provided' }, { status: 400 })
    }

    // Validate file type – allow PDF, Word, Excel, PowerPoint, images, zip
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'application/zip',
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/svg+xml',
    ]

    if (!allowedTypes.includes(file.type)) {
      return Response.json({ error: `File type '${file.type}' is not allowed` }, { status: 400 })
    }

    // 50 MB max
    const MAX_SIZE = 50 * 1024 * 1024
    if (file.size > MAX_SIZE) {
      return Response.json({ error: 'File exceeds 50 MB limit' }, { status: 400 })
    }

    // Sanitise filename to prevent path traversal
    const ext = file.name.split('.').pop()?.toLowerCase() || 'bin'
    const baseName = file.name
      .replace(/\.[^.]+$/, '')
      .replace(/[^a-zA-Z0-9_-]/g, '-')
      .slice(0, 80)
    const timestamp = Date.now()
    const filename = `${baseName}-${timestamp}.${ext}`

    // Ensure target directory exists
    const uploadDir = path.join(process.cwd(), 'public', 'resources')
    await mkdir(uploadDir, { recursive: true })

    const filePath = path.join(uploadDir, filename)
    const bytes = await file.arrayBuffer()
    await writeFile(filePath, Buffer.from(bytes))

    const fileSize = formatFileSize(file.size)
    const publicUrl = `/resources/${filename}`

    return Response.json({
      success: true,
      url: publicUrl,
      filename,
      fileSize,
      mimeType: file.type,
    })
  } catch (err: any) {
    console.error('[RESOURCE UPLOAD]', err)
    return Response.json({ error: err.message || 'Upload failed' }, { status: 500 })
  }
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}
