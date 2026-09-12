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
  role: varchar('role', { length: 50 }).default('customer'),
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
  shortDescription: text('short_description'),
  description: text('description'),
  categoryId: int('category_id').notNull(),
  brandId: int('brand_id'),
  price: decimal('price', { precision: 12, scale: 2 }),
  salePrice: decimal('sale_price', { precision: 12, scale: 2 }),
  costPrice: decimal('cost_price', { precision: 12, scale: 2 }),
  currency: varchar('currency', { length: 3 }).default('KES'),
  imageUrl: text('image_url'),
  images: text('images'), // JSON string array of additional image URLs
  features: text('features'), // Line separated or CSV features
  specifications: text('specifications'), // JSON string key-value attributes (legacy)
  purchaseType: varchar('purchase_type', { length: 50 }).default('buy_online'), // buy_online | request_quote | contact_sales
  stockQuantity: int('stock_quantity').default(0),
  lowStockThreshold: int('low_stock_threshold').default(5),
  stockStatus: varchar('stock_status', { length: 50 }).default('in_stock'),
  isFeatured: boolean('is_featured').default(false),
  orderPosition: int('order_position').default(0),
  isActive: boolean('is_active').default(true),
  seoTitle: varchar('seo_title', { length: 255 }),
  seoDescription: text('seo_description'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
})

// Brands / Manufacturers
export const brands = mysqlTable('brands', {
  id: int('id').autoincrement().primaryKey(),
  slug: varchar('slug', { length: 191 }).notNull().unique(),
  name: varchar('name', { length: 255 }).notNull(),
  logoUrl: text('logo_url'),
  websiteUrl: text('website_url'),
  description: text('description'),
  isActive: boolean('is_active').default(true),
  orderPosition: int('order_position').default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
})

// Departments (GlobalSpec official engineering departments)
export const departments = mysqlTable('departments', {
  id: int('id').autoincrement().primaryKey(),
  slug: varchar('slug', { length: 191 }).notNull().unique(),
  name: varchar('name', { length: 255 }).notNull(),
  mainFunction: text('main_function'),
  description: text('description'),
  capabilities: text('capabilities'), // CSV of capability statements
  icon: varchar('icon', { length: 100 }),
  imageUrl: text('image_url'),
  orderPosition: int('order_position').default(0),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
})

// Many-to-many: Products <-> Departments
export const productDepartments = mysqlTable('product_departments', {
  id: int('id').autoincrement().primaryKey(),
  productId: int('product_id').notNull(),
  departmentId: int('department_id').notNull(),
})

