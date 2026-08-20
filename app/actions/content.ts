'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import {
  heroSlides,
  productCategories,
  products,
  solutions,
  clients,
  teamMembers,
  services,
} from '@/lib/db/schema'
import { and, desc, eq } from 'drizzle-orm'
import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'

// Admin verification
async function verifyAdmin() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error('Unauthorized')
  return session.user.id
}

// Hero Slides
export async function getHeroSlides() {
  return db
    .select()
    .from(heroSlides)
    .where(eq(heroSlides.isActive, true))
    .orderBy(heroSlides.orderPosition)
}

export async function createHeroSlide(data: typeof heroSlides.$inferInsert) {
  await verifyAdmin()
  const result = await db.insert(heroSlides).values(data).returning()
  revalidatePath('/')
  return result[0]
}

export async function updateHeroSlide(
  id: number,
  data: Partial<typeof heroSlides.$inferInsert>
) {
  await verifyAdmin()
  const result = await db
    .update(heroSlides)
    .set(data)
    .where(eq(heroSlides.id, id))
    .returning()
  revalidatePath('/')
  return result[0]
}

export async function deleteHeroSlide(id: number) {
  await verifyAdmin()
  await db.delete(heroSlides).where(eq(heroSlides.id, id))
  revalidatePath('/')
}

// Product Categories
export async function getProductCategories() {
  return db
    .select()
    .from(productCategories)
    .where(eq(productCategories.isActive, true))
    .orderBy(productCategories.orderPosition)
}

export async function createProductCategory(
  data: typeof productCategories.$inferInsert
) {
  await verifyAdmin()
  const result = await db.insert(productCategories).values(data).returning()
  revalidatePath('/')
  return result[0]
}

export async function updateProductCategory(
  id: number,
  data: Partial<typeof productCategories.$inferInsert>
) {
  await verifyAdmin()
  const result = await db
    .update(productCategories)
    .set(data)
    .where(eq(productCategories.id, id))
    .returning()
  revalidatePath('/')
  return result[0]
}

export async function deleteProductCategory(id: number) {
  await verifyAdmin()
  await db.delete(productCategories).where(eq(productCategories.id, id))
  revalidatePath('/')
}

// Products
export async function getProducts(categoryId?: number) {
  const query = db
    .select()
    .from(products)
    .where(eq(products.isActive, true))

  if (categoryId) {
    const whereClause = and(
      eq(products.isActive, true),
      eq(products.categoryId, categoryId)
    )
    return db
      .select()
      .from(products)
      .where(whereClause)
      .orderBy(products.orderPosition)
  }

  return query.orderBy(products.orderPosition)
}

export async function createProduct(data: typeof products.$inferInsert) {
  await verifyAdmin()
  const result = await db.insert(products).values(data).returning()
  revalidatePath('/')
  return result[0]
}

export async function updateProduct(
  id: number,
  data: Partial<typeof products.$inferInsert>
) {
  await verifyAdmin()
  const result = await db
    .update(products)
    .set(data)
    .where(eq(products.id, id))
    .returning()
  revalidatePath('/')
  return result[0]
}

export async function deleteProduct(id: number) {
  await verifyAdmin()
  await db.delete(products).where(eq(products.id, id))
  revalidatePath('/')
}

// Solutions
export async function getSolutions() {
  return db
    .select()
    .from(solutions)
    .where(eq(solutions.isActive, true))
    .orderBy(solutions.orderPosition)
}

export async function createSolution(data: typeof solutions.$inferInsert) {
  await verifyAdmin()
  const result = await db.insert(solutions).values(data).returning()
  revalidatePath('/')
  return result[0]
}

export async function updateSolution(
  id: number,
  data: Partial<typeof solutions.$inferInsert>
) {
  await verifyAdmin()
  const result = await db
    .update(solutions)
    .set(data)
    .where(eq(solutions.id, id))
    .returning()
  revalidatePath('/')
  return result[0]
}

export async function deleteSolution(id: number) {
  await verifyAdmin()
  await db.delete(solutions).where(eq(solutions.id, id))
  revalidatePath('/')
}

// Clients
export async function getClients() {
  return db
    .select()
    .from(clients)
    .where(eq(clients.isActive, true))
    .orderBy(clients.orderPosition)
}

export async function createClient(data: typeof clients.$inferInsert) {
  await verifyAdmin()
  const result = await db.insert(clients).values(data).returning()
  revalidatePath('/')
  return result[0]
}

export async function updateClient(
  id: number,
  data: Partial<typeof clients.$inferInsert>
) {
  await verifyAdmin()
  const result = await db
    .update(clients)
    .set(data)
    .where(eq(clients.id, id))
    .returning()
  revalidatePath('/')
  return result[0]
}

export async function deleteClient(id: number) {
  await verifyAdmin()
  await db.delete(clients).where(eq(clients.id, id))
  revalidatePath('/')
}

// Team Members
export async function getTeamMembers() {
  return db
    .select()
    .from(teamMembers)
    .where(eq(teamMembers.isActive, true))
    .orderBy(teamMembers.orderPosition)
}

export async function createTeamMember(data: typeof teamMembers.$inferInsert) {
  await verifyAdmin()
  const result = await db.insert(teamMembers).values(data).returning()
  revalidatePath('/')
  return result[0]
}

export async function updateTeamMember(
  id: number,
  data: Partial<typeof teamMembers.$inferInsert>
) {
  await verifyAdmin()
  const result = await db
    .update(teamMembers)
    .set(data)
    .where(eq(teamMembers.id, id))
    .returning()
  revalidatePath('/')
  return result[0]
}

export async function deleteTeamMember(id: number) {
  await verifyAdmin()
  await db.delete(teamMembers).where(eq(teamMembers.id, id))
  revalidatePath('/')
}

// Services
export async function getServices() {
  return db
    .select()
    .from(services)
    .where(eq(services.isActive, true))
    .orderBy(services.orderPosition)
}

export async function createService(data: typeof services.$inferInsert) {
  await verifyAdmin()
  const result = await db.insert(services).values(data).returning()
  revalidatePath('/')
  return result[0]
}

export async function updateService(
  id: number,
  data: Partial<typeof services.$inferInsert>
) {
  await verifyAdmin()
  const result = await db
    .update(services)
    .set(data)
    .where(eq(services.id, id))
    .returning()
  revalidatePath('/')
  return result[0]
}

export async function deleteService(id: number) {
  await verifyAdmin()
  await db.delete(services).where(eq(services.id, id))
  revalidatePath('/')
}
