import { db } from '@/lib/db'
import { roles, rolePermissions, userPermissions, user } from '@/lib/db/schema'
import { eq, inArray } from 'drizzle-orm'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'

// ─── PERMISSION INVENTORY (Part 32) ───────────────────────────────────────────
// Granular permission keys across the admin platform. Roles grant these keys;
// individual users can also be granted extra keys via user_permissions.

export const PERMISSIONS = [
  'dashboard.view',
  'orders.view',
  'orders.manage',
  'orders.refund',
  'products.manage',
  'categories.manage',
  'brands.manage',
  'inventory.manage',
  'customers.view',
  'customers.manage',
  'quotes.manage',
  'quotes.convert',
  'messages.manage',
  'coupons.manage',
  'media.manage',
  'cms.manage',
  'analytics.view',
  'users.manage',
  'roles.manage',
  'settings.manage',
  'projects.manage',
  'pages.manage',
] as const

export type Permission = (typeof PERMISSIONS)[number]

// ─── DEFAULT ROLE DEFINITIONS ─────────────────────────────────────────────────
// Shipped with the platform (Part 32: Super Administrator, Administrator,
// Content Manager, Shop Manager, Sales Manager, Analyst).

export const DEFAULT_ROLES: Array<{
  slug: string
  name: string
  description: string
  isAdmin: boolean
  permissions: string[]
}> = [
  {
    slug: 'super-admin',
    name: 'Super Administrator',
    description: 'Full unrestricted access to every part of the platform.',
    isAdmin: true,
    permissions: [...PERMISSIONS],
  },
  {
    slug: 'admin',
    name: 'Administrator',
    description: 'Manages orders, products, customers, content and settings.',
    isAdmin: true,
    permissions: [...PERMISSIONS],
  },
  {
    slug: 'content-manager',
    name: 'Content Manager',
    description: 'Publishes CMS content: hero, services, solutions, partners, departments, pages, media.',
    isAdmin: false,
    permissions: ['dashboard.view', 'cms.manage', 'media.manage', 'pages.manage', 'analytics.view'],
  },
  {
    slug: 'shop-manager',
    name: 'Shop Manager',
    description: 'Runs the online shop: products, categories, brands, inventory, orders and coupons.',
    isAdmin: false,
    permissions: [
      'dashboard.view',
      'orders.view',
      'orders.manage',
      'orders.refund',
      'products.manage',
      'categories.manage',
      'brands.manage',
      'inventory.manage',
      'coupons.manage',
      'analytics.view',
    ],
  },
  {
    slug: 'sales-manager',
    name: 'Sales Manager',
    description: 'Manages customer inquiries, quotes and sales follow-ups.',
    isAdmin: false,
    permissions: ['dashboard.view', 'orders.view', 'quotes.manage', 'quotes.convert', 'messages.manage', 'customers.view', 'customers.manage', 'analytics.view'],
  },
  {
    slug: 'analyst',
    name: 'Analyst',
    description: 'Read-only access to reports and analytics.',
    isAdmin: false,
    permissions: ['dashboard.view', 'analytics.view'],
  },
]

// ─── SEED ROLES ────────────────────────────────────────────────────────────────

export async function ensureDefaultRoles() {
  for (const def of DEFAULT_ROLES) {
    try {
      const existing = await db.select().from(roles).where(eq(roles.slug, def.slug)).limit(1)
      if (existing.length > 0) continue
      const [inserted] = await db.insert(roles).values({
        slug: def.slug,
        name: def.name,
        description: def.description,
        isAdmin: def.isAdmin,
        isSystem: true,
        orderPosition: DEFAULT_ROLES.indexOf(def),
      })
      const roleId = inserted.insertId
      for (const perm of def.permissions) {
        await db.insert(rolePermissions).values({ roleId, permission: perm }).catch(() => null)
      }
    } catch {
      // Continue if already exists
    }
  }
}

// ─── PERMISSION RESOLUTION ─────────────────────────────────────────────────────

export async function getRolePermissionsBySlug(roleSlug: string): Promise<string[]> {
  try {
    const roleRes = await db.select().from(roles).where(eq(roles.slug, roleSlug)).limit(1)
    if (roleRes.length === 0) return []
    const roleId = roleRes[0].id
    const perms = await db.select().from(rolePermissions).where(eq(rolePermissions.roleId, roleId))
    return perms.map((p) => p.permission)
  } catch {
    return []
  }
}

export async function getRoleBySlug(roleSlug: string) {
  try {
    const res = await db.select().from(roles).where(eq(roles.slug, roleSlug)).limit(1)
    return res[0] || null
  } catch {
    return null
  }
}

// Build the full permission set for a given user id.
export async function getUserPermissions(userId: string): Promise<string[]> {
  const set = new Set<string>()
  try {
    const userRes = await db.select().from(user).where(eq(user.id, userId)).limit(1)
    const roleSlug = String(userRes[0]?.role || 'customer')
    if (roleSlug !== 'customer') {
      const rolePerms = await getRolePermissionsBySlug(roleSlug)
      rolePerms.forEach((p) => set.add(p))
    }
    const extra = await db.select().from(userPermissions).where(eq(userPermissions.userId, userId))
    extra.forEach((e) => set.add(e.permission))
  } catch {
    // fall through
  }
  return [...set]
}

// Resolve session with roles/permissions attached (null when not authed).
export async function getSessionWithPermissions() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) return null
  const userId = session.user.id
  const roleSlug = String((session.user as any).role || 'customer').toLowerCase()
  const role = await getRoleBySlug(roleSlug)
  const permissions = await getUserPermissions(userId)
  return { ...session, user: { ...session.user, role: roleSlug }, role, permissions }
}

export type SessionWithPermissions = Awaited<ReturnType<typeof getSessionWithPermissions>>