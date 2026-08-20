import { db } from './db'
import {
  heroSlides,
  productCategories,
  products,
  solutions,
  clients,
  services,
  siteSettings,
} from './db/schema'
import { eq } from 'drizzle-orm'

export async function seedDatabase() {
  try {
    console.log('Seeding MySQL database for Global Spec Solutions...')

    // Seed Site Settings
    const initialSettings = [
      { settingKey: 'whatsapp_number', settingValue: '+254721113431', description: 'WhatsApp business phone for checkout' },
      { settingKey: 'company_phone', settingValue: '+254 721 113 431 / +254 725 440 342', description: 'Public contact phone numbers' },
      { settingKey: 'company_email', settingValue: 'info@globalspecsolutions.com', description: 'Public contact email address' },
      { settingKey: 'company_address', settingValue: 'Barclays House, Mai Mahiu road off Langata Road, P.O Box 9520-00200 Nairobi, Kenya', description: 'Physical office address' },
      { settingKey: 'floating_whatsapp_enabled', settingValue: 'true', description: 'Enable floating WhatsApp widget' },
    ]

    for (const setting of initialSettings) {
      const existing = await db.select().from(siteSettings).where(eq(siteSettings.settingKey, setting.settingKey))
      if (existing.length === 0) {
        await db.insert(siteSettings).values(setting)
      }
    }

    // Seed Hero Slides
    const heroData = [
      {
        title: 'Advanced Electrical & Power Infrastructure',
        subtitle: 'Engineering Reliability & Excellence',
        description: 'Premium electrical engineering, UPS critical power, and business solutions tailored for industrial and commercial sectors.',
        imageUrl: '/images/WhatsApp Image 2026-08-17 at 21.11.55.jpeg',
        ctaText: 'Explore Products',
        ctaLink: '/shop',
        orderPosition: 0,
        isActive: true,
      },
      {
        title: 'Solar & Renewable Energy Systems',
        subtitle: 'Sustainable Enterprise Power',
        description: 'Comprehensive high-efficiency solar panel installations and inverter systems designed to cut operating costs.',
        imageUrl: '/images/WhatsApp Image 2026-08-17 at 21.12.00.jpeg',
        ctaText: 'View Solar Solutions',
        ctaLink: '/shop/renewable-energy',
        orderPosition: 1,
        isActive: true,
      },
      {
        title: 'Data Centre Infrastructure & DCIM',
        subtitle: 'Mission Critical Operations',
        description: 'Struxureware environmental monitoring, security integration, and scalable data room implementations.',
        imageUrl: '/images/WhatsApp Image 2026-08-17 at 21.12.12.jpeg',
        ctaText: 'Browse ICT Solutions',
        ctaLink: '/shop/ict-infrastructure',
        orderPosition: 2,
        isActive: true,
      },
    ]

    for (const slide of heroData) {
      const existing = await db.select().from(heroSlides).where(eq(heroSlides.title, slide.title))
      if (existing.length === 0) {
        await db.insert(heroSlides).values(slide)
      }
    }

    // Seed Product Categories
    const categoryData = [
      {
        slug: 'electrical-works',
        name: 'Electrical Works',
        description: 'High voltage installations, critical power, and switchgear',
        icon: '⚡',
        color: '#00BFFF',
        imageUrl: '/images/WhatsApp Image 2026-08-17 at 21.11.55.jpeg',
        orderPosition: 0,
        isActive: true,
      },
      {
        slug: 'ict-infrastructure',
        name: 'ICT Infrastructure',
        description: 'Data centre design, DCIM monitoring, and server room setups',
        icon: '🖥️',
        color: '#FF6B35',
        imageUrl: '/images/WhatsApp Image 2026-08-17 at 21.12.12.jpeg',
        orderPosition: 1,
        isActive: true,
      },
      {
        slug: 'renewable-energy',
        name: 'Renewable Energy',
        description: 'Industrial solar installations, battery backups, and inverters',
        icon: '☀️',
        color: '#00D084',
        imageUrl: '/images/WhatsApp Image 2026-08-17 at 21.12.00.jpeg',
        orderPosition: 2,
        isActive: true,
      },
      {
        slug: 'cybersecurity-monitoring',
        name: 'Software & Security',
        description: 'Struxureware, cybersecurity, and environmental monitoring',
        icon: '💻',
        color: '#9333EA',
        imageUrl: '/images/WhatsApp Image 2026-08-17 at 21.12.02.jpeg',
        orderPosition: 3,
        isActive: true,
      },
    ]

    for (const cat of categoryData) {
      const existing = await db.select().from(productCategories).where(eq(productCategories.slug, cat.slug))
      if (existing.length === 0) {
        await db.insert(productCategories).values(cat)
      }
    }

    // Retrieve Category IDs
    const cats = await db.select().from(productCategories)
    const elecCat = cats.find((c) => c.slug === 'electrical-works')?.id || 1
    const ictCat = cats.find((c) => c.slug === 'ict-infrastructure')?.id || 2
    const solarCat = cats.find((c) => c.slug === 'renewable-energy')?.id || 3
    const secCat = cats.find((c) => c.slug === 'cybersecurity-monitoring')?.id || 4

    // Seed Products
    const productData = [
      {
        slug: 'critical-ups-power-system',
        name: 'Industrial UPS & Critical Power Installation',
        sku: 'GSS-UPS-001',
        description: 'Uninterrupted power supply installation with dual redundant battery backup units for critical facilities.',
        categoryId: elecCat,
        price: '850000.00',
        salePrice: '799000.00',
        imageUrl: '/images/WhatsApp Image 2026-08-17 at 21.11.55.jpeg',
        features: 'High Efficiency UPS, Automatic Bypass, Remote SNMP Monitoring',
        stockStatus: 'in_stock',
        isFeatured: true,
        orderPosition: 0,
        isActive: true,
      },
      {
        slug: 'data-centre-dcim-suite',
        name: 'Data Centre DCIM & Environmental Monitoring',
        sku: 'GSS-DC-002',
        description: 'Complete data centre Struxureware setup with sensor arrays and power distribution monitoring.',
        categoryId: ictCat,
        price: '2500000.00',
        imageUrl: '/images/WhatsApp Image 2026-08-17 at 21.12.12.jpeg',
        features: 'Struxureware Platform, Humidity & Temp Sensors, Rack Power Units',
        stockStatus: 'in_stock',
        isFeatured: true,
        orderPosition: 1,
        isActive: true,
      },
      {
        slug: 'commercial-solar-pv-array',
        name: 'Commercial Solar PV Power System 50kW',
        sku: 'GSS-SLR-003',
        description: 'Turnkey solar panel installation with hybrid inverters and lithium storage batteries.',
        categoryId: solarCat,
        price: '3500000.00',
        salePrice: '3250000.00',
        imageUrl: '/images/WhatsApp Image 2026-08-17 at 21.12.00.jpeg',
        features: 'Tier-1 Mono Solar Panels, 50kW Hybrid Inverter, Grid-Tie & Backup',
        stockStatus: 'in_stock',
        isFeatured: true,
        orderPosition: 2,
        isActive: true,
      },
      {
        slug: 'enterprise-cybersecurity-monitoring',
        name: 'Facility Security & Access Control System',
        sku: 'GSS-SEC-004',
        description: 'Integrated biometric access control, IP cameras, and perimeter threat detection.',
        categoryId: secCat,
        price: '450000.00',
        imageUrl: '/images/WhatsApp Image 2026-08-17 at 21.12.02.jpeg',
        features: 'Biometric Access, Central Surveillance, Real-time Alerts',
        stockStatus: 'in_stock',
        isFeatured: false,
        orderPosition: 3,
        isActive: true,
      },
    ]

    for (const prod of productData) {
      const existing = await db.select().from(products).where(eq(products.slug, prod.slug))
      if (existing.length === 0) {
        await db.insert(products).values(prod)
      }
    }

    // Seed Solutions
    const solutionData = [
      {
        slug: 'electrical-engineering-solutions',
        title: 'High-Voltage Electrical Infrastructure',
        description: 'Engineering design, panel assembly, and power audit solutions.',
        imageUrl: '/images/WhatsApp Image 2026-08-17 at 21.11.55.jpeg',
        benefits: 'UPS Systems, DC Power Plants, Switchgear Assemblies',
        orderPosition: 0,
        isActive: true,
      },
      {
        slug: 'data-center-management',
        title: 'Data Centre Infrastructure & Management',
        description: 'Turnkey server room cooling, rack power, and Struxureware DCIM.',
        imageUrl: '/images/WhatsApp Image 2026-08-17 at 21.12.12.jpeg',
        benefits: 'Precision Cooling, Redundant Power, Real-time DCIM',
        orderPosition: 1,
        isActive: true,
      },
    ]

    for (const sol of solutionData) {
      const existing = await db.select().from(solutions).where(eq(solutions.slug, sol.slug))
      if (existing.length === 0) {
        await db.insert(solutions).values(sol)
      }
    }

    // Seed Services
    const serviceData = [
      {
        slug: 'electrical-consultation-audit',
        name: 'Electrical Consultation & Energy Audits',
        description: 'Comprehensive electrical load calculations and energy efficiency audits.',
        icon: '💡',
        orderPosition: 0,
        isActive: true,
      },
      {
        slug: '24-7-emergency-maintenance',
        name: '24/7 Support & Preventive Maintenance',
        description: 'Round-the-clock technician response for critical power and UPS breakdowns.',
        icon: '🛠️',
        orderPosition: 1,
        isActive: true,
      },
      {
        slug: 'custom-solar-design',
        name: 'Custom Renewable Energy Design',
        description: 'Tailored solar micro-grid designs for remote facilities and commercial complexes.',
        icon: '⚙️',
        orderPosition: 2,
        isActive: true,
      },
    ]

    for (const srv of serviceData) {
      const existing = await db.select().from(services).where(eq(services.slug, srv.slug))
      if (existing.length === 0) {
        await db.insert(services).values(srv)
      }
    }

    console.log('Database seeded successfully!')
  } catch (error) {
    console.error('Error seeding database:', error)
  }
}
