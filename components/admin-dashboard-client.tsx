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
} from 'lucide-react'
import { Button } from '@/components/ui/button'

// ─── Types ────────────────────────────────────────────────────────────────────
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
  settingsMap: Record<string, string>
}

// ─── Status Badge Colours ─────────────────────────────────────────────────────
function orderStatusColor(status: string) {
  switch (status) {
    case 'New': return 'bg-blue-950 text-blue-400 border-blue-800'
    case 'Contacted': return 'bg-purple-950 text-purple-400 border-purple-800'
    case 'Confirmed': return 'bg-amber-950 text-amber-400 border-amber-800'
    case 'Processing': return 'bg-orange-950 text-orange-400 border-orange-800'
    case 'Completed': return 'bg-emerald-950 text-emerald-400 border-emerald-800'
    case 'Cancelled': return 'bg-red-950 text-red-400 border-red-800'
    default: return 'bg-slate-800 text-slate-300 border-slate-700'
  }
}

function msgStatusColor(status: string) {
  switch (status) {
    case 'New': return 'bg-blue-950 text-blue-400 border-blue-800'
    case 'Read': return 'bg-slate-800 text-slate-400 border-slate-700'
    case 'Replied': return 'bg-emerald-950 text-emerald-400 border-emerald-800'
    case 'Archived': return 'bg-red-950 text-red-400 border-red-800'
    default: return 'bg-slate-800 text-slate-400 border-slate-700'
  }
}

function stockBadge(status: string) {
  switch (status) {
    case 'in_stock': return 'bg-emerald-950 text-emerald-400 border-emerald-800'
    case 'available_on_order': return 'bg-amber-950 text-amber-400 border-amber-800'
    case 'out_of_stock': return 'bg-red-950 text-red-400 border-red-800'
    default: return 'bg-slate-800 text-slate-400 border-slate-700'
  }
}

// ─── Input component ──────────────────────────────────────────────────────────
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">{label}</label>
      {children}
    </div>
  )
}

const inputCls = 'w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-100 text-xs focus:ring-2 focus:ring-primary focus:outline-none placeholder:text-slate-600'
const selectCls = 'w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-100 text-xs focus:ring-2 focus:ring-primary focus:outline-none'

