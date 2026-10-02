import { seedDatabase, ensureDefaultAdminUser } from '@/lib/seed'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    console.log('[SEED API] Starting seedDatabase()...')
    await seedDatabase()
    await ensureDefaultAdminUser()
    console.log('[SEED API] Finished seedDatabase() and ensureDefaultAdminUser() successfully!')
    return NextResponse.json({ success: true, message: 'Database seeded successfully', admin: 'admin@globalspecsolutions.com' })
  } catch (error: any) {
    console.error('[SEED API] Error:', error)
    return NextResponse.json(
      { error: 'Failed to seed database', details: String(error?.message || error) },
      { status: 500 }
    )
  }
}

