import { db } from '@/lib/db'
import {
  heroSlides,
  productCategories,
  products,
  solutions,
  clients,
  teamMembers,
  services,
  orders,
  orderItems,
  contactMessages,
  siteSettings,
} from '@/lib/db/schema'
import { eq, desc, like, or, and } from 'drizzle-orm'

// Hero Slides
export async function getHeroSlides() {
  try {
    return await db.select().from(heroSlides).where(eq(heroSlides.isActive, true)).orderBy(heroSlides.orderPosition)
  } catch {
    return []
  }
}

// Categories
export async function getProductCategories() {
  try {
    return await db.select().from(productCategories).where(eq(productCategories.isActive, true)).orderBy(productCategories.orderPosition)
  } catch {
    return []
  }
}

export async function getCategoryBySlug(slug: string) {
  try {
    const res = await db.select().from(productCategories).where(eq(productCategories.slug, slug)).limit(1)
    return res[0] || null
  } catch {
    return null
  }
}

// Products
export async function getProducts(params?: { categoryId?: number; categorySlug?: string; search?: string; limit?: number }) {
  try {
    let categoryIdToUse = params?.categoryId

    if (params?.categorySlug && !categoryIdToUse) {
      const cat = await getCategoryBySlug(params.categorySlug)
      if (cat) categoryIdToUse = cat.id
    }

    const conditions = [eq(products.isActive, true)]

    if (categoryIdToUse) {
      conditions.push(eq(products.categoryId, categoryIdToUse))
    }

    if (params?.search) {
      const term = `%${params.search}%`
      conditions.push(
        or(
          like(products.name, term),
          like(products.description, term),
          like(products.sku, term)
        )!
      )
    }

    let query = db.select().from(products).where(and(...conditions)).orderBy(products.orderPosition)

    if (params?.limit) {
      return await query.limit(params.limit)
    }

    return await query
  } catch {
    return []
  }
}

export async function getProductBySlug(slug: string) {
  try {
    const res = await db.select().from(products).where(eq(products.slug, slug)).limit(1)
    return res[0] || null
  } catch {
    return null
  }
}

// Solutions & Services
export async function getSolutions() {
  try {
    return await db.select().from(solutions).where(eq(solutions.isActive, true)).orderBy(solutions.orderPosition)
  } catch {
    return []
  }
}

export async function getServices() {
  try {
    return await db.select().from(services).where(eq(services.isActive, true)).orderBy(services.orderPosition)
  } catch {
    return []
  }
}

export async function getClients() {
  try {
    return await db.select().from(clients).where(eq(clients.isActive, true)).orderBy(clients.orderPosition)
  } catch {
    return []
  }
}

export async function getTeamMembers() {
  try {
    return await db.select().from(teamMembers).where(eq(teamMembers.isActive, true)).orderBy(teamMembers.orderPosition)
  } catch {
    return []
  }
}

// Site Settings Key-Value Map
export async function getSiteSettings(): Promise<Record<string, string>> {
  try {
    const rows = await db.select().from(siteSettings)
    const settingsMap: Record<string, string> = {
      whatsapp_number: '+254721113431',
      company_phone: '+254 721 113 431 / +254 725 440 342',
      company_email: 'info@globalspecsolutions.com',
      company_address: 'Barclays House, Mai Mahiu road off Langata Road, P.O Box 9520-00200 Nairobi, Kenya',
      hero_title: 'Advanced Electrical & Critical Power Infrastructure',
      hero_subtitle: 'Engineered for reliability, sustainability, and industrial growth',
      floating_whatsapp_enabled: 'true',
    }

    for (const row of rows) {
      settingsMap[row.settingKey] = row.settingValue
    }

    return settingsMap
  } catch {
    return {
      whatsapp_number: '+254721113431',
      company_phone: '+254 721 113 431 / +254 725 440 342',
      company_email: 'info@globalspecsolutions.com',
      company_address: 'Barclays House, Mai Mahiu road off Langata Road, P.O Box 9520-00200 Nairobi, Kenya',
      floating_whatsapp_enabled: 'true',
    }
  }
}
