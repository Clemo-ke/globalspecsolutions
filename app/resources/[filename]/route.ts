import { NextRequest, NextResponse } from 'next/server'
import { readFile, stat } from 'fs/promises'
import path from 'path'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await params

    if (!filename || filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
      return new NextResponse('Bad Request', { status: 400 })
    }

    const filePath = path.join(process.cwd(), 'public', 'resources', filename)
    await stat(filePath)
    const fileBuffer = await readFile(filePath)

    const ext = path.extname(filePath).toLowerCase().replace('.', '')
    const mimeTypes: Record<string, string> = {
      pdf: 'application/pdf',
      doc: 'application/msword',
      docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      xls: 'application/vnd.ms-excel',
      xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      ppt: 'application/vnd.ms-powerpoint',
      pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      zip: 'application/zip',
      png: 'image/png',
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
    }
    const contentType = mimeTypes[ext] || 'application/octet-stream'

    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'public, max-age=86400',
      },
    })
  } catch (err) {
    return new NextResponse('Resource file not found', { status: 404 })
  }
}
