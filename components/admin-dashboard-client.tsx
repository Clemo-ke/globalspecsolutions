'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  LayoutDashboard,
  Package,
  FolderTree,
  ShoppingBag,
  MessageSquare,
  Settings,
  Image as ImageIcon,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Plus,
  Edit,
  Trash2,
  CheckCircle2,
  Clock,
  ChevronRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

interface AdminDashboardClientProps {
  stats: {
    totalOrders: number
    totalInquiries: number
    totalProducts: number
    totalCategories: number
  }
  recentOrders: any[]
  recentMessages: any[]
  productsList: any[]
  categoriesList: any[]
  servicesList?: any[]
  partnersList?: any[]
  settingsMap: Record<string, string>
}

export function AdminDashboardClient({
  stats,
  recentOrders,
  recentMessages,
  productsList,
  categoriesList,
  servicesList = [],
  partnersList = [],
  settingsMap,
}: AdminDashboardClientProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'products' | 'services' | 'partners' | 'messages' | 'settings'>('overview')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [settings, setSettings] = useState(settingsMap)
  const [savingSettings, setSavingSettings] = useState(false)
  const [saveNotice, setSaveNotice] = useState('')

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
      if (res.ok) {
        setSaveNotice('Settings updated successfully!')
        setTimeout(() => setSaveNotice(''), 3000)
      }
    } catch {
      setSaveNotice('Failed to update settings.')
    } finally {
      setSavingSettings(false)
    }
  }

  // Modals state
  const [showProductModal, setShowProductModal] = useState(false)
  const [showCategoryModal, setShowCategoryModal] = useState(false)
  const [showServiceModal, setShowServiceModal] = useState(false)
  const [showPartnerModal, setShowPartnerModal] = useState(false)

  // Creation forms state
  const [newProduct, setNewProduct] = useState({ name: '', price: '', stock: '10', description: '', categoryId: '', imageUrl: '' })
  const [newCategory, setNewCategory] = useState({ name: '', description: '' })
  const [newService, setNewService] = useState({ name: '', icon: 'Server', description: '', details: '', imageUrl: '' })
  const [newPartner, setNewPartner] = useState({ name: '', category: 'Technology Partner', websiteUrl: '', description: '', logoUrl: '' })
  const [creating, setCreating] = useState(false)

  // File upload handler (converts file to base64 data URL for direct instant usage)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, setter: (url: string) => void) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onloadend = () => {
      setter(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

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
        setNewProduct({ name: '', price: '', stock: '10', description: '', categoryId: '', imageUrl: '' })
        window.location.reload()
      }
    } finally {
      setCreating(false)
    }
  }

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
        setNewCategory({ name: '', description: '' })
        window.location.reload()
      }
    } finally {
      setCreating(false)
    }
  }

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
        setNewService({ name: '', icon: 'Server', description: '', details: '', imageUrl: '' })
        window.location.reload()
      }
    } finally {
      setCreating(false)
    }
  }

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
        setNewPartner({ name: '', category: 'Technology Partner', websiteUrl: '', description: '', logoUrl: '' })
        window.location.reload()
      }
    } finally {
      setCreating(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row">
      {/* Mobile top navbar */}
      <div className="md:hidden bg-slate-900 border-b border-slate-800 p-4 flex items-center justify-between">
        <span className="font-extrabold text-lg tracking-wide text-primary">Global Specs Solutions Admin</span>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 text-slate-300">
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`${
          sidebarOpen ? 'block' : 'hidden'
        } md:block w-full md:w-64 bg-slate-900 border-r border-slate-800 p-6 flex-col justify-between shrink-0`}
      >
        <div className="space-y-8">
          <div>
            <span className="text-lg font-black text-primary tracking-wider uppercase block">
              Global Specs Solutions
            </span>
            <span className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold block">
              Enterprise Dashboard
            </span>
          </div>

          <nav className="space-y-1.5 font-medium text-sm">
            <button
              onClick={() => {
                setActiveTab('overview')
                setSidebarOpen(false)
              }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all ${
                activeTab === 'overview'
                  ? 'bg-primary text-primary-foreground font-bold shadow-md'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" /> Overview
            </button>

            <button
              onClick={() => {
                setActiveTab('orders')
                setSidebarOpen(false)
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all ${
                activeTab === 'orders'
                  ? 'bg-primary text-primary-foreground font-bold shadow-md'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
              }`}
            >
              <span className="flex items-center gap-3">
                <ShoppingBag className="w-4 h-4" /> Orders
              </span>
              <span className="bg-slate-800 text-slate-200 text-xs px-2 py-0.5 rounded-full">
                {stats.totalOrders}
              </span>
            </button>

            <button
              onClick={() => {
                setActiveTab('products')
                setSidebarOpen(false)
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all ${
                activeTab === 'products'
                  ? 'bg-primary text-primary-foreground font-bold shadow-md'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
              }`}
            >
              <span className="flex items-center gap-3">
                <Package className="w-4 h-4" /> Products
              </span>
              <span className="bg-slate-800 text-slate-200 text-xs px-2 py-0.5 rounded-full">
                {stats.totalProducts}
              </span>
            </button>

            <button
              onClick={() => {
                setActiveTab('services')
                setSidebarOpen(false)
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all ${
                activeTab === 'services'
                  ? 'bg-primary text-primary-foreground font-bold shadow-md'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
              }`}
            >
              <span className="flex items-center gap-3">
                <FolderTree className="w-4 h-4" /> Services & Engineering
              </span>
              <span className="bg-slate-800 text-slate-200 text-xs px-2 py-0.5 rounded-full">
                {servicesList.length}
              </span>
            </button>

            <button
              onClick={() => {
                setActiveTab('partners')
                setSidebarOpen(false)
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all ${
                activeTab === 'partners'
                  ? 'bg-primary text-primary-foreground font-bold shadow-md'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
              }`}
            >
              <span className="flex items-center gap-3">
                <ImageIcon className="w-4 h-4" /> OEM Partners & Brands
              </span>
              <span className="bg-slate-800 text-slate-200 text-xs px-2 py-0.5 rounded-full">
                {partnersList.length}
              </span>
            </button>

            <button
              onClick={() => {
                setActiveTab('messages')
                setSidebarOpen(false)
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all ${
                activeTab === 'messages'
                  ? 'bg-primary text-primary-foreground font-bold shadow-md'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
              }`}
            >
              <span className="flex items-center gap-3">
                <MessageSquare className="w-4 h-4" /> Inquiries
              </span>
              <span className="bg-slate-800 text-slate-200 text-xs px-2 py-0.5 rounded-full">
                {stats.totalInquiries}
              </span>
            </button>

            <button
              onClick={() => {
                setActiveTab('settings')
                setSidebarOpen(false)
              }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all ${
                activeTab === 'settings'
                  ? 'bg-primary text-primary-foreground font-bold shadow-md'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
              }`}
            >
              <Settings className="w-4 h-4" /> Site Settings & Logo
            </button>
          </nav>
        </div>

        <div className="pt-6 border-t border-slate-800 space-y-3 mt-8">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-primary transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" /> View Public Site
          </Link>
        </div>
      </aside>

      {/* Main Admin Dashboard Content */}
      <main className="flex-1 p-6 md:p-10 space-y-8 overflow-y-auto">
        {/* Header with Quick Create Buttons */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <h1 className="text-2xl font-black text-slate-100 capitalize">
              {activeTab === 'overview' && 'System Overview & Metrics'}
              {activeTab === 'orders' && 'Customer WhatsApp Orders'}
              {activeTab === 'products' && 'Product Inventory & Catalog'}
              {activeTab === 'services' && 'Engineering Services & Solutions'}
              {activeTab === 'partners' && 'OEM Brand Partners & Manufacturers'}
              {activeTab === 'messages' && 'Customer Inquiry Submissions'}
              {activeTab === 'settings' && 'Global Site Settings, Logo & Colors'}
            </h1>
            <p className="text-xs text-slate-400">
              Create and manage products, services, brand partners, and site settings.
            </p>
          </div>

          {/* Quick Create Buttons */}
          <div className="flex items-center gap-3 flex-wrap">
            <Button
              onClick={() => setShowProductModal(true)}
              size="sm"
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold gap-1.5 text-xs shadow-md"
            >
              <Plus className="w-3.5 h-3.5" /> Create Product
            </Button>

            <Button
              onClick={() => setShowServiceModal(true)}
              size="sm"
              variant="outline"
              className="border-slate-700 hover:bg-slate-800 text-slate-200 gap-1.5 text-xs"
            >
              <Plus className="w-3.5 h-3.5" /> Create Service
            </Button>

            <Button
              onClick={() => setShowPartnerModal(true)}
              size="sm"
              variant="outline"
              className="border-slate-700 hover:bg-slate-800 text-slate-200 gap-1.5 text-xs"
            >
              <Plus className="w-3.5 h-3.5" /> Create Partner
            </Button>
          </div>
        </div>

        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Total Orders</span>
                <div className="text-3xl font-black text-primary">{stats.totalOrders}</div>
                <span className="text-[10px] text-emerald-400 font-semibold">Active Pipeline</span>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Total Products</span>
                <div className="text-3xl font-black text-amber-500">{stats.totalProducts}</div>
                <span className="text-[10px] text-slate-400 font-semibold">{stats.totalCategories} Categories</span>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Inquiries Received</span>
                <div className="text-3xl font-black text-purple-400">{stats.totalInquiries}</div>
                <span className="text-[10px] text-slate-400 font-semibold">Contact Messages</span>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">WhatsApp Config</span>
                <div className="text-sm font-bold text-emerald-400 truncate">{settings.whatsapp_number}</div>
                <span className="text-[10px] text-slate-400 font-semibold">Live Ordering Target</span>
              </div>
            </div>

            {/* Recent Orders Overview Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-bold text-lg text-slate-100 flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-primary" /> Recent Orders
                </h2>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="text-xs font-bold text-primary hover:underline"
                >
                  View All Orders &rarr;
                </button>
              </div>

              {recentOrders.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-950 text-slate-400 uppercase font-semibold border-b border-slate-800">
                      <tr>
                        <th className="p-3">Order Number</th>
                        <th className="p-3">Customer</th>
                        <th className="p-3">Phone</th>
                        <th className="p-3">Amount</th>
                        <th className="p-3">Status</th>
                        <th className="p-3">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {recentOrders.map((ord) => (
                        <tr key={ord.id} className="hover:bg-slate-800/40">
                          <td className="p-3 font-bold text-primary">{ord.orderNumber}</td>
                          <td className="p-3 text-slate-200 font-medium">{ord.customerName}</td>
                          <td className="p-3 text-slate-400">{ord.customerPhone}</td>
                          <td className="p-3 font-bold text-slate-100">KES {Number(ord.total).toLocaleString()}</td>
                          <td className="p-3">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                              {ord.status}
                            </span>
                          </td>
                          <td className="p-3 text-slate-400">
                            {new Date(ord.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-xs text-slate-500 py-4">No recent orders found.</p>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Orders */}
        {activeTab === 'orders' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h2 className="font-bold text-lg text-slate-100">All WhatsApp Orders ({recentOrders.length})</h2>
            {recentOrders.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950 text-slate-400 uppercase font-semibold border-b border-slate-800">
                    <tr>
                      <th className="p-3">Order Number</th>
                      <th className="p-3">Customer Name</th>
                      <th className="p-3">Phone</th>
                      <th className="p-3">Email</th>
                      <th className="p-3">Location</th>
                      <th className="p-3">Total</th>
                      <th className="p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {recentOrders.map((ord) => (
                      <tr key={ord.id} className="hover:bg-slate-800/40">
                        <td className="p-3 font-bold text-primary">{ord.orderNumber}</td>
                        <td className="p-3 text-slate-200 font-medium">{ord.customerName}</td>
                        <td className="p-3 text-slate-400">{ord.customerPhone}</td>
                        <td className="p-3 text-slate-400">{ord.customerEmail}</td>
                        <td className="p-3 text-slate-400">{ord.deliveryLocation || 'N/A'}</td>
                        <td className="p-3 font-bold text-slate-100">KES {Number(ord.total).toLocaleString()}</td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                            {ord.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-xs text-slate-500">No orders logged in the database.</p>
            )}
          </div>
        )}

        {/* Tab 3: Products */}
        {activeTab === 'products' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-lg text-slate-100">Products Catalog ({productsList.length})</h2>
              <div className="flex items-center gap-3">
                <Button onClick={() => setShowProductModal(true)} size="sm" className="bg-primary hover:bg-primary/90 text-xs font-bold gap-1.5">
                  <Plus className="w-3.5 h-3.5" /> Create Product
                </Button>
                <Link href="/shop" target="_blank">
                  <Button size="sm" variant="outline" className="border-slate-700 text-xs gap-1.5">
                    <ExternalLink className="w-3.5 h-3.5" /> View Public Shop
                  </Button>
                </Link>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 uppercase font-semibold border-b border-slate-800">
                  <tr>
                    <th className="p-3">SKU</th>
                    <th className="p-3">Product Name</th>
                    <th className="p-3">Price</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {productsList.map((prod) => (
                    <tr key={prod.id} className="hover:bg-slate-800/40">
                      <td className="p-3 font-mono text-slate-400">{prod.sku || 'N/A'}</td>
                      <td className="p-3 font-bold text-slate-200">{prod.name}</td>
                      <td className="p-3 font-bold text-primary">
                        KES {parseFloat(prod.price || '0').toLocaleString()}
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                          {prod.stockStatus || 'In Stock'}
                        </span>
                      </td>
                      <td className="p-3">
                        <Link href={`/shop/product/${prod.slug}`} target="_blank" className="text-primary hover:underline font-semibold">
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3.5: Services */}
        {activeTab === 'services' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-lg text-slate-100">Engineering & Services Catalog ({servicesList.length})</h2>
              <div className="flex items-center gap-3">
                <Button onClick={() => setShowServiceModal(true)} size="sm" className="bg-primary hover:bg-primary/90 text-xs font-bold gap-1.5">
                  <Plus className="w-3.5 h-3.5" /> Create Service
                </Button>
                <Link href="/services" target="_blank">
                  <Button size="sm" variant="outline" className="border-slate-700 text-xs gap-1.5">
                    <ExternalLink className="w-3.5 h-3.5" /> View Services Page
                  </Button>
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {servicesList.map((srv) => (
                <div key={srv.id} className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-100">{srv.name}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-primary/20 text-primary">{srv.icon || 'Server'}</span>
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-2">{srv.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3.6: Partners */}
        {activeTab === 'partners' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-lg text-slate-100">OEM Partners & Brands ({partnersList.length})</h2>
              <div className="flex items-center gap-3">
                <Button onClick={() => setShowPartnerModal(true)} size="sm" className="bg-primary hover:bg-primary/90 text-xs font-bold gap-1.5">
                  <Plus className="w-3.5 h-3.5" /> Create Partner
                </Button>
                <Link href="/partners" target="_blank">
                  <Button size="sm" variant="outline" className="border-slate-700 text-xs gap-1.5">
                    <ExternalLink className="w-3.5 h-3.5" /> View Partners Page
                  </Button>
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {partnersList.map((ptn) => (
                <div key={ptn.id} className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-100 block">{ptn.name}</span>
                    <span className="text-[10px] text-slate-400">{ptn.category || 'Technology Partner'}</span>
                  </div>
                  {ptn.logoUrl && (
                    <img src={ptn.logoUrl} alt={ptn.name} className="h-8 w-auto object-contain max-w-[80px]" />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Inquiries */}
        {activeTab === 'messages' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h2 className="font-bold text-lg text-slate-100">Contact Form Messages ({recentMessages.length})</h2>
            {recentMessages.length > 0 ? (
              <div className="space-y-4">
                {recentMessages.map((msg) => (
                  <div key={msg.id} className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-primary">{msg.name} ({msg.email})</span>
                      <span className="text-slate-500">{new Date(msg.createdAt).toLocaleString()}</span>
                    </div>
                    {msg.phone && <span className="text-xs text-slate-400 block">Phone: {msg.phone}</span>}
                    <p className="text-xs text-slate-300 bg-slate-900/60 p-3 rounded-lg border border-slate-800/60">
                      {msg.message}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500">No contact messages received.</p>
            )}
          </div>
        )}

        {/* Tab 5: Site Settings, Logo & Colors */}
        {activeTab === 'settings' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-2xl space-y-6">
            <h2 className="font-bold text-lg text-slate-100 border-b border-slate-800 pb-3">
              Global Site Branding & Settings
            </h2>

            {saveNotice && (
              <div className="p-3 text-xs bg-emerald-950 text-emerald-400 border border-emerald-800 rounded-md">
                {saveNotice}
              </div>
            )}

            <form onSubmit={handleSaveSettings} className="space-y-5 text-xs">
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-4">
                <h3 className="font-bold text-slate-200 uppercase tracking-wider text-[11px] text-primary">Brand Logo & Primary Color</h3>
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Company Logo Image (Upload or URL)</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      value={settings.site_logo_url || ''}
                      onChange={(e) => setSettings({ ...settings, site_logo_url: e.target.value })}
                      className="flex-1 px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-100"
                      placeholder="https://example.com/logo.png"
                    />
                    <label className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-2 rounded-lg cursor-pointer font-bold border border-slate-700">
                      Upload File
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileUpload(e, (url) => setSettings({ ...settings, site_logo_url: url }))}
                      />
                    </label>
                  </div>
                </div>
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Primary Theme Accent Color</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={settings.primary_color || '#2563eb'}
                      onChange={(e) => setSettings({ ...settings, primary_color: e.target.value })}
                      className="w-10 h-10 rounded-lg border border-slate-800 bg-slate-900 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={settings.primary_color || '#2563eb'}
                      onChange={(e) => setSettings({ ...settings, primary_color: e.target.value })}
                      className="w-32 px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-100 font-mono"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">WhatsApp Order Number</label>
                <input
                  type="text"
                  value={settings.whatsapp_number || ''}
                  onChange={(e) => setSettings({ ...settings, whatsapp_number: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:ring-2 focus:ring-primary focus:outline-none"
                  placeholder="+254721113431"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Company Phone Numbers</label>
                <input
                  type="text"
                  value={settings.company_phone || ''}
                  onChange={(e) => setSettings({ ...settings, company_phone: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Company Contact Email</label>
                <input
                  type="email"
                  value={settings.company_email || ''}
                  onChange={(e) => setSettings({ ...settings, company_email: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Office Address / Location</label>
                <textarea
                  rows={2}
                  value={settings.company_address || ''}
                  onChange={(e) => setSettings({ ...settings, company_address: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100"
                />
              </div>

              <Button
                type="submit"
                disabled={savingSettings}
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-6 py-2.5 text-xs rounded-xl shadow-md"
              >
                {savingSettings ? 'Saving Settings...' : 'Save Site Settings'}
              </Button>
            </form>
          </div>
        )}
      </main>

      {/* Modal: Create Product */}
      {showProductModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-lg text-slate-100">Create New Product</h3>
              <button onClick={() => setShowProductModal(false)} className="text-slate-400 hover:text-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-300 mb-1">Product Title *</label>
                <input
                  type="text"
                  required
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100"
                  placeholder="e.g. Cisco Catalyst 9300 Switch"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Price (KES) *</label>
                  <input
                    type="number"
                    required
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100"
                    placeholder="150000"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Initial Stock</label>
                  <input
                    type="number"
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Product Image (Upload File or URL)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newProduct.imageUrl}
                    onChange={(e) => setNewProduct({ ...newProduct, imageUrl: e.target.value })}
                    className="flex-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100"
                    placeholder="https://..."
                  />
                  <label className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-2 rounded-lg cursor-pointer font-bold border border-slate-700">
                    Upload
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, (url) => setNewProduct({ ...newProduct, imageUrl: url }))}
                    />
                  </label>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100"
                  placeholder="High-performance enterprise networking..."
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="outline" onClick={() => setShowProductModal(false)} className="border-slate-800 text-xs">
                  Cancel
                </Button>
                <Button type="submit" disabled={creating} className="bg-primary hover:bg-primary/90 font-bold text-xs">
                  {creating ? 'Saving...' : 'Create Product'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Create Service */}
      {showServiceModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-lg text-slate-100">Create New Service</h3>
              <button onClick={() => setShowServiceModal(false)} className="text-slate-400 hover:text-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateService} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-300 mb-1">Service Title *</label>
                <input
                  type="text"
                  required
                  value={newService.name}
                  onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100"
                  placeholder="e.g. Data Centre Cooling & DCIM"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Service Image (Upload File or URL)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newService.imageUrl}
                    onChange={(e) => setNewService({ ...newService, imageUrl: e.target.value })}
                    className="flex-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100"
                    placeholder="https://..."
                  />
                  <label className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-2 rounded-lg cursor-pointer font-bold border border-slate-700">
                    Upload
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, (url) => setNewService({ ...newService, imageUrl: url }))}
                    />
                  </label>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={newService.description}
                  onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100"
                  placeholder="Comprehensive server room maintenance..."
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="outline" onClick={() => setShowServiceModal(false)} className="border-slate-800 text-xs">
                  Cancel
                </Button>
                <Button type="submit" disabled={creating} className="bg-primary hover:bg-primary/90 font-bold text-xs">
                  {creating ? 'Saving...' : 'Create Service'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Create Partner */}
      {showPartnerModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-lg text-slate-100">Create Brand Partner</h3>
              <button onClick={() => setShowPartnerModal(false)} className="text-slate-400 hover:text-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePartner} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-300 mb-1">Partner / Brand Name *</label>
                <input
                  type="text"
                  required
                  value={newPartner.name}
                  onChange={(e) => setNewPartner({ ...newPartner, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100"
                  placeholder="e.g. Schneider Electric"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Category</label>
                <input
                  type="text"
                  value={newPartner.category}
                  onChange={(e) => setNewPartner({ ...newPartner, category: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100"
                  placeholder="OEM Manufacturer"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Logo Image (Upload File or URL)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newPartner.logoUrl}
                    onChange={(e) => setNewPartner({ ...newPartner, logoUrl: e.target.value })}
                    className="flex-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100"
                    placeholder="https://..."
                  />
                  <label className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-2 rounded-lg cursor-pointer font-bold border border-slate-700">
                    Upload
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, (url) => setNewPartner({ ...newPartner, logoUrl: url }))}
                    />
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="outline" onClick={() => setShowPartnerModal(false)} className="border-slate-800 text-xs">
                  Cancel
                </Button>
                <Button type="submit" disabled={creating} className="bg-primary hover:bg-primary/90 font-bold text-xs">
                  {creating ? 'Saving...' : 'Create Partner'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
