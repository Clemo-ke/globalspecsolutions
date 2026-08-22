import { db } from './db'
import {
  heroSlides,
  productCategories,
  products,
  solutions,
  clients,
  services,
  siteSettings,
  industries,
  partners,
  resources,
  orders,
  orderItems,
  contactMessages,
  quoteRequests,
  quoteItems,
} from './db/schema'
import { eq } from 'drizzle-orm'

export async function seedDatabase() {
  try {
    console.log('🌱 Seeding MySQL database for Global Spec Solutions...')

    // ─── Site Settings ────────────────────────────────────────────────────────
    const initialSettings = [
      { settingKey: 'whatsapp_number', settingValue: '+254721113431', description: 'WhatsApp business phone for checkout' },
      { settingKey: 'company_phone', settingValue: '+254 721 113 431 / +254 725 440 342', description: 'Public contact phone numbers' },
      { settingKey: 'company_email', settingValue: 'info@globalspecsolutions.com', description: 'Public contact email address' },
      { settingKey: 'company_address', settingValue: 'Barclays House, Mai Mahiu road off Langata Road, P.O Box 9520-00200 Nairobi, Kenya', description: 'Physical office address' },
      { settingKey: 'floating_whatsapp_enabled', settingValue: 'true', description: 'Enable floating WhatsApp widget' },
      { settingKey: 'site_name', settingValue: 'Global Spec Solutions', description: 'Site brand name' },
      { settingKey: 'primary_color', settingValue: '#2563eb', description: 'Brand primary color' },
    ]
    for (const setting of initialSettings) {
      const existing = await db.select().from(siteSettings).where(eq(siteSettings.settingKey, setting.settingKey))
      if (existing.length === 0) await db.insert(siteSettings).values(setting)
    }
    console.log('✅ Site settings seeded')

    // ─── Hero Slides ──────────────────────────────────────────────────────────
    const heroData = [
      {
        title: 'Advanced Electrical & Power Infrastructure',
        subtitle: 'Engineering Reliability & Excellence',
        description: 'Premium electrical engineering, UPS critical power, and business solutions tailored for industrial and commercial sectors.',
        imageUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=1600&auto=format&fit=crop&q=80',
        ctaText: 'Explore Products',
        ctaLink: '/shop',
        orderPosition: 0,
        isActive: true,
      },
      {
        title: 'Solar & Renewable Energy Systems',
        subtitle: 'Sustainable Enterprise Power',
        description: 'Comprehensive high-efficiency solar panel installations and inverter systems designed to cut operating costs.',
        imageUrl: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=1600&auto=format&fit=crop&q=80',
        ctaText: 'View Solar Solutions',
        ctaLink: '/shop?category=renewable-energy',
        orderPosition: 1,
        isActive: true,
      },
      {
        title: 'Data Centre Infrastructure & DCIM',
        subtitle: 'Mission Critical Operations',
        description: 'Struxureware environmental monitoring, security integration, and scalable data room implementations.',
        imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1600&auto=format&fit=crop&q=80',
        ctaText: 'Browse ICT Solutions',
        ctaLink: '/shop?category=ict-infrastructure',
        orderPosition: 2,
        isActive: true,
      },
    ]
    for (const slide of heroData) {
      const existing = await db.select().from(heroSlides).where(eq(heroSlides.title, slide.title))
      if (existing.length === 0) await db.insert(heroSlides).values(slide)
    }
    console.log('✅ Hero slides seeded')

    // ─── Services ─────────────────────────────────────────────────────────────
    const serviceData = [
      {
        slug: 'electrical-works',
        name: 'Electrical Works',
        description: 'Quality installation of Critical power, UPS DC Power systems, switchgear, and high-voltage grid connections.',
        details: 'Our electrical engineering team handles complete installations from design to commissioning. We specialize in LV/MV switchgear, automatic transfer switches, and energy metering.',
        icon: 'Zap',
        imageUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&auto=format&fit=crop&q=80',
        orderPosition: 0,
        isActive: true,
      },
      {
        slug: 'ict-infrastructure',
        name: 'ICT Infrastructure & Data Centre',
        description: 'Data Centre design, implementation, operations, and maintenance by certified specialist engineers.',
        details: 'From structured cabling and server racks to full DCIM deployments. We integrate Schneider Electric EcoStruxure and Struxureware platforms.',
        icon: 'Server',
        imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80',
        orderPosition: 1,
        isActive: true,
      },
      {
        slug: 'renewable-energy',
        name: 'Renewable Energy',
        description: 'Industrial solar solutions, solar power plants, battery storage systems, and energy efficiency audits.',
        details: 'We install grid-tie, off-grid, and hybrid solar systems for commercial and industrial clients across East Africa. Battery storage from 10kWh to 10MWh.',
        icon: 'Sun',
        imageUrl: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&auto=format&fit=crop&q=80',
        orderPosition: 2,
        isActive: true,
      },
      {
        slug: 'software-and-integrations',
        name: 'Software and Integrations',
        description: 'DCIM and Struxureware for Data Centre Overview, Schneider Electric reference designs, and cybersecurity.',
        details: 'End-to-end software integration including EcoStruxure IT, Struxureware Data Centre Operations, and enterprise cybersecurity platforms.',
        icon: 'Cpu',
        imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop&q=80',
        orderPosition: 3,
        isActive: true,
      },
      {
        slug: 'electrical-consultation-audit',
        name: 'Electrical Consultation & Energy Audits',
        description: 'Comprehensive electrical load calculations and energy efficiency audits.',
        details: 'Our certified energy auditors help organizations identify inefficiencies, reduce wastage, and comply with energy regulations.',
        icon: 'ClipboardCheck',
        imageUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&auto=format&fit=crop&q=80',
        orderPosition: 4,
        isActive: true,
      },
      {
        slug: '24-7-emergency-maintenance',
        name: '24/7 Support & Preventive Maintenance',
        description: 'Round-the-clock technician response for critical power and UPS breakdowns.',
        details: 'SLA-backed maintenance contracts covering UPS systems, generators, solar inverters, and data centre cooling equipment.',
        icon: 'Wrench',
        imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&auto=format&fit=crop&q=80',
        orderPosition: 5,
        isActive: true,
      },
    ]
    for (const srv of serviceData) {
      const existing = await db.select().from(services).where(eq(services.slug, srv.slug))
      if (existing.length === 0) await db.insert(services).values(srv)
    }
    console.log('✅ Services seeded')

    // ─── Industries ───────────────────────────────────────────────────────────
    const industryData = [
      { slug: 'telecommunications', name: 'Telecommunications', description: 'Mission-critical power backup and Data Centre cooling for cellular networks and ISPs.', icon: 'Radio', orderPosition: 0, isActive: true },
      { slug: 'banking-finance', name: 'Banking & Financial Institutions', description: 'Uninterrupted power systems and server room security for financial transaction processing.', icon: 'Building2', orderPosition: 1, isActive: true },
      { slug: 'commercial-real-estate', name: 'Commercial Real Estate & Malls', description: 'Substation installations, solar microgrids, and smart facility energy management.', icon: 'Landmark', orderPosition: 2, isActive: true },
      { slug: 'healthcare-hospitals', name: 'Healthcare & Hospitals', description: 'Zero-latency critical power backups for surgical suites, medical imaging, and ICU wards.', icon: 'HeartPulse', orderPosition: 3, isActive: true },
      { slug: 'manufacturing', name: 'Manufacturing & Industry', description: 'Industrial power distribution, motor control centres, and factory automation systems.', icon: 'Factory', orderPosition: 4, isActive: true },
      { slug: 'government', name: 'Government & Public Sector', description: 'Reliable infrastructure for government data centres, ministries, and public utilities.', icon: 'Shield', orderPosition: 5, isActive: true },
    ]
    for (const ind of industryData) {
      const existing = await db.select().from(industries).where(eq(industries.slug, ind.slug))
      if (existing.length === 0) await db.insert(industries).values(ind)
    }
    console.log('✅ Industries seeded')

    // ─── Partners ─────────────────────────────────────────────────────────────
    const partnerData = [
      { name: 'Schneider Electric', slug: 'schneider-electric', logoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80', websiteUrl: 'https://www.se.com', description: 'Global leader in energy management, automation, and Struxureware DCIM software.', category: 'Technology Partner', isFeatured: true, orderPosition: 0, isActive: true },
      { name: 'APC by Schneider Electric', slug: 'apc', logoUrl: 'https://images.unsplash.com/photo-1563770660941-20978e870e26?w=200&auto=format&fit=crop&q=80', websiteUrl: 'https://www.apc.com', description: 'Uninterruptible power supply (UPS) systems, server racks, and critical power infrastructure.', category: 'Manufacturer', isFeatured: true, orderPosition: 1, isActive: true },
      { name: 'Huawei Solar', slug: 'huawei-solar', logoUrl: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=200&auto=format&fit=crop&q=80', websiteUrl: 'https://solar.huawei.com', description: 'Commercial & industrial string inverters and Smart String ESS battery systems.', category: 'Solar Equipment', isFeatured: true, orderPosition: 2, isActive: true },
      { name: 'ABB Group', slug: 'abb-group', logoUrl: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=200&auto=format&fit=crop&q=80', websiteUrl: 'https://www.abb.com', description: 'Industrial automation, drives, switchgear, and power distribution equipment.', category: 'Technology Partner', isFeatured: true, orderPosition: 3, isActive: true },
      { name: 'Eaton Corporation', slug: 'eaton', logoUrl: 'https://images.unsplash.com/photo-1620228885847-9eab2a1adddc?w=200&auto=format&fit=crop&q=80', websiteUrl: 'https://www.eaton.com', description: 'Power management solutions including UPS, PDUs, and power distribution systems.', category: 'Manufacturer', isFeatured: true, orderPosition: 4, isActive: true },
      { name: 'Cisco Systems', slug: 'cisco', logoUrl: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=200&auto=format&fit=crop&q=80', websiteUrl: 'https://www.cisco.com', description: 'Enterprise networking, switching, routing, and cybersecurity solutions.', category: 'ICT Partner', isFeatured: false, orderPosition: 5, isActive: true },
    ]
    for (const partner of partnerData) {
      const existing = await db.select().from(partners).where(eq(partners.slug, partner.slug))
      if (existing.length === 0) await db.insert(partners).values(partner)
    }
    console.log('✅ Partners seeded')

    // ─── Resources ────────────────────────────────────────────────────────────
    const resourceData = [
      { title: 'GlobalSpec Solutions Enterprise Profile 2026', slug: 'globalspec-company-profile-2026', category: 'Company Profile', description: 'Full official company overview, engineering team credentials, and project portfolio.', fileUrl: '/docs/Globalspec-Solutions-profile-2020.pdf', fileSize: '4.2 MB', isFeatured: true, isActive: true },
      { title: 'Struxureware Data Centre Architecture Blueprint', slug: 'struxureware-dcim-blueprint', category: 'Datasheet', description: 'Technical specifications for DCIM environmental and power monitoring implementations.', fileUrl: '/docs/Struxureware-DCIM-Guide.pdf', fileSize: '2.8 MB', isFeatured: true, isActive: true },
      { title: 'Solar Energy ROI Calculator Guide', slug: 'solar-roi-calculator', category: 'Whitepaper', description: 'Step-by-step guide to calculating return on investment for commercial solar installations.', fileUrl: '/docs/Solar-ROI-Guide.pdf', fileSize: '1.5 MB', isFeatured: false, isActive: true },
    ]
    for (const res of resourceData) {
      const existing = await db.select().from(resources).where(eq(resources.slug, res.slug))
      if (existing.length === 0) await db.insert(resources).values(res)
    }
    console.log('✅ Resources seeded')

    // ─── Product Categories ───────────────────────────────────────────────────
    const categoryData = [
      { slug: 'electrical-works', name: 'Electrical Works', description: 'High voltage installations, critical power, and switchgear', icon: '⚡', color: '#1d4ed8', imageUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&auto=format&fit=crop&q=80', orderPosition: 0, isActive: true },
      { slug: 'ict-infrastructure', name: 'ICT Infrastructure', description: 'Data centre design, DCIM monitoring, and server room setups', icon: '🖥️', color: '#0891b2', imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80', orderPosition: 1, isActive: true },
      { slug: 'renewable-energy', name: 'Renewable Energy', description: 'Industrial solar installations, battery backups, and inverters', icon: '☀️', color: '#d97706', imageUrl: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&auto=format&fit=crop&q=80', orderPosition: 2, isActive: true },
      { slug: 'software-security', name: 'Software & Security', description: 'Struxureware, cybersecurity, and environmental monitoring', icon: '🔒', color: '#7c3aed', imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop&q=80', orderPosition: 3, isActive: true },
      { slug: 'generators-backup', name: 'Generators & Backup', description: 'Diesel generators, automatic transfer switches, and fuel systems', icon: '🔋', color: '#059669', imageUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&auto=format&fit=crop&q=80', orderPosition: 4, isActive: true },
    ]
    for (const cat of categoryData) {
      const existing = await db.select().from(productCategories).where(eq(productCategories.slug, cat.slug))
      if (existing.length === 0) await db.insert(productCategories).values(cat)
    }
    console.log('✅ Product categories seeded')

    // Retrieve Category IDs
    const cats = await db.select().from(productCategories)
    const elecCat = cats.find((c) => c.slug === 'electrical-works')?.id ?? 1
    const ictCat = cats.find((c) => c.slug === 'ict-infrastructure')?.id ?? 2
    const solarCat = cats.find((c) => c.slug === 'renewable-energy')?.id ?? 3
    const secCat = cats.find((c) => c.slug === 'software-security')?.id ?? 4
    const genCat = cats.find((c) => c.slug === 'generators-backup')?.id ?? 5

    // ─── Products (20 realistic GlobalSpec products) ──────────────────────────
    const productData = [
      // ELECTRICAL WORKS
      {
        slug: 'apc-smart-ups-10kva',
        name: 'APC Smart-UPS 10kVA Online Double Conversion',
        sku: 'GSS-UPS-001',
        description: 'Enterprise-grade 10kVA / 8kW online double-conversion UPS with SNMP card, LCD display, and extended runtime battery module for data centers and server rooms.',
        categoryId: elecCat,
        price: '485000.00',
        salePrice: '449000.00',
        imageUrl: 'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=800&auto=format&fit=crop&q=80',
        features: 'Online Double Conversion, Extended Battery Module, SNMP/Web Management, LCD Display, Hot-Swap Batteries',
        specifications: JSON.stringify({ Power: '10kVA / 8kW', Input: '220-240V AC 50Hz', 'Battery Type': 'VRLA Sealed Lead Acid', Runtime: 'Up to 15 min at full load', Dimensions: '132H x 440W x 680D mm', Weight: '68 kg' }),
        stockStatus: 'in_stock',
        isFeatured: true,
        orderPosition: 0,
        isActive: true,
        seoTitle: 'APC Smart-UPS 10kVA Online UPS System | Global Spec Solutions Kenya',
        seoDescription: 'Buy APC Smart-UPS 10kVA online double conversion UPS in Kenya. SNMP monitoring, extended battery, LCD display. Nairobi delivery available.',
      },
      {
        slug: 'eaton-9px-20kva-ups',
        name: 'Eaton 9PX 20kVA Tower/Rack UPS System',
        sku: 'GSS-UPS-002',
        description: 'High-density 20kVA Eaton 9PX UPS with advanced battery management, lithium-ion option, and integrated bypass for mission-critical applications.',
        categoryId: elecCat,
        price: '1250000.00',
        imageUrl: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=800&auto=format&fit=crop&q=80',
        features: 'Hot-Swap Batteries, Lithium-Ion Option, Integrated Bypass, Network Card, Tower/Rack Convertible',
        specifications: JSON.stringify({ Power: '20kVA / 18kW', Input: '380-415V AC 3-phase', Runtime: 'Up to 10 min at full load', 'Efficiency': 'Up to 99% ECO mode', 'MTBF': '250,000 hours' }),
        stockStatus: 'in_stock',
        isFeatured: true,
        orderPosition: 1,
        isActive: true,
      },
      {
        slug: 'hv-switchgear-panel-11kv',
        name: 'HV Switchgear Panel 11kV Metal-Clad',
        sku: 'GSS-SWGR-003',
        description: 'Factory-assembled 11kV metal-clad switchgear panel with vacuum circuit breakers, protection relays, and bus-bar system for industrial substations.',
        categoryId: elecCat,
        price: '3800000.00',
        salePrice: '3500000.00',
        imageUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&auto=format&fit=crop&q=80',
        features: 'Vacuum Circuit Breakers, Numerical Protection Relays, SF6 Insulated Bus Bars, Anti-condensation Heaters, Interlocking System',
        specifications: JSON.stringify({ Voltage: '11kV', Current: 'Up to 1250A', 'Short Circuit': '25kA for 3 seconds', 'Protection Class': 'IP3X', Standard: 'IEC 62271-200' }),
        stockStatus: 'in_stock',
        isFeatured: false,
        orderPosition: 2,
        isActive: true,
      },
      {
        slug: 'automatic-transfer-switch-200a',
        name: 'Automatic Transfer Switch 200A 3-Phase',
        sku: 'GSS-ATS-004',
        description: 'Microprocessor-controlled 200A 3-phase automatic transfer switch for seamless switching between mains power and generator or UPS backup.',
        categoryId: elecCat,
        price: '185000.00',
        salePrice: '165000.00',
        imageUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&auto=format&fit=crop&q=80',
        features: 'Microprocessor Controlled, LCD Display, Remote Monitoring, 0.1s Transfer Time, Manual Override',
        specifications: JSON.stringify({ Current: '200A', Poles: '3-phase + N', Input: '380V AC', 'Transfer Time': '<100ms', 'Operating Temp': '-10°C to +55°C' }),
        stockStatus: 'in_stock',
        isFeatured: false,
        orderPosition: 3,
        isActive: true,
      },
      // ICT INFRASTRUCTURE
      {
        slug: 'schneider-netshelter-sx-42u-rack',
        name: 'Schneider Electric NetShelter SX 42U Server Rack',
        sku: 'GSS-RACK-005',
        description: 'Industry-standard 42U server rack enclosure with high airflow perforated doors, side panels, roof and base routing with cable management options.',
        categoryId: ictCat,
        price: '220000.00',
        imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80',
        features: 'High Airflow Perforated Doors, Cable Management, Side Panels, Adjustable Mounting Rails, Locking Doors',
        specifications: JSON.stringify({ 'Rack Units': '42U', Height: '1991mm', Width: '600mm', Depth: '1070mm', Weight: '86 kg', 'Load Capacity': '1360 kg' }),
        stockStatus: 'in_stock',
        isFeatured: true,
        orderPosition: 4,
        isActive: true,
      },
      {
        slug: 'struxureware-dcim-suite',
        name: 'Schneider EcoStruxure IT DCIM Suite License',
        sku: 'GSS-DCIM-006',
        description: 'Full EcoStruxure IT Data Centre Infrastructure Management suite with power monitoring, environmental sensors, and remote management dashboard.',
        categoryId: ictCat,
        price: '2800000.00',
        salePrice: '2500000.00',
        imageUrl: 'https://images.unsplash.com/photo-1563770660941-20978e870e26?w=800&auto=format&fit=crop&q=80',
        features: 'Real-time Power Monitoring, Environmental Sensors, Asset Management, Capacity Planning, Mobile App Access',
        specifications: JSON.stringify({ Nodes: 'Up to 1000 managed nodes', Sensors: 'Temperature, Humidity, Leak detection', Integration: 'API, SNMP, Modbus', Deployment: 'Cloud or On-premise' }),
        stockStatus: 'in_stock',
        isFeatured: true,
        orderPosition: 5,
        isActive: true,
      },
      {
        slug: 'cisco-catalyst-9300-48p',
        name: 'Cisco Catalyst 9300 48-Port PoE+ Switch',
        sku: 'GSS-NET-007',
        description: '48-port Gigabit PoE+ enterprise access switch with 4x10G SFP+ uplinks, 802.3bt support, and Cisco DNA Center management compatibility.',
        categoryId: ictCat,
        price: '580000.00',
        salePrice: '520000.00',
        imageUrl: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&auto=format&fit=crop&q=80',
        features: '48x1G PoE+, 4x10G SFP+ Uplinks, 802.3bt Support, Cisco DNA, Stacking Up to 8 Units',
        specifications: JSON.stringify({ Ports: '48x GE PoE+, 4x10G SFP+', PoE: '802.3af/at/bt', 'Switching Capacity': '592 Gbps', 'Stack Speed': '80 Gbps', MTBF: '380,000 hours' }),
        stockStatus: 'in_stock',
        isFeatured: false,
        orderPosition: 6,
        isActive: true,
      },
      {
        slug: 'structured-cabling-cat6a-kit',
        name: 'Structured Cabling Cat6A System (Per Floor)',
        sku: 'GSS-CAB-008',
        description: 'Complete Cat6A structured cabling installation package per floor including patch panels, keystone jacks, faceplates, and cable management.',
        categoryId: ictCat,
        price: '450000.00',
        imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&auto=format&fit=crop&q=80',
        features: '10Gbps Support, 24-Port Patch Panel, Cable Management, Test Certificate Included, 15-Year Warranty',
        specifications: JSON.stringify({ Category: 'Cat6A Shielded', Speed: '10 Gbps', 'Max Length': '100m channel', Installation: 'Per floor up to 50 drops', Standard: 'ISO/IEC 11801 Class EA' }),
        stockStatus: 'in_stock',
        isFeatured: false,
        orderPosition: 7,
        isActive: true,
      },
      // RENEWABLE ENERGY
      {
        slug: 'commercial-solar-50kw-system',
        name: 'Commercial Solar PV System 50kWp Turnkey',
        sku: 'GSS-SLR-009',
        description: 'Complete 50kWp rooftop solar installation with Tier-1 monocrystalline panels, hybrid inverter, and lithium battery storage. Includes design, supply, installation, and commissioning.',
        categoryId: solarCat,
        price: '4800000.00',
        salePrice: '4500000.00',
        imageUrl: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&auto=format&fit=crop&q=80',
        features: 'Tier-1 Mono Solar Panels, 50kW Hybrid Inverter, 100kWh Lithium Battery, Grid-Tie & Backup, 25yr Panel Warranty',
        specifications: JSON.stringify({ Capacity: '50kWp', Panels: '112x 450W Monocrystalline', Inverter: 'Huawei SUN2000 50KTL', Battery: '100kWh LFP', 'Est. Daily Yield': '200-250 kWh', 'ROI Period': '4-6 years' }),
        stockStatus: 'in_stock',
        isFeatured: true,
        orderPosition: 8,
        isActive: true,
      },
      {
        slug: 'huawei-sun2000-10kw-inverter',
        name: 'Huawei SUN2000-10KTL-M1 Smart String Inverter',
        sku: 'GSS-INV-010',
        description: 'Huawei 10kW smart string inverter with built-in smart monitoring, arc fault circuit protection, and compatibility with LUNA2000 battery storage system.',
        categoryId: solarCat,
        price: '185000.00',
        salePrice: '168000.00',
        imageUrl: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&auto=format&fit=crop&q=80',
        features: 'Smart String Technology, Built-in PID Recovery, Arc Fault Protection, IP65, Smart Logger Compatible',
        specifications: JSON.stringify({ Power: '10kW', 'Max Input Voltage': '1100V DC', 'MPPT Voltage Range': '160-1000V', Efficiency: '98.6%', Weight: '22 kg', Protection: 'IP65' }),
        stockStatus: 'in_stock',
        isFeatured: true,
        orderPosition: 9,
        isActive: true,
      },
      {
        slug: 'lithium-battery-48v-200ah',
        name: 'Lithium Iron Phosphate Battery 48V 200Ah',
        sku: 'GSS-BAT-011',
        description: 'High-cycle LiFePO4 battery bank 48V 200Ah (9.6kWh) with integrated BMS, RS485 communication, and compatible with most hybrid inverters on the market.',
        categoryId: solarCat,
        price: '320000.00',
        salePrice: '295000.00',
        imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&auto=format&fit=crop&q=80',
        features: 'LiFePO4 Chemistry, Integrated BMS, 6000+ Cycles, RS485/CAN Communication, IP55',
        specifications: JSON.stringify({ Voltage: '48V', Capacity: '200Ah / 9.6kWh', Chemistry: 'LiFePO4', 'Cycle Life': '6000+ cycles at 80% DoD', 'Communication': 'RS485, CAN', Dimensions: '482x180x640mm' }),
        stockStatus: 'in_stock',
        isFeatured: false,
        orderPosition: 10,
        isActive: true,
      },
      {
        slug: 'solar-mounting-flat-roof-kit',
        name: 'Flat Roof Solar Mounting System (Per 20 Panels)',
        sku: 'GSS-MNT-012',
        description: 'Aluminum ballasted flat roof solar mounting system for 20 panels. No roof penetrations, adjustable tilt angle 5-25°, wind-rated up to 200km/h.',
        categoryId: solarCat,
        price: '85000.00',
        imageUrl: 'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=800&auto=format&fit=crop&q=80',
        features: 'No Roof Penetration, Adjustable Tilt 5-25°, Wind Rated 200km/h, Anodized Aluminum, Stainless Hardware',
        specifications: JSON.stringify({ 'Panel Capacity': '20 panels', 'Tilt Angle': '5-25° adjustable', 'Wind Rating': '200 km/h', Material: 'Anodized aluminum 6005-T5', Standard: 'EN 1991-1-4' }),
        stockStatus: 'in_stock',
        isFeatured: false,
        orderPosition: 11,
        isActive: true,
      },
      // SOFTWARE & SECURITY
      {
        slug: 'cctv-ip-camera-system-32ch',
        name: '32-Channel IP CCTV Surveillance System 4K',
        sku: 'GSS-SEC-013',
        description: 'Complete 32-channel 4K IP camera surveillance package with NVR, PoE switch, 4TB storage, and remote mobile viewing. Includes professional installation.',
        categoryId: secCat,
        price: '480000.00',
        salePrice: '440000.00',
        imageUrl: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=800&auto=format&fit=crop&q=80',
        features: '4K Resolution, Night Vision 50m, AI Motion Detection, Mobile App, 4TB Storage, 32 PoE Channels',
        specifications: JSON.stringify({ Channels: '32', Resolution: '4K (8MP)', NVR: '32-ch 4K NVR', Storage: '4TB HDD', Night: 'Up to 50m IR', Viewing: 'iOS, Android, Web' }),
        stockStatus: 'in_stock',
        isFeatured: true,
        orderPosition: 12,
        isActive: true,
      },
      {
        slug: 'biometric-access-control-system',
        name: 'Enterprise Biometric Access Control System',
        sku: 'GSS-ACS-014',
        description: 'Multi-door fingerprint + card + PIN access control with central management software, audit trail, and integration with HR systems. Up to 10 doors.',
        categoryId: secCat,
        price: '350000.00',
        imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop&q=80',
        features: 'Fingerprint + Card + PIN, 10-Door Management, Audit Trail, Anti-Passback, Integration Ready',
        specifications: JSON.stringify({ Doors: 'Up to 10', 'User Capacity': '5000 per controller', 'Fingerprint Template': '3000 per door', Communication: 'TCP/IP, RS485', 'Software': 'Windows-based CMS', Power: '12V DC PoE' }),
        stockStatus: 'in_stock',
        isFeatured: false,
        orderPosition: 13,
        isActive: true,
      },
      {
        slug: 'fire-alarm-addressable-system',
        name: 'Addressable Fire Alarm System (Per Zone)',
        sku: 'GSS-FA-015',
        description: 'Addressable fire detection and alarm system with intelligent detectors, manual call points, sounders, and control panel. Certified to BS 5839 standards.',
        categoryId: secCat,
        price: '280000.00',
        salePrice: '250000.00',
        imageUrl: 'https://images.unsplash.com/photo-1563213126-a4273aed2016?w=800&auto=format&fit=crop&q=80',
        features: 'Addressable Loop, Intelligent Detectors, Zoned Alarm, EN54 Certified, Remote Monitoring',
        specifications: JSON.stringify({ Type: 'Addressable', Loops: '2 loops expandable', 'Points Per Loop': 'Up to 250', Standard: 'BS 5839 / EN54', 'Battery Backup': '72 hours standby' }),
        stockStatus: 'in_stock',
        isFeatured: false,
        orderPosition: 14,
        isActive: true,
      },
      // GENERATORS & BACKUP
      {
        slug: 'perkins-100kva-diesel-generator',
        name: 'Perkins 100kVA Soundproof Diesel Generator',
        sku: 'GSS-GEN-016',
        description: 'Heavy-duty 100kVA standby diesel generator with Perkins 1104A-44TG2 engine, brushless alternator, acoustic enclosure, and AMF control panel.',
        categoryId: genCat,
        price: '2800000.00',
        salePrice: '2600000.00',
        imageUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&auto=format&fit=crop&q=80',
        features: 'Perkins Engine, Brushless Alternator, Soundproof Canopy, AMF Control Panel, 250L Fuel Tank',
        specifications: JSON.stringify({ Power: '100kVA / 80kW Standby', Engine: 'Perkins 1104A-44TG2', 'Fuel Consumption': '22.4 L/hr at full load', 'Noise Level': '72 dB(A) at 7m', 'Fuel Tank': '250 litres', Alternator: 'Stamford UCI274D' }),
        stockStatus: 'in_stock',
        isFeatured: true,
        orderPosition: 15,
        isActive: true,
      },
      {
        slug: 'cummins-250kva-generator-set',
        name: 'Cummins 250kVA Three-Phase Generator Set',
        sku: 'GSS-GEN-017',
        description: 'Industrial 250kVA Cummins generator set with QSB7-G5 engine, deep sea controller, remote monitoring, and automatic load testing schedule.',
        categoryId: genCat,
        price: '6500000.00',
        imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&auto=format&fit=crop&q=80',
        features: 'Cummins QSB7-G5 Engine, Deep Sea Controller, Remote GPRS Monitoring, Auto Load Testing, 3-Phase Output',
        specifications: JSON.stringify({ Power: '250kVA / 200kW', Engine: 'Cummins QSB7-G5', Voltage: '415V 3-Phase', Frequency: '50Hz', Alternator: 'Stamford HCI444D', Controller: 'Deep Sea 7320' }),
        stockStatus: 'available_on_order',
        isFeatured: true,
        orderPosition: 16,
        isActive: true,
      },
      {
        slug: 'dc-power-system-48v-rectifier',
        name: 'DC Power Plant 48V Rectifier System 200A',
        sku: 'GSS-DC-018',
        description: 'Modular 48V DC power plant with 200A rectifier capacity, battery management, and SNMP monitoring. Ideal for telecom base stations and data centres.',
        categoryId: genCat,
        price: '680000.00',
        salePrice: '620000.00',
        imageUrl: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=800&auto=format&fit=crop&q=80',
        features: 'Modular Rectifiers, Battery Management, SNMP Monitoring, N+1 Redundancy, Hot-Swap Modules',
        specifications: JSON.stringify({ 'Output Voltage': '-48V DC', 'Rectifier Capacity': '200A', Modules: '10x 20A hot-swap', 'Battery Capacity': 'Up to 2000Ah', 'SNMP': 'v1, v2c, v3', Efficiency: '>93%' }),
        stockStatus: 'in_stock',
        isFeatured: false,
        orderPosition: 17,
        isActive: true,
      },
      {
        slug: 'building-management-system',
        name: 'Building Management System (BMS) Integration',
        sku: 'GSS-BMS-019',
        description: 'Integrated BMS solution covering HVAC, lighting, access control, and energy metering on a single platform with mobile control and reporting.',
        categoryId: secCat,
        price: '1800000.00',
        imageUrl: 'https://images.unsplash.com/photo-1590650153855-d9e808231d41?w=800&auto=format&fit=crop&q=80',
        features: 'HVAC Control, Energy Metering, Lighting Automation, Mobile App, Custom Dashboards, API Integration',
        specifications: JSON.stringify({ Protocol: 'BACnet, Modbus, KNX', 'Data Points': 'Up to 5000', Interface: 'Web + Mobile App', Reporting: 'Scheduled PDF/Excel', Integration: 'REST API available' }),
        stockStatus: 'available_on_order',
        isFeatured: false,
        orderPosition: 18,
        isActive: true,
      },
      {
        slug: 'solar-water-pump-system-5hp',
        name: 'Solar Water Pump System 5HP Submersible',
        sku: 'GSS-SWP-020',
        description: 'Complete 5HP solar-powered submersible pump system with VFD controller, float switch, and tank level monitoring. Ideal for boreholes and irrigation.',
        categoryId: solarCat,
        price: '380000.00',
        salePrice: '350000.00',
        imageUrl: 'https://images.unsplash.com/photo-1551836022-4c4c79ecde51?w=800&auto=format&fit=crop&q=80',
        features: '5HP Submersible Pump, VFD Solar Controller, Float Switch, Dry-Run Protection, Remote SMS Alerts',
        specifications: JSON.stringify({ 'Motor Power': '5HP (3.7kW)', 'Solar Array': '4kWp', 'Max Head': '120 metres', 'Flow Rate': 'Up to 15 m³/hr', Controller: 'MPPT VFD', 'Cable Depth': 'Up to 150m' }),
        stockStatus: 'in_stock',
        isFeatured: false,
        orderPosition: 19,
        isActive: true,
      },
    ]

    for (const prod of productData) {
      const existing = await db.select().from(products).where(eq(products.slug, prod.slug))
      if (existing.length === 0) await db.insert(products).values(prod)
    }
    console.log('✅ Products seeded (20 items)')

    // ─── Solutions ────────────────────────────────────────────────────────────
    const solutionData = [
      { slug: 'electrical-engineering-solutions', title: 'High-Voltage Electrical Infrastructure', description: 'Engineering design, panel assembly, and power audit solutions.', imageUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&auto=format&fit=crop&q=80', benefits: 'UPS Systems, DC Power Plants, Switchgear Assemblies', orderPosition: 0, isActive: true },
      { slug: 'data-center-management', title: 'Data Centre Infrastructure & Management', description: 'Turnkey server room cooling, rack power, and Struxureware DCIM.', imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80', benefits: 'Precision Cooling, Redundant Power, Real-time DCIM', orderPosition: 1, isActive: true },
      { slug: 'renewable-energy-solutions', title: 'Commercial Solar & Renewable Energy', description: 'Turnkey solar installations, battery storage, and energy efficiency consulting.', imageUrl: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&auto=format&fit=crop&q=80', benefits: 'Solar PV, Battery Storage, Grid-tie Systems', orderPosition: 2, isActive: true },
    ]
    for (const sol of solutionData) {
      const existing = await db.select().from(solutions).where(eq(solutions.slug, sol.slug))
      if (existing.length === 0) await db.insert(solutions).values(sol)
    }
    console.log('✅ Solutions seeded')

    // ─── Mock Clients / Portfolio ─────────────────────────────────────────────
    const clientData = [
      { name: 'Safaricom PLC', description: 'Critical power UPS systems and DC power plants for 200+ base stations across Kenya.', imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=80', projectTitle: 'Nationwide Telecom Power Infrastructure', projectDescription: 'Design and installation of 200 x 48V DC power plants and 50 x 10kVA UPS systems.', technologies: 'DC Power Plants, UPS Systems, DCIM', orderPosition: 0, isActive: true },
      { name: 'Equity Bank Kenya', description: 'Data centre design, server rack installation, and structured cabling for headquarters.', imageUrl: 'https://images.unsplash.com/photo-1541354329998-f4d9a9f9297f?w=800&auto=format&fit=crop&q=80', projectTitle: 'Enterprise Data Centre Build-Out', projectDescription: 'Complete 42U server room with precision cooling, N+1 UPS, and DCIM monitoring.', technologies: 'Server Racks, DCIM, Structured Cabling', orderPosition: 1, isActive: true },
      { name: 'Nairobi Hospital', description: '100kVA generator installation with automatic transfer switch for ICU and surgical facilities.', imageUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&auto=format&fit=crop&q=80', projectTitle: 'Medical Critical Power Backup', projectDescription: 'Installation of standby generator and UPS systems for uninterrupted medical operations.', technologies: 'Generators, UPS, ATS', orderPosition: 2, isActive: true },
      { name: 'Two Rivers Mall', description: '500kWp commercial solar installation reducing annual electricity costs by 40%.', imageUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&auto=format&fit=crop&q=80', projectTitle: 'Commercial Solar Microgrid 500kWp', projectDescription: 'Rooftop solar with battery storage and BMS integration for Africa\'s largest mall.', technologies: 'Solar PV, Battery Storage, BMS', orderPosition: 3, isActive: true },
    ]
    for (const client of clientData) {
      const existing = await db.select().from(clients).where(eq(clients.name, client.name))
      if (existing.length === 0) await db.insert(clients).values(client)
    }
    console.log('✅ Clients/portfolio seeded')

    // ─── Mock Orders ──────────────────────────────────────────────────────────
    const allProducts = await db.select().from(products)
    const mockOrders = [
      {
        orderNumber: 'GSS-847291',
        customerName: 'John Kamau',
        customerPhone: '+254712345678',
        customerEmail: 'john.kamau@company.co.ke',
        deliveryLocation: 'Westlands, Nairobi',
        notes: 'Please deliver to the 3rd floor server room',
        subtotal: '449000.00',
        total: '449000.00',
        status: 'Confirmed',
        whatsappStatus: 'Sent',
        items: [{ slug: 'apc-smart-ups-10kva', qty: 1 }],
      },
      {
        orderNumber: 'GSS-938473',
        customerName: 'Mary Wanjiku',
        customerPhone: '+254723456789',
        customerEmail: 'mwanjiku@solarco.ke',
        deliveryLocation: 'Industrial Area, Nairobi',
        notes: 'Need installation service as well',
        subtotal: '336000.00',
        total: '336000.00',
        status: 'Processing',
        whatsappStatus: 'Sent',
        items: [{ slug: 'huawei-sun2000-10kw-inverter', qty: 2 }],
      },
      {
        orderNumber: 'GSS-102847',
        customerName: 'David Ochieng',
        customerPhone: '+254734567890',
        customerEmail: 'david@techsolutions.co.ke',
        deliveryLocation: 'Upper Hill, Nairobi',
        notes: '',
        subtotal: '580000.00',
        total: '580000.00',
        status: 'New',
        whatsappStatus: 'Sent',
        items: [{ slug: 'cisco-catalyst-9300-48p', qty: 1 }],
      },
      {
        orderNumber: 'GSS-293847',
        customerName: 'Fatima Hassan',
        customerPhone: '+254745678901',
        customerEmail: 'fhassan@hospitality.co.ke',
        deliveryLocation: 'Kilimani, Nairobi',
        notes: 'Urgent order - project start date next week',
        subtotal: '880000.00',
        total: '880000.00',
        status: 'Completed',
        whatsappStatus: 'Sent',
        items: [{ slug: 'cctv-ip-camera-system-32ch', qty: 2 }],
      },
      {
        orderNumber: 'GSS-374829',
        customerName: 'Peter Muthoni',
        customerPhone: '+254756789012',
        customerEmail: 'pmuthoni@bank.co.ke',
        deliveryLocation: 'CBD, Nairobi',
        notes: 'Quote required before final confirmation',
        subtotal: '4500000.00',
        total: '4500000.00',
        status: 'Contacted',
        whatsappStatus: 'Sent',
        items: [{ slug: 'commercial-solar-50kw-system', qty: 1 }],
      },
    ]

    for (const ord of mockOrders) {
      const existing = await db.select().from(orders).where(eq(orders.orderNumber, ord.orderNumber))
      if (existing.length === 0) {
        const [inserted] = await db.insert(orders).values({
          orderNumber: ord.orderNumber,
          customerName: ord.customerName,
          customerPhone: ord.customerPhone,
          customerEmail: ord.customerEmail,
          deliveryLocation: ord.deliveryLocation,
          notes: ord.notes,
          subtotal: ord.subtotal,
          total: ord.total,
          status: ord.status,
          whatsappStatus: ord.whatsappStatus,
        })
        const orderId = (inserted as any).insertId

        for (const item of ord.items) {
          const prod = allProducts.find((p) => p.slug === item.slug)
          if (prod) {
            const unitPrice = parseFloat(prod.salePrice || prod.price || '0')
            await db.insert(orderItems).values({
              orderId,
              productId: prod.id,
              productName: prod.name,
              unitPrice: unitPrice.toString(),
              quantity: item.qty,
              totalPrice: (unitPrice * item.qty).toString(),
            })
          }
        }
      }
    }
    console.log('✅ Mock orders seeded')

    // ─── Mock Contact Messages ────────────────────────────────────────────────
    const mockMessages = [
      { name: 'James Mwangi', email: 'jmwangi@company.co.ke', phone: '+254711223344', subject: 'Solar Installation Quote', message: 'Good morning, we are a manufacturing plant in Athi River and we would like to get a quote for a 200kWp solar installation. Please advise on the process and timeline.', status: 'New' },
      { name: 'Grace Akinyi', email: 'gakinyi@hospital.co.ke', phone: '+254722334455', subject: 'UPS Maintenance Contract', message: 'We have 3 units of 30kVA UPS systems that need quarterly maintenance. Do you offer annual maintenance contracts and what is the pricing?', status: 'Read' },
      { name: 'Samuel Kipchoge', email: 'skipchoge@hotel.co.ke', phone: '+254733445566', subject: 'CCTV System Upgrade', message: 'Our current CCTV system is outdated and we need to upgrade to an IP-based system covering 80+ cameras across 5 buildings. Can you send a site survey team?', status: 'New' },
      { name: 'Amina Osman', email: 'aosman@telecom.co.ke', phone: '+254744556677', subject: 'DC Power Plant Supply', message: 'We require DC power plant systems for 15 base stations being deployed in Western Kenya. Please provide your best pricing for 48V 100A systems.', status: 'Replied' },
    ]
    for (const msg of mockMessages) {
      const existing = await db.select().from(contactMessages).where(eq(contactMessages.email, msg.email))
      if (existing.length === 0) await db.insert(contactMessages).values(msg)
    }
    console.log('✅ Mock contact messages seeded')

    // ─── Mock Quote Requests ──────────────────────────────────────────────────
    const mockQuotes = [
      { quoteNumber: 'GSS-RFQ-001', customerName: 'Robert Maina', companyName: 'Maina Developers Ltd', customerEmail: 'rmaina@mainadevelopers.co.ke', customerPhone: '+254755667788', notes: '5-storey commercial building power infrastructure', status: 'Reviewing' },
      { quoteNumber: 'GSS-RFQ-002', customerName: 'Alice Njeri', companyName: 'Njeri ICT Solutions', customerEmail: 'anjeri@ictsolve.co.ke', customerPhone: '+254766778899', notes: 'Data centre for 50-rack colocation facility', status: 'Quoted' },
      { quoteNumber: 'GSS-RFQ-003', customerName: 'Hassan Abdirahman', companyName: 'Abdirahman Trading Co', customerEmail: 'habdirahman@atc.co.ke', customerPhone: '+254777889900', notes: 'Warehouse solar system for large cold storage', status: 'New' },
    ]
    for (const quote of mockQuotes) {
      const existing = await db.select().from(quoteRequests).where(eq(quoteRequests.quoteNumber, quote.quoteNumber))
      if (existing.length === 0) {
        const [inserted] = await db.insert(quoteRequests).values(quote)
        const quoteId = (inserted as any).insertId
        const prod = allProducts[0]
        if (prod) {
          await db.insert(quoteItems).values({ quoteRequestId: quoteId, productId: prod.id, productName: prod.name, quantity: 1 })
        }
      }
    }
    console.log('✅ Mock quote requests seeded')

    console.log('\n🎉 All seed data inserted successfully!')
  } catch (error) {
    console.error('❌ Error seeding database:', error)
    throw error
  }
}
