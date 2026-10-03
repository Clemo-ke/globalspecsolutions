'use client'

import React, { useState, useCallback } from 'react'
import Link from 'next/link'
import {
  LayoutDashboard,
  Package,
  FolderTree,
  ShoppingBag,
  MessageSquare,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Plus,
  Edit2,
  Trash2,
  ChevronDown,
  FileText,
  TrendingUp,
  Users,
  AlertCircle,
  CheckCircle2,
  Clock,
  Save,
  RefreshCw,
  Eye,
  Star,
  Zap,
  Lightbulb,
  Images,
  Check,
  PackageMinus,
  Ticket,
  BarChart3,
  Monitor,
  Building2,
  Factory,
  Briefcase,
  Globe2,
  Newspaper,
  ShieldCheck,
  UserCog,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Calendar,
  Search,
  PieChart,
  Bell,
  Boxes,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { signOutAction } from '@/app/actions/auth'
import { CategoryIcon } from '@/components/category-icon'
import { InventoryManager } from '@/components/admin/inventory-manager'
import { CustomersManager } from '@/components/admin/customers-manager'
import { CouponsManager } from '@/components/admin/coupons-manager'
import { MediaManager } from '@/components/admin/media-manager'
import { AnalyticsView } from '@/components/admin/analytics-view'
import { ContentManager, EntityConfig } from '@/components/admin/content-manager'
import { UsersManager } from '@/components/admin/users-manager'
import { RolesManager } from '@/components/admin/roles-manager'
import { ResourcesManager } from '@/components/admin/resources-manager'
import {
  AreaTrendChart,
  DonutShareChart,
  Sparkline,
  TrendPoint,
  DonutSegment,
  fmtKES,
} from '@/components/admin/admin-charts'

// â”€â”€â”€ Types â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
interface AdminDashboardClientProps {
  stats: {
    totalOrders: number
    totalInquiries: number
    totalProducts: number
    totalCategories: number
    totalQuotes?: number
    totalSolutions?: number
    totalHeroSlides?: number
  }
  recentOrders: any[]
  recentMessages: any[]
  recentQuotes?: any[]
  productsList: any[]
  categoriesList: any[]
  servicesList?: any[]
  solutionsList?: any[]
  partnersList?: any[]
  resourcesList?: any[]
  industriesList?: any[]
  heroSlidesList?: any[]
  brandsList?: any[]
  departmentsList?: any[]
  productDepartmentsList?: any[]
  productSpecsList?: any[]
  quoteItemsList?: any[]
  orderItemsList?: any[]
  customersList?: any[]
  couponsList?: any[]
  mediaList?: any[]
  usersList?: any[]
  rolesList?: any[]
  projectsList?: any[]
  applicationsList?: any[]
  pagesList?: any[]
  currentUserId?: string | null
  canManageRoles?: boolean
  settingsMap: Record<string, string>
}

// â”€â”€â”€ Status Badge Colours â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function orderStatusColor(status: string) {
  switch (status) {
    case 'Pending': return 'bg-amber-50 text-amber-700 border-amber-200'
    case 'Confirmed': return 'bg-blue-50 text-blue-700 border-blue-200'
    case 'Processing': return 'bg-purple-50 text-purple-700 border-purple-200'
    case 'Shipped': return 'bg-orange-50 text-orange-700 border-orange-200'
    case 'Delivered': return 'bg-cyan-50 text-cyan-700 border-cyan-200'
    case 'Completed': return 'bg-emerald-50 text-emerald-700 border-emerald-200'
    case 'Cancelled': return 'bg-red-50 text-red-700 border-red-200'
    case 'New': return 'bg-blue-50 text-blue-700 border-blue-200'
    case 'Contacted': return 'bg-purple-50 text-purple-700 border-purple-200'
    default: return 'bg-gray-100 text-gray-600 border-gray-200'
  }
}

const ORDER_STATUSES = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Completed', 'Cancelled']
const PAYMENT_STATUSES = ['Pending', 'Paid', 'Failed', 'Refunded', 'Partially Refunded']

function paymentStatusColor(status: string) {
  switch (status) {
    case 'Paid': return 'border-emerald-300 text-emerald-700'
    case 'Refunded': return 'border-red-300 text-red-700'
    case 'Partially Refunded': return 'border-orange-300 text-orange-700'
    case 'Failed': return 'border-red-300 text-red-700'
    default: return 'border-amber-300 text-amber-700'
  }
}

function msgStatusColor(status: string) {
  switch (status) {
    case 'New': return 'bg-blue-50 text-blue-700 border-blue-200'
    case 'Read': return 'bg-gray-100 text-gray-600 border-gray-200'
    case 'Replied': return 'bg-emerald-50 text-emerald-700 border-emerald-200'
    case 'Archived': return 'bg-red-50 text-red-700 border-red-200'
    default: return 'bg-gray-100 text-gray-600 border-gray-200'
  }
}

const QUOTE_STATUSES = ['New', 'Under Review', 'Quotation Sent', 'Negotiating', 'Approved', 'Rejected', 'Expired', 'Converted to Order']

function quoteBadgeColor(status: string) {
  switch (status) {
    case 'New': return 'bg-blue-50 text-blue-700 border-blue-200'
    case 'Under Review': return 'bg-amber-50 text-amber-700 border-amber-200'
    case 'Quotation Sent': return 'bg-purple-50 text-purple-700 border-purple-200'
    case 'Negotiating': return 'bg-orange-50 text-orange-700 border-orange-200'
    case 'Approved': return 'bg-emerald-50 text-emerald-700 border-emerald-200'
    case 'Converted to Order': return 'bg-emerald-50 text-emerald-700 border-emerald-200'
    case 'Rejected': return 'bg-red-50 text-red-700 border-red-200'
    case 'Expired': return 'bg-red-50 text-red-700 border-red-200'
    default: return 'bg-gray-100 text-gray-600 border-gray-200'
  }
}

function stockBadge(status: string) {
  switch (status) {
    case 'in_stock': return 'bg-emerald-50 text-emerald-700 border-emerald-200'
    case 'available_on_order': return 'bg-amber-50 text-amber-700 border-amber-200'
    case 'out_of_stock': return 'bg-red-50 text-red-700 border-red-200'
    default: return 'bg-gray-100 text-gray-600 border-gray-200'
  }
}

// â”€â”€â”€ Input component â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">{label}</label>
      {children}
    </div>
  )
}

const inputCls = 'w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-gray-900 text-xs focus:ring-2 focus:ring-primary focus:outline-none placeholder:text-gray-400'
const selectCls = 'w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-gray-900 text-xs focus:ring-2 focus:ring-primary focus:outline-none'

// â”€â”€â”€ Content manager configs â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function activeBadge(item: any) {
  return item.isActive !== false ? null : <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-gray-100 text-gray-400">disabled</span>
}

const BRAND_CONFIG: EntityConfig = {
  api: '/api/admin/brands',
  slug: 'brands',
  title: 'Brands',
  label: 'Brand',
  fields: [
    { key: 'name', label: 'Brand name', required: true },
    { key: 'logoUrl', label: 'Logo URL', type: 'url' },
    { key: 'websiteUrl', label: 'Website URL', type: 'url' },
    { key: 'description', label: 'Description', type: 'textarea', colSpan: 3 },
  ],
  columns: ['Brand', 'Logo', 'Description'],
  emptyMessage: 'No brands yet. OEM partner brands will appear here.',
  renderCell: (item, col) => {
    if (col === 'Brand') return <span className="flex items-center gap-2">{item.name} <span className="text-[9px] text-slate-500 font-normal">/{item.slug}</span></span>
    if (col === 'Logo') return item.logoUrl ? <img src={item.logoUrl} alt={item.name} className="h-6 w-6 object-contain" /> : <span className="text-slate-600">â€”</span>
    return <span className="max-w-[240px] block truncate">{item.description || 'â€”'}</span>
  },
  badge: activeBadge,
}

const DEPT_CONFIG: EntityConfig = {
  api: '/api/admin/departments',
  slug: 'departments',
  title: 'Departments',
  label: 'Department',
  fields: [
    { key: 'name', label: 'Department name', required: true },
    { key: 'icon', label: 'Icon name' },
    { key: 'mainFunction', label: 'Main function', type: 'textarea', colSpan: 2 },
    { key: 'description', label: 'Description', type: 'textarea', colSpan: 2 },
    { key: 'capabilities', label: 'Capabilities (comma-separated)', type: 'textarea', colSpan: 3 },
    { key: 'imageUrl', label: 'Image URL', type: 'url' },
  ],
  columns: ['Department', 'Main function', 'Capabilities'],
  emptyMessage: 'No departments yet.',
  renderCell: (item, col) => {
    if (col === 'Department') return <span>{item.name} <span className="text-[9px] text-slate-500 font-normal">/{item.slug}</span></span>
    if (col === 'Main function') return <span className="max-w-[240px] block truncate">{item.mainFunction || 'â€”'}</span>
    return <span className="max-w-[200px] block truncate">{item.capabilities || 'â€”'}</span>
  },
  badge: activeBadge,
}

const INDUSTRY_CONFIG: EntityConfig = {
  api: '/api/admin/industries',
  slug: 'industries',
  title: 'Industries',
  label: 'Industry',
  fields: [
    { key: 'name', label: 'Industry name', required: true },
    { key: 'icon', label: 'Icon name' },
    { key: 'description', label: 'Description', type: 'textarea', colSpan: 2 },
    { key: 'imageUrl', label: 'Image URL', type: 'url' },
  ],
  columns: ['Industry', 'Description', 'Icon'],
  emptyMessage: 'No industries yet.',
  renderCell: (item, col) => {
    if (col === 'Industry') return <span>{item.name} <span className="text-[9px] text-slate-500 font-normal">/{item.slug}</span></span>
    if (col === 'Description') return <span className="max-w-[280px] block truncate">{item.description || 'â€”'}</span>
    return <span>{item.icon || 'â€”'}</span>
  },
  badge: activeBadge,
}

const RESOURCE_CONFIG: EntityConfig = {
  api: '/api/admin/resources',
  slug: 'resources',
  title: 'Insights & Resources',
  label: 'Resource',
  fields: [
    { key: 'title', label: 'Title', required: true },
    { key: 'category', label: 'Category', type: 'select', required: true, options: ['Datasheet', 'Whitepaper', 'Case Study', 'Manual', 'Brochure', 'News'] },
    { key: 'fileUrl', label: 'File URL', type: 'url', required: true },
    { key: 'fileSize', label: 'File size' },
    { key: 'thumbnailUrl', label: 'Thumbnail URL', type: 'url' },
    { key: 'description', label: 'Description', type: 'textarea', colSpan: 4 },
  ],
  columns: ['Resource', 'Category', 'File'],
  emptyMessage: 'No resources yet. Add datasheets, whitepapers or case studies.',
  renderCell: (item, col) => {
    if (col === 'Resource') return <span>{item.title} {item.isFeatured && <span className="text-[9px] font-bold text-primary ml-1">FEATURED</span>}</span>
    if (col === 'Category') return item.category
    return item.fileUrl ? <a href={item.fileUrl} target="_blank" className="text-primary hover:underline">{item.fileSize || 'Open'}</a> : 'â€”'
  },
  badge: activeBadge,
}

