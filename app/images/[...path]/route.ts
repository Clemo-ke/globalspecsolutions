import { NextRequest, NextResponse } from 'next/server'
import { readFile, stat } from 'fs/promises'
import path from 'path'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path: pathSegments } = await params
    const relPath = pathSegments.join('/')

    // Prevent directory traversal
    if (relPath.includes('..') || relPath.includes('\0')) {
      return new NextResponse('Forbidden', { status: 403 })
    }

    const filePath = path.join(process.cwd(), 'public', 'images', ...pathSegments)
    await stat(filePath)
    const fileBuffer = await readFile(filePath)

    const ext = path.extname(filePath).toLowerCase().replace('.', '')
    const mimeTypes: Record<string, string> = {
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      png: 'image/png',
      webp: 'image/webp',
      gif: 'image/gif',
      svg: 'image/svg+xml',
      avif: 'image/avif',
      ico: 'image/x-icon',
    }
    const contentType = mimeTypes[ext] || 'application/octet-stream'

    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=2592000, immutable',
      },
    })
  } catch (err) {
    return new NextResponse('Image not found', { status: 404 })
  }
}
