import { AdminDashboardClient } from '@/components/admin-dashboard-client'
import { db } from '@/lib/db'
import {
  orders,
  contactMessages,
  products,
  productCategories,
  brands,
  departments,
  productDepartments,
  productSpecs,
  quoteRequests,
  quoteItems,
  industries,
  partners,
  resources,
  services,
  solutions,
  heroSlides,
  customers,
  coupons,
  media,
  orderItems,
  user,
  roles,
  projects,
  applications,
  pages,
} from '@/lib/db/schema'
import { getSiteSettings } from '@/lib/db-data'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { getRoleBySlug, getUserPermissions } from '@/lib/permissions'
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
    brandsList,
    departmentsList,
    productDepartmentsList,
    productSpecsList,
    quotesList,
    quoteItemsList,
    industriesList,
    partnersList,
    servicesList,
    solutionsList,
    resourcesList,
    heroSlidesList,
    customersList,
    couponsList,
    mediaList,
    orderItemsList,
    settingsMap,
    usersList,
    rolesList,
    projectsList,
    applicationsList,
    pagesList,
  ] = await Promise.all([
    db.select().from(orders).orderBy(orders.createdAt).catch(() => [] as any[]),
    db.select().from(contactMessages).orderBy(contactMessages.createdAt).catch(() => [] as any[]),
    db.select().from(products).catch(() => [] as any[]),
    db.select().from(productCategories).catch(() => [] as any[]),
    db.select().from(brands).catch(() => [] as any[]),
    db.select().from(departments).catch(() => [] as any[]),
    db.select().from(productDepartments).catch(() => [] as any[]),
    db.select().from(productSpecs).catch(() => [] as any[]),
    db.select().from(quoteRequests).orderBy(quoteRequests.createdAt).catch(() => [] as any[]),
    db.select().from(quoteItems).catch(() => [] as any[]),
    db.select().from(industries).catch(() => [] as any[]),
    db.select().from(partners).catch(() => [] as any[]),
    db.select().from(services).catch(() => [] as any[]),
    db.select().from(solutions).orderBy(solutions.orderPosition).catch(() => [] as any[]),
    db.select().from(resources).catch(() => [] as any[]),
    db.select().from(heroSlides).orderBy(heroSlides.orderPosition).catch(() => [] as any[]),
    db.select().from(customers).orderBy(customers.createdAt).catch(() => [] as any[]),
    db.select().from(coupons).orderBy(coupons.createdAt).catch(() => [] as any[]),
    db.select().from(media).orderBy(media.createdAt).catch(() => [] as any[]),
    db.select().from(orderItems).catch(() => [] as any[]),
    getSiteSettings().catch(() => ({} as Record<string, string>)),
    db.select().from(user).orderBy(user.createdAt).catch(() => [] as any[]),
    db.select().from(roles).catch(() => [] as any[]),
    db.select().from(projects).catch(() => [] as any[]),
    db.select().from(applications).catch(() => [] as any[]),
    db.select().from(pages).catch(() => [] as any[]),
  ])

  // Resolve current session → for the "You" badge and role-management capability
  let currentUserId: string | null = null
  let canManageRoles = false
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (session?.user) {
      currentUserId = session.user.id
      const roleSlug = String((session.user as any).role || '').toLowerCase()
      const role = await getRoleBySlug(roleSlug)
      const perms = await getUserPermissions(session.user.id).catch(() => [] as string[])
      canManageRoles = Boolean(role?.isAdmin || roleSlug === 'admin' || perms.includes('users.manage'))
    }
  } catch {
    // Non-admin visitors still see the UI, guarded per-tab by API routes
  }

  const stats = {
    totalOrders: ordersList.length,
    totalInquiries: messagesList.length,
    totalProducts: productsList.length,
    totalCategories: categoriesList.length,
    totalQuotes: quotesList.length,
    totalSolutions: solutionsList.length,
    totalHeroSlides: heroSlidesList.length,
    totalCustomers: customersList.length,
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
      brandsList={brandsList}
      departmentsList={departmentsList}
      productDepartmentsList={productDepartmentsList}
      productSpecsList={productSpecsList}
      quoteItemsList={quoteItemsList}
      orderItemsList={orderItemsList}
      customersList={customersList}
      couponsList={couponsList}
      mediaList={mediaList}
      usersList={usersList}
      rolesList={rolesList}
      projectsList={projectsList}
      applicationsList={applicationsList}
      pagesList={pagesList}
      currentUserId={currentUserId}
      canManageRoles={canManageRoles}
      settingsMap={settingsMap}
    />
  )
}