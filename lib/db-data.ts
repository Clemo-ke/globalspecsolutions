import { db } from '@/lib/db'
import {
  heroSlides,
  productCategories,
  products,
  brands,
  departments,
  productDepartments,
  productSpecs,
  solutions,
  clients,
  teamMembers,
  services,
  siteSettings,
  industries,
  partners,
  resources,
  quoteRequests,
  quoteItems,
  orders,
  orderItems,
  customers,
  customerAddresses,
} from '@/lib/db/schema'
import { inArray } from 'drizzle-orm'
import { eq, desc, like, or, and } from 'drizzle-orm'

// ─── RICH FALLBACK / DUMMY DATABASE DATA FOR NETLIFY DEPLOYMENTS ───────────────

const MOCK_SITE_SETTINGS: Record<string, string> = {
  whatsapp_number: '+254721113431',
  company_phone: '+254 721 113 431 / +254 725 440 342',
  company_email: 'info@globalspecsolutions.com',
  company_address: 'Barclays House, Mai Mahiu road off Langata Road, P.O Box 9520-00200 Nairobi, Kenya',
  floating_whatsapp_enabled: 'true',
  site_name: 'Global Spec Solutions',
  primary_color: '#2563eb',
  hero_title: 'Advanced Electrical & Critical Power Infrastructure',
  hero_subtitle: 'Engineered for reliability, sustainability, and industrial growth',
  delivery_methods: JSON.stringify([
    { id: 'nairobi', name: 'Nairobi Delivery', cost: 500, note: 'Within Nairobi & environs (1-3 days)' },
    { id: 'countrywide', name: 'Countrywide Delivery', cost: 1500, note: 'Nationwide via courier (2-5 days)' },
    { id: 'pickup', name: 'Collection Point / Pickup', cost: 0, note: 'Pick up at our Nairobi office' },
  ]),
  payment_methods: JSON.stringify([
    { id: 'mpesa', name: 'M-Pesa / Mobile Money', instructions: 'Pay via M-Pesa paybill. Reference details will be sent on WhatsApp.' },
    { id: 'bank', name: 'Bank Transfer', instructions: 'Bank details will be shared on confirmation via WhatsApp.' },
    { id: 'card', name: 'Card Payment', instructions: 'Secure card payment link will be sent to your email.' },
  ]),
}

