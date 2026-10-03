import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

/**
 * Normalises an image URL. If it's a data URL (base64), decodes it and writes
 * it to public/images/<folder>/, returning the clean server URL path.
 * If it's already an absolute or relative URL, returns it unchanged.
 */
export async function normalizeImageUrl(
  urlOrData: string | undefined | null,
  folder = 'uploads',
  prefix = 'img'
): Promise<string> {
  if (!urlOrData) return ''
  const str = urlOrData.trim()
  if (!str.startsWith('data:image/')) return str

  try {
    const match = str.match(/^data:image\/([a-zA-Z0-9+.-]+);base64,(.+)$/)
    if (!match) return str

    let ext = match[1].toLowerCase()
    if (ext === 'jpeg') ext = 'jpg'
    if (ext === 'svg+xml') ext = 'svg'
    if (!['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg', 'avif', 'ico'].includes(ext)) {
      ext = 'png'
    }

    const buffer = Buffer.from(match[2], 'base64')
    const filename = `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}.${ext}`
    const uploadDir = path.join(process.cwd(), 'public', 'images', folder)
    await mkdir(uploadDir, { recursive: true })
    await writeFile(path.join(uploadDir, filename), buffer)

    return `/images/${folder}/${filename}`
  } catch (err) {
    console.error('[NORMALIZE IMAGE ERROR]', err)
    return str
  }
}