const PROJECT_CONFIG: EntityConfig = {
  api: '/api/admin/projects',
  slug: 'projects',
  title: 'Projects / Case Studies',
  label: 'Project',
  fields: [
    { key: 'title', label: 'Project title', required: true },
    { key: 'clientName', label: 'Client name' },
    { key: 'location', label: 'Location' },
    { key: 'status', label: 'Status', type: 'select', options: ['Completed', 'Ongoing', 'Upcoming'] },
    { key: 'year', label: 'Year' },
    { key: 'description', label: 'Description', type: 'textarea', colSpan: 2 },
    { key: 'imageUrl', label: 'Image URL', type: 'url' },
  ],
  columns: ['Project', 'Client', 'Location', 'Status'],
  emptyMessage: 'No projects yet. Showcase delivered work here.',
  renderCell: (item, col) => {
    if (col === 'Project') return <span>{item.title}</span>
    if (col === 'Client') return item.clientName || 'â€”'
    if (col === 'Location') return item.location || 'â€”'
    return <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${item.status === 'Completed' ? 'border-emerald-200 text-emerald-700' : item.status === 'Ongoing' ? 'border-amber-200 text-amber-700' : 'border-gray-200 text-gray-600'}`}>{item.status}</span>
  },
  badge: activeBadge,
}

const APPLICATION_CONFIG: EntityConfig = {
  api: '/api/admin/applications',
  slug: 'applications',
  title: 'Applications',
  label: 'Application',
  fields: [
    { key: 'name', label: 'Application name', required: true },
    { key: 'icon', label: 'Icon name' },
    { key: 'description', label: 'Description', type: 'textarea', colSpan: 2 },
    { key: 'imageUrl', label: 'Image URL', type: 'url' },
  ],
  columns: ['Application', 'Description', 'Icon'],
  emptyMessage: 'No applications yet.',
  renderCell: (item, col) => {
    if (col === 'Application') return <span>{item.name} <span className="text-[9px] text-slate-500 font-normal">/{item.slug}</span></span>
    if (col === 'Description') return <span className="max-w-[280px] block truncate">{item.description || 'â€”'}</span>
    return <span>{item.icon || 'â€”'}</span>
  },
  badge: activeBadge,
}

const PAGE_CONFIG: EntityConfig = {
  api: '/api/admin/pages',
  slug: 'pages',
  title: 'Custom Pages & SEO',
  label: 'Page',
  fields: [
    { key: 'title', label: 'Page title', required: true },
    { key: 'content', label: 'Content (HTML/markdown)', type: 'textarea', colSpan: 4, required: true, placeholder: 'Body content for this pageâ€¦' },
    { key: 'metaTitle', label: 'Meta title' },
    { key: 'metaDescription', label: 'Meta description', type: 'textarea', colSpan: 2 },
    { key: 'ogImage', label: 'OG image URL', type: 'url' },
    { key: 'canonicalUrl', label: 'Canonical URL', type: 'url' },
  ],
  columns: ['Page', 'Slug', 'Meta title'],
  emptyMessage: 'No custom pages yet. Manage landing pages and SEO metadata here.',
  renderCell: (item, col) => {
    if (col === 'Page') return <span>{item.title} {item.metaTitle && <span className="text-[9px] text-slate-500 font-normal ml-1">SEO ready</span>}</span>
    if (col === 'Slug') return <span className="font-mono text-[10px] text-slate-500">/{item.slug}</span>
    return <span className="max-w-[240px] block truncate">{item.metaTitle || 'â€”'}</span>
  },
  badge: activeBadge,
}

// â”€â”€â”€ Component â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export function AdminDashboardClient({
  stats,
  recentOrders,
  recentMessages,
  recentQuotes = [],
  productsList,
  categoriesList,
  servicesList = [],
  solutionsList = [],
  partnersList = [],
  resourcesList = [],
  industriesList = [],
  heroSlidesList = [],
  brandsList = [],
  departmentsList = [],
  productDepartmentsList = [],
  productSpecsList = [],
  quoteItemsList = [],
  orderItemsList = [],
  customersList = [],
  couponsList = [],
  mediaList = [],
  usersList = [],
  rolesList = [],
  projectsList = [],
  applicationsList = [],
  pagesList = [],
  currentUserId = null,
  canManageRoles = false,
  settingsMap,
}: AdminDashboardClientProps) {
  type Tab = 'overview' | 'orders' | 'products' | 'categories' | 'services' | 'solutions' | 'hero' | 'partners' | 'messages' | 'quotes' | 'settings' | 'inventory' | 'customers' | 'coupons' | 'media' | 'analytics' | 'brands' | 'departments' | 'industries' | 'resources' | 'projects' | 'applications' | 'pages' | 'users' | 'roles'
  const [activeTab, setActiveTab] = useState<Tab>('overview')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({ sales: true, catalog: false, cms: false, people: false, system: false })

  const [selectedOrder, setSelectedOrder] = useState<any>(null)

  // Auto-expand the sidebar group that contains the active tab
  React.useEffect(() => {
    const groupMap: Record<Tab, string> = {
      overview: '', orders: 'sales', quotes: 'sales', messages: 'sales', customers: 'sales', coupons: 'sales', analytics: 'sales',
      products: 'catalog', categories: 'catalog', brands: 'catalog', inventory: 'catalog', applications: 'catalog',
      hero: 'cms', services: 'cms', solutions: 'cms', partners: 'cms', departments: 'cms', industries: 'cms', projects: 'cms', resources: 'cms', pages: 'cms', media: 'cms',
      users: 'people', roles: 'people',
      settings: 'system',
    }
    const group = groupMap[activeTab]
    if (group) setExpandedGroups((prev) => ({ ...prev, [group]: true }))
  }, [activeTab])
  const [settings, setSettings] = useState(settingsMap)
  const [savingSettings, setSavingSettings] = useState(false)
  const [saveNotice, setSaveNotice] = useState('')

  // â”€â”€ Local lists (mutated optimistically) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const [localProducts, setLocalProducts] = useState<any[]>(productsList)
  const [localCategories, setLocalCategories] = useState<any[]>(categoriesList)
  const [localOrders, setLocalOrders] = useState<any[]>(recentOrders)
  const [localMessages, setLocalMessages] = useState<any[]>(recentMessages)
  const [localPartners, setLocalPartners] = useState<any[]>(partnersList)
  const [localSolutions, setLocalSolutions] = useState<any[]>(solutionsList)
  const [localHeroSlides, setLocalHeroSlides] = useState<any[]>(heroSlidesList)
  const [localQuotes, setLocalQuotes] = useState<any[]>(recentQuotes)

  // â”€â”€ Modal visibility â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const [showProductModal, setShowProductModal] = useState(false)
  const [showCategoryModal, setShowCategoryModal] = useState(false)
  const [showServiceModal, setShowServiceModal] = useState(false)
  const [showSolutionModal, setShowSolutionModal] = useState(false)
  const [showPartnerModal, setShowPartnerModal] = useState(false)
  const [showHeroModal, setShowHeroModal] = useState(false)
  const [showEditProductModal, setShowEditProductModal] = useState(false)
  const [showEditCategoryModal, setShowEditCategoryModal] = useState(false)
  const [showEditSolutionModal, setShowEditSolutionModal] = useState(false)
  const [showEditPartnerModal, setShowEditPartnerModal] = useState(false)
  const [showEditHeroModal, setShowEditHeroModal] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<{ type: string; id: number; name: string } | null>(null)
  const [refundFor, setRefundFor] = useState<any>(null)
  const [refundAmount, setRefundAmount] = useState('')
  const [refundReason, setRefundReason] = useState('')
  const [refunding, setRefunding] = useState(false)
  const [creating, setCreating] = useState(false)
  const [saving, setSaving] = useState(false)
  const [notice, setNotice] = useState<{ text: string; ok: boolean } | null>(null)

  // â”€â”€ Create forms â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const emptyProduct = { name: '', price: '', salePrice: '', costPrice: '', currency: 'KES', sku: '', brandId: '', shortDescription: '', description: '', categoryId: '', imageUrl: '', purchaseType: 'buy_online', stockQuantity: '', lowStockThreshold: '5', stockStatus: 'in_stock', isFeatured: false, features: '', specs: [{ label: '', value: '' }], departmentIds: [] as number[] }
  const emptyCategory = { name: '', slug: '', description: '', icon: '', color: '#2563eb', imageUrl: '' }
  const emptyService = { name: '', icon: 'Server', description: '', details: '', imageUrl: '' }
  const emptySolution = { title: '', description: '', benefits: '', imageUrl: '' }
  const emptyPartner = { name: '', category: 'Technology Partner', websiteUrl: '', description: '', logoUrl: '', isFeatured: true }
  const emptyHeroSlide = { title: '', subtitle: '', badge: '', description: '', imageUrl: '', ctaText: 'Explore Products', ctaLink: '/shop', orderPosition: 0, isActive: true }

  const [newProduct, setNewProduct] = useState(emptyProduct)
  const [newCategory, setNewCategory] = useState(emptyCategory)
  const [newService, setNewService] = useState(emptyService)
  const [newSolution, setNewSolution] = useState(emptySolution)
  const [newPartner, setNewPartner] = useState(emptyPartner)
  const [newHeroSlide, setNewHeroSlide] = useState(emptyHeroSlide)

  // â”€â”€ Edit forms â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const [editProduct, setEditProduct] = useState<any>(null)
  const [editCategory, setEditCategory] = useState<any>(null)
  const [editSolution, setEditSolution] = useState<any>(null)
  const [editPartner, setEditPartner] = useState<any>(null)
  const [editHeroSlide, setEditHeroSlide] = useState<any>(null)



  // â”€â”€ Filters / Search â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const [productSearch, setProductSearch] = useState('')
  const [overviewChartRange, setOverviewChartRange] = useState<'7' | '30' | 'all'>('30')
  const [overviewOrderSearch, setOverviewOrderSearch] = useState('')
  const [orderStatusFilter, setOrderStatusFilter] = useState('All')
  // shared accordion state for modules
  const [activeAccordion, setActiveAccordion] = useState<{section:string, id:number|null}>({section:'', id:null})
  const handleAccordionChange = (section:string, id:number|null) => {
    setActiveAccordion(prev => ({ section, id }))
  }
  const [quoteStatusFilter, setQuoteStatusFilter] = useState('All')
  const [expandedQuote, setExpandedQuote] = useState<number | null>(null)
  const [convertingQuote, setConvertingQuote] = useState<number | null>(null)

  // â”€â”€ Helper â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const flash = (msg: string, ok = true) => {
    setNotice({ text: msg, ok })
    setTimeout(() => setNotice(null), 3500)
  }

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (url: string) => void,
    folder = 'uploads'
  ) => {
    const file = e.target.files?.[0]
    if (!file) return
    e.target.value = ''
    flash('Uploading image…')
    try {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('folder', folder)
      const res = await fetch('/api/admin/upload', { method: 'POST', body: fd })
      const data = await res.json()
      if (!res.ok) { flash(data.error || 'Upload failed', false); return }
      setter(data.url)
      flash('Image uploaded ✓')
    } catch {
      flash('Image upload failed', false)
    }
  }

  // â”€â”€â”€ Settings save â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault()
    setSavingSettings(true)
    setSaveNotice('')
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      })
      setSaveNotice(res.ok ? 'Settings updated successfully!' : 'Failed to update settings.')
      setTimeout(() => setSaveNotice(''), 3000)
    } finally {
      setSavingSettings(false)
    }
  }

  // â”€â”€â”€ Create product â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    setCreating(true)
    try {
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'product', ...newProduct }),
      })
      if (res.ok) {
        setShowProductModal(false)
        setNewProduct(emptyProduct)
        flash('Product created successfully')
        window.location.reload()
      } else {
        flash('Failed to create product', false)
      }
    } finally {
      setCreating(false)
    }
  }

  // â”€â”€â”€ Edit product â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const handleEditProduct = (prod: any) => {
    const linkDepts = productDepartmentsList.filter((l: any) => l.productId === prod.id).map((l: any) => l.departmentId)
    const existingSpecs = productSpecsList
      .filter((s: any) => s.productId === prod.id)
      .sort((a: any, b: any) => (a.orderPosition || 0) - (b.orderPosition || 0))
      .map((s: any) => ({ label: s.label, value: s.value }))
    setEditProduct({
      ...prod,
      stockQuantity: prod.stockQuantity ?? '',
      lowStockThreshold: prod.lowStockThreshold ?? '5',
      costPrice: prod.costPrice || '',
      brandId: prod.brandId || '',
      purchaseType: prod.purchaseType || 'buy_online',
      specs: existingSpecs.length ? existingSpecs : [{ label: '', value: '' }],
      departmentIds: linkDepts,
    })
    setShowEditProductModal(true)
  }

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch(`/api/admin/products/${editProduct.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editProduct),
      })
      if (res.ok) {
        setLocalProducts((prev: any[]) => prev.map((p: any) => (p.id === editProduct.id ? { ...p, ...editProduct } : p)))
        setShowEditProductModal(false)
        flash('Product updated successfully')
      } else {
        flash('Failed to update product', false)
      }
    } finally {
      setSaving(false)
    }
  }

  // â”€â”€â”€ Create category â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault()
    setCreating(true)
    try {
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'category', ...newCategory }),
      })
      if (res.ok) {
        setShowCategoryModal(false)
        setNewCategory(emptyCategory)
        flash('Category created')
        window.location.reload()
      } else {
        flash('Failed to create category', false)
      }
    } finally {
      setCreating(false)
    }
  }

  // â”€â”€â”€ Edit category â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const handleEditCategory = (cat: any) => {
    setEditCategory({ ...cat })
    setShowEditCategoryModal(true)
  }

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch(`/api/admin/categories/${editCategory.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editCategory),
      })
      if (res.ok) {
        setLocalCategories((prev: any[]) => prev.map((c: any) => (c.id === editCategory.id ? { ...c, ...editCategory } : c)))
        setShowEditCategoryModal(false)
        flash('Category updated')
      } else {
        flash('Failed to update category', false)
      }
    } finally {
      setSaving(false)
    }
  }

  // â”€â”€â”€ Create service â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const handleCreateService = async (e: React.FormEvent) => {
    e.preventDefault()
    setCreating(true)
    try {
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'service', ...newService }),
      })
      if (res.ok) {
        setShowServiceModal(false)
        setNewService(emptyService)
        flash('Service created')
        window.location.reload()
      }
    } finally {
      setCreating(false)
    }
  }

  // â”€â”€â”€ Create solution â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const handleCreateSolution = async (e: React.FormEvent) => {
    e.preventDefault()
    setCreating(true)
    try {
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'solution', ...newSolution }),
      })
      if (res.ok) {
        setShowSolutionModal(false)
        setNewSolution(emptySolution)
        flash('Solution created')
        window.location.reload()
      }
    } finally {
      setCreating(false)
    }
  }

  // â”€â”€â”€ Edit solution â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const handleEditSolution = (sol: any) => {
    setEditSolution({ ...sol })
    setShowEditSolutionModal(true)
  }

  const handleSaveSolution = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch(`/api/admin/solutions/${editSolution.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editSolution),
      })
      if (res.ok) {
        setLocalSolutions((prev: any[]) => prev.map((s: any) => (s.id === editSolution.id ? { ...s, ...editSolution } : s)))
        setShowEditSolutionModal(false)
        flash('Solution updated')
      } else {
        flash('Failed to update solution', false)
      }
    } finally {
      setSaving(false)
    }
  }

  // â”€â”€â”€ Create partner â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const handleCreatePartner = async (e: React.FormEvent) => {
    e.preventDefault()
    setCreating(true)
    try {
      const res = await fetch('/api/admin/partners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPartner),
      })
      if (res.ok) {
        setShowPartnerModal(false)
        setNewPartner(emptyPartner)
        flash('Partner created')
        window.location.reload()
      } else {
        const data = await res.json().catch(() => ({}))
        flash(data.error || 'Failed to create partner', false)
      }
    } catch (err: any) {
      flash(err.message || 'Failed to create partner', false)
    } finally {
      setCreating(false)
    }
  }

  // â”€â”€â”€ Edit partner â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const handleEditPartner = (ptn: any) => {
    setEditPartner({ ...ptn })
    setShowEditPartnerModal(true)
  }

  const handleSavePartner = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch(`/api/admin/partners/${editPartner.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editPartner),
      })
      if (res.ok) {
        setLocalPartners((prev: any[]) => prev.map((p: any) => (p.id === editPartner.id ? { ...p, ...editPartner } : p)))
        setShowEditPartnerModal(false)
        flash('Partner updated')
      } else {
        const data = await res.json().catch(() => ({}))
        flash(data.error || 'Failed to update partner', false)
      }
    } catch (err: any) {
      flash(err.message || 'Failed to update partner', false)
    } finally {
      setSaving(false)
    }
  }

  // â”€â”€â”€ Hero Slide Handlers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const handleCreateHeroSlide = async (e: React.FormEvent) => {
    e.preventDefault()
    setCreating(true)
    try {
      const res = await fetch('/api/admin/hero-slides', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newHeroSlide),
      })
      if (res.ok) {
        setShowHeroModal(false)
        setNewHeroSlide(emptyHeroSlide)
        flash('Hero slide created')
        const refresh = await fetch('/api/admin/hero-slides')
        if (refresh.ok) setLocalHeroSlides(await refresh.json())
      } else {
        flash('Failed to create hero slide', false)
      }
    } finally {
      setCreating(false)
    }
  }

  const handleEditHeroSlide = (slide: any) => {
    setEditHeroSlide({ ...slide })
    setShowEditHeroModal(true)
  }

  const handleSaveEditHeroSlide = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch(`/api/admin/hero-slides/${editHeroSlide.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editHeroSlide),
      })
      if (res.ok) {
        setLocalHeroSlides((prev: any[]) => prev.map((s: any) => (s.id === editHeroSlide.id ? { ...s, ...editHeroSlide } : s)))
        setShowEditHeroModal(false)
        flash('Hero slide updated')
      } else {
        flash('Failed to update hero slide', false)
      }
    } finally {
      setSaving(false)
    }
  }

  // â”€â”€â”€ Delete handler â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const handleDelete = async () => {
    if (!showDeleteConfirm) return
    setSaving(true)
    try {
      let url = ''
      if (showDeleteConfirm.type === 'product') url = `/api/admin/products/${showDeleteConfirm.id}`
      if (showDeleteConfirm.type === 'category') url = `/api/admin/categories/${showDeleteConfirm.id}`
      if (showDeleteConfirm.type === 'solution') url = `/api/admin/solutions/${showDeleteConfirm.id}`
      if (showDeleteConfirm.type === 'partner') url = `/api/admin/partners/${showDeleteConfirm.id}`
      if (showDeleteConfirm.type === 'hero_slide') url = `/api/admin/hero-slides/${showDeleteConfirm.id}`

      const res = await fetch(url, { method: 'DELETE' })
      if (res.ok) {
        if (showDeleteConfirm.type === 'product')
          setLocalProducts((prev: any[]) => prev.filter((p: any) => p.id !== showDeleteConfirm.id))
        if (showDeleteConfirm.type === 'category')
          setLocalCategories((prev: any[]) => prev.filter((c: any) => c.id !== showDeleteConfirm.id))
        if (showDeleteConfirm.type === 'solution')
          setLocalSolutions((prev: any[]) => prev.filter((s: any) => s.id !== showDeleteConfirm.id))
        if (showDeleteConfirm.type === 'partner')
          setLocalPartners((prev: any[]) => prev.filter((p: any) => p.id !== showDeleteConfirm.id))
        if (showDeleteConfirm.type === 'hero_slide')
          setLocalHeroSlides((prev: any[]) => prev.filter((h: any) => h.id !== showDeleteConfirm.id))
        flash(`${showDeleteConfirm.name} deleted`)
      } else {
        flash('Delete failed', false)
      }
    } finally {
      setSaving(false)
      setShowDeleteConfirm(null)
    }
  }



