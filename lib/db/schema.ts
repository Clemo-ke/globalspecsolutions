import {
  boolean,
  decimal,
  int,
  mysqlTable,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/mysql-core'
import { relations } from 'drizzle-orm'

// Auth / Admin User tables
export const user = mysqlTable('user', {
  id: varchar('id', { length: 191 }).primaryKey(),
  email: varchar('email', { length: 191 }).notNull().unique(),
  emailVerified: boolean('emailVerified').notNull().default(false),
  name: varchar('name', { length: 191 }),
  image: varchar('image', { length: 500 }),
  role: varchar('role', { length: 50 }).default('admin'),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow().onUpdateNow(),
})

export const session = mysqlTable('session', {
  id: varchar('id', { length: 191 }).primaryKey(),
  userId: varchar('userId', { length: 191 }).notNull(),
  expiresAt: timestamp('expiresAt').notNull(),
  token: varchar('token', { length: 191 }).notNull().unique(),
  ipAddress: varchar('ipAddress', { length: 191 }),
  userAgent: text('userAgent'),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow().onUpdateNow(),
})

export const account = mysqlTable('account', {
  id: varchar('id', { length: 191 }).primaryKey(),
  userId: varchar('userId', { length: 191 }).notNull(),
  accountId: varchar('accountId', { length: 191 }).notNull(),
  providerId: varchar('providerId', { length: 191 }).notNull(),
  accessToken: text('accessToken'),
  refreshToken: text('refreshToken'),
  idToken: text('idToken'),
  accessTokenExpiresAt: timestamp('accessTokenExpiresAt'),
  refreshTokenExpiresAt: timestamp('refreshTokenExpiresAt'),
  scope: text('scope'),
  password: text('password'),
  issuer: text('issuer'),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow().onUpdateNow(),
})

export const verification = mysqlTable('verification', {
  id: varchar('id', { length: 191 }).primaryKey(),
  identifier: varchar('identifier', { length: 191 }).notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expiresAt').notNull(),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow().onUpdateNow(),
})

// Content & CMS tables
export const heroSlides = mysqlTable('hero_slides', {
  id: int('id').autoincrement().primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  subtitle: varchar('subtitle', { length: 255 }),
  description: text('description'),
  imageUrl: text('image_url'),
  ctaText: varchar('cta_text', { length: 100 }),
  ctaLink: varchar('cta_link', { length: 255 }),
  orderPosition: int('order_position').default(0),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
})

export const productCategories = mysqlTable('product_categories', {
  id: int('id').autoincrement().primaryKey(),
  slug: varchar('slug', { length: 191 }).notNull().unique(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  icon: varchar('icon', { length: 100 }),
  color: varchar('color', { length: 50 }),
  imageUrl: text('image_url'),
  orderPosition: int('order_position').default(0),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
})

export const products = mysqlTable('products', {
  id: int('id').autoincrement().primaryKey(),
  slug: varchar('slug', { length: 191 }).notNull().unique(),
  name: varchar('name', { length: 255 }).notNull(),
  sku: varchar('sku', { length: 100 }),
  description: text('description'),
  categoryId: int('category_id').notNull(),
  price: decimal('price', { precision: 12, scale: 2 }),
  salePrice: decimal('sale_price', { precision: 12, scale: 2 }),
  imageUrl: text('image_url'),
  images: text('images'), // JSON string array of additional image URLs
  features: text('features'), // Line separated or CSV features
  specifications: text('specifications'), // JSON string key-value attributes
  stockStatus: varchar('stock_status', { length: 50 }).default('in_stock'),
  isFeatured: boolean('is_featured').default(false),
  orderPosition: int('order_position').default(0),
  isActive: boolean('is_active').default(true),
  seoTitle: varchar('seo_title', { length: 255 }),
  seoDescription: text('seo_description'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
})

export const solutions = mysqlTable('solutions', {
  id: int('id').autoincrement().primaryKey(),
  slug: varchar('slug', { length: 191 }).notNull().unique(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  imageUrl: text('image_url'),
  benefits: text('benefits'),
  orderPosition: int('order_position').default(0),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
})

export const clients = mysqlTable('clients', {
  id: int('id').autoincrement().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  imageUrl: text('image_url'),
  projectTitle: varchar('project_title', { length: 255 }),
  projectDescription: text('project_description'),
  technologies: text('technologies'),
  orderPosition: int('order_position').default(0),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const teamMembers = mysqlTable('team_members', {
  id: int('id').autoincrement().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  role: varchar('role', { length: 255 }).notNull(),
  bio: text('bio'),
  imageUrl: text('image_url'),
  email: varchar('email', { length: 191 }),
  phone: varchar('phone', { length: 100 }),
  orderPosition: int('order_position').default(0),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
})

export const services = mysqlTable('services', {
  id: int('id').autoincrement().primaryKey(),
  slug: varchar('slug', { length: 191 }).notNull().unique(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  details: text('details'),
  icon: varchar('icon', { length: 100 }),
  imageUrl: text('image_url'),
  orderPosition: int('order_position').default(0),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
})

// Orders & Checkout tables
export const orders = mysqlTable('orders', {
  id: int('id').autoincrement().primaryKey(),
  orderNumber: varchar('order_number', { length: 100 }).notNull().unique(),
  customerName: varchar('customer_name', { length: 255 }).notNull(),
  customerPhone: varchar('customer_phone', { length: 100 }).notNull(),
  customerEmail: varchar('customer_email', { length: 191 }).notNull(),
  deliveryLocation: text('delivery_location'),
  notes: text('notes'),
  subtotal: decimal('subtotal', { precision: 12, scale: 2 }).notNull(),
  total: decimal('total', { precision: 12, scale: 2 }).notNull(),
  status: varchar('status', { length: 50 }).default('New').notNull(), // New, Contacted, Confirmed, Processing, Completed, Cancelled
  whatsappStatus: varchar('whatsapp_status', { length: 50 }).default('Sent'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
})

export const orderItems = mysqlTable('order_items', {
  id: int('id').autoincrement().primaryKey(),
  orderId: int('order_id').notNull(),
  productId: int('product_id'),
  productName: varchar('product_name', { length: 255 }).notNull(),
  unitPrice: decimal('unit_price', { precision: 12, scale: 2 }).notNull(),
  quantity: int('quantity').notNull(),
  totalPrice: decimal('total_price', { precision: 12, scale: 2 }).notNull(),
})

// Contact / Inquiry Submissions
export const contactMessages = mysqlTable('contact_messages', {
  id: int('id').autoincrement().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 191 }).notNull(),
  phone: varchar('phone', { length: 100 }),
  subject: varchar('subject', { length: 255 }),
  message: text('message').notNull(),
  status: varchar('status', { length: 50 }).default('New').notNull(), // New, Read, Replied, Archived
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// General Dynamic Site Settings & Media
export const siteSettings = mysqlTable('site_settings', {
  id: int('id').autoincrement().primaryKey(),
  settingKey: varchar('setting_key', { length: 191 }).notNull().unique(),
  settingValue: text('setting_value').notNull(),
  description: text('description'),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
})

export const media = mysqlTable('media', {
  id: int('id').autoincrement().primaryKey(),
  filename: varchar('filename', { length: 255 }).notNull(),
  url: text('url').notNull(),
  altText: varchar('alt_text', { length: 255 }),
  mimeType: varchar('mime_type', { length: 100 }),
  size: int('size'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// Industries Served
export const industries = mysqlTable('industries', {
  id: int('id').autoincrement().primaryKey(),
  slug: varchar('slug', { length: 191 }).notNull().unique(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  imageUrl: text('image_url'),
  icon: varchar('icon', { length: 100 }),
  orderPosition: int('order_position').default(0),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
})

// Partners & Brands
export const partners = mysqlTable('partners', {
  id: int('id').autoincrement().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 191 }).notNull().unique(),
  logoUrl: text('logo_url').notNull(),
  websiteUrl: text('website_url'),
  description: text('description'),
  category: varchar('category', { length: 100 }), // e.g. Manufacturer, Technology Partner
  isFeatured: boolean('is_featured').default(true),
  orderPosition: int('order_position').default(0),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// Downloads & Resources (Case Studies, Datasheets, Whitepapers)
export const resources = mysqlTable('resources', {
  id: int('id').autoincrement().primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 191 }).notNull().unique(),
  category: varchar('category', { length: 100 }).notNull(), // Datasheet, Whitepaper, Case Study, Manual
  description: text('description'),
  fileUrl: text('file_url').notNull(),
  fileSize: varchar('file_size', { length: 50 }),
  thumbnailUrl: text('thumbnail_url'),
  isFeatured: boolean('is_featured').default(false),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// Quote Requests B2B Engine
export const quoteRequests = mysqlTable('quote_requests', {
  id: int('id').autoincrement().primaryKey(),
  quoteNumber: varchar('quote_number', { length: 100 }).notNull().unique(),
  customerName: varchar('customer_name', { length: 255 }).notNull(),
  companyName: varchar('company_name', { length: 255 }),
  customerEmail: varchar('customer_email', { length: 191 }).notNull(),
  customerPhone: varchar('customer_phone', { length: 100 }).notNull(),
  notes: text('notes'),
  status: varchar('status', { length: 50 }).default('New').notNull(), // New, Reviewing, Quoted, Won, Lost, Closed
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
})

export const quoteItems = mysqlTable('quote_items', {
  id: int('id').autoincrement().primaryKey(),
  quoteRequestId: int('quote_request_id').notNull(),
  productId: int('product_id'),
  productName: varchar('product_name', { length: 255 }).notNull(),
  quantity: int('quantity').default(1).notNull(),
  notes: text('notes'),
})

// Relations
export const productCategories_relations = relations(
  productCategories,
  ({ many }) => ({
    products: many(products),
  })
)

export const products_relations = relations(products, ({ one }) => ({
  category: one(productCategories, {
    fields: [products.categoryId],
    references: [productCategories.id],
  }),
}))

export const orders_relations = relations(orders, ({ many }) => ({
  items: many(orderItems),
}))

export const orderItems_relations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
}))

