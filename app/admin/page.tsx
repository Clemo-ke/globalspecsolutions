import { AdminDashboardClient } from '@/components/admin-dashboard-client'
import { db } from '@/lib/db'
import { orders, contactMessages, products, productCategories } from '@/lib/db/schema'
import { getSiteSettings } from '@/lib/db-data'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Admin Dashboard | Global Spec Solutions',
  description: 'Manage website content, products, categories, orders, and site settings.',
}

export default async function AdminPage() {
  let ordersList: any[] = []
  let messagesList: any[] = []
  let productsList: any[] = []
  let categoriesList: any[] = []
  let settingsMap: Record<string, string> = {}

  try {
    ordersList = await db.select().from(orders).orderBy(orders.createdAt)
  } catch {}

  try {
    messagesList = await db.select().from(contactMessages).orderBy(contactMessages.createdAt)
  } catch {}

  try {
    productsList = await db.select().from(products)
  } catch {}

  try {
    categoriesList = await db.select().from(productCategories)
  } catch {}

  try {
    settingsMap = await getSiteSettings()
  } catch {}

  const stats = {
    totalOrders: ordersList.length,
    totalInquiries: messagesList.length,
    totalProducts: productsList.length,
    totalCategories: categoriesList.length,
  }

  return (
    <AdminDashboardClient
      stats={stats}
      recentOrders={ordersList.reverse()}
      recentMessages={messagesList.reverse()}
      productsList={productsList}
      categoriesList={categoriesList}
      settingsMap={settingsMap}
    />
  )
}
