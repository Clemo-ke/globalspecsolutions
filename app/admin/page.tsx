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
  heroSlides,
} from '@/lib/db/schema'
import { getSiteSettings } from '@/lib/db-data'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Admin Dashboard | Global Spec Solutions',
  description: 'Manage website content, products, quotes, categories, orders, solutions, hero carousel, and site settings.',
}

export default async function AdminPage() {
  // Run all DB queries in parallel — avoids sequential connection exhaustion
  const [
    ordersList,
    messagesList,
    productsList,
    categoriesList,
    quotesList,
    industriesList,
    partnersList,
    servicesList,
    solutionsList,
    resourcesList,
    heroSlidesList,
    settingsMap,
  ] = await Promise.all([
    db.select().from(orders).orderBy(orders.createdAt).catch(() => [] as any[]),
    db.select().from(contactMessages).orderBy(contactMessages.createdAt).catch(() => [] as any[]),
    db.select().from(products).catch(() => [] as any[]),
    db.select().from(productCategories).catch(() => [] as any[]),
    db.select().from(quoteRequests).orderBy(quoteRequests.createdAt).catch(() => [] as any[]),
    db.select().from(industries).catch(() => [] as any[]),
    db.select().from(partners).catch(() => [] as any[]),
    db.select().from(services).catch(() => [] as any[]),
    db.select().from(solutions).orderBy(solutions.orderPosition).catch(() => [] as any[]),
    db.select().from(resources).catch(() => [] as any[]),
    db.select().from(heroSlides).orderBy(heroSlides.orderPosition).catch(() => [] as any[]),
    getSiteSettings().catch(() => ({} as Record<string, string>)),
  ])

  const stats = {
    totalOrders: ordersList.length,
    totalInquiries: messagesList.length,
    totalProducts: productsList.length,
    totalCategories: categoriesList.length,
    totalQuotes: quotesList.length,
    totalSolutions: solutionsList.length,
    totalHeroSlides: heroSlidesList.length,
  }

  return (
    <AdminDashboardClient
      stats={stats}
      recentOrders={[...ordersList].reverse()}
      recentMessages={[...messagesList].reverse()}
      recentQuotes={[...quotesList].reverse()}
      productsList={productsList}
      categoriesList={categoriesList}
      servicesList={servicesList}
      solutionsList={solutionsList}
      industriesList={industriesList}
      partnersList={partnersList}
      resourcesList={resourcesList}
      heroSlidesList={heroSlidesList}
      settingsMap={settingsMap}
    />
  )
}
