# Global Spec Solutions - Dynamic Enterprise Platform

A fully dynamic, professional business solutions website with **complete content management** through an admin dashboard. Built with **Next.js 16**, **Neon PostgreSQL**, **Drizzle ORM**, and **Better Auth**.

## 🎨 Features

### Public Website
- **Hero Carousel**: Auto-rotating hero slides with call-to-action buttons
- **Dynamic Products**: Filterable product catalog with category selection
- **Solutions Showcase**: Highlight your key offerings with beautiful cards
- **Client Portfolio**: Showcase completed projects and client testimonials
- **Services Grid**: Display your core services with icons and descriptions
- **Contact Section**: Professional contact information and CTA
- **Responsive Design**: Optimized for desktop, tablet, and mobile

### Admin Dashboard
- **Complete CMS**: Manage all website content without coding
- **Hero Slides Management**: Create, edit, delete carousel slides
- **Product Categories**: Organize products into dynamic categories
- **Products Management**: Full CRUD for products with pricing and images
- **Solutions Management**: Add and manage solution offerings
- **Clients Portfolio**: Manage client projects and case studies
- **Team Members**: Add staff bios and information
- **Services Listing**: Manage service offerings

### Design & Branding
- **Custom Theme Colors**: Cyan (#00BFFF) and Orange-Red (#FF6B35) from your logo
- **Professional Styling**: Clean, modern UI with Tailwind CSS
- **Dark Mode Support**: Full light/dark theme implementation
- **Accessibility Compliant**: WCAG 2.1 AA standards

## 🏗️ Architecture

### Technology Stack
- **Frontend**: Next.js 16 with React 19
- **Database**: Neon Postgres
- **ORM**: Drizzle ORM
- **Authentication**: Better Auth (email + password)
- **UI Components**: shadcn/ui
- **Styling**: Tailwind CSS with custom theme tokens
- **Deployment Ready**: Built for Vercel

### Database Schema
```
hero_slides
├── id (serial)
├── title, subtitle, description
├── image_url, cta_text, cta_link
├── order_position, is_active
└── created_at, updated_at

product_categories
├── id (serial)
├── name, description
├── icon, color
└── order_position, is_active

products
├── id (serial)
├── name, description, price
├── category_id (FK)
├── image_url, features
└── order_position, is_active

solutions
├── id (serial)
├── title, description
├── image_url, benefits
└── order_position, is_active

clients
├── id (serial)
├── name, description
├── image_url, project_title, project_description
├── technologies
└── order_position, is_active

team_members
├── id (serial)
├── name, role, bio
├── image_url, email, phone
└── order_position, is_active

services
├── id (serial)
├── name, description, icon
└── order_position, is_active
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Neon Database (included with integration)
- Environment variables configured

### Environment Setup
```bash
# Required environment variables
DATABASE_URL=          # Auto-provided by Neon integration
BETTER_AUTH_SECRET=    # Generate: openssl rand -base64 32
```

### Installation
```bash
# Install dependencies
pnpm install

# Seed database with sample data (development only)
curl http://localhost:3000/api/seed

# Start development server
pnpm dev
```

Visit `http://localhost:3000` to view the website.

## 📱 Pages & Routes

### Public Routes
- `/` - Homepage with all sections
- `/sign-in` - User login
- `/sign-up` - Create new account

### Admin Routes
- `/admin` - Admin dashboard (protected)
- `/sign-in` - Authentication required for admin access

## 🛠️ Admin Dashboard Features

### Content Management
Each content type has full CRUD functionality:

**Hero Slides**
- Add rotating banner slides with images and CTAs
- Reorder slides by drag-and-drop (order_position)
- Toggle active/inactive status
- Set call-to-action text and links

**Products**
- Organize by category
- Add pricing, images, and feature descriptions
- Manage inventory status
- Sort by position

**Solutions**
- Showcase your service offerings
- Add detailed descriptions and benefits
- Include before/after images
- Highlight key benefits

**Clients**
- Display project portfolio
- Include project descriptions
- List technologies used
- Add client testimonials

**Team & Services**
- Build your team directory
- List core services
- Add icons and descriptions

### Media Management
- Image uploads for all content
- Automatic image optimization
- Integration with Vercel Blob (optional)

## 🎯 Key Features Explained

### Dynamic Hero Carousel
- Auto-rotates every 5 seconds
- Manual navigation with arrow buttons
- Each slide pulls from database
- Responsive with full-screen images

### Product Filtering
- Filter by category in real-time
- Search functionality
- Dynamic pricing display
- Call-to-action buttons

### Client Portfolio
- Interactive modal view
- Click to see full project details
- Technologies display
- Responsive gallery grid

### Services Showcase
- Icon-based service cards
- Organized grid layout
- Responsive design

## 🔐 Security Features

- **Authentication**: Better Auth with email + password
- **Session Management**: Secure, HttpOnly cookies
- **Database Security**: No RLS needed (per-user scoping in queries)
- **Admin Protection**: All admin routes require authentication

## 📊 Performance Optimizations

- Server-side rendering for initial page load
- Optimized image loading with proper aspect ratios
- CSS-in-JS with Tailwind for minimal bundle size
- Database query optimization with Drizzle ORM
- Built-in caching headers

## 🎨 Customization Guide

### Change Theme Colors
Edit `/app/globals.css` and update the CSS custom properties:
```css
:root {
  --primary: oklch(0.52 0.213 260.4);      /* Cyan */
  --secondary: oklch(0.6 0.22 28.3);       /* Orange-Red */
  /* ... other colors */
}
```

### Add New Content Types
1. Create new table in database via Neon MCP
2. Add schema in `/lib/db/schema.ts`
3. Create server actions in `/app/actions/content.ts`
4. Add UI components in `/components/`
5. Update admin dashboard in `/app/admin/`

### Customize Home Page Sections
Edit `/app/page.tsx` to:
- Reorder sections
- Add new sections
- Remove unused sections
- Modify layout and styling

## 📈 Scaling & Deployment

### Deploy to Vercel
```bash
# Push to GitHub
git push origin main

# Automatically deploys to Vercel
```

### Database Management
- Neon handles backups automatically
- Scale compute as needed in Neon console
- Monitor queries with Neon performance tools

### Environment Variables
Set in Vercel project settings:
- `BETTER_AUTH_SECRET` - Generate locally
- `DATABASE_URL` - Auto-synced from Neon

## 🔧 Development

### Project Structure
```
/app
  /admin          - Admin dashboard pages
  /api            - API routes (auth, seed)
  /actions        - Server actions for data operations
  page.tsx        - Homepage
  layout.tsx      - Root layout

/components
  /ui             - shadcn/ui components
  *.tsx           - Page-specific components

/lib
  auth.ts         - Better Auth configuration
  auth-client.ts  - Client-side auth helpers
  /db
    index.ts      - Drizzle client setup
    schema.ts     - Database schema definitions
  seed.ts         - Sample data seeder
```

### Adding Features
1. Design database schema
2. Add SQL tables via Neon MCP
3. Update Drizzle schema
4. Create server actions
5. Build UI components
6. Update admin dashboard

## 🐛 Troubleshooting

**Database Connection Issues**
- Verify `DATABASE_URL` is set
- Check Neon project is active
- Confirm network access settings

**Auth Issues**
- Ensure `BETTER_AUTH_SECRET` is set
- Check browser cookies are enabled
- Verify auth routes are configured

**Content Not Showing**
- Seed database: `curl http://localhost:3000/api/seed`
- Check database records exist
- Verify queries in server actions
- Check browser console for errors

## 📞 Support & Customization

This is a fully functional, production-ready platform. For customization:
1. Modify components in `/components/`
2. Add new content types to database
3. Update admin dashboard as needed
4. Deploy whenever ready

## 📝 License

Custom enterprise application built with v0.

---

**Happy building! 🚀**
