# GlobalSpec Platform Complete UI/UX, E-Commerce & Administration System Specification

## Project Type

GlobalSpec is a modern corporate, engineering, infrastructure and e-commerce platform consisting of two major systems:

**A. Public Website** — Used by visitors, customers and potential clients.

**B. Administration Platform** — Used by authorized staff to manage:
- Website content, Departments, Services, Projects, Products, Categories, Orders, Customers, Inventory, Payments, Inquiries, Reports, Analytics, Users and permissions, Site settings

The public website and administration platform must share the same underlying data but have completely different UI purposes and experiences.

---

## PART 1 — CORE DESIGN PHILOSOPHY (Public Website)

The public website should feel: **Modern, Premium, Classic, Minimal, Professional, Technical, Reliable, Engineering-focused.**

Typography must be a major design feature. Use: Slim/light weights, regular weights, medium weights, bold weights, occasional italics. Create hierarchy through typography rather than excessive colors or visual decoration.

Examples:

> Infrastructure built for performance.

> Engineering for complex environments.

The visual system should be restrained and sophisticated. Avoid excessive rounded cards, excessive shadows, gradients and generic SaaS styling.

---

## PART 2 — PUBLIC WEBSITE STRUCTURE

**Primary Navigation:** Home | About Us | Departments | Solutions | Projects | Shop | Insights | Contact

- Primary CTA: **Talk to an Expert**
- Secondary CTA: **Request a Quote**

---

## PART 3 — HOMEPAGE

Introduces GlobalSpec as a comprehensive infrastructure and engineering solutions company.

**Section 1 — Hero:** "GLOBAL ENGINEERING & INFRASTRUCTURE" / *Infrastructure designed for performance.* Supporting text + buttons (Explore Solutions, Request a Consultation). Premium visual representing infrastructure/engineering/technical environments.

**Section 2 — Introduction:** "Engineering systems that support critical operations." Large editorial typography.

**Section 3 — Departments:** Display the seven departments with an interactive numbered layout (not identical generic cards): hover/select reveals description, image, capabilities, link.

---

## PART 4 — DEPARTMENT STRUCTURE

| # | Department | Main function |
|---|------------|---------------|
| 01 | Electrical Works | Electrical distribution, lighting, grounding and controls |
| 02 | Mechanical & Cooling Systems | HVAC, precision cooling, plumbing and mechanical services |
| 03 | ICT Infrastructure & Data Centers | Network infrastructure, cabling, server rooms and data centers |
| 04 | Security Systems & Applications | CCTV, access control, alarms and integrated security |
| 05 | Renewable Energy | Solar, wind, energy storage and microgrid solutions |
| 06 | Critical Power & Backup Systems | UPS, generators, batteries and redundant power infrastructure |
| 07 | Building Works | Renovation, refurbishment and minor building works |

---

## PART 5 — ONLINE SHOP

The `/shop` section is a complete e-commerce system, professionally designed, product-focused and easy to browse, consistent with the GlobalSpec brand.

- **Shop homepage:** Hero; dynamic categories (Electrical Equipment, Cooling & HVAC, Networking & ICT, Data Center Equipment, Security Systems, Renewable Energy, Critical Power, Building Materials & Solutions); featured products; latest products; optional featured brands; products by department.
- **Products ↔ Departments:** A product should optionally connect to one or more departments (e.g. UPS → Critical Power + ICT Infrastructure; CCTV → Security Systems; Solar Inverter → Renewable Energy + Critical Power).

---

## PART 6 — PRODUCT MANAGEMENT

- **Basic information:** name, SKU, slug, short/full description
- **Pricing:** regular price, sale price, discount %, cost price (admin only), currency
- **Inventory:** stock quantity, status, low-stock threshold, backorder settings, tracking
- **Relationships:** categories, subcategories, brands, departments, applications (many-to-many)
- **Media:** main image, gallery, technical documents, datasheets, manuals, brochures
- **Specifications:** dynamic fields, not hardcoded (e.g. Input Voltage, Output Capacity, Efficiency, Battery Type, Operating Temperature)
- **SEO:** title, meta description, Open Graph image, canonical URL

---

## PART 7 — SHOPPING EXPERIENCE

- **Listing (`/shop`):** search, category/department/brand/price/availability filters; sorting (newest, price, popular). Minimal product cards (image, category, name, price, stock indicator, quick action).
- **Detail page:** gallery, info, SKU, price, availability, quantity, add-to-cart. Support **Purchase Type: Buy Online / Request Quote / Contact Sales** (engineering products may require quotation).

---

## PART 8 — SHOPPING CART

Product image, name, quantity, unit price, total, remove item; optional save-for-later; dynamic updates.

---

## PART 9 — CHECKOUT

Customer information (name, email, phone, address, country, city, postal), delivery (method, cost, estimate), payment (configurable via admin — never hardcoded).

---

## PART 10 — CUSTOMER ACCOUNTS

Profile, addresses, orders, order history, saved products, quotes, downloads.

---

## PART 11 — REQUEST FOR QUOTE SYSTEM