// â”€â”€â”€ Order status update â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const handleOrderStatusChange = async (orderId: number, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      if (res.ok) {
        setLocalOrders((prev: any[]) => prev.map((o: any) => (o.id === orderId ? { ...o, status: newStatus } : o)))
        flash(`Order status updated to ${newStatus}`)
      }
    } catch {
        flash('Failed to update order status', false)
    }
  }

  // â”€â”€â”€ Order payment status update â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const handlePaymentStatusChange = async (orderId: number, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentStatus: newStatus }),
      })
      if (res.ok) {
        setLocalOrders((prev: any[]) => prev.map((o: any) => (o.id === orderId ? { ...o, paymentStatus: newStatus } : o)))
        flash('Payment status updated')
      } else {
        flash('Failed to update payment status', false)
      }
    } catch {
      flash('Failed to update payment status', false)
    }
  }

  // â”€â”€â”€ Order refund â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const openRefundModal = (ord: any) => {
    setRefundFor(ord)
    setRefundAmount('')
    setRefundReason('')
  }

  const handleRefund = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!refundFor) return
    setRefunding(true)
    try {
      const res = await fetch(`/api/admin/orders/${refundFor.id}/refund`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: refundAmount, reason: refundReason }),
      })
      const data = await res.json()
      if (res.ok) {
        const newRefunded = Number(refundFor.refundedAmount || 0) + Number(refundAmount)
        const total = Number(refundFor.total || 0)
        const paymentStatus = Math.abs(newRefunded - total) < 0.01 ? 'Refunded' : 'Partially Refunded'
        setLocalOrders((prev: any[]) => prev.map((o: any) => (o.id === refundFor.id ? { ...o, refundedAmount: newRefunded.toFixed(2), paymentStatus } : o)))
        setRefundFor(null)
        flash(data.message || `Refund recorded`)
      } else {
        flash(data.error || 'Failed to record refund', false)
      }
    } catch {
      flash('Failed to record refund', false)
    } finally {
      setRefunding(false)
    }
  }

  // â”€â”€â”€ Message status update / delete â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const handleMessageStatusChange = async (messageId: number, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/messages/${messageId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      if (res.ok) {
        setLocalMessages((prev: any[]) => prev.map((m: any) => (m.id === messageId ? { ...m, status: newStatus } : m)))
        flash(`Message marked ${newStatus}`)
      } else {
        flash('Failed to update message', false)
      }
    } catch {
      flash('Failed to update message', false)
    }
  }

  const handleMessageDelete = async (messageId: number) => {
    try {
      const res = await fetch(`/api/admin/messages/${messageId}`, { method: 'DELETE' })
      if (res.ok) {
        setLocalMessages((prev: any[]) => prev.filter((m: any) => m.id !== messageId))
        flash('Message deleted')
      } else {
        flash('Failed to delete message', false)
      }
    } catch {
      flash('Failed to delete message', false)
    }
  }

  // â”€â”€â”€ Quote status update â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const handleQuoteStatusChange = async (quoteId: number, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/quotes/${quoteId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      if (res.ok) {
        setLocalQuotes((prev: any[]) => prev.map((q: any) => (q.id === quoteId ? { ...q, status: newStatus } : q)))
        flash(`Quote status updated to ${newStatus}`)
      } else {
        flash('Failed to update quote status', false)
      }
    } catch {
      flash('Failed to update quote status', false)
    }
  }

  // â”€â”€â”€ Convert quote to order â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const handleConvertToOrder = async (quote: any) => {
    setConvertingQuote(quote.id)
    try {
      const res = await fetch(`/api/admin/quotes/${quote.id}/convert`, { method: 'POST' })
      const data = await res.json()
      if (res.ok) {
        setLocalQuotes((prev: any[]) => prev.map((q: any) => (q.id === quote.id ? { ...q, status: 'Converted to Order' } : q)))
        flash(`Quote converted â€” order ${data.orderNumber} created`)
      } else {
        flash(data.error || 'Failed to convert quote', false)
      }
    } catch {
      flash('Failed to convert quote', false)
    } finally {
      setConvertingQuote(null)
    }
  }

  // â”€â”€â”€ Filtered data â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const filteredProducts = localProducts.filter((p: any) => {
    const s = productSearch.toLowerCase()
    return !s || p.name?.toLowerCase().includes(s) || p.sku?.toLowerCase().includes(s) || p.description?.toLowerCase().includes(s)
  })

  const filteredOrders = orderStatusFilter === 'All'
    ? localOrders
    : localOrders.filter((o: any) => o.status === orderStatusFilter)

  const filteredQuotes = quoteStatusFilter === 'All'
    ? localQuotes
    : localQuotes.filter((q: any) => q.status === quoteStatusFilter)

  const quoteItemsByQuote = quoteItemsList.reduce((acc: Record<number, any[]>, item: any) => {
    const key = item.quoteRequestId
    if (!acc[key]) acc[key] = []
    acc[key].push(item)
    return acc
  }, {})

  // â”€â”€â”€ Revenue calc â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const totalRevenue = localOrders
    .filter((o: any) => o.status !== 'Cancelled')
    .reduce((sum: number, o: any) => sum + parseFloat(o.total || '0'), 0)

  const inventoryLowCount = localProducts.filter((p: any) => {
    const s = p.stockStatus
    if (s === 'out_of_stock') return true
    if (s === 'in_stock') return (p.stockQuantity ?? 0) <= (p.lowStockThreshold ?? 5)
    return false
  }).length

  // â”€â”€â”€ NavLink helper â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const NavBtn = ({ tab, icon, label, count }: { tab: Tab; icon: React.ReactNode; label: string; count?: number }) => (
    <button
      onClick={() => { setActiveTab(tab); setSidebarOpen(false) }}
      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all text-xs font-medium ${
        activeTab === tab
          ? 'bg-primary/10 text-primary font-semibold'
          : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
      }`}
    >
      <span className="flex items-center gap-2.5">{icon}{label}</span>
      {count !== undefined && count > 0 && (
        <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${
          activeTab === tab ? 'bg-primary/20 text-primary' : 'bg-gray-100 text-gray-400'
        }`}>{count}</span>
      )}
    </button>
  )

  const NavGroup = ({ label, icon, groupKey, children, expandedGroups, setExpandedGroups }: { label: string; icon: React.ReactNode; groupKey: string; children: React.ReactNode; expandedGroups: Record<string, boolean>; setExpandedGroups: React.Dispatch<React.SetStateAction<Record<string, boolean>>> }) => {
    const open = expandedGroups[groupKey]
    return (
      <div className="mt-1">
        <button
          onClick={() => setExpandedGroups((prev) => {
            const isOpen = prev[groupKey]
            // close all groups, then toggle this one — accordion behaviour
            const next: Record<string, boolean> = {}
            Object.keys(prev).forEach((k) => { next[k] = false })
            next[groupKey] = !isOpen
            return next
          })}
          className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-[11px] font-semibold text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-all uppercase tracking-wider"
        >
          <span className="flex items-center gap-2">{icon}{label}</span>
          <ChevronDown className={`w-3 h-3 transition-transform ${open ? 'rotate-180' : ''}`} />
        </button>
        {open && <div className="ml-2 pl-3 border-l border-gray-100 space-y-0.5 mt-0.5">{children}</div>}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col md:flex-row">
      {/* â”€â”€ Mobile top bar â”€â”€ */}
      <div className="md:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-40 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
            <LayoutDashboard className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-sm text-gray-900">GSS Admin</span>
        </div>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500">
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* â”€â”€ Sidebar â”€â”€ */}
      <aside className={`${sidebarOpen ? 'flex' : 'hidden'} md:flex flex-col w-full md:w-56 bg-white border-r border-gray-100 shrink-0 sticky top-0 h-screen overflow-y-auto`}>
        {/* Logo */}
        <div className="px-5 py-5 border-b border-gray-100">
          <Link href="/admin" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center shadow-sm">
              <LayoutDashboard className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="font-bold text-sm text-gray-900 leading-none">GSS Admin</div>
              <div className="text-[10px] text-gray-400 mt-0.5">Dashboard</div>
            </div>
          </Link>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          <NavBtn tab="overview" icon={<LayoutDashboard className="w-4 h-4" />} label="Overview" />

          {/* â”€â”€ Sales â”€â”€ */}
          <NavGroup label="Sales" icon={<ShoppingBag className="w-4 h-4" />} groupKey="sales" expandedGroups={expandedGroups} setExpandedGroups={setExpandedGroups}>
            <NavBtn tab="orders" icon={<ShoppingBag className="w-4 h-4" />} label="Orders" count={localOrders.length} />
            <NavBtn tab="quotes" icon={<FileText className="w-4 h-4" />} label="Quotes" count={recentQuotes.length} />
            <NavBtn tab="messages" icon={<MessageSquare className="w-4 h-4" />} label="Inquiries" count={localMessages.length} />
            <NavBtn tab="customers" icon={<Users className="w-4 h-4" />} label="Customers" count={customersList.length} />
            <NavBtn tab="coupons" icon={<Ticket className="w-4 h-4" />} label="Coupons" count={couponsList.length} />
            <NavBtn tab="analytics" icon={<BarChart3 className="w-4 h-4" />} label="Analytics" />
          </NavGroup>

          {/* â”€â”€ Catalog â”€â”€ */}
          <NavGroup label="Catalog" icon={<Package className="w-4 h-4" />} groupKey="catalog" expandedGroups={expandedGroups} setExpandedGroups={setExpandedGroups}>
            <NavBtn tab="inventory" icon={<Package className="w-4 h-4" />} label="Products & Inventory" count={localProducts.length} />
            <NavBtn tab="categories" icon={<FolderTree className="w-4 h-4" />} label="Categories" count={localCategories.length} />
            <NavBtn tab="brands" icon={<Building2 className="w-4 h-4" />} label="Brands" count={brandsList.length} />
            <NavBtn tab="applications" icon={<Globe2 className="w-4 h-4" />} label="Applications" count={applicationsList.length} />
          </NavGroup>

          {/* â”€â”€ CMS â”€â”€ */}
          <NavGroup label="CMS" icon={<Images className="w-4 h-4" />} groupKey="cms" expandedGroups={expandedGroups} setExpandedGroups={setExpandedGroups}>
            <NavBtn tab="hero" icon={<Images className="w-4 h-4" />} label="Hero Carousel" count={localHeroSlides.length} />
            <NavBtn tab="services" icon={<TrendingUp className="w-4 h-4" />} label="Services" count={servicesList.length} />
            <NavBtn tab="solutions" icon={<Zap className="w-4 h-4" />} label="Solutions" count={localSolutions.length} />
            <NavBtn tab="partners" icon={<Users className="w-4 h-4" />} label="Partners" count={localPartners.length} />
            <NavBtn tab="departments" icon={<Factory className="w-4 h-4" />} label="Departments" count={departmentsList.length} />
            <NavBtn tab="industries" icon={<Briefcase className="w-4 h-4" />} label="Industries" count={industriesList.length} />
            <NavBtn tab="projects" icon={<Lightbulb className="w-4 h-4" />} label="Projects" count={projectsList.length} />
            <NavBtn tab="resources" icon={<Newspaper className="w-4 h-4" />} label="Resources" count={resourcesList.length} />
            <NavBtn tab="pages" icon={<FileText className="w-4 h-4" />} label="Pages & SEO" count={pagesList.length} />
            <NavBtn tab="media" icon={<Monitor className="w-4 h-4" />} label="Media" count={mediaList.length} />
          </NavGroup>

          {/* â”€â”€ People â”€â”€ */}
          <NavGroup label="People" icon={<UserCog className="w-4 h-4" />} groupKey="people" expandedGroups={expandedGroups} setExpandedGroups={setExpandedGroups}>
            <NavBtn tab="users" icon={<UserCog className="w-4 h-4" />} label="Users" count={usersList.length} />
            <NavBtn tab="roles" icon={<ShieldCheck className="w-4 h-4" />} label="Roles" count={rolesList.length} />
          </NavGroup>

          {/* â”€â”€ System â”€â”€ */}
          <NavGroup label="System" icon={<Settings className="w-4 h-4" />} groupKey="system" expandedGroups={expandedGroups} setExpandedGroups={setExpandedGroups}>
            <NavBtn tab="settings" icon={<Settings className="w-4 h-4" />} label="Settings" />
          </NavGroup>
        </nav>

        {/* Sidebar footer */}
        <div className="px-3 py-4 border-t border-gray-100 space-y-1">
          <Link href="/" target="_blank" className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-all font-medium">
            <ExternalLink className="w-3.5 h-3.5" /> View Site
          </Link>
          <Link href="/shop" target="_blank" className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-all font-medium">
            <ExternalLink className="w-3.5 h-3.5" /> View Shop
          </Link>
          <form action={signOutAction}>
            <button type="submit" className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-red-500 hover:text-red-600 hover:bg-red-50 transition-all font-medium">
              <LogOut className="w-3.5 h-3.5" /> Sign Out
            </button>
          </form>
        </div>
      </aside>

      {/* â”€â”€ Main Content â”€â”€ */}
      <main className="flex-1 min-h-screen bg-gray-50/50 overflow-y-auto overflow-x-hidden">
        {/* Page header */}
        <div className="bg-white border-b border-gray-100 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sticky top-0 z-30">
          <div>
            <h1 className="text-base font-bold text-gray-900">
              {activeTab === 'overview' && 'Overview'}
              {activeTab === 'orders' && 'Orders'}
              {activeTab === 'inventory' && 'Products & Inventory'}
              {activeTab === 'customers' && 'Customers'}
              {activeTab === 'coupons' && 'Coupons'}
              {activeTab === 'products' && 'Product Catalog'}
              {activeTab === 'categories' && 'Categories'}
              {activeTab === 'services' && 'Services'}
              {activeTab === 'solutions' && 'Solutions'}
              {activeTab === 'partners' && 'Partners'}
              {activeTab === 'brands' && 'Brands'}
              {activeTab === 'departments' && 'Departments'}
              {activeTab === 'industries' && 'Industries'}
              {activeTab === 'projects' && 'Projects'}
              {activeTab === 'applications' && 'Applications'}
              {activeTab === 'resources' && 'Resources'}
              {activeTab === 'pages' && 'Pages & SEO'}
              {activeTab === 'users' && 'Users'}
              {activeTab === 'roles' && 'Roles'}
              {activeTab === 'messages' && 'Inquiries'}
              {activeTab === 'quotes' && 'Quotes'}
              {activeTab === 'analytics' && 'Analytics'}
              {activeTab === 'media' && 'Media'}
              {activeTab === 'settings' && 'Settings'}
            </h1>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {(activeTab === 'inventory' || activeTab === 'overview') && (
              <Button onClick={() => setShowProductModal(true)} size="sm" className="bg-primary hover:bg-primary/90 text-xs font-semibold gap-1.5 h-8">
                <Plus className="w-3.5 h-3.5" /> Add Product
              </Button>
            )}
            {activeTab === 'categories' && (
              <Button onClick={() => setShowCategoryModal(true)} size="sm" className="bg-primary hover:bg-primary/90 text-xs font-semibold gap-1.5 h-8">
                <Plus className="w-3.5 h-3.5" /> Add Category
              </Button>
            )}
            {activeTab === 'services' && (
              <Button onClick={() => setShowServiceModal(true)} size="sm" className="bg-primary hover:bg-primary/90 text-xs font-semibold gap-1.5 h-8">
                <Plus className="w-3.5 h-3.5" /> Add Service
              </Button>
            )}
            {activeTab === 'solutions' && (
              <Button onClick={() => setShowSolutionModal(true)} size="sm" className="bg-primary hover:bg-primary/90 text-xs font-semibold gap-1.5 h-8">
                <Plus className="w-3.5 h-3.5" /> Add Solution
              </Button>
            )}
            {activeTab === 'partners' && (
              <Button onClick={() => setShowPartnerModal(true)} size="sm" className="bg-primary hover:bg-primary/90 text-xs font-semibold gap-1.5 h-8">
                <Plus className="w-3.5 h-3.5" /> Add Partner
              </Button>
            )}
          </div>
        </div>

        <div className="p-6 space-y-6">
        {notice && (
          <div className={`fixed top-4 right-4 z-[100] flex items-center gap-2 text-xs font-semibold px-4 py-3 rounded-xl shadow-lg border animate-fadeInUp ${
            notice.ok ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-red-50 border-red-200 text-red-700'
          }`}>
            {notice.ok ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
            {notice.text}
          </div>
        )}

        {/* Refund modal */}
        {refundFor && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <form onSubmit={handleRefund} className="bg-white border border-gray-200 rounded-2xl p-6 w-full max-w-md space-y-4 shadow-xl">
              <h3 className="text-sm font-black text-gray-900">Refund order {refundFor.orderNumber}</h3>
              <p className="text-xs text-gray-500">
                Order total KES {Number(refundFor.total).toLocaleString()} Â· Already refunded KES {Number(refundFor.refundedAmount || 0).toLocaleString()} Â· Remaining KES {(Number(refundFor.total) - Number(refundFor.refundedAmount || 0)).toLocaleString()}
              </p>
              <Field label="Refund amount (KES)">
                <input type="number" required min="0.01" step="0.01" value={refundAmount} onChange={(e) => setRefundAmount(e.target.value)} className={inputCls} placeholder="0.00" />
              </Field>
              <Field label="Reason (optional)">
                <input type="text" value={refundReason} onChange={(e) => setRefundReason(e.target.value)} className={inputCls} placeholder="e.g. Customer requested cancellation" />
              </Field>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button type="button" onClick={() => setRefundFor(null)} className="text-xs font-bold px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50">Cancel</button>
                <button type="submit" disabled={refunding} className="inline-flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-500 disabled:opacity-50">
                  {refunding ? 'Processingâ€¦' : 'Record Refund'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ══════════════════ TAB: OVERVIEW ════════════════════════════════ */}
        {activeTab === 'overview' && (() => {
          const PALETTE = ['#2563eb', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4']
          const pMap: Record<number, any> = {}
          localProducts.forEach((p: any) => { pMap[p.id] = p })
          const catTotals: Record<string, number> = {}
          orderItemsList.forEach((it: any) => {
            const p = it.productId != null ? pMap[it.productId] : null
            const cat = p?.categoryId != null ? localCategories.find((c: any) => c.id === p.categoryId)?.name || 'General' : 'General'
            catTotals[cat] = (catTotals[cat] || 0) + parseFloat(it.totalPrice || '0')
          })
          const catSegments: DonutSegment[] = Object.entries(catTotals).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([label, value], i) => ({ label, value, color: PALETTE[i] }))
          if (catSegments.length === 0) localCategories.slice(0, 4).forEach((c: any, i: number) => catSegments.push({ label: c.name, value: 120000 * (4 - i), color: PALETTE[i] }))

          const buckets14: Record<string, { revenue: number; orders: number }> = {}
          localOrders.forEach((o: any) => {
            const d = o.createdAt ? new Date(o.createdAt) : null
            if (!d || isNaN(d.getTime())) return
            const k = d.toISOString().slice(0, 10)
            if (!buckets14[k]) buckets14[k] = { revenue: 0, orders: 0 }
            if (o.status !== 'Cancelled') buckets14[k].revenue += parseFloat(o.total || '0')
            buckets14[k].orders += 1
          })
          const now = new Date()
          const trendPts: TrendPoint[] = []
          for (let i = 13; i >= 0; i--) {
            const d = new Date(now.getTime() - i * 86400000)
            const k = d.toISOString().slice(0, 10)
            const lbl = d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
            const b = buckets14[k] || { revenue: 0, orders: 0 }
            trendPts.push({ date: k, label: lbl, value: b.revenue, secondaryValue: b.orders })
          }

          const revSpk = trendPts.slice(-10).map(p => p.value)
          const ordSpk = trendPts.slice(-10).map(p => p.secondaryValue || 0)
          const pendingQuotesCount = recentQuotes.filter((q: any) => q.status === 'New' || q.status === 'Under Review').length
          const newMsgCount = localMessages.filter((m: any) => m.status === 'New').length
          const convRate = recentQuotes.length > 0
            ? ((recentQuotes.filter((q: any) => q.status === 'Converted to Order').length / recentQuotes.length) * 100).toFixed(1) : '0'

          const pendingAlerts = [
            ...localMessages.filter((m: any) => m.status === 'New').slice(0, 3).map((m: any) => ({ type: 'inquiry', label: `Inquiry from ${m.name || 'Unknown'}`, sub: m.subject || m.email || '' })),
            ...recentQuotes.filter((q: any) => q.status === 'New' || q.status === 'Under Review').slice(0, 3).map((q: any) => ({ type: 'quote', label: `Quote #${q.quoteNumber} pending`, sub: q.customerName || '' })),
            ...localProducts.filter((p: any) => p.stockStatus === 'out_of_stock').slice(0, 2).map((p: any) => ({ type: 'stock', label: `${p.name} out of stock`, sub: `SKU: ${p.sku || 'N/A'}` })),
            ...localProducts.filter((p: any) => p.stockStatus === 'in_stock' && (p.stockQuantity ?? 0) <= (p.lowStockThreshold ?? 5)).slice(0, 2).map((p: any) => ({ type: 'low', label: `${p.name} — low stock`, sub: `${p.stockQuantity} units left` })),
          ].slice(0, 7)

          return (
            <div className="space-y-5">
              {/* KPI Strip */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {([
                  { label: 'Total Revenue', value: fmtKES(totalRevenue), sub: `${localOrders.length} orders`, sparkData: revSpk, color: '#2563eb', tc: 'text-primary' },
                  { label: 'Products', value: String(localProducts.length), sub: `${localCategories.length} categories`, sparkData: [], color: '#f59e0b', tc: 'text-amber-500' },
                  { label: 'Open Inquiries', value: String(newMsgCount), sub: `${pendingQuotesCount} quotes pending`, sparkData: ordSpk, color: '#8b5cf6', tc: 'text-violet-600' },
                  { label: 'Quote → Order', value: `${convRate}%`, sub: `${recentQuotes.filter((q: any) => q.status === 'Converted to Order').length} converted`, sparkData: [], color: '#10b981', tc: 'text-emerald-600' },
                ] as any[]).map((kpi, idx) => (
                  <div key={idx} className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">{kpi.label}</div>
                    <div className={`text-2xl font-black ${kpi.tc}`}>{kpi.value}</div>
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
                      <span className="text-[10px] text-gray-400">{kpi.sub}</span>
                      {kpi.sparkData.length > 1 && <Sparkline data={kpi.sparkData} color={kpi.color} height={22} />}
                    </div>
                  </div>
                ))}
              </div>

              {/* Status mini strip */}
              <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                {(['Pending', 'Confirmed', 'Processing', 'Shipped', 'Completed', 'Cancelled'] as const).map((s) => {
                  const cnt = localOrders.filter((o: any) => o.status === s).length
                  return (
                    <button key={s} onClick={() => setActiveTab('orders')} className={`p-2.5 rounded-xl border text-center hover:opacity-80 transition-opacity ${orderStatusColor(s)}`}>
                      <div className="text-xl font-black">{cnt}</div>
                      <div className="text-[10px] font-bold">{s}</div>
                    </button>
                  )
                })}
              </div>

              {/* Trend + Donut row */}
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
                <div className="lg:col-span-3 bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-sm font-black text-gray-900">Revenue — Last 14 Days</h3>
                      <p className="text-[11px] text-gray-400 mt-0.5">Hover bars for daily values</p>
                    </div>
                    <button onClick={() => setActiveTab('analytics')} className="text-xs font-bold text-primary hover:underline">Full Analytics →</button>
                  </div>
                  <AreaTrendChart
                    data={trendPts.length > 1 ? trendPts : [{ date: '2026-09-28', label: 'Sep 28', value: 0, secondaryValue: 0 }, { date: '2026-10-02', label: 'Oct 2', value: totalRevenue, secondaryValue: localOrders.length }]}
                    valueFormatter={fmtKES}
                    secondaryLabel="Orders"
                    secondaryFormatter={(v) => `${v} orders`}
                    color="#2563eb"
                    secondaryColor="#10b981"
                    height={210}
                    showSecondary
                  />
                </div>
                <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
                  <h3 className="text-sm font-black text-gray-900 mb-4">Revenue by Category</h3>
                  <DonutShareChart segments={catSegments} centerLabel="Revenue" centerValue={fmtKES(totalRevenue)} valueFormatter={fmtKES} size={160} />
                </div>
              </div>

              {/* Alerts + Recent orders */}
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
                <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
                  <h3 className="text-sm font-black text-gray-900 flex items-center gap-2 mb-3">
                    <Bell className="w-4 h-4 text-amber-500" /> Action Required
                    {pendingAlerts.length > 0 && <span className="ml-auto text-[10px] font-bold bg-red-500 text-white px-1.5 py-0.5 rounded-full">{pendingAlerts.length}</span>}
                  </h3>
                  {pendingAlerts.length === 0
                    ? <p className="text-xs text-gray-400 py-6 text-center">✓ No pending actions</p>
                    : <div className="space-y-2">{pendingAlerts.map((a: any, i: number) => (
                      <div key={i} className={`flex items-start gap-2.5 p-2.5 rounded-xl border text-xs ${a.type === 'inquiry' ? 'bg-blue-50 border-blue-200' : a.type === 'quote' ? 'bg-violet-50 border-violet-200' : a.type === 'stock' ? 'bg-red-50 border-red-200' : 'bg-amber-50 border-amber-200'}`}>
                        <span className={`mt-1 w-2 h-2 rounded-full shrink-0 ${a.type === 'inquiry' ? 'bg-blue-500' : a.type === 'quote' ? 'bg-violet-500' : a.type === 'stock' ? 'bg-red-500' : 'bg-amber-500'}`} />
                        <div className="min-w-0"><div className="font-semibold text-gray-800 truncate">{a.label}</div><div className="text-[10px] text-gray-500 truncate">{a.sub}</div></div>
                      </div>
                    ))}</div>
                  }
                </div>
                <div className="lg:col-span-3 bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-black text-gray-900 flex items-center gap-2"><ShoppingBag className="w-4 h-4 text-primary" /> Recent Orders</h3>
                    <button onClick={() => setActiveTab('orders')} className="text-xs font-bold text-primary hover:underline">View All →</button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead><tr className="text-[10px] text-gray-400 uppercase font-bold border-b border-gray-100">
                        <th className="pb-2 text-left">Order</th><th className="pb-2 text-left">Customer</th><th className="pb-2 text-right">Amount</th><th className="pb-2 pl-3 text-left">Status</th>
                      </tr></thead>
                      <tbody className="divide-y divide-gray-50">
                        {localOrders.slice(0, 7).map((ord: any) => (
                          <tr key={ord.id} onClick={() => setSelectedOrder(ord)} className="hover:bg-gray-50 cursor-pointer">
                            <td className="py-2 font-bold text-primary">{ord.orderNumber}</td>
                            <td className="py-2 font-medium text-gray-800 truncate max-w-[90px]">{ord.customerName}</td>
                            <td className="py-2 font-bold text-gray-900 text-right">KES {Number(ord.total).toLocaleString()}</td>
                            <td className="py-2 pl-3"><span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${orderStatusColor(ord.status)}`}>{ord.status}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )
        })()}

        {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• TAB: ORDERS â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            {/* Status filter */}
            <div className="flex items-center gap-2 flex-wrap">
              {['All', ...ORDER_STATUSES].map((s) => (
                <button
                  key={s}
                  onClick={() => setOrderStatusFilter(s)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-full border transition-all ${orderStatusFilter === s ? 'bg-primary text-primary-foreground border-primary' : 'border-gray-200 text-gray-500 hover:border-gray-400'}`}
                >
                  {s} {s !== 'All' && `(${localOrders.filter((o: any) => o.status === s).length})`}
                </button>
              ))}
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50 text-gray-400 uppercase font-semibold border-b border-gray-100">
                    <tr>{['Order #', 'Customer', 'Phone', 'Email', 'Location', 'Total', 'Discount', 'Status', 'Payment', 'Actions'].map((h) => <th key={h} className="p-3 whitespace-nowrap">{h}</th>)}</tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredOrders.map((ord: any) => (
                      <tr key={ord.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => setSelectedOrder(ord)}>
                        <td className="p-3 font-bold text-primary whitespace-nowrap">{ord.orderNumber}</td>
                        <td className="p-3 font-medium text-gray-800 whitespace-nowrap">{ord.customerName}</td>
                        <td className="p-3 text-gray-500 whitespace-nowrap">{ord.customerPhone}</td>
                        <td className="p-3 text-gray-500 whitespace-nowrap">{ord.customerEmail}</td>
                        <td className="p-3 text-gray-500 max-w-[120px] truncate">{ord.deliveryLocation || 'â€”'}</td>
                        <td className="p-3 font-bold text-gray-900 whitespace-nowrap">KES {Number(ord.total).toLocaleString()}</td>
                        <td className="p-3 whitespace-nowrap">
                          {Number(ord.discountAmount || 0) > 0 ? (
                            <span className="flex flex-col">
                              <span className="text-emerald-600 font-bold text-[11px]">âˆ’KES {Number(ord.discountAmount).toLocaleString()}</span>
                              {ord.couponCode && <span className="text-[9px] text-slate-500 uppercase">{ord.couponCode}</span>}
                            </span>
                          ) : (
                            <span className="text-slate-600">â€”</span>
                          )}
                        </td>
                        <td className="p-3" onClick={(e) => e.stopPropagation()}>
                          <select
                            value={ord.status}
                            onChange={(e) => handleOrderStatusChange(ord.id, e.target.value)}
                            className={`text-[10px] font-bold px-2 py-1 rounded-lg border bg-transparent cursor-pointer ${orderStatusColor(ord.status)}`}
                          >
                            {ORDER_STATUSES.map((s) => (
                              <option key={s} value={s} className="bg-white text-gray-900">{s}</option>
                            ))}
                          </select>
                        </td>
                        <td className="p-3" onClick={(e) => e.stopPropagation()}>
                          <select
                            value={ord.paymentStatus || 'Pending'}
                            onChange={(e) => handlePaymentStatusChange(ord.id, e.target.value)}
                            className={`text-[10px] font-bold px-2 py-1 rounded-lg border bg-transparent cursor-pointer ${paymentStatusColor(ord.paymentStatus || 'Pending')}`}
                          >
                            {PAYMENT_STATUSES.map((s) => (
                              <option key={s} value={s} className="bg-white text-gray-900">{s}</option>
                            ))}
                          </select>
                        </td>
                        <td className="p-3" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center gap-2">
                          <a
                            href={`https://wa.me/${(settings.whatsapp_number || '+254721113431').replace(/[^0-9]/g, '')}?text=Hi, regarding order ${ord.orderNumber}`}
                            target="_blank"
                            className="text-emerald-600 hover:text-emerald-700 text-[10px] font-bold"
                          >
                            WhatsApp
                          </a>
                          {Number(ord.refundedAmount || 0) > 0 ? (
                            <span className="text-[9px] font-bold text-red-400" title={`Refunded KES ${Number(ord.refundedAmount).toLocaleString()}`}>
                              {ord.paymentStatus}
                            </span>
                          ) : (
                            <button
                              onClick={() => openRefundModal(ord)}
                              disabled={(ord.paymentStatus || '') === 'Refunded'}
                              className="text-[10px] font-bold text-red-300 hover:text-red-200 disabled:opacity-40 disabled:hover:text-red-300"
                            >
                              Refund
                            </button>
                          )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredOrders.length === 0 && (
                  <p className="text-xs text-gray-400 p-6 text-center">No orders found for this filter.</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• TAB: PRODUCTS (removed â€” merged into inventory) â•â• */}

        {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• TAB: CATEGORIES â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
        {activeTab === 'categories' && (
          <div className="space-y-4">
            <div className="flex justify-end">
              <Button onClick={() => setShowCategoryModal(true)} size="sm" className="bg-primary hover:bg-primary/90 text-xs font-bold gap-1 h-8">
                <Plus className="w-3.5 h-3.5" /> Add Category
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {localCategories.map((cat: any) => {
                const prodCount = localProducts.filter((p: any) => p.categoryId === cat.id).length
                return (
                  <div key={cat.id} className="bg-white border border-gray-200 rounded-2xl p-4 space-y-3 shadow-sm">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span className="p-2 rounded-xl bg-gray-50 border border-gray-200 text-primary">
                          <CategoryIcon name={cat.icon} className="w-5 h-5" />
                        </span>
                        <div>
                          <div className="font-bold text-gray-900 text-sm">{cat.name}</div>
                          <div className="text-[10px] text-gray-400">{prodCount} product{prodCount !== 1 ? 's' : ''}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button onClick={() => handleEditCategory(cat)} className="p-1.5 rounded-lg bg-gray-100 hover:bg-primary/10 text-gray-400 hover:text-primary transition-colors">
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => setShowDeleteConfirm({ type: 'category', id: cat.id, name: cat.name })} className="p-1.5 rounded-lg bg-gray-100 hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    {cat.description && <p className="text-[11px] text-gray-500 leading-relaxed line-clamp-2">{cat.description}</p>}
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full border border-gray-200" style={{ backgroundColor: cat.color || '#2563eb' }} />
                      <span className="text-[10px] text-gray-400 font-mono">{cat.color || '#2563eb'}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• TAB: SERVICES â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
        {activeTab === 'services' && (
          <div className="space-y-4">
            <div className="flex justify-end">
              <Button onClick={() => setShowServiceModal(true)} size="sm" className="bg-primary hover:bg-primary/90 text-xs font-bold gap-1 h-8">
                <Plus className="w-3.5 h-3.5" /> Add Service
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {servicesList.map((srv) => (
                <div key={srv.id} className="bg-white border border-gray-200 rounded-2xl p-4 space-y-2 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-gray-900 text-sm">{srv.name}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-primary/10 text-primary">{srv.icon || 'Server'}</span>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed">{srv.description}</p>
                  {srv.details && <p className="text-[11px] text-gray-400 leading-relaxed border-t border-gray-100 pt-2">{srv.details}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• TAB: SOLUTIONS â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
        {activeTab === 'solutions' && (
          <div className="space-y-4">
            <div className="flex justify-end">
              <Button onClick={() => setShowSolutionModal(true)} size="sm" className="bg-primary hover:bg-primary/90 text-xs font-bold gap-1 h-8">
                <Plus className="w-3.5 h-3.5" /> Add Solution
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {localSolutions.map((sol: any) => (
                <div key={sol.id} className="bg-white border border-gray-200 rounded-2xl p-4 space-y-3 flex flex-col justify-between shadow-sm">
                  <div className="space-y-3">
                    {sol.imageUrl && (
                      <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                        <img src={sol.imageUrl} alt={sol.title} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className="space-y-1">
                      <h3 className="font-bold text-gray-900 text-sm leading-snug">{sol.title}</h3>
                      {sol.description && <p className="text-xs text-gray-500 leading-relaxed">{sol.description}</p>}
                    </div>
                    {sol.benefits && (
                      <div className="flex flex-wrap gap-1 pt-1 border-t border-gray-100">
                        {sol.benefits.split(',').map((b: string, i: number) => (
                          <span key={i} className="inline-flex items-center gap-1 text-[10px] bg-gray-50 text-gray-600 px-2 py-0.5 rounded-full border border-gray-200 font-medium">
                            <Check size={10} className="text-primary" />
                            {b.trim()}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="pt-2 border-t border-gray-100 flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleEditSolution(sol)}
                      className="p-1.5 rounded-lg bg-gray-100 hover:bg-primary/10 text-gray-500 hover:text-primary transition-colors text-xs font-semibold flex items-center gap-1 px-2.5"
                    >
                      <Edit2 className="w-3.5 h-3.5" /> Edit
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm({ type: 'solution', id: sol.id, name: sol.title })}
                      className="p-1.5 rounded-lg bg-gray-100 hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}


        {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• TAB: HERO CAROUSEL â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
        {activeTab === 'hero' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">
                Manage dynamic homepage hero slides, captions, buttons & backgrounds
              </span>
              <Button onClick={() => setShowHeroModal(true)} size="sm" className="bg-primary hover:bg-primary/90 text-xs font-bold gap-1 h-8">
                <Plus className="w-3.5 h-3.5" /> Add Hero Slide
              </Button>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {localHeroSlides.map((slide: any) => (
                <div key={slide.id} className="bg-white border border-gray-200 rounded-2xl p-5 space-y-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm">
                  {/* Image Preview Box */}
                  <div className="w-full md:w-64 h-36 bg-gray-100 rounded-xl overflow-hidden relative border border-gray-200 shrink-0">
                    {slide.imageUrl ? (
                      <img src={slide.imageUrl} alt={slide.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400 text-xs font-bold">
                        No Image Set
                      </div>
                    )}
                    <div className="absolute top-2 left-2 flex items-center gap-1.5">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${slide.isActive !== false ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-gray-100 text-gray-500 border border-gray-200'}`}>
                        {slide.isActive !== false ? 'Active Slide' : 'Disabled'}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/90 text-gray-600 border border-gray-200">
                        Pos #{slide.orderPosition || 0}
                      </span>
                    </div>
                  </div>

                  {/* Slide Content */}
                  <div className="space-y-2 flex-1">
                    {slide.subtitle && (
                      <span className="text-xs font-bold text-primary tracking-wider uppercase block">
                        {slide.subtitle}
                      </span>
                    )}
                    <h3 className="font-extrabold text-gray-900 text-lg leading-snug">{slide.title}</h3>
                    {slide.description && (
                      <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{slide.description}</p>
                    )}
                    <div className="flex items-center gap-3 pt-2 text-xs">
                      {slide.ctaText && (
                        <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-lg border border-gray-200 font-bold">
                          Button: {slide.ctaText} â†’ ({slide.ctaLink || '/shop'})
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex md:flex-col items-center gap-2 shrink-0 w-full md:w-auto justify-end border-t md:border-t-0 border-gray-100 pt-3 md:pt-0">
                    <button
                      onClick={() => handleEditHeroSlide(slide)}
                      className="p-2 rounded-xl bg-gray-100 hover:bg-primary/10 text-gray-600 hover:text-primary transition-colors text-xs font-semibold flex items-center gap-1 px-3 w-full justify-center"
                    >
                      <Edit2 className="w-3.5 h-3.5" /> Edit Slide
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm({ type: 'hero_slide', id: slide.id, name: slide.title })}
                      className="p-2 rounded-xl bg-gray-100 hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors text-xs font-semibold flex items-center gap-1 px-3 w-full justify-center"
                      title="Delete Slide"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}


        {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• TAB: PARTNERS â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
        {activeTab === 'partners' && (
          <div className="space-y-4">
            <div className="flex justify-end">
              <Button onClick={() => setShowPartnerModal(true)} size="sm" className="bg-primary hover:bg-primary/90 text-xs font-bold gap-1 h-8">
                <Plus className="w-3.5 h-3.5" /> Add Partner
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {localPartners.map((ptn: any) => (
                <div key={ptn.id} className="bg-white border border-gray-200 rounded-2xl p-4 space-y-3 flex flex-col justify-between shadow-sm">
                  <div className="space-y-3">
                    <div className="p-3 bg-gray-50 rounded-xl flex items-center justify-center h-20 border border-gray-100 overflow-hidden relative">
                      {ptn.logoUrl ? (
                        <img src={ptn.logoUrl} alt={ptn.name} className="max-h-12 w-auto object-contain" />
                      ) : (
                        <span className="font-extrabold text-sm text-gray-700">{ptn.name}</span>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-gray-900 text-sm">{ptn.name}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">{ptn.category || 'Partner'}</span>
                      </div>
                      {ptn.description && <p className="text-[11px] text-gray-500 mt-1 line-clamp-2">{ptn.description}</p>}
                      {ptn.websiteUrl && (
                        <a href={ptn.websiteUrl} target="_blank" className="text-[10px] text-primary hover:underline block mt-1.5 font-medium truncate">
                          {ptn.websiteUrl}
                        </a>
                      )}
                    </div>
                  </div>
                  <div className="pt-2 border-t border-gray-100 flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleEditPartner(ptn)}
                      className="p-1.5 rounded-lg bg-gray-100 hover:bg-primary/10 text-gray-500 hover:text-primary transition-colors text-xs font-semibold flex items-center gap-1 px-2.5"
                    >
                      <Edit2 className="w-3.5 h-3.5" /> Edit
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm({ type: 'partner', id: ptn.id, name: ptn.name })}
                      className="p-1.5 rounded-lg bg-gray-100 hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}


        {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• TAB: MESSAGES â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
        {activeTab === 'messages' && (
          <div className="space-y-4">
            {localMessages.length > 0 ? (
              <div className="space-y-3">
                {localMessages.map((msg: any) => (
                  <div key={msg.id} className={`bg-white border rounded-2xl p-4 space-y-2 shadow-sm ${msg.status === 'Archived' ? 'border-gray-100 opacity-60' : 'border-gray-200'}`}>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="font-bold text-primary text-sm">{msg.name}</span>
                        <span className="text-xs text-gray-500 ml-2">({msg.email})</span>
                        {msg.phone && <span className="text-xs text-gray-400 ml-2">Â· {msg.phone}</span>}
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <select
                          value={msg.status || 'New'}
                          onChange={(e) => handleMessageStatusChange(msg.id, e.target.value)}
                          className={`text-[10px] font-bold px-2 py-1 rounded-lg border bg-transparent cursor-pointer ${msgStatusColor(msg.status)}`}
                        >
                          {['New', 'Read', 'Replied', 'Archived'].map((s) => (
                            <option key={s} value={s} className="bg-white text-gray-900">{s}</option>
                          ))}
                        </select>
                        <span className="text-[10px] text-gray-400">{new Date(msg.createdAt).toLocaleString()}</span>
                        <button
                          onClick={() => handleMessageDelete(msg.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors p-1"
                          title="Delete message"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    {msg.subject && <div className="text-xs font-semibold text-gray-700">Re: {msg.subject}</div>}
                    <p className="text-xs text-gray-700 bg-gray-50 p-3 rounded-xl border border-gray-100 leading-relaxed">{msg.message}</p>
                    <div className="flex gap-2">
                      <a href={`mailto:${msg.email}?subject=Re: ${msg.subject || 'Your Inquiry'}`} className="text-[10px] font-bold text-primary hover:underline">Reply via Email</a>
                      {msg.phone && <a href={`https://wa.me/${msg.phone.replace(/[^0-9]/g, '')}`} target="_blank" className="text-[10px] font-bold text-emerald-600 hover:underline">WhatsApp</a>}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 text-center py-12">No contact messages received yet.</p>
            )}
          </div>
        )}

        {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• TAB: QUOTES â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
        {activeTab === 'quotes' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 flex-wrap">
              {['All', ...QUOTE_STATUSES].map((s) => (
                <button
                  key={s}
                  onClick={() => setQuoteStatusFilter(s)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-full border transition-all ${quoteStatusFilter === s ? 'bg-primary text-primary-foreground border-primary' : 'border-gray-200 text-gray-500 hover:border-gray-400'}`}
                >
                  {s} {s !== 'All' && `(${localQuotes.filter((q: any) => q.status === s).length})`}
                </button>
              ))}
            </div>

            {filteredQuotes.length > 0 ? (
              <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-gray-50 text-gray-400 uppercase font-semibold border-b border-gray-100">
                      <tr>{['Quote #', 'Customer', 'Company', 'Email', 'Phone', 'Items', 'Status', 'Convert', 'Date'].map((h) => <th key={h} className="p-3 whitespace-nowrap">{h}</th>)}</tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredQuotes.map((q) => {
                        const items = quoteItemsByQuote[q.id] || []
                        return (
                          <React.Fragment key={q.id}>
                            <tr
                              className="hover:bg-gray-50 cursor-pointer"
                              onClick={() => setExpandedQuote(expandedQuote === q.id ? null : q.id)}
                            >
                              <td className="p-3 font-bold text-primary whitespace-nowrap">{q.quoteNumber}</td>
                              <td className="p-3 font-medium text-gray-800 whitespace-nowrap">{q.customerName}</td>
                              <td className="p-3 text-gray-500">{q.companyName || 'â€”'}</td>
                              <td className="p-3 text-gray-500 whitespace-nowrap">{q.customerEmail}</td>
                              <td className="p-3 text-gray-500 whitespace-nowrap">{q.customerPhone}</td>
                              <td className="p-3 text-gray-700">
                                <span className="px-2 py-0.5 bg-gray-100 rounded-full text-[10px] font-bold">{items.length} item{items.length !== 1 ? 's' : ''}</span>
                              </td>
                              <td className="p-3" onClick={(e) => e.stopPropagation()}>
                                {q.status === 'Converted to Order' ? (
                                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${quoteBadgeColor(q.status)}`}>{q.status}</span>
                                ) : (
                                  <select
                                    value={q.status}
                                    onChange={(e) => handleQuoteStatusChange(q.id, e.target.value)}
                                    className={`text-[10px] font-bold px-2 py-1 rounded-lg border bg-transparent cursor-pointer ${quoteBadgeColor(q.status)}`}
                                  >
                                    {QUOTE_STATUSES.filter((s) => s !== 'Converted to Order').map((s) => (
                                      <option key={s} value={s} className="bg-white text-gray-900">{s}</option>
                                    ))}
                                  </select>
                                )}
                              </td>
                              <td className="p-3" onClick={(e) => e.stopPropagation()}>
                                {q.status === 'Converted to Order' ? (
                                  <span className="text-[10px] text-emerald-600 font-bold whitespace-nowrap">âœ“ Order</span>
                                ) : (
                                  <button
                                    onClick={() => handleConvertToOrder(q)}
                                    disabled={convertingQuote === q.id}
                                    className={`text-[10px] font-bold px-2.5 py-1.5 rounded-lg border whitespace-nowrap ${convertingQuote === q.id ? 'opacity-50 bg-gray-100 text-gray-400 border-gray-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'}`}
                                  >
                                    {convertingQuote === q.id ? 'Convertingâ€¦' : 'Convert to Order'}
                                  </button>
                                )}
                              </td>
                              <td className="p-3 text-gray-400 whitespace-nowrap">{new Date(q.createdAt).toLocaleDateString()}</td>
                            </tr>
                            {expandedQuote === q.id && (
                              <tr className="bg-gray-50 border-y border-gray-100">
                                <td colSpan={9} className="p-0">
                                  <div className="p-4 space-y-3">
                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                                      <div className="lg:col-span-2">
                                        <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Requested Items</h4>
                                        {items.length > 0 ? (
                                          <div className="space-y-1.5">
                                            {items.map((it: any) => (
                                              <div key={it.id} className="flex items-center justify-between px-3 py-2 bg-white border border-gray-200 rounded-lg">
                                                <span className="text-gray-800 font-medium">{it.productName}</span>
                                                <span className="text-xs text-gray-400 font-mono ml-4">Ã—{it.quantity}</span>
                                              </div>
                                            ))}
                                          </div>
                                        ) : (
                                          <p className="text-xs text-gray-400">No specific products â€” custom engineering spec.</p>
                                        )}
                                      </div>
                                      <div>
                                        <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Notes</h4>
                                        <p className="text-xs text-gray-700 leading-relaxed whitespace-pre-wrap">{q.notes || 'â€”'}</p>
                                      </div>
                                    </div>
                                    <div className="flex items-center justify-between text-[11px] text-gray-400 pt-2 border-t border-gray-100">
                                      <span>Submitted {new Date(q.createdAt).toLocaleString()}</span>
                                      {(q.customerId != null) && <span className="text-gray-400">Linked to customer account</span>}
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            )}
                          </React.Fragment>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
                {filteredQuotes.length === 0 && (
                  <p className="text-xs text-gray-400 p-6 text-center">No quotes found for this filter.</p>
                )}
              </div>
            ) : (
              <p className="text-xs text-gray-400 text-center py-12">No quote requests yet.</p>
            )}
          </div>
        )}

        {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• TAB: BRANDS â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
        {activeTab === 'brands' && (
          <ContentManager config={BRAND_CONFIG} initialItems={brandsList} flash={flash} />
        )}

        {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• TAB: DEPARTMENTS â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
        {activeTab === 'departments' && (
          <ContentManager config={DEPT_CONFIG} initialItems={departmentsList} flash={flash} />
        )}

        {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• TAB: INDUSTRIES â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
        {activeTab === 'industries' && (
          <ContentManager config={INDUSTRY_CONFIG} initialItems={industriesList} flash={flash} />
        )}

        {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• TAB: PROJECTS â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
        {activeTab === 'projects' && (
          <ContentManager config={PROJECT_CONFIG} initialItems={projectsList} flash={flash} />
        )}

        {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• TAB: APPLICATIONS â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
        {activeTab === 'applications' && (
          <ContentManager config={APPLICATION_CONFIG} initialItems={applicationsList} flash={flash} />
        )}

        {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• TAB: RESOURCES / INSIGHTS â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
        {activeTab === 'resources' && (
          <ResourcesManager initialItems={resourcesList} flash={flash} />
        )}

        {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• TAB: PAGES â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
        {activeTab === 'pages' && (
          <ContentManager config={PAGE_CONFIG} initialItems={pagesList} flash={flash} />
        )}

        {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• TAB: USERS â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
        {activeTab === 'users' && (
          <UsersManager usersList={usersList} rolesList={rolesList} currentUserId={currentUserId} flash={flash} />
        )}

        {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• TAB: ROLES â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
        {activeTab === 'roles' && (
          <RolesManager rolesList={rolesList} canManageRoles={canManageRoles} flash={flash} />
        )}

        {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• TAB: INVENTORY (Products + Stock) â•â•â•â•â•â•â•â•â•â•â• */}
        {activeTab === 'inventory' && (
          <InventoryTabs
            localProducts={localProducts}
            localCategories={localCategories}
            brandsList={brandsList}
            departmentsList={departmentsList}
            productDepartmentsList={productDepartmentsList}
            productSpecsList={productSpecsList}
            productSearch={productSearch}
            setProductSearch={setProductSearch}
            filteredProducts={filteredProducts}
            handleEditProduct={handleEditProduct}
            setShowProductModal={setShowProductModal}
            setShowDeleteConfirm={setShowDeleteConfirm}
            flash={flash}
          />
        )}

        {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• TAB: CUSTOMERS â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
        {activeTab === 'customers' && (
          <CustomersManager customersList={customersList} ordersList={localOrders} quotesList={localQuotes} />
        )}

        {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• TAB: COUPONS â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
        {activeTab === 'coupons' && (
          <CouponsManager couponsList={couponsList} flash={flash} />
        )}

        {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• TAB: MEDIA â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
        {activeTab === 'media' && (
          <MediaManager mediaList={mediaList} flash={flash} />
        )}

        {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• TAB: ANALYTICS â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
        {activeTab === 'analytics' && (
          <AnalyticsView
            ordersList={localOrders}
            orderItemsList={orderItemsList}
            productsList={localProducts}
            categoriesList={categoriesList}
            customersList={customersList}
            quotesList={localQuotes}
            messagesList={localMessages}
            brandsList={brandsList}
          />
        )}

        {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• TAB: SETTINGS â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
        {activeTab === 'settings' && (
          <div className="max-w-2xl space-y-4">
            {saveNotice && (
              <div className={`p-3 text-xs rounded-xl border font-semibold ${saveNotice.includes('success') ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-red-50 text-red-700 border-red-200'}`}>{saveNotice}</div>
            )}
            <form onSubmit={handleSaveSettings} className="space-y-4">
              <div className="bg-white border border-gray-200 rounded-2xl p-5 space-y-4 shadow-sm">
                <h3 className="text-[11px] font-bold text-primary uppercase tracking-wider">Brand & Identity</h3>
                <Field label="Company Logo URL">
                  <div className="flex gap-2">
                    <input type="text" value={settings.site_logo_url || ''} onChange={(e) => setSettings({ ...settings, site_logo_url: e.target.value })} className={inputCls} placeholder="https://example.com/logo.png" />
                    <label className="shrink-0 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg cursor-pointer font-bold border border-gray-200 text-xs">
                      Upload
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, (url) => setSettings({ ...settings, site_logo_url: url }))} />
                    </label>
                  </div>
                </Field>
                <Field label="Primary Accent Color">
                  <div className="flex items-center gap-2">
                    <input type="color" value={settings.primary_color || '#2563eb'} onChange={(e) => setSettings({ ...settings, primary_color: e.target.value })} className="w-10 h-10 rounded-lg border border-gray-200 bg-white cursor-pointer" />
                    <input type="text" value={settings.primary_color || '#2563eb'} onChange={(e) => setSettings({ ...settings, primary_color: e.target.value })} className="w-32 px-3 py-2 bg-white border border-gray-200 rounded-lg text-gray-900 text-xs font-mono" />
                  </div>
                </Field>
              </div>

              <div className="bg-white border border-gray-200 rounded-2xl p-5 space-y-4 shadow-sm">
                <h3 className="text-[11px] font-bold text-primary uppercase tracking-wider">Contact & WhatsApp</h3>
                <Field label="WhatsApp Order Number">
                  <input type="text" value={settings.whatsapp_number || ''} onChange={(e) => setSettings({ ...settings, whatsapp_number: e.target.value })} className={inputCls} placeholder="+254721113431" />
                </Field>
                <Field label="Company Phone Numbers">
                  <input type="text" value={settings.company_phone || ''} onChange={(e) => setSettings({ ...settings, company_phone: e.target.value })} className={inputCls} />
                </Field>
                <Field label="Contact Email">
                  <input type="email" value={settings.company_email || ''} onChange={(e) => setSettings({ ...settings, company_email: e.target.value })} className={inputCls} />
                </Field>
                <Field label="Office Address">
                  <textarea rows={2} value={settings.company_address || ''} onChange={(e) => setSettings({ ...settings, company_address: e.target.value })} className={inputCls} />
                </Field>
              </div>

              <div className="bg-white border border-gray-200 rounded-2xl p-5 space-y-4 shadow-sm">
                <h3 className="text-[11px] font-bold text-primary uppercase tracking-wider">Checkout Configuration</h3>
                <p className="text-[10px] text-gray-400 -mt-2">These options are used on the public checkout page. Edit as JSON â€” never hardcoded in the storefront.</p>
                <Field label="Delivery Methods (JSON)">
                  <textarea
                    rows={4}
                    value={settings.delivery_methods || ''}
                    onChange={(e) => setSettings({ ...settings, delivery_methods: e.target.value })}
                    className={`${inputCls} font-mono`}
                  />
                </Field>
                <Field label="Payment Methods (JSON)">
                  <textarea
                    rows={4}
                    value={settings.payment_methods || ''}
                    onChange={(e) => setSettings({ ...settings, payment_methods: e.target.value })}
                    className={`${inputCls} font-mono`}
                  />
                </Field>
              </div>

              <Button type="submit" disabled={savingSettings} className="bg-primary hover:bg-primary/90 font-bold px-6 py-2.5 text-xs rounded-xl">
                {savingSettings ? <><RefreshCw className="w-3.5 h-3.5 mr-1.5 animate-spin" />Saving...</> : <><Save className="w-3.5 h-3.5 mr-1.5" />Save Settings</>}
              </Button>
            </form>
          </div>
        )}
        </div>
      </main>

      {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• MODALS â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-white border border-gray-200 rounded-2xl w-full max-w-2xl shadow-2xl max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
              <div>
                <h3 className="text-sm font-black text-gray-900">Order {selectedOrder.orderNumber}</h3>
                <p className="text-[10px] text-gray-400 mt-0.5">{new Date(selectedOrder.createdAt).toLocaleString()}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${orderStatusColor(selectedOrder.status)}`}>{selectedOrder.status}</span>
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${paymentStatusColor(selectedOrder.paymentStatus || 'Pending')}`}>{selectedOrder.paymentStatus || 'Pending'}</span>
                <button onClick={() => setSelectedOrder(null)} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 ml-2">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="overflow-y-auto flex-1 p-6 space-y-5">
              {/* Customer Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 space-y-2">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Customer</p>
                  <p className="text-sm font-bold text-gray-900">{selectedOrder.customerName}</p>
                  <p className="text-xs text-gray-500">{selectedOrder.customerEmail}</p>
                  <p className="text-xs text-gray-500">{selectedOrder.customerPhone}</p>
                </div>
                <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 space-y-2">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Delivery</p>
                  <p className="text-xs text-gray-700">{selectedOrder.deliveryLocation || 'â€”'}</p>
                  <p className="text-xs text-gray-500">{selectedOrder.deliveryMethod || 'â€”'}</p>
                  {selectedOrder.shippingAddress && <p className="text-xs text-gray-400">{selectedOrder.shippingAddress}</p>}
                </div>
              </div>

              {/* Order Items */}
              <div className="bg-gray-50 border border-gray-100 rounded-xl overflow-hidden">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-4 py-3 border-b border-gray-100">Items</p>
                {orderItemsList.filter((i: any) => i.orderId === selectedOrder.id).length > 0 ? (
                  <table className="w-full text-xs">
                    <thead className="text-gray-400 border-b border-gray-100">
                      <tr>
                        <th className="text-left px-4 py-2">Product</th>
                        <th className="text-right px-4 py-2">Qty</th>
                        <th className="text-right px-4 py-2">Unit Price</th>
                        <th className="text-right px-4 py-2">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {orderItemsList.filter((i: any) => i.orderId === selectedOrder.id).map((item: any) => (
                        <tr key={item.id}>
                          <td className="px-4 py-2.5 text-gray-800 font-medium">{item.productName}</td>
                          <td className="px-4 py-2.5 text-gray-500 text-right">{item.quantity}</td>
                          <td className="px-4 py-2.5 text-gray-500 text-right">KES {Number(item.unitPrice).toLocaleString()}</td>
                          <td className="px-4 py-2.5 text-gray-900 font-bold text-right">KES {Number(item.totalPrice).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="text-xs text-gray-400 px-4 py-4">No line items recorded.</p>
                )}
              </div>

              {/* Totals */}
              <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 space-y-2 text-xs">
                <div className="flex justify-between text-gray-500"><span>Subtotal</span><span>KES {Number(selectedOrder.subtotal || 0).toLocaleString()}</span></div>
                {Number(selectedOrder.discountAmount || 0) > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Discount {selectedOrder.couponCode && <span className="text-[9px] uppercase ml-1 text-gray-400">({selectedOrder.couponCode})</span>}</span>
                    <span>âˆ’KES {Number(selectedOrder.discountAmount).toLocaleString()}</span>
                  </div>
                )}
                {Number(selectedOrder.deliveryCost || 0) > 0 && (
                  <div className="flex justify-between text-gray-500"><span>Delivery</span><span>KES {Number(selectedOrder.deliveryCost).toLocaleString()}</span></div>
                )}
                <div className="flex justify-between text-gray-900 font-black text-sm border-t border-gray-200 pt-2">
                  <span>Total</span><span>KES {Number(selectedOrder.total).toLocaleString()}</span>
                </div>
                {Number(selectedOrder.refundedAmount || 0) > 0 && (
                  <div className="flex justify-between text-red-500 font-bold"><span>Refunded</span><span>âˆ’KES {Number(selectedOrder.refundedAmount).toLocaleString()}</span></div>
                )}
              </div>

              {/* Payment & Notes */}
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 space-y-1">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Payment</p>
                  <p className="text-gray-700">{selectedOrder.paymentMethod || 'â€”'}</p>
                </div>
                {selectedOrder.notes && (
                  <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Notes</p>
                    <p className="text-gray-700 leading-relaxed">{selectedOrder.notes}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Footer Actions */}
            <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between gap-3 shrink-0">
              <a
                href={`https://wa.me/${(settings.whatsapp_number || '+254721113431').replace(/[^0-9]/g, '')}?text=Hi ${selectedOrder.customerName}, regarding your order ${selectedOrder.orderNumber}`}
                target="_blank"
                className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1.5"
              >
                WhatsApp Customer
              </a>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => { openRefundModal(selectedOrder); setSelectedOrder(null) }}
                  disabled={(selectedOrder.paymentStatus || '') === 'Refunded'}
                  className="text-xs font-bold px-3 py-1.5 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 disabled:opacity-40"
                >
                  Refund
                </button>
                <button onClick={() => setSelectedOrder(null)} className="text-xs font-bold px-4 py-1.5 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200">
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal wrapper helper */}
      {[
        // Create Product
        showProductModal && (
          <ModalWrap key="create-product" title="Add New Product" onClose={() => setShowProductModal(false)}>
            <form onSubmit={handleCreateProduct} className="space-y-3 text-xs">
              <Field label="Product Name *">
                <input required value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} className={inputCls} placeholder="e.g. APC Smart-UPS 10kVA" />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Price (KES) *">
                  <input required type="number" value={newProduct.price} onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })} className={inputCls} placeholder="450000" />
                </Field>
                <Field label="Sale Price (KES)">
                  <input type="number" value={newProduct.salePrice} onChange={(e) => setNewProduct({ ...newProduct, salePrice: e.target.value })} className={inputCls} placeholder="Optional" />
                </Field>
                <Field label="Cost Price (KES)">
                  <input type="number" value={newProduct.costPrice} onChange={(e) => setNewProduct({ ...newProduct, costPrice: e.target.value })} className={inputCls} placeholder="Internal cost (optional)" />
                </Field>
                <Field label="Currency">
                  <select value={newProduct.currency} onChange={(e) => setNewProduct({ ...newProduct, currency: e.target.value })} className={selectCls}>
                    <option>KES</option>
                    <option>USD</option>
                  </select>
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Brand">
                  <select value={newProduct.brandId} onChange={(e) => setNewProduct({ ...newProduct, brandId: e.target.value })} className={selectCls}>
                    <option value="">No brand</option>
                    {brandsList.map((b: any) => <option key={b.id} value={b.id}>{b.name}</option>)}
                  </select>
                </Field>
                <Field label="Purchase Type">
                  <select value={newProduct.purchaseType} onChange={(e) => setNewProduct({ ...newProduct, purchaseType: e.target.value })} className={selectCls}>
                    <option value="buy_online">Buy Online</option>
                    <option value="request_quote">Request Quote</option>
                    <option value="contact_sales">Contact Sales</option>
                  </select>
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Stock Quantity">
                  <input type="number" min="0" value={newProduct.stockQuantity} onChange={(e) => setNewProduct({ ...newProduct, stockQuantity: e.target.value })} className={inputCls} placeholder="0" />
                </Field>
                <Field label="Low Stock Threshold">
                  <input type="number" min="0" value={newProduct.lowStockThreshold} onChange={(e) => setNewProduct({ ...newProduct, lowStockThreshold: e.target.value })} className={inputCls} placeholder="5" />
                </Field>
              </div>
              <Field label="Short Description">
                <input value={newProduct.shortDescription} onChange={(e) => setNewProduct({ ...newProduct, shortDescription: e.target.value })} className={inputCls} placeholder="One-line summary shown in listings" />
              </Field>
              <Field label="Departments (multi-select)">
                <div className="flex flex-wrap gap-2">
                  {departmentsList.map((d: any) => {
                    const checked = (newProduct.departmentIds || []).includes(d.id)
                    return (
                      <button
                        key={d.id}
                        type="button"
                        onClick={() => setNewProduct({ ...newProduct, departmentIds: checked ? (newProduct.departmentIds || []).filter((x: number) => x !== d.id) : [...(newProduct.departmentIds || []), d.id] })}
                        className={`px-3 py-1.5 rounded-full text-[10px] font-bold border transition-colors ${checked ? 'bg-primary text-primary-foreground border-primary' : 'bg-gray-100 text-gray-500 border-gray-200 hover:border-primary/40'}`}
                      >
                        {d.name}
                      </button>
                    )
                  })}
                </div>
              </Field>
              <Field label="Specifications">
                <div className="space-y-2">
                  {newProduct.specs.map((s: any, idx: number) => (
                    <div key={idx} className="flex gap-2 items-center">
                      <input value={s.label} onChange={(e) => { const specs = [...newProduct.specs]; specs[idx] = { ...specs[idx], label: e.target.value }; setNewProduct({ ...newProduct, specs }) }} className={inputCls} placeholder="Label (e.g. Power)" />
                      <input value={s.value} onChange={(e) => { const specs = [...newProduct.specs]; specs[idx] = { ...specs[idx], value: e.target.value }; setNewProduct({ ...newProduct, specs }) }} className={inputCls} placeholder="Value (e.g. 10kVA / 8kW)" />
                      <button
                        type="button"
                        onClick={() => setNewProduct({ ...newProduct, specs: newProduct.specs.filter((_: any, i: number) => i !== idx) })}
                        disabled={newProduct.specs.length <= 1}
                        className="p-2 rounded-lg bg-gray-100 text-gray-400 hover:text-red-500 hover:bg-red-50 disabled:opacity-40 shrink-0"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => setNewProduct({ ...newProduct, specs: [...newProduct.specs, { label: '', value: '' }] })}
                    className="text-[10px] font-bold text-primary hover:text-primary/80"
                  >
                    + Add specification
                  </button>
                </div>
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="SKU">
                  <input value={newProduct.sku} onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })} className={inputCls} placeholder="GSS-UPS-001" />
                </Field>
                <Field label="Category *">
                  <select required value={newProduct.categoryId} onChange={(e) => setNewProduct({ ...newProduct, categoryId: e.target.value })} className={selectCls}>
                    <option value="">Select category</option>
                    {localCategories.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Stock Status">
                  <select value={newProduct.stockStatus} onChange={(e) => setNewProduct({ ...newProduct, stockStatus: e.target.value })} className={selectCls}>
                    <option value="in_stock">In Stock</option>
                    <option value="available_on_order">Available on Order</option>
                    <option value="out_of_stock">Out of Stock</option>
                  </select>
                </Field>
                <Field label="Featured">
                  <select value={newProduct.isFeatured ? 'true' : 'false'} onChange={(e) => setNewProduct({ ...newProduct, isFeatured: e.target.value === 'true' })} className={selectCls}>
                    <option value="false">No</option>
                    <option value="true">Yes</option>
                  </select>
                </Field>
              </div>
              <Field label="Product Image URL or Upload">
                <div className="flex gap-2">
                  <input value={newProduct.imageUrl} onChange={(e) => setNewProduct({ ...newProduct, imageUrl: e.target.value })} className={inputCls} placeholder="https://..." />
                  <label className="shrink-0 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg cursor-pointer font-bold border border-gray-200 text-[10px]">
                    Upload<input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, (url) => setNewProduct((prev: any) => ({ ...prev, imageUrl: url })), 'products')} />
                  </label>
                </div>
              </Field>
              <Field label="Features (comma separated)">
                <input value={newProduct.features} onChange={(e) => setNewProduct({ ...newProduct, features: e.target.value })} className={inputCls} placeholder="SNMP Monitoring, Hot-Swap Batteries, LCD Display" />
              </Field>
              <Field label="Description">
                <textarea rows={3} value={newProduct.description} onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })} className={inputCls} placeholder="Product description..." />
              </Field>
              <div className="flex justify-end gap-2 pt-1">
                <Button type="button" variant="outline" size="sm" onClick={() => setShowProductModal(false)} className="text-xs h-8">Cancel</Button>
                <Button type="submit" size="sm" disabled={creating} className="bg-primary text-xs h-8 font-bold">{creating ? 'Creating...' : 'Create Product'}</Button>
              </div>
            </form>
          </ModalWrap>
        ),

        // Edit Product
        showEditProductModal && editProduct && (
          <ModalWrap key="edit-product" title={`Edit: ${editProduct.name}`} onClose={() => setShowEditProductModal(false)}>
            <form onSubmit={handleSaveProduct} className="space-y-3 text-xs">
              <Field label="Product Name *">
                <input required value={editProduct.name || ''} onChange={(e) => setEditProduct({ ...editProduct, name: e.target.value })} className={inputCls} />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Price (KES) *">
                  <input required type="number" value={editProduct.price || ''} onChange={(e) => setEditProduct({ ...editProduct, price: e.target.value })} className={inputCls} />
                </Field>
                <Field label="Sale Price (KES)">
                  <input type="number" value={editProduct.salePrice || ''} onChange={(e) => setEditProduct({ ...editProduct, salePrice: e.target.value })} className={inputCls} placeholder="Optional" />
                </Field>
                <Field label="Cost Price (KES)">
                  <input type="number" value={editProduct.costPrice || ''} onChange={(e) => setEditProduct({ ...editProduct, costPrice: e.target.value })} className={inputCls} />
                </Field>
                <Field label="Currency">
                  <select value={editProduct.currency || 'KES'} onChange={(e) => setEditProduct({ ...editProduct, currency: e.target.value })} className={selectCls}>
                    <option>KES</option>
                    <option>USD</option>
                  </select>
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Brand">
                  <select value={editProduct.brandId || ''} onChange={(e) => setEditProduct({ ...editProduct, brandId: e.target.value })} className={selectCls}>
                    <option value="">No brand</option>
                    {brandsList.map((b: any) => <option key={b.id} value={b.id}>{b.name}</option>)}
                  </select>
                </Field>
                <Field label="Purchase Type">
                  <select value={editProduct.purchaseType || 'buy_online'} onChange={(e) => setEditProduct({ ...editProduct, purchaseType: e.target.value })} className={selectCls}>
                    <option value="buy_online">Buy Online</option>
                    <option value="request_quote">Request Quote</option>
                    <option value="contact_sales">Contact Sales</option>
                  </select>
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Stock Quantity">
                  <input type="number" min="0" value={editProduct.stockQuantity ?? ''} onChange={(e) => setEditProduct({ ...editProduct, stockQuantity: e.target.value })} className={inputCls} />
                </Field>
                <Field label="Low Stock Threshold">
                  <input type="number" min="0" value={editProduct.lowStockThreshold ?? ''} onChange={(e) => setEditProduct({ ...editProduct, lowStockThreshold: e.target.value })} className={inputCls} />
                </Field>
              </div>
              <Field label="Short Description">
                <input value={editProduct.shortDescription || ''} onChange={(e) => setEditProduct({ ...editProduct, shortDescription: e.target.value })} className={inputCls} />
              </Field>
              <Field label="Departments (multi-select)">
                <div className="flex flex-wrap gap-2">
                  {departmentsList.map((d: any) => {
                    const checked = (editProduct.departmentIds || []).includes(d.id)
                    return (
                      <button
                        key={d.id}
                        type="button"
                        onClick={() => setEditProduct({ ...editProduct, departmentIds: checked ? (editProduct.departmentIds || []).filter((x: number) => x !== d.id) : [...(editProduct.departmentIds || []), d.id] })}
                        className={`px-3 py-1.5 rounded-full text-[10px] font-bold border transition-colors ${checked ? 'bg-primary text-primary-foreground border-primary' : 'bg-gray-100 text-gray-500 border-gray-200 hover:border-primary/40'}`}
                      >
                        {d.name}
                      </button>
                    )
                  })}
                </div>
              </Field>
              <Field label="Specifications">
                <div className="space-y-2">
                  {(editProduct.specs || []).map((s: any, idx: number) => (
                    <div key={idx} className="flex gap-2 items-center">
                      <input value={s.label} onChange={(e) => { const specs = [...(editProduct.specs || [])]; specs[idx] = { ...specs[idx], label: e.target.value }; setEditProduct({ ...editProduct, specs }) }} className={inputCls} placeholder="Label" />
                      <input value={s.value} onChange={(e) => { const specs = [...(editProduct.specs || [])]; specs[idx] = { ...specs[idx], value: e.target.value }; setEditProduct({ ...editProduct, specs }) }} className={inputCls} placeholder="Value" />
                      <button
                        type="button"
                        onClick={() => setEditProduct({ ...editProduct, specs: (editProduct.specs || []).filter((_: any, i: number) => i !== idx) })}
                        disabled={editProduct.specs.length <= 1}
                        className="p-2 rounded-lg bg-gray-100 text-gray-400 hover:text-red-500 hover:bg-red-50 disabled:opacity-40 shrink-0"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => setEditProduct({ ...editProduct, specs: [...(editProduct.specs || []), { label: '', value: '' }] })}
                    className="text-[10px] font-bold text-primary hover:text-primary/80"
                  >
                    + Add specification
                  </button>
                </div>
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="SKU">
                  <input value={editProduct.sku || ''} onChange={(e) => setEditProduct({ ...editProduct, sku: e.target.value })} className={inputCls} />
                </Field>
                <Field label="Category">
                  <select value={editProduct.categoryId || ''} onChange={(e) => setEditProduct({ ...editProduct, categoryId: e.target.value })} className={selectCls}>
                    {localCategories.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Stock Status">
                  <select value={editProduct.stockStatus || 'in_stock'} onChange={(e) => setEditProduct({ ...editProduct, stockStatus: e.target.value })} className={selectCls}>
                    <option value="in_stock">In Stock</option>
                    <option value="available_on_order">Available on Order</option>
                    <option value="out_of_stock">Out of Stock</option>
                  </select>
                </Field>
                <Field label="Featured">
                  <select value={editProduct.isFeatured ? 'true' : 'false'} onChange={(e) => setEditProduct({ ...editProduct, isFeatured: e.target.value === 'true' })} className={selectCls}>
                    <option value="false">No</option>
                    <option value="true">Yes</option>
                  </select>
                </Field>
              </div>
              <Field label="Image URL or Upload">
                <div className="flex gap-2">
                  <input value={editProduct.imageUrl || ''} onChange={(e) => setEditProduct({ ...editProduct, imageUrl: e.target.value })} className={inputCls} placeholder="https://..." />
                  <label className="shrink-0 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg cursor-pointer font-bold border border-gray-200 text-[10px]">
                    Upload<input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, (url) => setEditProduct((prev: any) => ({ ...prev, imageUrl: url })), 'products')} />
                  </label>
                </div>
              </Field>
              <Field label="Features">
                <input value={editProduct.features || ''} onChange={(e) => setEditProduct({ ...editProduct, features: e.target.value })} className={inputCls} />
              </Field>
              <Field label="Description">
                <textarea rows={3} value={editProduct.description || ''} onChange={(e) => setEditProduct({ ...editProduct, description: e.target.value })} className={inputCls} />
              </Field>
              <div className="flex justify-end gap-2 pt-1">
                <Button type="button" variant="outline" size="sm" onClick={() => setShowEditProductModal(false)} className="text-xs h-8">Cancel</Button>
                <Button type="submit" size="sm" disabled={saving} className="bg-primary text-xs h-8 font-bold">{saving ? 'Saving...' : 'Save Changes'}</Button>
              </div>
            </form>
          </ModalWrap>
        ),

        // Create Category
        showCategoryModal && (
          <ModalWrap key="create-cat" title="Add New Category" onClose={() => setShowCategoryModal(false)}>
            <form onSubmit={handleCreateCategory} className="space-y-3 text-xs">
              <Field label="Category Name *">
                <input required value={newCategory.name} onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })} className={inputCls} placeholder="e.g. Generators & Backup" />
              </Field>
              <Field label="Description">
                <textarea rows={2} value={newCategory.description} onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })} className={inputCls} />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Emoji Icon">
                  <input value={newCategory.icon} onChange={(e) => setNewCategory({ ...newCategory, icon: e.target.value })} className={inputCls} placeholder="e.g. zap, server, sun" />
                </Field>
                <Field label="Brand Color">
                  <input type="color" value={newCategory.color} onChange={(e) => setNewCategory({ ...newCategory, color: e.target.value })} className="w-full h-9 rounded-lg border border-gray-200 bg-white cursor-pointer" />
                </Field>
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <Button type="button" variant="outline" size="sm" onClick={() => setShowCategoryModal(false)} className="text-xs h-8">Cancel</Button>
                <Button type="submit" size="sm" disabled={creating} className="bg-primary text-xs h-8 font-bold">{creating ? 'Creating...' : 'Create Category'}</Button>
              </div>
            </form>
          </ModalWrap>
        ),

        // Edit Category
        showEditCategoryModal && editCategory && (
          <ModalWrap key="edit-cat" title={`Edit: ${editCategory.name}`} onClose={() => setShowEditCategoryModal(false)}>
            <form onSubmit={handleSaveCategory} className="space-y-3 text-xs">
              <Field label="Category Name *">
                <input required value={editCategory.name || ''} onChange={(e) => setEditCategory({ ...editCategory, name: e.target.value })} className={inputCls} />
              </Field>
              <Field label="Description">
                <textarea rows={2} value={editCategory.description || ''} onChange={(e) => setEditCategory({ ...editCategory, description: e.target.value })} className={inputCls} />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Emoji Icon">
                  <input value={editCategory.icon || ''} onChange={(e) => setEditCategory({ ...editCategory, icon: e.target.value })} className={inputCls} placeholder="e.g. zap, server, sun" />
                </Field>
                <Field label="Brand Color">
                  <input type="color" value={editCategory.color || '#2563eb'} onChange={(e) => setEditCategory({ ...editCategory, color: e.target.value })} className="w-full h-9 rounded-lg border border-gray-200 bg-white cursor-pointer" />
                </Field>
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <Button type="button" variant="outline" size="sm" onClick={() => setShowEditCategoryModal(false)} className="text-xs h-8">Cancel</Button>
                <Button type="submit" size="sm" disabled={saving} className="bg-primary text-xs h-8 font-bold">{saving ? 'Saving...' : 'Save Changes'}</Button>
              </div>
            </form>
          </ModalWrap>
        ),

        // Create Service
        showServiceModal && (
          <ModalWrap key="create-service" title="Add New Service" onClose={() => setShowServiceModal(false)}>
            <form onSubmit={handleCreateService} className="space-y-3 text-xs">
              <Field label="Service Name *">
                <input required value={newService.name} onChange={(e) => setNewService({ ...newService, name: e.target.value })} className={inputCls} placeholder="e.g. Data Centre Cooling" />
              </Field>
              <Field label="Icon Name">
                <input value={newService.icon} onChange={(e) => setNewService({ ...newService, icon: e.target.value })} className={inputCls} placeholder="Server, Zap, Sun, Cpu..." />
              </Field>
              <Field label="Image URL or Upload">
                <div className="flex gap-2">
                  <input value={newService.imageUrl} onChange={(e) => setNewService({ ...newService, imageUrl: e.target.value })} className={inputCls} placeholder="https://..." />
                  <label className="shrink-0 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg cursor-pointer font-bold border border-gray-200 text-[10px]">
                    Upload<input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, (url) => setNewService({ ...newService, imageUrl: url }))} />
                  </label>
                </div>
              </Field>
              <Field label="Short Description *">
                <textarea rows={2} required value={newService.description} onChange={(e) => setNewService({ ...newService, description: e.target.value })} className={inputCls} />
              </Field>
              <Field label="Extended Details">
                <textarea rows={3} value={newService.details} onChange={(e) => setNewService({ ...newService, details: e.target.value })} className={inputCls} />
              </Field>
              <div className="flex justify-end gap-2 pt-1">
                <Button type="button" variant="outline" size="sm" onClick={() => setShowServiceModal(false)} className="text-xs h-8">Cancel</Button>
                <Button type="submit" size="sm" disabled={creating} className="bg-primary text-xs h-8 font-bold">{creating ? 'Creating...' : 'Create Service'}</Button>
              </div>
            </form>
          </ModalWrap>
        ),

        // Create Solution
        showSolutionModal && (
          <ModalWrap key="create-solution" title="Add Enterprise Solution" onClose={() => setShowSolutionModal(false)}>
            <form onSubmit={handleCreateSolution} className="space-y-3 text-xs">
              <Field label="Solution Title *">
                <input required value={newSolution.title} onChange={(e) => setNewSolution({ ...newSolution, title: e.target.value })} className={inputCls} placeholder="e.g. Industrial Solar Microgrid Solutions" />
              </Field>
              <Field label="Image URL or Upload">
                <div className="flex gap-2">
                  <input value={newSolution.imageUrl} onChange={(e) => setNewSolution({ ...newSolution, imageUrl: e.target.value })} className={inputCls} placeholder="https://..." />
                  <label className="shrink-0 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg cursor-pointer font-bold border border-gray-200 text-[10px]">
                    Upload<input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, (url) => setNewSolution({ ...newSolution, imageUrl: url }))} />
                  </label>
                </div>
              </Field>
              <Field label="Key Benefits (comma separated)">
                <input value={newSolution.benefits} onChange={(e) => setNewSolution({ ...newSolution, benefits: e.target.value })} className={inputCls} placeholder="Tier-1 Solar PV, Battery ESS, Zero Export Control" />
              </Field>
              <Field label="Description *">
                <textarea rows={3} required value={newSolution.description} onChange={(e) => setNewSolution({ ...newSolution, description: e.target.value })} className={inputCls} placeholder="Detailed explanation of this turnkey solution..." />
              </Field>
              <div className="flex justify-end gap-2 pt-1">
                <Button type="button" variant="outline" size="sm" onClick={() => setShowSolutionModal(false)} className="text-xs h-8">Cancel</Button>
                <Button type="submit" size="sm" disabled={creating} className="bg-primary text-xs h-8 font-bold">{creating ? 'Creating...' : 'Create Solution'}</Button>
              </div>
            </form>
          </ModalWrap>
        ),

        // Edit Solution
        showEditSolutionModal && editSolution && (
          <ModalWrap key="edit-solution" title={`Edit: ${editSolution.title}`} onClose={() => setShowEditSolutionModal(false)}>
            <form onSubmit={handleSaveSolution} className="space-y-3 text-xs">
              <Field label="Solution Title *">
                <input required value={editSolution.title || ''} onChange={(e) => setEditSolution({ ...editSolution, title: e.target.value })} className={inputCls} />
              </Field>
              <Field label="Image URL or Upload">
                <div className="flex gap-2">
                  <input value={editSolution.imageUrl || ''} onChange={(e) => setEditSolution({ ...editSolution, imageUrl: e.target.value })} className={inputCls} placeholder="https://..." />
                  <label className="shrink-0 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg cursor-pointer font-bold border border-gray-200 text-[10px]">
                    Upload<input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, (url) => setEditSolution({ ...editSolution, imageUrl: url }))} />
                  </label>
                </div>
              </Field>
              <Field label="Key Benefits (comma separated)">
                <input value={editSolution.benefits || ''} onChange={(e) => setEditSolution({ ...editSolution, benefits: e.target.value })} className={inputCls} />
              </Field>
              <Field label="Description *">
                <textarea rows={3} required value={editSolution.description || ''} onChange={(e) => setEditSolution({ ...editSolution, description: e.target.value })} className={inputCls} />
              </Field>
              <div className="flex justify-end gap-2 pt-1">
                <Button type="button" variant="outline" size="sm" onClick={() => setShowEditSolutionModal(false)} className="text-xs h-8">Cancel</Button>
                <Button type="submit" size="sm" disabled={saving} className="bg-primary text-xs h-8 font-bold">{saving ? 'Saving...' : 'Save Changes'}</Button>
              </div>
            </form>
          </ModalWrap>
        ),


        // Create Partner
        showPartnerModal && (
          <ModalWrap key="create-partner" title="Add Brand Partner" onClose={() => setShowPartnerModal(false)}>
            <form onSubmit={handleCreatePartner} className="space-y-3 text-xs">
              <Field label="Partner / Brand Name *">
                <input required value={newPartner.name} onChange={(e) => setNewPartner({ ...newPartner, name: e.target.value })} className={inputCls} placeholder="e.g. Schneider Electric" />
              </Field>
              <Field label="Category">
                <input value={newPartner.category} onChange={(e) => setNewPartner({ ...newPartner, category: e.target.value })} className={inputCls} placeholder="OEM Manufacturer" />
              </Field>
              <Field label="Website URL">
                <input type="url" value={newPartner.websiteUrl} onChange={(e) => setNewPartner({ ...newPartner, websiteUrl: e.target.value })} className={inputCls} placeholder="https://partner.com" />
              </Field>
              <Field label="Logo Image (Upload File or Image URL) *">
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input value={newPartner.logoUrl} onChange={(e) => setNewPartner({ ...newPartner, logoUrl: e.target.value })} className={inputCls} placeholder="https://... or upload below" />
                    <label className="shrink-0 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg cursor-pointer font-bold border border-gray-200 text-[10px] flex items-center gap-1">
                      Upload Logo
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, (url) => setNewPartner((prev: any) => ({ ...prev, logoUrl: url })), 'partners')} />
                    </label>
                  </div>
                  {newPartner.logoUrl && (
                    <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 flex items-center justify-center h-16 w-36 overflow-hidden">
                      <img src={newPartner.logoUrl} alt="Logo preview" className="max-h-12 w-auto object-contain" />
                    </div>
                  )}
                </div>
              </Field>
              <Field label="Description">
                <textarea rows={2} value={newPartner.description} onChange={(e) => setNewPartner({ ...newPartner, description: e.target.value })} className={inputCls} placeholder="Brief details about OEM partnership..." />
              </Field>
              <div className="flex justify-end gap-2 pt-1">
                <Button type="button" variant="outline" size="sm" onClick={() => setShowPartnerModal(false)} className="text-xs h-8">Cancel</Button>
                <Button type="submit" size="sm" disabled={creating} className="bg-primary text-xs h-8 font-bold">{creating ? 'Creating...' : 'Add Partner'}</Button>
              </div>
            </form>
          </ModalWrap>
        ),

        // Edit Partner
        showEditPartnerModal && editPartner && (
          <ModalWrap key="edit-partner" title={`Edit Partner: ${editPartner.name}`} onClose={() => setShowEditPartnerModal(false)}>
            <form onSubmit={handleSavePartner} className="space-y-3 text-xs">
              <Field label="Partner / Brand Name *">
                <input required value={editPartner.name || ''} onChange={(e) => setEditPartner({ ...editPartner, name: e.target.value })} className={inputCls} />
              </Field>
              <Field label="Category">
                <input value={editPartner.category || ''} onChange={(e) => setEditPartner({ ...editPartner, category: e.target.value })} className={inputCls} placeholder="e.g. Technology Partner" />
              </Field>
              <Field label="Website URL">
                <input type="url" value={editPartner.websiteUrl || ''} onChange={(e) => setEditPartner({ ...editPartner, websiteUrl: e.target.value })} className={inputCls} placeholder="https://..." />
              </Field>
              <Field label="Logo Image (Upload File or Image URL)">
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input value={editPartner.logoUrl || ''} onChange={(e) => setEditPartner({ ...editPartner, logoUrl: e.target.value })} className={inputCls} placeholder="https://..." />
                    <label className="shrink-0 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg cursor-pointer font-bold border border-gray-200 text-[10px] flex items-center gap-1">
                      Upload Logo
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, (url) => setEditPartner((prev: any) => ({ ...prev, logoUrl: url })), 'partners')} />
                    </label>
                  </div>
                  {editPartner.logoUrl && (
                    <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 flex items-center justify-center h-16 w-36 overflow-hidden">
                      <img src={editPartner.logoUrl} alt="Logo preview" className="max-h-12 w-auto object-contain" />
                    </div>
                  )}
                </div>
              </Field>
              <Field label="Description">
                <textarea rows={2} value={editPartner.description || ''} onChange={(e) => setEditPartner({ ...editPartner, description: e.target.value })} className={inputCls} />
              </Field>
              <div className="flex justify-end gap-2 pt-1">
                <Button type="button" variant="outline" size="sm" onClick={() => setShowEditPartnerModal(false)} className="text-xs h-8">Cancel</Button>
                <Button type="submit" size="sm" disabled={saving} className="bg-primary text-xs h-8 font-bold">{saving ? 'Saving...' : 'Save Changes'}</Button>
              </div>
            </form>
          </ModalWrap>
        ),


        // Create Hero Slide
        showHeroModal && (
          <ModalWrap key="create-hero" title="Add Homepage Hero Slide" onClose={() => setShowHeroModal(false)}>
            <form onSubmit={handleCreateHeroSlide} className="space-y-3 text-xs">
              <Field label="Slide Title *">
                <input required value={newHeroSlide.title} onChange={(e) => setNewHeroSlide({ ...newHeroSlide, title: e.target.value })} className={inputCls} placeholder="e.g. Advanced Electrical & Power Infrastructure" />
              </Field>
              <Field label="Subtitle / Tagline">
                <input value={newHeroSlide.subtitle} onChange={(e) => setNewHeroSlide({ ...newHeroSlide, subtitle: e.target.value })} className={inputCls} placeholder="e.g. Engineering Reliability & Excellence" />
              </Field>
              <Field label="Badge Label (Optional)">
                <input value={newHeroSlide.badge} onChange={(e) => setNewHeroSlide({ ...newHeroSlide, badge: e.target.value })} className={inputCls} placeholder="e.g. ISO 9001 Certified" />
              </Field>
              <Field label="Description">
                <textarea rows={3} value={newHeroSlide.description} onChange={(e) => setNewHeroSlide({ ...newHeroSlide, description: e.target.value })} className={inputCls} placeholder="Brief summary for hero banner..." />
              </Field>
              <Field label="Slide Background Image (Upload File or Image URL)">
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input value={newHeroSlide.imageUrl} onChange={(e) => setNewHeroSlide({ ...newHeroSlide, imageUrl: e.target.value })} className={inputCls} placeholder="https://images.unsplash.com/..." />
                    <label className="shrink-0 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg cursor-pointer font-bold border border-gray-200 text-[10px] flex items-center gap-1">
                      Upload Image
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, (url) => setNewHeroSlide((prev: any) => ({ ...prev, imageUrl: url })), 'hero')} />
                    </label>
                  </div>
                  {newHeroSlide.imageUrl && (
                    <div className="h-28 w-full bg-gray-100 rounded-xl overflow-hidden border border-gray-200 relative">
                      <img src={newHeroSlide.imageUrl} alt="Hero slide preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Button CTA Text">
                  <input value={newHeroSlide.ctaText} onChange={(e) => setNewHeroSlide({ ...newHeroSlide, ctaText: e.target.value })} className={inputCls} placeholder="Explore Products" />
                </Field>
                <Field label="Button CTA Link">
                  <input value={newHeroSlide.ctaLink} onChange={(e) => setNewHeroSlide({ ...newHeroSlide, ctaLink: e.target.value })} className={inputCls} placeholder="/shop" />
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Sort Order Position">
                  <input type="number" value={newHeroSlide.orderPosition} onChange={(e) => setNewHeroSlide({ ...newHeroSlide, orderPosition: parseInt(e.target.value, 10) || 0 })} className={inputCls} />
                </Field>
                <Field label="Status">
                  <label className="flex items-center gap-2 pt-2 cursor-pointer font-bold text-gray-700">
                    <input type="checkbox" checked={newHeroSlide.isActive} onChange={(e) => setNewHeroSlide({ ...newHeroSlide, isActive: e.target.checked })} className="rounded border-gray-300 text-primary" />
                    Active Slide
                  </label>
                </Field>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setShowHeroModal(false)} className="text-xs h-8">Cancel</Button>
                <Button type="submit" size="sm" disabled={creating} className="bg-primary text-xs h-8 font-bold">{creating ? 'Creating...' : 'Add Slide'}</Button>
              </div>
            </form>
          </ModalWrap>
        ),

        // Edit Hero Slide
        showEditHeroModal && editHeroSlide && (
          <ModalWrap key="edit-hero" title="Edit Hero Slide" onClose={() => setShowEditHeroModal(false)}>
            <form onSubmit={handleSaveEditHeroSlide} className="space-y-3 text-xs">
              <Field label="Slide Title *">
                <input required value={editHeroSlide.title || ''} onChange={(e) => setEditHeroSlide({ ...editHeroSlide, title: e.target.value })} className={inputCls} />
              </Field>
              <Field label="Subtitle / Tagline">
                <input value={editHeroSlide.subtitle || ''} onChange={(e) => setEditHeroSlide({ ...editHeroSlide, subtitle: e.target.value })} className={inputCls} />
              </Field>
              <Field label="Badge Label (Optional)">
                <input value={editHeroSlide.badge || ''} onChange={(e) => setEditHeroSlide({ ...editHeroSlide, badge: e.target.value })} className={inputCls} />
              </Field>
              <Field label="Description">
                <textarea rows={3} value={editHeroSlide.description || ''} onChange={(e) => setEditHeroSlide({ ...editHeroSlide, description: e.target.value })} className={inputCls} />
              </Field>
              <Field label="Slide Background Image (Upload File or Image URL)">
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input value={editHeroSlide.imageUrl || ''} onChange={(e) => setEditHeroSlide({ ...editHeroSlide, imageUrl: e.target.value })} className={inputCls} />
                    <label className="shrink-0 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg cursor-pointer font-bold border border-gray-200 text-[10px] flex items-center gap-1">
                      Upload Image
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, (url) => setEditHeroSlide((prev: any) => ({ ...prev, imageUrl: url })), 'hero')} />
                    </label>
                  </div>
                  {editHeroSlide.imageUrl && (
                    <div className="h-28 w-full bg-gray-100 rounded-xl overflow-hidden border border-gray-200 relative">
                      <img src={editHeroSlide.imageUrl} alt="Hero slide preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Button CTA Text">
                  <input value={editHeroSlide.ctaText || ''} onChange={(e) => setEditHeroSlide({ ...editHeroSlide, ctaText: e.target.value })} className={inputCls} />
                </Field>
                <Field label="Button CTA Link">
                  <input value={editHeroSlide.ctaLink || ''} onChange={(e) => setEditHeroSlide({ ...editHeroSlide, ctaLink: e.target.value })} className={inputCls} />
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Sort Order Position">
                  <input type="number" value={editHeroSlide.orderPosition ?? 0} onChange={(e) => setEditHeroSlide({ ...editHeroSlide, orderPosition: parseInt(e.target.value, 10) || 0 })} className={inputCls} />
                </Field>
                <Field label="Status">
                  <label className="flex items-center gap-2 pt-2 cursor-pointer font-bold text-gray-700">
                    <input type="checkbox" checked={editHeroSlide.isActive !== false} onChange={(e) => setEditHeroSlide({ ...editHeroSlide, isActive: e.target.checked })} className="rounded border-gray-300 text-primary" />
                    Active Slide
                  </label>
                </Field>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setShowEditHeroModal(false)} className="text-xs h-8">Cancel</Button>
                <Button type="submit" size="sm" disabled={saving} className="bg-primary text-xs h-8 font-bold">{saving ? 'Saving...' : 'Save Changes'}</Button>
              </div>
            </form>
          </ModalWrap>
        ),


        // Delete confirm
        showDeleteConfirm && (
          <ModalWrap key="delete-confirm" title="Confirm Delete" onClose={() => setShowDeleteConfirm(null)} size="sm">
            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3 p-3 bg-red-50 border border-red-200 rounded-xl">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-red-700 mb-1">This action cannot be undone</p>
                  <p className="text-gray-500">Are you sure you want to delete <span className="font-bold text-gray-800">"{showDeleteConfirm.name}"</span>?</p>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" size="sm" onClick={() => setShowDeleteConfirm(null)} className="text-xs h-8">Cancel</Button>
                <Button size="sm" disabled={saving} onClick={handleDelete} className="bg-red-600 hover:bg-red-700 text-xs h-8 font-bold">
                  {saving ? 'Deleting...' : 'Delete Permanently'}
                </Button>
              </div>
            </div>
          </ModalWrap>
        ),
      ]}
    </div>
  )
}

// â”€â”€â”€ InventoryTabs: merged Products + Stock management â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function InventoryTabs({ localProducts, localCategories, brandsList, departmentsList, productDepartmentsList, productSpecsList, productSearch, setProductSearch, filteredProducts, handleEditProduct, setShowProductModal, setShowDeleteConfirm, flash }: any) {
  const [subTab, setSubTab] = useState<'products' | 'stock'>('products')
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-1 bg-gray-100 border border-gray-200 rounded-xl p-1 w-fit">
        {(['products', 'stock'] as const).map((t) => (
          <button key={t} onClick={() => setSubTab(t)}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all capitalize ${
              subTab === t ? 'bg-white text-gray-900 shadow border border-gray-200' : 'text-gray-500 hover:text-gray-700'
            }`}>
            {t === 'products' ? 'Products' : 'Stock Management'}
          </button>
        ))}
      </div>

      {subTab === 'products' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
            <input type="text" placeholder="Search by name, SKU, description..."
              value={productSearch} onChange={(e) => setProductSearch(e.target.value)}
              className="flex-1 max-w-sm px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs text-gray-900 focus:ring-2 focus:ring-primary focus:outline-none placeholder:text-gray-400" />
            <div className="flex items-center gap-2">
              <Button onClick={() => setShowProductModal(true)} size="sm" className="bg-primary hover:bg-primary/90 text-xs font-bold gap-1 h-8">
                <Plus className="w-3.5 h-3.5" /> Add Product
              </Button>
              <Link href="/shop" target="_blank">
                <Button size="sm" variant="outline" className="border-gray-300 text-xs gap-1 h-8">
                  <Eye className="w-3.5 h-3.5" /> Live Shop
                </Button>
              </Link>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 text-gray-400 uppercase font-semibold border-b border-gray-100">
                  <tr>{['Image','SKU','Product','Category','Brand','Price','Stock','Purchase','Featured','Actions'].map((h) => <th key={h} className="p-3 whitespace-nowrap">{h}</th>)}</tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredProducts.map((prod: any) => {
                    const cat = localCategories.find((c: any) => c.id === prod.categoryId)
                    return (
                      <tr key={prod.id} className="hover:bg-gray-50">
                        <td className="p-3">{prod.imageUrl ? <img src={prod.imageUrl} alt={prod.name} className="w-10 h-10 rounded-lg object-cover" /> : <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 text-[9px]">No img</div>}</td>
                        <td className="p-3 font-mono text-gray-400 whitespace-nowrap">{prod.sku || 'â€”'}</td>
                        <td className="p-3 font-bold text-gray-800 max-w-[180px]"><div className="truncate">{prod.name}</div>{prod.shortDescription && <div className="text-[10px] text-gray-400 font-normal truncate mt-0.5">{prod.shortDescription}</div>}</td>
                        <td className="p-3 text-gray-500 whitespace-nowrap">{cat?.name || `#${prod.categoryId}`}</td>
                        <td className="p-3 text-gray-500 whitespace-nowrap">{brandsList.find((b: any) => b.id === prod.brandId)?.name || <span className="text-gray-300">â€”</span>}</td>
                        <td className="p-3 whitespace-nowrap"><div className="font-bold text-primary">KES {parseFloat(prod.salePrice || prod.price || '0').toLocaleString()}</div>{prod.salePrice && prod.price && <div className="text-[10px] text-gray-400 line-through">KES {parseFloat(prod.price).toLocaleString()}</div>}</td>
                        <td className="p-3"><span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${stockBadge(prod.stockStatus || 'in_stock')}`}>{(prod.stockStatus || 'in_stock').replace(/_/g, ' ')}</span>{Number(prod.stockQuantity) > 0 && <span className="text-[10px] text-gray-400 ml-1">Ã—{prod.stockQuantity}</span>}</td>
                        <td className="p-3 text-gray-500 whitespace-nowrap">{(prod.purchaseType || 'buy_online').replace(/_/g, ' ')}</td>
                        <td className="p-3"><span className={`text-[10px] font-bold ${prod.isFeatured ? 'text-amber-500' : 'text-gray-300'}`}>{prod.isFeatured ? 'â˜… Yes' : 'No'}</span></td>
                        <td className="p-3"><div className="flex items-center gap-1.5">
                          <button onClick={() => handleEditProduct(prod)} className="p-1.5 rounded-lg bg-gray-100 hover:bg-primary/10 text-gray-400 hover:text-primary transition-colors" title="Edit"><Edit2 className="w-3.5 h-3.5" /></button>
                          <Link href={`/shop/product/${prod.slug}`} target="_blank"><button className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-400 hover:text-gray-700 transition-colors" title="View"><Eye className="w-3.5 h-3.5" /></button></Link>
                          <button onClick={() => setShowDeleteConfirm({ type: 'product', id: prod.id, name: prod.name })} className="p-1.5 rounded-lg bg-gray-100 hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors" title="Delete"><Trash2 className="w-3.5 h-3.5" /></button>
                        </div></td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
              {filteredProducts.length === 0 && <p className="text-xs text-gray-400 p-6 text-center">No products found.</p>}
            </div>
          </div>
        </div>
      )}

      {subTab === 'stock' && (
        <InventoryManager productsList={localProducts} flash={flash} />
      )}
    </div>
  )
}

// â”€â”€â”€ Modal Wrapper Component â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function ModalWrap({ title, onClose, children, size = 'md' }: { title: string; onClose: () => void; children: React.ReactNode; size?: 'sm' | 'md' | 'lg' }) {
  const widths = { sm: 'max-w-sm', md: 'max-w-lg', lg: 'max-w-2xl' }
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className={`bg-white border border-gray-200 rounded-2xl w-full ${widths[size]} p-5 shadow-2xl my-4`}>
        <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
          <h3 className="font-bold text-gray-900 text-sm">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 p-1 rounded-lg hover:bg-gray-100 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="max-h-[70vh] overflow-y-auto pr-1">{children}</div>
      </div>
    </div>
  )
}

