import { AdminDashboardClient } from '@/components/admin-dashboard-client'
import { db } from '@/lib/db'
import {
  orders,
  contactMessages,
  products,
  productCategories,
  quoteRequests,
  industries,
  partners,
  resources,
  services,
  solutions,
} from '@/lib/db/schema'
import { getSiteSettings } from '@/lib/db-data'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Admin Dashboard | Global Spec Solutions',
  description: 'Manage website content, products, quotes, categories, orders, solutions, and site settings.',
}

export default async function AdminPage() {
  let ordersList: any[] = []
  let messagesList: any[] = []
  let productsList: any[] = []
  let categoriesList: any[] = []
  let quotesList: any[] = []
  let industriesList: any[] = []
  let partnersList: any[] = []
  let resourcesList: any[] = []
  let servicesList: any[] = []
  let solutionsList: any[] = []
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
    quotesList = await db.select().from(quoteRequests).orderBy(quoteRequests.createdAt)
  } catch {}

  try {
    industriesList = await db.select().from(industries)
  } catch {}

  try {
    partnersList = await db.select().from(partners)
  } catch {}

  try {
    servicesList = await db.select().from(services)
  } catch {}

  try {
    solutionsList = await db.select().from(solutions).orderBy(solutions.orderPosition)
  } catch {}

  try {
    resourcesList = await db.select().from(resources)
  } catch {}

  try {
    settingsMap = await getSiteSettings()
  } catch {}

  const stats = {
    totalOrders: ordersList.length,
    totalInquiries: messagesList.length,
    totalProducts: productsList.length,
    totalCategories: categoriesList.length,
    totalQuotes: quotesList.length,
    totalSolutions: solutionsList.length,
  }

  return (
    <AdminDashboardClient
      stats={stats}
      recentOrders={ordersList.reverse()}
      recentMessages={messagesList.reverse()}
      recentQuotes={quotesList.reverse()}
      productsList={productsList}
      categoriesList={categoriesList}
      servicesList={servicesList}
      solutionsList={solutionsList}
      industriesList={industriesList}
      partnersList={partnersList}
      resourcesList={resourcesList}
      settingsMap={settingsMap}
    />
  )
}