// Dynamic product specifications
export const productSpecs = mysqlTable('product_specs', {
  id: int('id').autoincrement().primaryKey(),
  productId: int('product_id').notNull(),
  label: varchar('label', { length: 191 }).notNull(),
  value: varchar('value', { length: 255 }).notNull(),
  orderPosition: int('order_position').default(0),
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
  customerId: int('customer_id'),
  customerName: varchar('customer_name', { length: 255 }).notNull(),
  customerPhone: varchar('customer_phone', { length: 100 }).notNull(),
  customerEmail: varchar('customer_email', { length: 191 }).notNull(),
  deliveryLocation: text('delivery_location'),
  deliveryMethod: varchar('delivery_method', { length: 100 }),
  deliveryCost: decimal('delivery_cost', { precision: 12, scale: 2 }),
  shippingAddress: text('shipping_address'),
  paymentMethod: varchar('payment_method', { length: 100 }),
  paymentStatus: varchar('payment_status', { length: 50 }).default('Pending'), // Pending, Paid, Failed, Refunded, Partially Refunded
  refundedAmount: decimal('refunded_amount', { precision: 12, scale: 2 }).default('0.00'),
  notes: text('notes'),
  subtotal: decimal('subtotal', { precision: 12, scale: 2 }).notNull(),
  discountAmount: decimal('discount_amount', { precision: 12, scale: 2 }).default('0.00'),
  couponCode: varchar('coupon_code', { length: 50 }),
  total: decimal('total', { precision: 12, scale: 2 }).notNull(),
  status: varchar('status', { length: 50 }).default('Pending').notNull(), // Pending, Confirmed, Processing, Shipped, Delivered, Completed, Cancelled
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

// Customers (linked to auth users via userId when signed in)
export const customers = mysqlTable('customers', {
  id: int('id').autoincrement().primaryKey(),
  userId: varchar('user_id', { length: 191 }).unique(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 191 }).notNull().unique(),
  phone: varchar('phone', { length: 100 }),
  company: varchar('company', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
})

export const customerAddresses = mysqlTable('customer_addresses', {
  id: int('id').autoincrement().primaryKey(),
  customerId: int('customer_id').notNull(),
  label: varchar('label', { length: 100 }).default('Default'),
  addressLine1: varchar('address_line1', { length: 255 }).notNull(),
  addressLine2: varchar('address_line2', { length: 255 }),
  country: varchar('country', { length: 100 }).default('Kenya').notNull(),
  city: varchar('city', { length: 100 }).notNull(),
  postalCode: varchar('postal_code', { length: 50 }),
  isDefault: boolean('is_default').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// User permissions (granular, role-agnostic access grants)
export const userPermissions = mysqlTable('user_permissions', {
  id: int('id').autoincrement().primaryKey(),
  userId: varchar('user_id', { length: 191 }).notNull(),
  permission: varchar('permission', { length: 100 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// Roles & role-based permissions (Part 32)
export const roles = mysqlTable('roles', {
  id: int('id').autoincrement().primaryKey(),
  slug: varchar('slug', { length: 50 }).notNull().unique(),
  name: varchar('name', { length: 100 }).notNull(),
  description: text('description'),
  isAdmin: boolean('is_admin').default(false),
  isSystem: boolean('is_system').default(false),
  orderPosition: int('order_position').default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
})

export const rolePermissions = mysqlTable('role_permissions', {
  id: int('id').autoincrement().primaryKey(),
  roleId: int('role_id').notNull(),
  permission: varchar('permission', { length: 100 }).notNull(),
})

// Projects portfolio (Part 29)
export const projects = mysqlTable('projects', {
  id: int('id').autoincrement().primaryKey(),
  slug: varchar('slug', { length: 191 }).notNull().unique(),
  title: varchar('title', { length: 255 }).notNull(),
  clientName: varchar('client_name', { length: 255 }),
  location: varchar('location', { length: 255 }),
  description: text('description'),
  imageUrl: text('image_url'),
  status: varchar('status', { length: 50 }).default('Completed'),
  year: varchar('year', { length: 20 }),
  orderPosition: int('order_position').default(0),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
})

// Applications (engineering applications, many-to-many with products)
export const applications = mysqlTable('applications', {
  id: int('id').autoincrement().primaryKey(),
  slug: varchar('slug', { length: 191 }).notNull().unique(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  icon: varchar('icon', { length: 100 }),
  imageUrl: text('image_url'),
  orderPosition: int('order_position').default(0),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
})

export const productApplications = mysqlTable('product_applications', {
  id: int('id').autoincrement().primaryKey(),
  productId: int('product_id').notNull(),
  applicationId: int('application_id').notNull(),
})

// Order payments & refunds (Part 31)
export const payments = mysqlTable('payments', {
  id: int('id').autoincrement().primaryKey(),
  orderId: int('order_id').notNull(),
  amount: decimal('amount', { precision: 12, scale: 2 }).notNull(),
  method: varchar('method', { length: 100 }),
  reference: varchar('reference', { length: 191 }),
  status: varchar('status', { length: 50 }).default('Pending'), // Pending, Paid, Failed, Partially Refunded, Refunded
  paidAt: timestamp('paid_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const refunds = mysqlTable('refunds', {
  id: int('id').autoincrement().primaryKey(),
  orderId: int('order_id').notNull(),
  amount: decimal('amount', { precision: 12, scale: 2 }).notNull(),
  reason: text('reason'),
  refundedAt: timestamp('refunded_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// Inventory movement history (Part 15-24 Inventory analytics)
export const inventoryTransactions = mysqlTable('inventory_transactions', {
  id: int('id').autoincrement().primaryKey(),
  productId: int('product_id').notNull(),
  type: varchar('type', { length: 50 }).notNull(), // added, sold, adjusted, returned
  quantityChange: int('quantity_change').notNull(),
  note: text('note'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// CMS Pages & SEO settings (Part 29)
export const pages = mysqlTable('pages', {
  id: int('id').autoincrement().primaryKey(),
  slug: varchar('slug', { length: 191 }).notNull().unique(),
  title: varchar('title', { length: 255 }).notNull(),
  content: text('content'),
  metaTitle: varchar('meta_title', { length: 255 }),
  metaDescription: text('meta_description'),
  ogImage: text('og_image'),
  canonicalUrl: varchar('canonical_url', { length: 255 }),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
})

// Analytics events (funnel: view -> add_to_cart -> checkout -> purchase)
export const analyticsEvents = mysqlTable('analytics_events', {
  id: int('id').autoincrement().primaryKey(),
  eventType: varchar('event_type', { length: 50 }).notNull(),
  productId: int('product_id'),
  visitorId: varchar('visitor_id', { length: 191 }),
  userId: varchar('user_id', { length: 191 }),
  metadata: text('metadata'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// Promotions & Coupons
export const coupons = mysqlTable('coupons', {
  id: int('id').autoincrement().primaryKey(),
  code: varchar('code', { length: 50 }).notNull().unique(),
  description: text('description'),
  discountType: varchar('discount_type', { length: 20 }).notNull().default('percent'), // percent | fixed
  discountValue: decimal('discount_value', { precision: 12, scale: 2 }).notNull(),
  minSubtotal: decimal('min_subtotal', { precision: 12, scale: 2 }),
  maxDiscount: decimal('max_discount', { precision: 12, scale: 2 }),
  usageLimit: int('usage_limit').default(0), // 0 = unlimited
  usedCount: int('used_count').default(0),
  isActive: boolean('is_active').default(true),
  startsAt: timestamp('starts_at'),
  expiresAt: timestamp('expires_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
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
  customerId: int('customer_id'),
  customerName: varchar('customer_name', { length: 255 }).notNull(),
  companyName: varchar('company_name', { length: 255 }),
  customerEmail: varchar('customer_email', { length: 191 }).notNull(),
  customerPhone: varchar('customer_phone', { length: 100 }).notNull(),
  notes: text('notes'),
  status: varchar('status', { length: 50 }).default('New').notNull(), // New, Under Review, Quotation Sent, Negotiating, Approved, Rejected, Expired, Converted to Order
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

export const products_relations = relations(products, ({ one, many }) => ({
  category: one(productCategories, {
    fields: [products.categoryId],
    references: [productCategories.id],
  }),
  brand: one(brands, {
    fields: [products.brandId],
    references: [brands.id],
  }),
  departments: many(productDepartments),
  specs: many(productSpecs),
}))

export const brands_relations = relations(brands, ({ many }) => ({
  products: many(products),
}))

export const departments_relations = relations(departments, ({ many }) => ({
  products: many(productDepartments),
}))

export const productDepartments_relations = relations(productDepartments, ({ one }) => ({
  product: one(products, {
    fields: [productDepartments.productId],
    references: [products.id],
  }),
  department: one(departments, {
    fields: [productDepartments.departmentId],
    references: [departments.id],
  }),
}))

export const productSpecs_relations = relations(productSpecs, ({ one }) => ({
  product: one(products, {
    fields: [productSpecs.productId],
    references: [products.id],
  }),
}))

export const orders_relations = relations(orders, ({ one, many }) => ({
  items: many(orderItems),
  customer: one(customers, {
    fields: [orders.customerId],
    references: [customers.id],
  }),
}))

export const customers_relations = relations(customers, ({ many }) => ({
  addresses: many(customerAddresses),
  orders: many(orders),
  quotes: many(quoteRequests),
}))

export const customerAddresses_relations = relations(customerAddresses, ({ one }) => ({
  customer: one(customers, {
    fields: [customerAddresses.customerId],
    references: [customers.id],
  }),
}))

export const quoteRequests_relations = relations(quoteRequests, ({ one, many }) => ({
  customer: one(customers, {
    fields: [quoteRequests.customerId],
    references: [customers.id],
  }),
  items: many(quoteItems),
}))

export const quoteItems_relations = relations(quoteItems, ({ one }) => ({
  quoteRequest: one(quoteRequests, {
    fields: [quoteItems.quoteRequestId],
    references: [quoteRequests.id],
  }),
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

export const rolePermissions_relations = relations(rolePermissions, ({ one }) => ({
  role: one(roles, {
    fields: [rolePermissions.roleId],
    references: [roles.id],
  }),
}))

export const projects_relations = relations(projects, ({}) => ({}))
export const applications_relations = relations(applications, ({}) => ({}))

