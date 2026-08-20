import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { siteSettings } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    for (const [key, val] of Object.entries(body)) {
      if (typeof val === 'string') {
        const existing = await db.select().from(siteSettings).where(eq(siteSettings.settingKey, key))
        if (existing.length > 0) {
          await db.update(siteSettings).set({ settingValue: val }).where(eq(siteSettings.settingKey, key))
        } else {
          await db.insert(siteSettings).values({ settingKey: key, settingValue: val })
        }
      }
    }

    return NextResponse.json({ success: true, message: 'Settings saved successfully' })
  } catch (error) {
    console.error('Settings update error:', error)
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 })
  }
}