// ─── Component ────────────────────────────────────────────────────────────────
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
  settingsMap,
}: AdminDashboardClientProps) {
  type Tab = 'overview' | 'orders' | 'products' | 'categories' | 'services' | 'solutions' | 'hero' | 'partners' | 'messages' | 'quotes' | 'settings'
  const [activeTab, setActiveTab] = useState<Tab>('overview')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [settings, setSettings] = useState(settingsMap)
  const [savingSettings, setSavingSettings] = useState(false)
  const [saveNotice, setSaveNotice] = useState('')

  // ── Local lists (mutated optimistically) ──────────────────────────────────
  const [localProducts, setLocalProducts] = useState<any[]>(productsList)
  const [localCategories, setLocalCategories] = useState<any[]>(categoriesList)
  const [localOrders, setLocalOrders] = useState<any[]>(recentOrders)
  const [localMessages, setLocalMessages] = useState<any[]>(recentMessages)
  const [localPartners, setLocalPartners] = useState<any[]>(partnersList)
  const [localSolutions, setLocalSolutions] = useState<any[]>(solutionsList)
  const [localHeroSlides, setLocalHeroSlides] = useState<any[]>(heroSlidesList)

  // ── Modal visibility ───────────────────────────────────────────────────────
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
  const [creating, setCreating] = useState(false)
  const [saving, setSaving] = useState(false)
  const [notice, setNotice] = useState('')

  // ── Create forms ───────────────────────────────────────────────────────────
  const emptyProduct = { name: '', price: '', salePrice: '', sku: '', description: '', categoryId: '', imageUrl: '', stockStatus: 'in_stock', isFeatured: false, features: '' }
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

  // ── Edit forms ─────────────────────────────────────────────────────────────
  const [editProduct, setEditProduct] = useState<any>(null)
  const [editCategory, setEditCategory] = useState<any>(null)
  const [editSolution, setEditSolution] = useState<any>(null)
  const [editPartner, setEditPartner] = useState<any>(null)
  const [editHeroSlide, setEditHeroSlide] = useState<any>(null)



  // ── Filters / Search ───────────────────────────────────────────────────────
  const [productSearch, setProductSearch] = useState('')
  const [orderStatusFilter, setOrderStatusFilter] = useState('All')

  // ── Helper ─────────────────────────────────────────────────────────────────
  const flash = (msg: string) => {
    setNotice(msg)
    setTimeout(() => setNotice(''), 3500)
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, setter: (url: string) => void) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onloadend = () => setter(reader.result as string)
    reader.readAsDataURL(file)
  }

  // ─── Settings save ─────────────────────────────────────────────────────────
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

  // ─── Create product ────────────────────────────────────────────────────────
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
        flash('✅ Product created successfully')
        window.location.reload()
      } else {
        flash('❌ Failed to create product')
      }
    } finally {
      setCreating(false)
    }
  }

  // ─── Edit product ──────────────────────────────────────────────────────────
  const handleEditProduct = (prod: any) => {
    setEditProduct({ ...prod })
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
        flash('✅ Product updated successfully')
      } else {
        flash('❌ Failed to update product')
      }
    } finally {
      setSaving(false)
    }
  }

  // ─── Create category ───────────────────────────────────────────────────────
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
        flash('✅ Category created')
        window.location.reload()
      } else {
        flash('❌ Failed to create category')
      }
    } finally {
      setCreating(false)
    }
  }

  // ─── Edit category ─────────────────────────────────────────────────────────
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
        flash('✅ Category updated')
      } else {
        flash('❌ Failed to update category')
      }
    } finally {
      setSaving(false)
    }
  }

  // ─── Create service ────────────────────────────────────────────────────────
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
        flash('✅ Service created')
        window.location.reload()
      }
    } finally {
      setCreating(false)
    }
  }

  // ─── Create solution ───────────────────────────────────────────────────────
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
        flash('✅ Solution created')
        window.location.reload()
      }
    } finally {
      setCreating(false)
    }
  }

  // ─── Edit solution ─────────────────────────────────────────────────────────
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
        flash('✅ Solution updated')
      } else {
        flash('❌ Failed to update solution')
      }
    } finally {
      setSaving(false)
    }
  }

  // ─── Create partner ────────────────────────────────────────────────────────
  const handleCreatePartner = async (e: React.FormEvent) => {
    e.preventDefault()
    setCreating(true)
    try {
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'partner', ...newPartner }),
      })
      if (res.ok) {
        setShowPartnerModal(false)
        setNewPartner(emptyPartner)
        flash('✅ Partner created')
        window.location.reload()
      }
    } finally {
      setCreating(false)
    }
  }

  // ─── Edit partner ──────────────────────────────────────────────────────────
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
        flash('✅ Partner updated')
      } else {
        flash('❌ Failed to update partner')
      }
    } finally {
      setSaving(false)
    }
  }

  // ─── Hero Slide Handlers ──────────────────────────────────────────────────
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
        flash('✅ Hero slide created')
        const refresh = await fetch('/api/admin/hero-slides')
        if (refresh.ok) setLocalHeroSlides(await refresh.json())
      } else {
        flash('❌ Failed to create hero slide')
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
        flash('✅ Hero slide updated')
      } else {
        flash('❌ Failed to update hero slide')
      }
    } finally {
      setSaving(false)
    }
  }

  // ─── Delete handler ────────────────────────────────────────────────────────
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
        flash(`✅ ${showDeleteConfirm.name} deleted`)
      } else {
        flash('❌ Delete failed')
      }
    } finally {
      setSaving(false)
      setShowDeleteConfirm(null)
    }
  }



  // ─── Order status update ───────────────────────────────────────────────────
  const handleOrderStatusChange = async (orderId: number, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      if (res.ok) {
        setLocalOrders((prev: any[]) => prev.map((o: any) => (o.id === orderId ? { ...o, status: newStatus } : o)))
        flash(`✅ Order status updated to ${newStatus}`)
      }
    } catch {
      flash('❌ Failed to update order status')
    }
  }

  // ─── Filtered data ─────────────────────────────────────────────────────────
  const filteredProducts = localProducts.filter((p: any) => {
    const s = productSearch.toLowerCase()
    return !s || p.name?.toLowerCase().includes(s) || p.sku?.toLowerCase().includes(s) || p.description?.toLowerCase().includes(s)
  })

  const filteredOrders = orderStatusFilter === 'All'
    ? localOrders
    : localOrders.filter((o: any) => o.status === orderStatusFilter)

  // ─── Revenue calc ──────────────────────────────────────────────────────────
  const totalRevenue = localOrders
    .filter((o: any) => o.status !== 'Cancelled')
    .reduce((sum: number, o: any) => sum + parseFloat(o.total || '0'), 0)

  // ─── NavLink helper ────────────────────────────────────────────────────────
  const NavBtn = ({ tab, icon, label, count }: { tab: Tab; icon: React.ReactNode; label: string; count?: number }) => (
    <button
      onClick={() => { setActiveTab(tab); setSidebarOpen(false) }}
      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all text-sm ${activeTab === tab ? 'bg-primary text-primary-foreground font-bold shadow-md' : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'}`}
    >
      <span className="flex items-center gap-3">{icon}{label}</span>
      {count !== undefined && (
        <span className={`text-[10px] px-2 py-0.5 rounded-full ${activeTab === tab ? 'bg-white/20' : 'bg-slate-800 text-slate-300'}`}>{count}</span>
      )}
    </button>
  )

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row">
      {/* ── Mobile top bar ── */}
      <div className="md:hidden bg-slate-900 border-b border-slate-800 p-4 flex items-center justify-between sticky top-0 z-40">
        <span className="font-extrabold text-base text-primary">GSS Admin</span>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 text-slate-300">
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* ── Sidebar ── */}
      <aside className={`${sidebarOpen ? 'flex' : 'hidden'} md:flex flex-col w-full md:w-64 bg-slate-900 border-r border-slate-800 p-5 shrink-0 sticky top-0 h-screen overflow-y-auto`}>
        <div className="mb-8">
          <span className="text-sm font-black text-primary tracking-wider uppercase block">Global Spec Solutions</span>
          <span className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">Enterprise Dashboard</span>
        </div>
        <nav className="space-y-1 font-medium text-sm flex-1">
          <NavBtn tab="overview" icon={<LayoutDashboard className="w-4 h-4" />} label="Overview" />
          <NavBtn tab="orders" icon={<ShoppingBag className="w-4 h-4" />} label="Orders" count={localOrders.length} />
          <NavBtn tab="hero" icon={<Images className="w-4 h-4" />} label="Hero Carousel" count={localHeroSlides.length} />
          <NavBtn tab="products" icon={<Package className="w-4 h-4" />} label="Products" count={localProducts.length} />
          <NavBtn tab="categories" icon={<FolderTree className="w-4 h-4" />} label="Categories" count={localCategories.length} />
          <NavBtn tab="services" icon={<TrendingUp className="w-4 h-4" />} label="Services" count={servicesList.length} />
          <NavBtn tab="solutions" icon={<Zap className="w-4 h-4" />} label="Solutions" count={localSolutions.length} />
          <NavBtn tab="partners" icon={<Users className="w-4 h-4" />} label="Partners" count={localPartners.length} />
          <NavBtn tab="messages" icon={<MessageSquare className="w-4 h-4" />} label="Inquiries" count={localMessages.length} />
          <NavBtn tab="quotes" icon={<FileText className="w-4 h-4" />} label="Quote Requests" count={recentQuotes.length} />
          <NavBtn tab="settings" icon={<Settings className="w-4 h-4" />} label="Settings" />
        </nav>
        <div className="pt-5 border-t border-slate-800 space-y-2 mt-4">
          <Link href="/" target="_blank" className="flex items-center gap-2 text-xs text-slate-400 hover:text-primary transition-colors font-medium">
            <ExternalLink className="w-3.5 h-3.5" /> View Public Site
          </Link>
          <Link href="/shop" target="_blank" className="flex items-center gap-2 text-xs text-slate-400 hover:text-primary transition-colors font-medium">
            <ExternalLink className="w-3.5 h-3.5" /> View Shop
          </Link>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto space-y-6">
        {/* Global notice */}
        {notice && (
          <div className="fixed top-4 right-4 z-[100] bg-slate-800 border border-slate-700 text-slate-100 text-xs font-semibold px-4 py-3 rounded-xl shadow-2xl backdrop-blur animate-fadeInUp">
            {notice}
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <h1 className="text-xl font-black text-slate-100">
              {activeTab === 'overview' && 'System Overview'}
              {activeTab === 'orders' && 'Customer Orders'}
              {activeTab === 'products' && 'Product Catalog'}
              {activeTab === 'categories' && 'Product Categories'}
              {activeTab === 'services' && 'Engineering Services'}
              {activeTab === 'solutions' && 'Enterprise Solutions'}
              {activeTab === 'partners' && 'OEM Partners & Brands'}
              {activeTab === 'messages' && 'Customer Inquiries'}
              {activeTab === 'quotes' && 'Quote Requests'}
              {activeTab === 'settings' && 'Site Settings'}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">Global Spec Solutions – globalspecsolutions.com</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {(activeTab === 'products' || activeTab === 'overview') && (
              <Button onClick={() => setShowProductModal(true)} size="sm" className="bg-primary hover:bg-primary/90 text-xs font-bold gap-1.5 h-8">
                <Plus className="w-3.5 h-3.5" /> Add Product
              </Button>
            )}
            {(activeTab === 'categories') && (
              <Button onClick={() => setShowCategoryModal(true)} size="sm" className="bg-primary hover:bg-primary/90 text-xs font-bold gap-1.5 h-8">
                <Plus className="w-3.5 h-3.5" /> Add Category
              </Button>
            )}
            {(activeTab === 'services') && (
              <Button onClick={() => setShowServiceModal(true)} size="sm" variant="outline" className="border-slate-700 text-xs gap-1.5 h-8">
                <Plus className="w-3.5 h-3.5" /> Add Service
              </Button>
            )}
            {(activeTab === 'solutions') && (
              <Button onClick={() => setShowSolutionModal(true)} size="sm" className="bg-primary hover:bg-primary/90 text-xs font-bold gap-1.5 h-8">
                <Plus className="w-3.5 h-3.5" /> Add Solution
              </Button>
            )}
            {(activeTab === 'partners') && (
              <Button onClick={() => setShowPartnerModal(true)} size="sm" variant="outline" className="border-slate-700 text-xs gap-1.5 h-8">
                <Plus className="w-3.5 h-3.5" /> Add Partner
              </Button>
            )}
          </div>
        </div>

        {/* ══════════════════ TAB: OVERVIEW ════════════════════════════════ */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stat cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Total Orders', value: localOrders.length, sub: `KES ${totalRevenue.toLocaleString()} revenue`, color: 'text-primary' },
                { label: 'Products', value: localProducts.length, sub: `${localCategories.length} categories`, color: 'text-amber-400' },
                { label: 'Inquiries', value: localMessages.length, sub: `${recentQuotes.length} quote requests`, color: 'text-purple-400' },
                { label: 'WhatsApp', value: settings.whatsapp_number || '+254721113431', sub: 'Active order line', color: 'text-emerald-400', isText: true },
              ].map((card, i) => (
                <div key={i} className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">{card.label}</span>
                  <div className={`text-2xl font-black ${card.color} ${card.isText ? 'text-sm truncate pt-1' : ''}`}>{card.value}</div>
                  <span className="text-[10px] text-slate-500 font-medium">{card.sub}</span>
                </div>
              ))}
            </div>

            {/* Order status breakdown */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {['New', 'Contacted', 'Confirmed', 'Processing', 'Completed', 'Cancelled'].map((status) => {
                const count = localOrders.filter((o) => o.status === status).length
                return (
                  <div key={status} className={`p-3 rounded-xl border text-center ${orderStatusColor(status)}`}>
                    <div className="text-lg font-black">{count}</div>
                    <div className="text-[10px] font-bold">{status}</div>
                  </div>
                )
              })}
            </div>

            {/* Recent orders table */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="font-bold text-slate-100 flex items-center gap-2 text-sm"><ShoppingBag className="w-4 h-4 text-primary" /> Recent Orders</h2>
                <button onClick={() => setActiveTab('orders')} className="text-xs font-bold text-primary hover:underline">View All →</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950 text-slate-500 uppercase font-semibold border-b border-slate-800">
                    <tr>{['Order #', 'Customer', 'Phone', 'Amount', 'Status', 'Date'].map((h) => <th key={h} className="p-3">{h}</th>)}</tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {localOrders.slice(0, 6).map((ord) => (
                      <tr key={ord.id} className="hover:bg-slate-800/30">
                        <td className="p-3 font-bold text-primary">{ord.orderNumber}</td>
                        <td className="p-3 font-medium text-slate-200">{ord.customerName}</td>
                        <td className="p-3 text-slate-400">{ord.customerPhone}</td>
                        <td className="p-3 font-bold text-slate-100">KES {Number(ord.total).toLocaleString()}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${orderStatusColor(ord.status)}`}>{ord.status}</span>
                        </td>
                        <td className="p-3 text-slate-500">{new Date(ord.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Featured products */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
              <h2 className="font-bold text-slate-100 text-sm flex items-center gap-2"><Star className="w-4 h-4 text-amber-400" /> Featured Products</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {localProducts.filter((p) => p.isFeatured).slice(0, 6).map((p) => (
                  <div key={p.id} className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center gap-3">
                    {p.imageUrl && <img src={p.imageUrl} alt={p.name} className="w-12 h-12 rounded-lg object-cover shrink-0" />}
                    <div className="min-w-0">
                      <div className="font-bold text-xs text-slate-200 truncate">{p.name}</div>
                      <div className="text-xs text-primary font-bold">KES {parseFloat(p.salePrice || p.price || '0').toLocaleString()}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════ TAB: ORDERS ══════════════════════════════════ */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            {/* Status filter */}
            <div className="flex items-center gap-2 flex-wrap">
              {['All', 'New', 'Contacted', 'Confirmed', 'Processing', 'Completed', 'Cancelled'].map((s) => (
                <button
                  key={s}
                  onClick={() => setOrderStatusFilter(s)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-full border transition-all ${orderStatusFilter === s ? 'bg-primary text-primary-foreground border-primary' : 'border-slate-700 text-slate-400 hover:border-slate-500'}`}
                >
                  {s} {s !== 'All' && `(${localOrders.filter((o) => o.status === s).length})`}
                </button>
              ))}
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950 text-slate-500 uppercase font-semibold border-b border-slate-800">
                    <tr>{['Order #', 'Customer', 'Phone', 'Email', 'Location', 'Total', 'Status', 'Actions'].map((h) => <th key={h} className="p-3 whitespace-nowrap">{h}</th>)}</tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50">
                    {filteredOrders.map((ord) => (
                      <tr key={ord.id} className="hover:bg-slate-800/30">
                        <td className="p-3 font-bold text-primary whitespace-nowrap">{ord.orderNumber}</td>
                        <td className="p-3 font-medium text-slate-200 whitespace-nowrap">{ord.customerName}</td>
                        <td className="p-3 text-slate-400 whitespace-nowrap">{ord.customerPhone}</td>
                        <td className="p-3 text-slate-400 whitespace-nowrap">{ord.customerEmail}</td>
                        <td className="p-3 text-slate-400 max-w-[120px] truncate">{ord.deliveryLocation || '—'}</td>
                        <td className="p-3 font-bold text-slate-100 whitespace-nowrap">KES {Number(ord.total).toLocaleString()}</td>
                        <td className="p-3">
                          <select
                            value={ord.status}
                            onChange={(e) => handleOrderStatusChange(ord.id, e.target.value)}
                            className={`text-[10px] font-bold px-2 py-1 rounded-lg border bg-transparent cursor-pointer ${orderStatusColor(ord.status)}`}
                          >
                            {['New', 'Contacted', 'Confirmed', 'Processing', 'Completed', 'Cancelled'].map((s) => (
                              <option key={s} value={s} className="bg-slate-950 text-slate-100">{s}</option>
                            ))}
                          </select>
                        </td>
                        <td className="p-3">
                          <a
                            href={`https://wa.me/${(settings.whatsapp_number || '+254721113431').replace(/[^0-9]/g, '')}?text=Hi, regarding order ${ord.orderNumber}`}
                            target="_blank"
                            className="text-emerald-400 hover:text-emerald-300 text-[10px] font-bold"
                          >
                            WhatsApp
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredOrders.length === 0 && (
                  <p className="text-xs text-slate-500 p-6 text-center">No orders found for this filter.</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════ TAB: PRODUCTS ════════════════════════════════ */}
        {activeTab === 'products' && (
          <div className="space-y-4">
            {/* Search + actions */}
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
              <input
                type="text"
                placeholder="Search products by name, SKU, description..."
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                className="flex-1 max-w-sm px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-100 focus:ring-2 focus:ring-primary focus:outline-none placeholder:text-slate-600"
              />
              <div className="flex items-center gap-2">
                <Button onClick={() => setShowProductModal(true)} size="sm" className="bg-primary hover:bg-primary/90 text-xs font-bold gap-1 h-8">
                  <Plus className="w-3.5 h-3.5" /> Add Product
                </Button>
                <Link href="/shop" target="_blank">
                  <Button size="sm" variant="outline" className="border-slate-700 text-xs gap-1 h-8">
                    <Eye className="w-3.5 h-3.5" /> Live Shop
                  </Button>
                </Link>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950 text-slate-500 uppercase font-semibold border-b border-slate-800">
                    <tr>{['Image', 'SKU', 'Product Name', 'Category', 'Price', 'Stock', 'Featured', 'Actions'].map((h) => <th key={h} className="p-3 whitespace-nowrap">{h}</th>)}</tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50">
                    {filteredProducts.map((prod) => {
                      const cat = localCategories.find((c) => c.id === prod.categoryId)
                      return (
                        <tr key={prod.id} className="hover:bg-slate-800/30">
                          <td className="p-3">
                            {prod.imageUrl ? (
                              <img src={prod.imageUrl} alt={prod.name} className="w-10 h-10 rounded-lg object-cover" />
                            ) : (
                              <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-slate-600 text-[9px]">No img</div>
                            )}
                          </td>
                          <td className="p-3 font-mono text-slate-400 whitespace-nowrap">{prod.sku || '—'}</td>
                          <td className="p-3 font-bold text-slate-200 max-w-[200px]">
                            <div className="truncate">{prod.name}</div>
                            {prod.description && <div className="text-[10px] text-slate-500 font-normal truncate mt-0.5">{prod.description}</div>}
                          </td>
                          <td className="p-3 text-slate-400 whitespace-nowrap">{cat?.name || `Cat #${prod.categoryId}`}</td>
                          <td className="p-3 whitespace-nowrap">
                            <div className="font-bold text-primary">KES {parseFloat(prod.salePrice || prod.price || '0').toLocaleString()}</div>
                            {prod.salePrice && prod.price && (
                              <div className="text-[10px] text-slate-500 line-through">KES {parseFloat(prod.price).toLocaleString()}</div>
                            )}
                          </td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${stockBadge(prod.stockStatus || 'in_stock')}`}>
                              {(prod.stockStatus || 'in_stock').replace('_', ' ')}
                            </span>
                          </td>
                          <td className="p-3">
                            <span className={`text-[10px] font-bold ${prod.isFeatured ? 'text-amber-400' : 'text-slate-600'}`}>
                              {prod.isFeatured ? '⭐ Yes' : 'No'}
                            </span>
                          </td>
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleEditProduct(prod)}
                                className="p-1.5 rounded-lg bg-slate-800 hover:bg-primary/20 text-slate-400 hover:text-primary transition-colors"
                                title="Edit"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <Link href={`/shop/product/${prod.slug}`} target="_blank">
                                <button className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors" title="View">
                                  <Eye className="w-3.5 h-3.5" />
                                </button>
                              </Link>
                              <button
                                onClick={() => setShowDeleteConfirm({ type: 'product', id: prod.id, name: prod.name })}
                                className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-900/30 text-slate-500 hover:text-red-400 transition-colors"
                                title="Delete"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
                {filteredProducts.length === 0 && (
                  <p className="text-xs text-slate-500 p-6 text-center">No products found.</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════ TAB: CATEGORIES ══════════════════════════════ */}
        {activeTab === 'categories' && (
          <div className="space-y-4">
            <div className="flex justify-end">
              <Button onClick={() => setShowCategoryModal(true)} size="sm" className="bg-primary hover:bg-primary/90 text-xs font-bold gap-1 h-8">
                <Plus className="w-3.5 h-3.5" /> Add Category
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {localCategories.map((cat) => {
                const prodCount = localProducts.filter((p) => p.categoryId === cat.id).length
                return (
                  <div key={cat.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{cat.icon || '📦'}</span>
                        <div>
                          <div className="font-bold text-slate-200 text-sm">{cat.name}</div>
                          <div className="text-[10px] text-slate-500">{prodCount} product{prodCount !== 1 ? 's' : ''}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button onClick={() => handleEditCategory(cat)} className="p-1.5 rounded-lg bg-slate-800 hover:bg-primary/20 text-slate-400 hover:text-primary transition-colors">
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => setShowDeleteConfirm({ type: 'category', id: cat.id, name: cat.name })} className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-900/30 text-slate-500 hover:text-red-400 transition-colors">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    {cat.description && <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-2">{cat.description}</p>}
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full border border-slate-700" style={{ backgroundColor: cat.color || '#2563eb' }} />
                      <span className="text-[10px] text-slate-500 font-mono">{cat.color || '#2563eb'}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* ══════════════════ TAB: SERVICES ════════════════════════════════ */}
        {activeTab === 'services' && (
          <div className="space-y-4">
            <div className="flex justify-end">
              <Button onClick={() => setShowServiceModal(true)} size="sm" className="bg-primary hover:bg-primary/90 text-xs font-bold gap-1 h-8">
                <Plus className="w-3.5 h-3.5" /> Add Service
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {servicesList.map((srv) => (
                <div key={srv.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-100 text-sm">{srv.name}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-primary/20 text-primary">{srv.icon || 'Server'}</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">{srv.description}</p>
                  {srv.details && <p className="text-[11px] text-slate-500 leading-relaxed border-t border-slate-800 pt-2">{srv.details}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ══════════════════ TAB: SOLUTIONS ═══════════════════════════════ */}
        {activeTab === 'solutions' && (
          <div className="space-y-4">
            <div className="flex justify-end">
              <Button onClick={() => setShowSolutionModal(true)} size="sm" className="bg-primary hover:bg-primary/90 text-xs font-bold gap-1 h-8">
                <Plus className="w-3.5 h-3.5" /> Add Solution
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {localSolutions.map((sol) => (
                <div key={sol.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3 flex flex-col justify-between">
                  <div className="space-y-3">
                    {sol.imageUrl && (
                      <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-slate-950 border border-slate-800">
                        <img src={sol.imageUrl} alt={sol.title} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className="space-y-1">
                      <h3 className="font-bold text-slate-100 text-sm leading-snug">{sol.title}</h3>
                      {sol.description && <p className="text-xs text-slate-400 leading-relaxed">{sol.description}</p>}
                    </div>
                    {sol.benefits && (
                      <div className="flex flex-wrap gap-1 pt-1 border-t border-slate-800/60">
                        {sol.benefits.split(',').map((b: string, i: number) => (
                          <span key={i} className="text-[10px] bg-slate-950 text-slate-300 px-2 py-0.5 rounded-full border border-slate-800 font-medium">
                            ✓ {b.trim()}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleEditSolution(sol)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-primary/20 text-slate-400 hover:text-primary transition-colors text-xs font-semibold flex items-center gap-1 px-2.5"
                    >
                      <Edit2 className="w-3.5 h-3.5" /> Edit
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm({ type: 'solution', id: sol.id, name: sol.title })}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-900/30 text-slate-500 hover:text-red-400 transition-colors"
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


        {/* ══════════════════ TAB: HERO CAROUSEL ═══════════════════════════ */}
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
              {localHeroSlides.map((slide) => (
                <div key={slide.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                  {/* Image Preview Box */}
                  <div className="w-full md:w-64 h-36 bg-slate-950 rounded-xl overflow-hidden relative border border-slate-800 shrink-0">
                    {slide.imageUrl ? (
                      <img src={slide.imageUrl} alt={slide.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-slate-950 text-slate-600 text-xs font-bold">
                        No Image Set
                      </div>
                    )}
                    <div className="absolute top-2 left-2 flex items-center gap-1.5">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${slide.isActive !== false ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-slate-800 text-slate-400'}`}>
                        {slide.isActive !== false ? 'Active Slide' : 'Disabled'}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-900/90 text-slate-300 border border-slate-700">
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
                    <h3 className="font-extrabold text-slate-100 text-lg leading-snug">{slide.title}</h3>
                    {slide.description && (
                      <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">{slide.description}</p>
                    )}
                    <div className="flex items-center gap-3 pt-2 text-xs">
                      {slide.ctaText && (
                        <span className="bg-slate-800 text-slate-200 px-3 py-1 rounded-lg border border-slate-700 font-bold">
                          Button: {slide.ctaText} → ({slide.ctaLink || '/shop'})
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex md:flex-col items-center gap-2 shrink-0 w-full md:w-auto justify-end border-t md:border-t-0 border-slate-800 pt-3 md:pt-0">
                    <button
                      onClick={() => handleEditHeroSlide(slide)}
                      className="p-2 rounded-xl bg-slate-800 hover:bg-primary/20 text-slate-300 hover:text-primary transition-colors text-xs font-semibold flex items-center gap-1 px-3 w-full justify-center"
                    >
                      <Edit2 className="w-3.5 h-3.5" /> Edit Slide
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm({ type: 'hero_slide', id: slide.id, name: slide.title })}
                      className="p-2 rounded-xl bg-slate-800 hover:bg-red-900/30 text-slate-500 hover:text-red-400 transition-colors text-xs font-semibold flex items-center gap-1 px-3 w-full justify-center"
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


        {/* ══════════════════ TAB: PARTNERS ════════════════════════════════ */}
        {activeTab === 'partners' && (
          <div className="space-y-4">
            <div className="flex justify-end">
              <Button onClick={() => setShowPartnerModal(true)} size="sm" className="bg-primary hover:bg-primary/90 text-xs font-bold gap-1 h-8">
                <Plus className="w-3.5 h-3.5" /> Add Partner
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {localPartners.map((ptn) => (
                <div key={ptn.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3 flex flex-col justify-between">
                  <div className="space-y-3">
                    {/* Logo Image Preview Box */}
                    <div className="p-3 bg-white rounded-xl flex items-center justify-center h-20 border border-slate-800/50 overflow-hidden relative">
                      {ptn.logoUrl ? (
                        <img src={ptn.logoUrl} alt={ptn.name} className="max-h-12 w-auto object-contain" />
                      ) : (
                        <span className="font-extrabold text-sm text-slate-900">{ptn.name}</span>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-100 text-sm">{ptn.name}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">{ptn.category || 'Partner'}</span>
                      </div>
                      {ptn.description && <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{ptn.description}</p>}
                      {ptn.websiteUrl && (
                        <a href={ptn.websiteUrl} target="_blank" className="text-[10px] text-primary hover:underline block mt-1.5 font-medium truncate">
                          {ptn.websiteUrl}
                        </a>
                      )}
                    </div>
                  </div>
                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleEditPartner(ptn)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-primary/20 text-slate-400 hover:text-primary transition-colors text-xs font-semibold flex items-center gap-1 px-2.5"
                    >
                      <Edit2 className="w-3.5 h-3.5" /> Edit
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm({ type: 'partner', id: ptn.id, name: ptn.name })}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-900/30 text-slate-500 hover:text-red-400 transition-colors"
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


        {/* ══════════════════ TAB: MESSAGES ════════════════════════════════ */}
        {activeTab === 'messages' && (
          <div className="space-y-4">
            {localMessages.length > 0 ? (
              <div className="space-y-3">
                {localMessages.map((msg) => (
                  <div key={msg.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="font-bold text-primary text-sm">{msg.name}</span>
                        <span className="text-xs text-slate-400 ml-2">({msg.email})</span>
                        {msg.phone && <span className="text-xs text-slate-500 ml-2">· {msg.phone}</span>}
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${msgStatusColor(msg.status)}`}>{msg.status}</span>
                        <span className="text-[10px] text-slate-600">{new Date(msg.createdAt).toLocaleString()}</span>
                      </div>
                    </div>
                    {msg.subject && <div className="text-xs font-semibold text-slate-300">Re: {msg.subject}</div>}
                    <p className="text-xs text-slate-300 bg-slate-950/60 p-3 rounded-xl border border-slate-800/60 leading-relaxed">{msg.message}</p>
                    <div className="flex gap-2">
                      <a href={`mailto:${msg.email}?subject=Re: ${msg.subject || 'Your Inquiry'}`} className="text-[10px] font-bold text-primary hover:underline">Reply via Email</a>
                      {msg.phone && <a href={`https://wa.me/${msg.phone.replace(/[^0-9]/g, '')}`} target="_blank" className="text-[10px] font-bold text-emerald-400 hover:underline">WhatsApp</a>}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 text-center py-12">No contact messages received yet.</p>
            )}
          </div>
        )}

        {/* ══════════════════ TAB: QUOTES ══════════════════════════════════ */}
        {activeTab === 'quotes' && (
          <div className="space-y-4">
            {recentQuotes.length > 0 ? (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-950 text-slate-500 uppercase font-semibold border-b border-slate-800">
                      <tr>{['Quote #', 'Customer', 'Company', 'Email', 'Phone', 'Status', 'Date'].map((h) => <th key={h} className="p-3 whitespace-nowrap">{h}</th>)}</tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50">
                      {recentQuotes.map((q) => (
                        <tr key={q.id} className="hover:bg-slate-800/30">
                          <td className="p-3 font-bold text-primary whitespace-nowrap">{q.quoteNumber}</td>
                          <td className="p-3 font-medium text-slate-200">{q.customerName}</td>
                          <td className="p-3 text-slate-400">{q.companyName || '—'}</td>
                          <td className="p-3 text-slate-400">{q.customerEmail}</td>
                          <td className="p-3 text-slate-400">{q.customerPhone}</td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${orderStatusColor(q.status)}`}>{q.status}</span>
                          </td>
                          <td className="p-3 text-slate-500">{new Date(q.createdAt).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500 text-center py-12">No quote requests yet.</p>
            )}
          </div>
        )}

        {/* ══════════════════ TAB: SETTINGS ════════════════════════════════ */}
        {activeTab === 'settings' && (
          <div className="max-w-2xl space-y-4">
            {saveNotice && (
              <div className={`p-3 text-xs rounded-xl border font-semibold ${saveNotice.includes('success') ? 'bg-emerald-950 text-emerald-400 border-emerald-800' : 'bg-red-950 text-red-400 border-red-800'}`}>{saveNotice}</div>
            )}
            <form onSubmit={handleSaveSettings} className="space-y-4">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
                <h3 className="text-[11px] font-bold text-primary uppercase tracking-wider">Brand & Identity</h3>
                <Field label="Company Logo URL">
                  <div className="flex gap-2">
                    <input type="text" value={settings.site_logo_url || ''} onChange={(e) => setSettings({ ...settings, site_logo_url: e.target.value })} className={inputCls} placeholder="https://example.com/logo.png" />
                    <label className="shrink-0 bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-2 rounded-lg cursor-pointer font-bold border border-slate-700 text-xs">
                      Upload
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, (url) => setSettings({ ...settings, site_logo_url: url }))} />
                    </label>
                  </div>
                </Field>
                <Field label="Primary Accent Color">
                  <div className="flex items-center gap-2">
                    <input type="color" value={settings.primary_color || '#2563eb'} onChange={(e) => setSettings({ ...settings, primary_color: e.target.value })} className="w-10 h-10 rounded-lg border border-slate-700 bg-slate-900 cursor-pointer" />
                    <input type="text" value={settings.primary_color || '#2563eb'} onChange={(e) => setSettings({ ...settings, primary_color: e.target.value })} className="w-32 px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-100 text-xs font-mono" />
                  </div>
                </Field>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
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

              <Button type="submit" disabled={savingSettings} className="bg-primary hover:bg-primary/90 font-bold px-6 py-2.5 text-xs rounded-xl">
                {savingSettings ? <><RefreshCw className="w-3.5 h-3.5 mr-1.5 animate-spin" />Saving...</> : <><Save className="w-3.5 h-3.5 mr-1.5" />Save Settings</>}
              </Button>
            </form>
          </div>
        )}
      </main>

      {/* ══════════════════ MODALS ══════════════════════════════════════════ */}

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
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="SKU">
                  <input value={newProduct.sku} onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })} className={inputCls} placeholder="GSS-UPS-001" />
                </Field>
                <Field label="Category *">
                  <select required value={newProduct.categoryId} onChange={(e) => setNewProduct({ ...newProduct, categoryId: e.target.value })} className={selectCls}>
                    <option value="">Select category</option>
                    {localCategories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
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
                    <option value="true">Yes ⭐</option>
                  </select>
                </Field>
              </div>
              <Field label="Product Image URL or Upload">
                <div className="flex gap-2">
                  <input value={newProduct.imageUrl} onChange={(e) => setNewProduct({ ...newProduct, imageUrl: e.target.value })} className={inputCls} placeholder="https://..." />
                  <label className="shrink-0 bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-2 rounded-lg cursor-pointer font-bold border border-slate-700 text-[10px]">
                    Upload<input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, (url) => setNewProduct({ ...newProduct, imageUrl: url }))} />
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
                <Button type="button" variant="outline" size="sm" onClick={() => setShowProductModal(false)} className="border-slate-700 text-xs h-8">Cancel</Button>
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
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="SKU">
                  <input value={editProduct.sku || ''} onChange={(e) => setEditProduct({ ...editProduct, sku: e.target.value })} className={inputCls} />
                </Field>
                <Field label="Category">
                  <select value={editProduct.categoryId || ''} onChange={(e) => setEditProduct({ ...editProduct, categoryId: e.target.value })} className={selectCls}>
                    {localCategories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
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
                    <option value="true">Yes ⭐</option>
                  </select>
                </Field>
              </div>
              <Field label="Image URL or Upload">
                <div className="flex gap-2">
                  <input value={editProduct.imageUrl || ''} onChange={(e) => setEditProduct({ ...editProduct, imageUrl: e.target.value })} className={inputCls} placeholder="https://..." />
                  <label className="shrink-0 bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-2 rounded-lg cursor-pointer font-bold border border-slate-700 text-[10px]">
                    Upload<input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, (url) => setEditProduct({ ...editProduct, imageUrl: url }))} />
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
                <Button type="button" variant="outline" size="sm" onClick={() => setShowEditProductModal(false)} className="border-slate-700 text-xs h-8">Cancel</Button>
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
                  <input value={newCategory.icon} onChange={(e) => setNewCategory({ ...newCategory, icon: e.target.value })} className={inputCls} placeholder="⚡ or 🖥️" />
                </Field>
                <Field label="Brand Color">
                  <input type="color" value={newCategory.color} onChange={(e) => setNewCategory({ ...newCategory, color: e.target.value })} className="w-full h-9 rounded-lg border border-slate-700 bg-slate-950 cursor-pointer" />
                </Field>
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <Button type="button" variant="outline" size="sm" onClick={() => setShowCategoryModal(false)} className="border-slate-700 text-xs h-8">Cancel</Button>
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
                  <input value={editCategory.icon || ''} onChange={(e) => setEditCategory({ ...editCategory, icon: e.target.value })} className={inputCls} placeholder="⚡ or 🖥️" />
                </Field>
                <Field label="Brand Color">
                  <input type="color" value={editCategory.color || '#2563eb'} onChange={(e) => setEditCategory({ ...editCategory, color: e.target.value })} className="w-full h-9 rounded-lg border border-slate-700 bg-slate-950 cursor-pointer" />
                </Field>
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <Button type="button" variant="outline" size="sm" onClick={() => setShowEditCategoryModal(false)} className="border-slate-700 text-xs h-8">Cancel</Button>
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
                  <label className="shrink-0 bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-2 rounded-lg cursor-pointer font-bold border border-slate-700 text-[10px]">
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
                <Button type="button" variant="outline" size="sm" onClick={() => setShowServiceModal(false)} className="border-slate-700 text-xs h-8">Cancel</Button>
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
                  <label className="shrink-0 bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-2 rounded-lg cursor-pointer font-bold border border-slate-700 text-[10px]">
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
                <Button type="button" variant="outline" size="sm" onClick={() => setShowSolutionModal(false)} className="border-slate-700 text-xs h-8">Cancel</Button>
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
                  <label className="shrink-0 bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-2 rounded-lg cursor-pointer font-bold border border-slate-700 text-[10px]">
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
                <Button type="button" variant="outline" size="sm" onClick={() => setShowEditSolutionModal(false)} className="border-slate-700 text-xs h-8">Cancel</Button>
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
                    <label className="shrink-0 bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-2 rounded-lg cursor-pointer font-bold border border-slate-700 text-[10px] flex items-center gap-1">
                      Upload Logo
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, (url) => setNewPartner({ ...newPartner, logoUrl: url }))} />
                    </label>
                  </div>
                  {newPartner.logoUrl && (
                    <div className="p-3 bg-white rounded-xl border border-slate-700 flex items-center justify-center h-16 w-36 overflow-hidden">
                      <img src={newPartner.logoUrl} alt="Logo preview" className="max-h-12 w-auto object-contain" />
                    </div>
                  )}
                </div>
              </Field>
              <Field label="Description">
                <textarea rows={2} value={newPartner.description} onChange={(e) => setNewPartner({ ...newPartner, description: e.target.value })} className={inputCls} placeholder="Brief details about OEM partnership..." />
              </Field>
              <div className="flex justify-end gap-2 pt-1">
                <Button type="button" variant="outline" size="sm" onClick={() => setShowPartnerModal(false)} className="border-slate-700 text-xs h-8">Cancel</Button>
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
                    <label className="shrink-0 bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-2 rounded-lg cursor-pointer font-bold border border-slate-700 text-[10px] flex items-center gap-1">
                      Upload Logo
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, (url) => setEditPartner({ ...editPartner, logoUrl: url }))} />
                    </label>
                  </div>
                  {editPartner.logoUrl && (
                    <div className="p-3 bg-white rounded-xl border border-slate-700 flex items-center justify-center h-16 w-36 overflow-hidden">
                      <img src={editPartner.logoUrl} alt="Logo preview" className="max-h-12 w-auto object-contain" />
                    </div>
                  )}
                </div>
              </Field>
              <Field label="Description">
                <textarea rows={2} value={editPartner.description || ''} onChange={(e) => setEditPartner({ ...editPartner, description: e.target.value })} className={inputCls} />
              </Field>
              <div className="flex justify-end gap-2 pt-1">
                <Button type="button" variant="outline" size="sm" onClick={() => setShowEditPartnerModal(false)} className="border-slate-700 text-xs h-8">Cancel</Button>
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
                    <label className="shrink-0 bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-2 rounded-lg cursor-pointer font-bold border border-slate-700 text-[10px] flex items-center gap-1">
                      Upload Image
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, (url) => setNewHeroSlide({ ...newHeroSlide, imageUrl: url }))} />
                    </label>
                  </div>
                  {newHeroSlide.imageUrl && (
                    <div className="h-28 w-full bg-slate-950 rounded-xl overflow-hidden border border-slate-800 relative">
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
                  <label className="flex items-center gap-2 pt-2 cursor-pointer font-bold text-slate-300">
                    <input type="checkbox" checked={newHeroSlide.isActive} onChange={(e) => setNewHeroSlide({ ...newHeroSlide, isActive: e.target.checked })} className="rounded bg-slate-950 border-slate-700 text-primary" />
                    Active Slide
                  </label>
                </Field>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setShowHeroModal(false)} className="border-slate-700 text-xs h-8">Cancel</Button>
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
                    <label className="shrink-0 bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-2 rounded-lg cursor-pointer font-bold border border-slate-700 text-[10px] flex items-center gap-1">
                      Upload Image
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, (url) => setEditHeroSlide({ ...editHeroSlide, imageUrl: url }))} />
                    </label>
                  </div>
                  {editHeroSlide.imageUrl && (
                    <div className="h-28 w-full bg-slate-950 rounded-xl overflow-hidden border border-slate-800 relative">
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
                  <label className="flex items-center gap-2 pt-2 cursor-pointer font-bold text-slate-300">
                    <input type="checkbox" checked={editHeroSlide.isActive !== false} onChange={(e) => setEditHeroSlide({ ...editHeroSlide, isActive: e.target.checked })} className="rounded bg-slate-950 border-slate-700 text-primary" />
                    Active Slide
                  </label>
                </Field>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setShowEditHeroModal(false)} className="border-slate-700 text-xs h-8">Cancel</Button>
                <Button type="submit" size="sm" disabled={saving} className="bg-primary text-xs h-8 font-bold">{saving ? 'Saving...' : 'Save Changes'}</Button>
              </div>
            </form>
          </ModalWrap>
        ),


        // Delete confirm
        showDeleteConfirm && (
          <ModalWrap key="delete-confirm" title="Confirm Delete" onClose={() => setShowDeleteConfirm(null)} size="sm">
            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3 p-3 bg-red-950/40 border border-red-800/50 rounded-xl">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-red-300 mb-1">This action cannot be undone</p>
                  <p className="text-slate-400">Are you sure you want to delete <span className="font-bold text-slate-200">"{showDeleteConfirm.name}"</span>?</p>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" size="sm" onClick={() => setShowDeleteConfirm(null)} className="border-slate-700 text-xs h-8">Cancel</Button>
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

// ─── Modal Wrapper Component ──────────────────────────────────────────────────
function ModalWrap({
  title,
  onClose,
  children,
  size = 'md',
}: {
  title: string
  onClose: () => void
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg'
}) {
  const widths = { sm: 'max-w-sm', md: 'max-w-lg', lg: 'max-w-2xl' }
  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className={`bg-slate-900 border border-slate-800 rounded-2xl w-full ${widths[size]} p-5 shadow-2xl my-4`}>
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
          <h3 className="font-bold text-slate-100 text-sm">{title}</h3>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-200 p-1 rounded-lg hover:bg-slate-800 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="max-h-[70vh] overflow-y-auto pr-1">{children}</div>
      </div>
    </div>
  )
}
