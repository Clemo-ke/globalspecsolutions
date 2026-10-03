import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { siteSettings } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { requireAdmin } from '@/lib/admin-guard'

import { normalizeImageUrl } from '@/lib/save-image'

export async function POST(req: NextRequest) {
  try {
    const session = await requireAdmin()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()

    for (const [key, val] of Object.entries(body)) {
      if (typeof val === 'string') {
        let finalVal = val
        if (key.includes('logo') || key.includes('image') || key.includes('icon')) {
          finalVal = await normalizeImageUrl(val, 'settings', key)
        }
        const existing = await db.select().from(siteSettings).where(eq(siteSettings.settingKey, key))
        if (existing.length > 0) {
          await db.update(siteSettings).set({ settingValue: finalVal }).where(eq(siteSettings.settingKey, key))
        } else {
          await db.insert(siteSettings).values({ settingKey: key, settingValue: finalVal })
        }
      }
    }

    return NextResponse.json({ success: true, message: 'Settings saved successfully' })
  } catch (error) {
    console.error('Settings update error:', error)
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 })
  }
}