const MOCK_HERO_SLIDES = [
  {
    id: 1,
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
    id: 2,
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
    id: 3,
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

const MOCK_CATEGORIES = [
  { id: 1, slug: 'electrical-works', name: 'Electrical Works', description: 'High voltage installations, critical power, and switchgear', icon: 'zap', color: '#1d4ed8', imageUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&auto=format&fit=crop&q=80', orderPosition: 0, isActive: true },
  { id: 2, slug: 'ict-infrastructure', name: 'ICT Infrastructure', description: 'Data centre design, DCIM monitoring, and server room setups', icon: 'server', color: '#0891b2', imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80', orderPosition: 1, isActive: true },
  { id: 3, slug: 'renewable-energy', name: 'Renewable Energy', description: 'Industrial solar installations, battery backups, and inverters', icon: 'sun', color: '#d97706', imageUrl: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&auto=format&fit=crop&q=80', orderPosition: 2, isActive: true },
  { id: 4, slug: 'software-security', name: 'Software & Security', description: 'Struxureware, cybersecurity, and environmental monitoring', icon: 'lock', color: '#7c3aed', imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop&q=80', orderPosition: 3, isActive: true },
  { id: 5, slug: 'generators-backup', name: 'Generators & Backup', description: 'Diesel generators, automatic transfer switches, and fuel systems', icon: 'battery-charging', color: '#059669', imageUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&auto=format&fit=crop&q=80', orderPosition: 4, isActive: true },
]

// The seven official GlobalSpec engineering departments
const MOCK_DEPARTMENTS = [
  { id: 1, slug: 'electrical-works', name: 'Electrical Works', mainFunction: 'Electrical distribution, lighting, grounding and controls.', description: 'From LV/MV distribution to switchgear installation, our electrical engineers deliver safe, code-compliant power systems for industrial and commercial facilities.', capabilities: 'Power Distribution, Lighting Design, Earthing & Grounding, Motor Control Centres, Electrical Safety Audits', icon: 'zap', imageUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=1200&auto=format&fit=crop&q=80', orderPosition: 0, isActive: true },
  { id: 2, slug: 'mechanical-cooling', name: 'Mechanical & Cooling Systems', mainFunction: 'HVAC, precision cooling, plumbing and mechanical services.', description: 'Precision cooling for data centres, HVAC design and installation, and mechanical services that keep critical facilities within operating envelopes.', capabilities: 'HVAC Engineering, Precision Cooling, Chilled Water Systems, Plumbing Services, Mechanical Maintenance', icon: 'snowflake', imageUrl: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=1200&auto=format&fit=crop&q=80', orderPosition: 1, isActive: true },
  { id: 3, slug: 'ict-infrastructure', name: 'ICT Infrastructure & Data Centers', mainFunction: 'Network infrastructure, cabling, server rooms and data centers.', description: 'Structured cabling, server room builds, and full data centre implementations managed with DCIM and environmental monitoring.', capabilities: 'Structured Cabling, Server Rack Installation, Data Centre Design, DCIM Monitoring, Network Infrastructure', icon: 'server', imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&auto=format&fit=crop&q=80', orderPosition: 2, isActive: true },
  { id: 4, slug: 'security-systems', name: 'Security Systems & Applications', mainFunction: 'CCTV, access control, alarms and integrated security.', description: 'Integrated physical security: video surveillance, access control, intrusion detection, and monitoring tied into facility management platforms.', capabilities: 'CCTV Surveillance, Access Control, Intrusion Alarms, Video Analytics, Integrated Security Platforms', icon: 'shield', imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&auto=format&fit=crop&q=80', orderPosition: 3, isActive: true },
  { id: 5, slug: 'renewable-energy', name: 'Renewable Energy', mainFunction: 'Solar, wind, energy storage and microgrid solutions.', description: 'Commercial and industrial solar PV, battery energy storage, hybrid inverters, and microgrid engineering for energy independence.', capabilities: 'Solar PV Systems, Battery Energy Storage, Hybrid Inverters, Microgrids, Energy Efficiency Audits', icon: 'sun', imageUrl: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=1200&auto=format&fit=crop&q=80', orderPosition: 4, isActive: true },
  { id: 6, slug: 'critical-power', name: 'Critical Power & Backup Systems', mainFunction: 'UPS, generators, batteries and redundant power infrastructure.', description: 'Uninterruptible power supplies, diesel generators, ATS, and battery rooms engineered for zero-downtime critical operations.', capabilities: 'UPS Systems, Diesel Generators, ATS & Switchgear, Battery Rooms, Redundant Power Design', icon: 'battery-charging', imageUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&auto=format&fit=crop&q=80', orderPosition: 5, isActive: true },
  { id: 7, slug: 'building-works', name: 'Building Works', mainFunction: 'Renovation, refurbishment and minor building works.', description: 'Civil support for technical installations: refurbishment, containment, partitioning, and finishes that complement engineered systems.', capabilities: 'Renovation, Refurbishment, Partitioning, Cable Containment, Finishing Works', icon: 'building', imageUrl: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=1200&auto=format&fit=crop&q=80', orderPosition: 6, isActive: true },
]

const MOCK_BRANDS = [
  { id: 1, slug: 'schneider-electric', name: 'Schneider Electric', logoUrl: '', websiteUrl: 'https://www.se.com', description: 'Energy management and automation.', isActive: true, orderPosition: 0, createdAt: new Date(), updatedAt: new Date() },
  { id: 2, slug: 'apc', name: 'APC by Schneider Electric', logoUrl: '', websiteUrl: 'https://www.apc.com', description: 'UPS and critical power infrastructure.', isActive: true, orderPosition: 1, createdAt: new Date(), updatedAt: new Date() },
  { id: 3, slug: 'huawei-solar', name: 'Huawei Solar', logoUrl: '', websiteUrl: 'https://solar.huawei.com', description: 'Smart string inverters and ESS.', isActive: true, orderPosition: 2, createdAt: new Date(), updatedAt: new Date() },
  { id: 4, slug: 'eaton', name: 'Eaton', logoUrl: '', websiteUrl: 'https://www.eaton.com', description: 'Power management and UPS systems.', isActive: true, orderPosition: 3, createdAt: new Date(), updatedAt: new Date() },
  { id: 5, slug: 'cisco', name: 'Cisco', logoUrl: '', websiteUrl: 'https://www.cisco.com', description: 'Enterprise networking.', isActive: true, orderPosition: 4, createdAt: new Date(), updatedAt: new Date() },
]

const MOCK_SERVICES = [
  { id: 1, slug: 'electrical-works', name: 'Electrical Works', description: 'Quality installation of Critical power, UPS DC Power systems, switchgear, and high-voltage grid connections.', details: 'Our electrical engineering team handles complete installations from design to commissioning. We specialize in LV/MV switchgear, automatic transfer switches, and energy metering.', icon: 'Zap', imageUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&auto=format&fit=crop&q=80', orderPosition: 0, isActive: true },
  { id: 2, slug: 'ict-infrastructure', name: 'ICT Infrastructure & Data Centre', description: 'Data Centre design, implementation, operations, and maintenance by certified specialist engineers.', details: 'From structured cabling and server racks to full DCIM deployments. We integrate Schneider Electric EcoStruxure and Struxureware platforms.', icon: 'Server', imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80', orderPosition: 1, isActive: true },
  { id: 3, slug: 'renewable-energy', name: 'Renewable Energy', description: 'Industrial solar solutions, solar power plants, battery storage systems, and energy efficiency audits.', details: 'We install grid-tie, off-grid, and hybrid solar systems for commercial and industrial clients across East Africa. Battery storage from 10kWh to 10MWh.', icon: 'Sun', imageUrl: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&auto=format&fit=crop&q=80', orderPosition: 2, isActive: true },
  { id: 4, slug: 'software-and-integrations', name: 'Software and Integrations', description: 'DCIM and Struxureware for Data Centre Overview, Schneider Electric reference designs, and cybersecurity.', details: 'End-to-end software integration including EcoStruxure IT, Struxureware Data Centre Operations, and enterprise cybersecurity platforms.', icon: 'Cpu', imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop&q=80', orderPosition: 3, isActive: true },
  { id: 5, slug: 'electrical-consultation-audit', name: 'Electrical Consultation & Energy Audits', description: 'Comprehensive electrical load calculations and energy efficiency audits.', details: 'Our certified energy auditors help organizations identify inefficiencies, reduce wastage, and comply with energy regulations.', icon: 'ClipboardCheck', imageUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&auto=format&fit=crop&q=80', orderPosition: 4, isActive: true },
  { id: 6, slug: '24-7-emergency-maintenance', name: '24/7 Support & Preventive Maintenance', description: 'Round-the-clock technician response for critical power and UPS breakdowns.', details: 'SLA-backed maintenance contracts covering UPS systems, generators, solar inverters, and data centre cooling equipment.', icon: 'Wrench', imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&auto=format&fit=crop&q=80', orderPosition: 5, isActive: true },
]

const MOCK_SOLUTIONS = [
  { id: 1, title: 'Commercial Solar Microgrid Systems', category: 'Renewable Energy', description: 'High-capacity solar PV microgrids with battery energy storage systems (BESS) for manufacturing plants and commercial properties.', benefits: 'Reduces grid power dependence by up to 80%, Zero emissions, SLA technical support included', imageUrl: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&auto=format&fit=crop&q=80', orderPosition: 0, isActive: true },
  { id: 2, title: 'Data Centre Infrastructure Management (DCIM)', category: 'ICT Infrastructure', description: 'Turnkey data centre environment, power, and security management using Schneider EcoStruxure IT platform.', benefits: 'Real-time thermal monitoring, PUE optimization, Automated alerts', imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80', orderPosition: 1, isActive: true },
  { id: 3, title: 'High Voltage Substation & Power Distribution', category: 'Electrical Works', description: '11kV/33kV substation engineering, metal-clad switchgear panels, and power factor correction systems.', benefits: 'Vacuum circuit breakers, Protective numerical relays, High reliability', imageUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&auto=format&fit=crop&q=80', orderPosition: 2, isActive: true },
  { id: 4, title: 'Uninterruptible Power Supply (UPS) Systems', category: 'Critical Power', description: 'Modular 10kVA to 500kVA online double conversion UPS systems for zero downtime operation.', benefits: 'N+1 redundancy, Hot-swappable power modules, ECO mode high efficiency', imageUrl: 'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=800&auto=format&fit=crop&q=80', orderPosition: 3, isActive: true },
]

const MOCK_INDUSTRIES = [
  { id: 1, slug: 'telecommunications', name: 'Telecommunications', description: 'Mission-critical power backup and Data Centre cooling for cellular networks and ISPs.', icon: 'Radio', orderPosition: 0, isActive: true },
  { id: 2, slug: 'banking-finance', name: 'Banking & Financial Institutions', description: 'Uninterrupted power systems and server room security for financial transaction processing.', icon: 'Building2', orderPosition: 1, isActive: true },
  { id: 3, slug: 'commercial-real-estate', name: 'Commercial Real Estate & Malls', description: 'Substation installations, solar microgrids, and smart facility energy management.', icon: 'Landmark', orderPosition: 2, isActive: true },
  { id: 4, slug: 'healthcare-hospitals', name: 'Healthcare & Hospitals', description: 'Zero-latency critical power backups for surgical suites, medical imaging, and ICU wards.', icon: 'HeartPulse', orderPosition: 3, isActive: true },
  { id: 5, slug: 'manufacturing', name: 'Manufacturing & Industry', description: 'Industrial power distribution, motor control centres, and factory automation systems.', icon: 'Factory', orderPosition: 4, isActive: true },
  { id: 6, slug: 'government', name: 'Government & Public Sector', description: 'Reliable infrastructure for government data centres, ministries, and public utilities.', icon: 'Shield', orderPosition: 5, isActive: true },
]

const MOCK_PARTNERS = [
  { id: 1, name: 'Schneider Electric', slug: 'schneider-electric', logoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80', websiteUrl: 'https://www.se.com', description: 'Global leader in energy management, automation, and Struxureware DCIM software.', category: 'Technology Partner', isFeatured: true, orderPosition: 0, isActive: true },
  { id: 2, name: 'APC by Schneider Electric', slug: 'apc', logoUrl: 'https://images.unsplash.com/photo-1563770660941-20978e870e26?w=200&auto=format&fit=crop&q=80', websiteUrl: 'https://www.apc.com', description: 'Uninterruptible power supply (UPS) systems, server racks, and critical power infrastructure.', category: 'Manufacturer', isFeatured: true, orderPosition: 1, isActive: true },
  { id: 3, name: 'Huawei Solar', slug: 'huawei-solar', logoUrl: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=200&auto=format&fit=crop&q=80', websiteUrl: 'https://solar.huawei.com', description: 'Commercial & industrial string inverters and Smart String ESS battery systems.', category: 'Solar Equipment', isFeatured: true, orderPosition: 2, isActive: true },
  { id: 4, name: 'ABB Group', slug: 'abb-group', logoUrl: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=200&auto=format&fit=crop&q=80', websiteUrl: 'https://www.abb.com', description: 'Industrial automation, drives, switchgear, and power distribution equipment.', category: 'Technology Partner', isFeatured: true, orderPosition: 3, isActive: true },
  { id: 5, name: 'Eaton Corporation', slug: 'eaton', logoUrl: 'https://images.unsplash.com/photo-1620228885847-9eab2a1adddc?w=200&auto=format&fit=crop&q=80', websiteUrl: 'https://www.eaton.com', description: 'Power management solutions including UPS, PDUs, and power distribution systems.', category: 'Manufacturer', isFeatured: true, orderPosition: 4, isActive: true },
  { id: 6, name: 'Cisco Systems', slug: 'cisco', logoUrl: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=200&auto=format&fit=crop&q=80', websiteUrl: 'https://www.cisco.com', description: 'Enterprise networking, switching, routing, and cybersecurity solutions.', category: 'ICT Partner', isFeatured: false, orderPosition: 5, isActive: true },
]

const MOCK_RESOURCES = [
  { id: 1, title: 'GlobalSpec Solutions Enterprise Profile 2026', slug: 'globalspec-company-profile-2026', category: 'Company Profile', description: 'Full official company overview, engineering team credentials, and project portfolio.', fileUrl: '/docs/Globalspec-Solutions-profile-2020.pdf', fileSize: '4.2 MB', isFeatured: true, isActive: true, createdAt: new Date() },
  { id: 2, title: 'Struxureware Data Centre Architecture Blueprint', slug: 'struxureware-dcim-blueprint', category: 'Datasheet', description: 'Technical specifications for DCIM environmental and power monitoring implementations.', fileUrl: '/docs/Struxureware-DCIM-Guide.pdf', fileSize: '2.8 MB', isFeatured: true, isActive: true, createdAt: new Date() },
  { id: 3, title: 'Solar Energy ROI Calculator Guide', slug: 'solar-roi-calculator', category: 'Whitepaper', description: 'Step-by-step guide to calculating return on investment for commercial solar installations.', fileUrl: '/docs/Solar-ROI-Guide.pdf', fileSize: '1.5 MB', isFeatured: false, isActive: true, createdAt: new Date() },
]

const MOCK_PRODUCTS = [
  {
    id: 1,
    slug: 'apc-smart-ups-10kva',
    name: 'APC Smart-UPS 10kVA Online Double Conversion',
    sku: 'GSS-UPS-001',
    description: 'Enterprise-grade 10kVA / 8kW online double-conversion UPS with SNMP card, LCD display, and extended runtime battery module for data centers and server rooms.',
    categoryId: 1,
    price: '485000.00',
    salePrice: '449000.00',
    imageUrl: 'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=800&auto=format&fit=crop&q=80',
    features: 'Online Double Conversion, Extended Battery Module, SNMP/Web Management, LCD Display, Hot-Swap Batteries',
    specifications: JSON.stringify({ Power: '10kVA / 8kW', Input: '220-240V AC 50Hz', 'Battery Type': 'VRLA Sealed Lead Acid', Runtime: 'Up to 15 min at full load', Dimensions: '132H x 440W x 680D mm', Weight: '68 kg' }),
    stockStatus: 'in_stock',
    isFeatured: true,
    orderPosition: 0,
    isActive: true,
  },
  {
    id: 2,
    slug: 'eaton-9px-20kva-ups',
    name: 'Eaton 9PX 20kVA Tower/Rack UPS System',
    sku: 'GSS-UPS-002',
    description: 'High-density 20kVA Eaton 9PX UPS with advanced battery management, lithium-ion option, and integrated bypass for mission-critical applications.',
    categoryId: 1,
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
    id: 3,
    slug: 'hv-switchgear-panel-11kv',
    name: 'HV Switchgear Panel 11kV Metal-Clad',
    sku: 'GSS-SWGR-003',
    description: 'Factory-assembled 11kV metal-clad switchgear panel with vacuum circuit breakers, protection relays, and bus-bar system for industrial substations.',
    categoryId: 1,
    price: '3800000.00',
    salePrice: '3500000.00',
    imageUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&auto=format&fit=crop&q=80',
    features: 'Vacuum Circuit Breakers, Numerical Protection Relays, SF6 Insulated Bus Bars, Anti-condensation Heaters',
    specifications: JSON.stringify({ Voltage: '11kV', Current: 'Up to 1250A', 'Short Circuit': '25kA for 3 seconds', Standard: 'IEC 62271-200' }),
    stockStatus: 'in_stock',
    isFeatured: false,
    orderPosition: 2,
    isActive: true,
  },
  {
    id: 4,
    slug: 'schneider-netshelter-sx-42u-rack',
    name: 'Schneider Electric NetShelter SX 42U Server Rack',
    sku: 'GSS-RACK-005',
    description: 'Industry-standard 42U server rack enclosure with high airflow perforated doors, side panels, roof and base routing with cable management options.',
    categoryId: 2,
    price: '220000.00',
    imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80',
    features: 'High Airflow Perforated Doors, Cable Management, Side Panels, Adjustable Mounting Rails, Locking Doors',
    specifications: JSON.stringify({ 'Rack Units': '42U', Height: '1991mm', Width: '600mm', Depth: '1070mm', Weight: '86 kg' }),
    stockStatus: 'in_stock',
    isFeatured: true,
    orderPosition: 4,
    isActive: true,
  },
  {
    id: 5,
    slug: 'struxureware-dcim-suite',
    name: 'Schneider EcoStruxure IT DCIM Suite License',
    sku: 'GSS-DCIM-006',
    description: 'Full EcoStruxure IT Data Centre Infrastructure Management suite with power monitoring, environmental sensors, and remote management dashboard.',
    categoryId: 2,
    price: '2800000.00',
    salePrice: '2500000.00',
    imageUrl: 'https://images.unsplash.com/photo-1563770660941-20978e870e26?w=800&auto=format&fit=crop&q=80',
    features: 'Real-time Power Monitoring, Environmental Sensors, Asset Management, Capacity Planning',
    specifications: JSON.stringify({ Nodes: 'Up to 1000 managed nodes', Integration: 'API, SNMP, Modbus' }),
    stockStatus: 'in_stock',
    isFeatured: true,
    orderPosition: 5,
    isActive: true,
  },
  {
    id: 6,
    slug: 'commercial-solar-50kw-system',
    name: 'Commercial Solar PV System 50kWp Turnkey',
    sku: 'GSS-SLR-009',
    description: 'Complete 50kWp rooftop solar installation with Tier-1 monocrystalline panels, hybrid inverter, and lithium battery storage.',
    categoryId: 3,
    price: '4800000.00',
    salePrice: '4500000.00',
    imageUrl: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&auto=format&fit=crop&q=80',
    features: 'Tier-1 Mono Solar Panels, 50kW Hybrid Inverter, 100kWh Lithium Battery, Grid-Tie & Backup',
    specifications: JSON.stringify({ Capacity: '50kWp', Panels: '112x 450W Monocrystalline', Inverter: 'Huawei SUN2000 50KTL' }),
    stockStatus: 'in_stock',
    isFeatured: true,
    orderPosition: 8,
    isActive: true,
  },
  {
    id: 7,
    slug: 'huawei-sun2000-10kw-inverter',
    name: 'Huawei SUN2000-10KTL-M1 Smart String Inverter',
    sku: 'GSS-INV-010',
    description: 'Huawei 10kW smart string inverter with built-in smart monitoring, arc fault circuit protection, and compatibility with LUNA2000 battery storage system.',
    categoryId: 3,
    price: '185000.00',
    salePrice: '168000.00',
    imageUrl: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&auto=format&fit=crop&q=80',
    features: 'Smart String Technology, Built-in PID Recovery, Arc Fault Protection, IP65',
    specifications: JSON.stringify({ Power: '10kW', Efficiency: '98.6%', Protection: 'IP65' }),
    stockStatus: 'in_stock',
    isFeatured: true,
    orderPosition: 9,
    isActive: true,
  },
  {
    id: 8,
    slug: 'cisco-catalyst-9300-48p',
    name: 'Cisco Catalyst 9300 48-Port PoE+ Switch',
    sku: 'GSS-NET-007',
    description: '48-port Gigabit PoE+ enterprise access switch with 4x10G SFP+ uplinks and Cisco DNA Center management compatibility.',
    categoryId: 2,
    price: '580000.00',
    salePrice: '520000.00',
    imageUrl: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&auto=format&fit=crop&q=80',
    features: '48x1G PoE+, 4x10G SFP+ Uplinks, 802.3bt Support',
    specifications: JSON.stringify({ Ports: '48x GE PoE+', 'Switching Capacity': '592 Gbps' }),
    stockStatus: 'in_stock',
    isFeatured: false,
    orderPosition: 6,
    isActive: true,
  },
]

// ─── QUERY FUNCTIONS WITH AUTOMATIC MOCK DUMMY DB FALLBACK ─────────────────────

// Hero Slides
export async function getHeroSlides() {
  try {
    const res = await db.select().from(heroSlides).where(eq(heroSlides.isActive, true)).orderBy(heroSlides.orderPosition)
    if (res && res.length > 0) return res
    return MOCK_HERO_SLIDES
  } catch {
    return MOCK_HERO_SLIDES
  }
}

// Categories
export async function getProductCategories() {
  try {
    const res = await db.select().from(productCategories).where(eq(productCategories.isActive, true)).orderBy(productCategories.orderPosition)
    if (res && res.length > 0) return res
    return MOCK_CATEGORIES
  } catch {
    return MOCK_CATEGORIES
  }
}

export async function getCategoryBySlug(slug: string) {
  try {
    const res = await db.select().from(productCategories).where(eq(productCategories.slug, slug)).limit(1)
    if (res && res[0]) return res[0]
    return MOCK_CATEGORIES.find((c) => c.slug === slug) || null
  } catch {
    return MOCK_CATEGORIES.find((c) => c.slug === slug) || null
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

    const query = db.select().from(products).where(and(...conditions)).orderBy(products.orderPosition)

    const res = params?.limit ? await query.limit(params.limit) : await query
    if (res && res.length > 0) return res

    // Mock filtering fallback
    let mockRes = MOCK_PRODUCTS
    if (categoryIdToUse) {
      mockRes = mockRes.filter((p) => p.categoryId === categoryIdToUse)
    }
    if (params?.search) {
      const q = params.search.toLowerCase()
      mockRes = mockRes.filter((p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q))
    }
    if (params?.limit) {
      mockRes = mockRes.slice(0, params.limit)
    }
    return mockRes
  } catch {
    let mockRes = MOCK_PRODUCTS
    let categoryIdToUse = params?.categoryId
    if (params?.categorySlug && !categoryIdToUse) {
      const cat = MOCK_CATEGORIES.find((c) => c.slug === params.categorySlug)
      if (cat) categoryIdToUse = cat.id
    }
    if (categoryIdToUse) {
      mockRes = mockRes.filter((p) => p.categoryId === categoryIdToUse)
    }
    if (params?.search) {
      const q = params.search.toLowerCase()
      mockRes = mockRes.filter((p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q))
    }
    if (params?.limit) {
      mockRes = mockRes.slice(0, params.limit)
    }
    return mockRes
  }
}

export async function getProductBySlug(slug: string) {
  try {
    const res = await db.select().from(products).where(eq(products.slug, slug)).limit(1)
    if (res && res[0]) return res[0]
    return MOCK_PRODUCTS.find((p) => p.slug === slug) || null
  } catch {
    return MOCK_PRODUCTS.find((p) => p.slug === slug) || null
  }
}

// Brands
export async function getBrands() {
  try {
    const res = await db.select().from(brands).where(eq(brands.isActive, true)).orderBy(brands.orderPosition)
    if (res && res.length > 0) return res
    return MOCK_BRANDS
  } catch {
    return MOCK_BRANDS
  }
}

// Departments
export async function getDepartments() {
  try {
    const res = await db.select().from(departments).where(eq(departments.isActive, true)).orderBy(departments.orderPosition)
    if (res && res.length > 0) return res
    return MOCK_DEPARTMENTS
  } catch {
    return MOCK_DEPARTMENTS
  }
}

export async function getDepartmentBySlug(slug: string) {
  try {
    const res = await db.select().from(departments).where(eq(departments.slug, slug)).limit(1)
    if (res && res[0]) return res[0]
    return MOCK_DEPARTMENTS.find((d) => d.slug === slug) || null
  } catch {
    return MOCK_DEPARTMENTS.find((d) => d.slug === slug) || null
  }
}

// Product departments (many-to-many)
export async function getProductDepartments(productId: number) {
  try {
    const links = await db.select().from(productDepartments).where(eq(productDepartments.productId, productId))
    if (links.length === 0) return []
    const ids = links.map((l) => l.departmentId)
    return await db.select().from(departments).where(and(inArray(departments.id, ids), eq(departments.isActive, true)))
  } catch {
    return []
  }
}

export async function getProductsByDepartment(departmentSlug: string) {
  try {
    const dep = await getDepartmentBySlug(departmentSlug)
    if (!dep) return []
    const links = await db.select().from(productDepartments).where(eq(productDepartments.departmentId, dep.id))
    if (links.length === 0) return []
    const ids = links.map((l) => l.productId)
    return await db
      .select()
      .from(products)
      .where(and(inArray(products.id, ids), eq(products.isActive, true)))
      .orderBy(products.orderPosition)
  } catch {
    return []
  }
}

// Dynamic product specifications
export async function getProductSpecs(productId: number) {
  try {
    const res = await db.select().from(productSpecs).where(eq(productSpecs.productId, productId)).orderBy(productSpecs.orderPosition)
    return res || []
  } catch {
    return []
  }
}

// Solutions & Services
export async function getSolutions() {
  try {
    const res = await db.select().from(solutions).where(eq(solutions.isActive, true)).orderBy(solutions.orderPosition)
    if (res && res.length > 0) return res
    return MOCK_SOLUTIONS
  } catch {
    return MOCK_SOLUTIONS
  }
}

export async function getSolutionById(id: number) {
  try {
    const res = await db.select().from(solutions).where(eq(solutions.id, id)).limit(1)
    if (res && res[0]) return res[0]
    return MOCK_SOLUTIONS.find((s) => s.id === id) || null
  } catch {
    return MOCK_SOLUTIONS.find((s) => s.id === id) || null
  }
}

export async function getServices() {
  try {
    const res = await db.select().from(services).where(eq(services.isActive, true)).orderBy(services.orderPosition)
    if (res && res.length > 0) return res
    return MOCK_SERVICES
  } catch {
    return MOCK_SERVICES
  }
}

export async function getServiceBySlug(slug: string) {
  try {
    const res = await db.select().from(services).where(eq(services.slug, slug)).limit(1)
    if (res && res[0]) return res[0]
    return MOCK_SERVICES.find((s) => s.slug === slug) || null
  } catch {
    return MOCK_SERVICES.find((s) => s.slug === slug) || null
  }
}

export async function getClients() {
  try {
    const res = await db.select().from(clients).where(eq(clients.isActive, true)).orderBy(clients.orderPosition)
    if (res && res.length > 0) return res
    return []
  } catch {
    return []
  }
}

export async function getTeamMembers() {
  try {
    const res = await db.select().from(teamMembers).where(eq(teamMembers.isActive, true)).orderBy(teamMembers.orderPosition)
    if (res && res.length > 0) return res
    return []
  } catch {
    return []
  }
}

// Industries
export async function getIndustries() {
  try {
    const res = await db.select().from(industries).where(eq(industries.isActive, true)).orderBy(industries.orderPosition)
    if (res && res.length > 0) return res
    return MOCK_INDUSTRIES
  } catch {
    return MOCK_INDUSTRIES
  }
}

// Partners
export async function getPartners() {
  try {
    const res = await db.select().from(partners).where(eq(partners.isActive, true)).orderBy(partners.orderPosition)
    if (res && res.length > 0) return res
    return MOCK_PARTNERS
  } catch {
    return MOCK_PARTNERS
  }
}

// Resources / Downloads
export async function getResources(category?: string) {
  try {
    const res = category
      ? await db.select().from(resources).where(and(eq(resources.isActive, true), eq(resources.category, category))).orderBy(desc(resources.createdAt))
      : await db.select().from(resources).where(eq(resources.isActive, true)).orderBy(desc(resources.createdAt))
    if (res && res.length > 0) return res
    return category ? MOCK_RESOURCES.filter((r) => r.category === category) : MOCK_RESOURCES
  } catch {
    return category ? MOCK_RESOURCES.filter((r) => r.category === category) : MOCK_RESOURCES
  }
}

// Quote Requests
export async function getQuoteRequests() {
  try {
    const res = await db.select().from(quoteRequests).orderBy(desc(quoteRequests.createdAt))
    return res || []
  } catch {
    return []
  }
}

// Site Settings Key-Value Map
export async function getSiteSettings(): Promise<Record<string, string>> {
  try {
    const rows = await db.select().from(siteSettings)
    const settingsMap = { ...MOCK_SITE_SETTINGS }

    if (rows && rows.length > 0) {
      for (const row of rows) {
        settingsMap[row.settingKey] = row.settingValue
      }
    }

    return settingsMap
  } catch {
    return MOCK_SITE_SETTINGS
  }
}

// ─── CHECKOUT CONFIG (configurable via admin settings) ────────────────────────

export interface DeliveryMethod {
  id: string
  name: string
  cost: number
  note?: string
}

export interface PaymentMethod {
  id: string
  name: string
  instructions?: string
}

function parseJsonArray(value: string | undefined, fallback: any[]): any[] {
  if (!value) return fallback
  try {
    const parsed = JSON.parse(value)
    return Array.isArray(parsed) ? parsed : fallback
  } catch {
    return fallback
  }
}

export async function getDeliveryMethods(): Promise<DeliveryMethod[]> {
  const settings = await getSiteSettings()
  const fallback = parseJsonArray(MOCK_SITE_SETTINGS.delivery_methods, [])
  return parseJsonArray(settings.delivery_methods, fallback)
}

export async function getPaymentMethods(): Promise<PaymentMethod[]> {
  const settings = await getSiteSettings()
  const fallback = parseJsonArray(MOCK_SITE_SETTINGS.payment_methods, [])
  return parseJsonArray(settings.payment_methods, fallback)
}

// ─── CUSTOMERS & ACCOUNTS ──────────────────────────────────────────────────────

export async function getCustomerByEmail(email: string) {
  if (!email) return null
  try {
    const rows = await db.select().from(customers).where(eq(customers.email, email))
    return rows[0] || null
  } catch {
    return null
  }
}

export async function getCustomerByUser(userId: string) {
  if (!userId) return null
  try {
    const rows = await db.select().from(customers).where(eq(customers.userId, userId))
    return rows[0] || null
  } catch {
    return null
  }
}

export async function getCustomerById(id: number) {
  try {
    const rows = await db.select().from(customers).where(eq(customers.id, id))
    return rows[0] || null
  } catch {
    return null
  }
}

export async function getOrCreateCustomer(input: {
  userId?: string | null
  name: string
  email: string
  phone?: string | null
  company?: string | null
}) {
  const existing = await getCustomerByEmail(input.email)
  if (existing) {
    if (!existing.userId && input.userId) {
      await db.update(customers).set({ userId: input.userId }).where(eq(customers.id, existing.id))
    }
    return existing
  }
  const [inserted] = await db
    .insert(customers)
    .values({
      userId: input.userId || null,
      name: input.name,
      email: input.email,
      phone: input.phone || null,
      company: input.company || null,
    })
  const id = inserted.insertId
  const [row] = await db.select().from(customers).where(eq(customers.id, id))
  return row
}

export async function getCustomerAddresses(customerId: number) {
  try {
    const rows = await db
      .select()
      .from(customerAddresses)
      .where(eq(customerAddresses.customerId, customerId))
      .orderBy(desc(customerAddresses.isDefault))
    return rows || []
  } catch {
    return []
  }
}

export async function getOrdersByCustomer(customerId: number) {
  try {
    const rows = await db
      .select()
      .from(orders)
      .where(eq(orders.customerId, customerId))
      .orderBy(desc(orders.createdAt))
    return rows || []
  } catch {
    return []
  }
}

export async function getOrdersByEmail(email: string) {
  try {
    const rows = await db
      .select()
      .from(orders)
      .where(eq(orders.customerEmail, email))
      .orderBy(desc(orders.createdAt))
    return rows || []
  } catch {
    return []
  }
}

export async function getOrderItemsByOrderId(orderId: number) {
  try {
    const rows = await db
      .select()
      .from(orderItems)
      .where(eq(orderItems.orderId, orderId))
    return rows || []
  } catch {
    return []
  }
}

export async function getQuotesByCustomer(customerId: number) {
  try {
    const rows = await db
      .select()
      .from(quoteRequests)
      .where(eq(quoteRequests.customerId, customerId))
      .orderBy(desc(quoteRequests.createdAt))
    return rows || []
  } catch {
    return []
  }
}

export async function getQuotesByEmail(email: string) {
  try {
    const rows = await db
      .select()
      .from(quoteRequests)
      .where(eq(quoteRequests.customerEmail, email))
      .orderBy(desc(quoteRequests.createdAt))
    return rows || []
  } catch {
    return []
  }
}

export async function getQuoteItemsByQuoteId(quoteId: number) {
  try {
    const rows = await db
      .select()
      .from(quoteItems)
      .where(eq(quoteItems.quoteRequestId, quoteId))
    return rows || []
  } catch {
    return []
  }
}