Users: add products to quote request, quantities, project/company info, technical requirements. Admin: view, update status, communicate, convert quote → order. Statuses: New, Under Review, Quotation Sent, Negotiating, Approved, Rejected, Expired, Converted to Order.

---

## PART 12–13 — ADMINISTRATION PLATFORM

Separate UI from public site. Prioritize speed, information density, clarity, data visibility, easy management, professional reporting. Modern business system, not decorative.

**Sidebar:** Overview (Dashboard) · Website (Pages, Departments, Services, Applications, Industries, Projects, Insights) · Shop (Products, Categories, Brands, Inventory, Orders, Customers, Quotes, Promotions) · Communication (Contact Inquiries, Messages) · Analytics (Reports, Sales Analytics, Product Analytics, Customer Analytics, Inventory Reports) · System (Media Library, Users, Roles & Permissions, Site Settings, SEO Settings). Navigation must support permissions.

---

## PART 14 — ADMIN DASHBOARD

KPI cards: Sales (today/week/month/year), Orders (new/processing/completed/cancelled), Customers (total/new), Products (total/low stock/out of stock), Leads (inquiries, quotes).

Example layout: Row 1 KPI metrics; Row 2 revenue trend chart; Row 3 sales by category + orders by status; Row 4 top products table; Row 5 recent orders; Row 6 recent inquiries, quotes, low stock alerts.

---

## PART 15–24 — ANALYTICS & REPORTING

- **Sales analytics:** revenue over time (daily/weekly/monthly/yearly; today, last 7/30 days, quarter, year, custom range); gross/net revenue, orders, AOV, refunds, discounts.
- **Order analytics:** pipeline by status (pending/processing/completed/cancelled/refunded).
- **Product analytics:** units sold, revenue, orders, views, conversion, cart additions; top/low performers; funnel (views → cart → checkout → purchased).
- **Customer analytics:** growth, type, value (total purchases, AOV, LTV), repeat customers.
- **Inventory analytics:** totals, in/low/out of stock, alerts below threshold, movement history (added/sold/adjusted/returned).
- **Revenue by category and department** (ranked).
- **Project & services analytics:** project/department/service interest, lead sources (contact page, department/project/product page, quote request, direct visit, search engine).
- **Inquiry analytics:** new/open/resolved, average response time, filters by department/service/date/type.
- **Quote analytics:** totals sent/approved/rejected/converted, conversion rate = converted ÷ sent × 100.

**Reports Center** (`Reports`): Sales, Orders, Products, Customers, Inventory, Quotes, Departments, Projects, Inquiries — each with date ranges and CSV/Excel/PDF export.

**Visualization:** revenue trend (line), orders by status (bar/compact), sales by category (bar), revenue by department (bar), customer growth (line), top products (horizontal bar), inventory status. Do not overload pages with charts.

**Admin reporting rules:** all reports from real system data; no hardcoded stats; support date/department/category/product filtering, exporting, and period comparison (e.g. $125,000 ↑ 18.5% vs previous month).

---

## PART 29 — DATABASE STRUCTURE

Users, Roles, Permissions · Departments, Services, Applications, Industries · Projects (ProjectDepartments/Services/Media) · Products (ProductCategories, ProductBrands, ProductImages, ProductSpecifications, ProductDepartments, ProductApplications) · Inventory, InventoryTransactions · Customers, CustomerAddresses · Carts, CartItems · Orders, OrderItems, Payments, Refunds · Quotes, QuoteItems · Promotions, Coupons · ContactInquiries · Articles, ArticleCategories · Media · AnalyticsEvents · Pages · SiteSettings, SEOSettings

**Relationships must be flexible** (not unnecessarily restrictive): e.g. a product can belong to multiple categories, departments, and applications.

---

## PART 31 — ORDER SYSTEM

Order number, customer, items, subtotal, discount, tax, shipping, total, payment status + order status.
- Payment: Pending, Paid, Failed, Refunded, Partially Refunded
- Order: Pending, Confirmed, Processing, Shipped, Delivered, Completed, Cancelled
- Statuses configurable where appropriate.

---

## PART 32 — USER ROLES

Super Administrator, Administrator, Content Manager, Shop Manager, Sales Manager, Analyst. Permission system granular — do not rely only on fixed role names; use permissions.

---

## PART 33 — IMPLEMENTATION INSTRUCTIONS

1. **Audit first.** Do not immediately redesign/rewrite. Audit existing codebase and database: frontend/backend framework, database, authentication, public pages, admin functionality, e-commerce, APIs, dynamic entities, product/order system, reporting.
2. **Preserve working functionality.** Do not remove working functionality unnecessarily; preserve architecture where practical.
3. **Implementation plan.** identify reusable components, UI components to replace, DB migrations required, new entities required.
4. **Design system first.** Implement reusable components and a consistent design system before redesigning individual pages.
5. **Migrations.** Use DB migrations for structural changes; maintain backwards compatibility.
6. **Review gate.** Before major changes, present proposed architecture, DB changes, route changes and implementation phases for review.

Platform is two experiences: (1) Public corporate + e-commerce website; (2) Professional administration/business platform. All content and reporting data must be dynamically generated from the database and manageable through the admin platform.