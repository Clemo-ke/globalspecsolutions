'use client'

import React, { useMemo, useState } from 'react'
import {
  TrendingUp,
  ShoppingBag,
  ReceiptText,
  Users,
  FileText,
  MessageSquare,
  Download,
  Filter,
  RotateCcw,
  Boxes,
  PieChart,
  BarChart3,
  Calendar,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
} from 'lucide-react'
import {
  AreaTrendChart,
  DonutShareChart,
  ComparativeBarChart,
  ConversionFunnelChart,
  Sparkline,
  TrendPoint,
  DonutSegment,
  BarGroup,
  fmtKES,
  fmtNum,
} from '@/components/admin/admin-charts'

interface Props {
  ordersList: any[]
  orderItemsList: any[]
  productsList: any[]
  categoriesList: any[]
  customersList: any[]
  quotesList: any[]
  messagesList: any[]
  brandsList?: any[]
}

const asDate = (v: any): Date | null => {
  if (!v) return null
  if (v instanceof Date) return v
  if (typeof v === 'string') {
    const d = new Date(v)
    return isNaN(d.getTime()) ? null : d
  }
  return null
}

const dayKey = (d: Date) => (d.toISOString ? d.toISOString().slice(0, 10) : '')
const shortDate = (d: Date) => d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })

const PALETTE = [
  '#2563eb', // Blue
  '#10b981', // Emerald
  '#f59e0b', // Amber
  '#8b5cf6', // Violet
  '#06b6d4', // Cyan
  '#ec4899', // Pink
  '#f97316', // Orange
  '#64748b', // Slate
]

export function AnalyticsView({
  ordersList,
  orderItemsList,
  productsList,
  categoriesList,
  customersList,
  quotesList,
  messagesList,
  brandsList = [],
}: Props) {
  const [range, setRange] = useState<'7' | '30' | '90' | '365' | 'all'>('30')
  const [customFrom, setCustomFrom] = useState('')
  const [customTo, setCustomTo] = useState('')
  const [chartMetric, setChartMetric] = useState<'revenue' | 'orders' | 'both'>('both')

  // Date filtering
  const from = useMemo(() => {
    if (range === 'all') return null
    const d = new Date()
    d.setDate(d.getDate() - parseInt(range, 10))
    d.setHours(0, 0, 0, 0)
    return d
  }, [range])

  const inRange = (v: any) => {
    if (!v) return false
    const d = asDate(v)
    if (!d) return false
    if (range === 'all') {
      if (customFrom && customTo) {
        return d >= new Date(customFrom) && d <= new Date(customTo + 'T23:59:59')
      }
      return true
    }
    return from ? d >= from : true
  }

  // Filtered dataset
  const orders = useMemo(() => ordersList.filter((o) => inRange(o.createdAt)), [ordersList, from, range, customFrom, customTo])
  const customers = useMemo(() => customersList.filter((c) => inRange(c.createdAt)), [customersList, from, range, customFrom, customTo])
  const quotes = useMemo(() => quotesList.filter((q) => inRange(q.createdAt)), [quotesList, from, range, customFrom, customTo])
  const messages = useMemo(() => messagesList.filter((m) => inRange(m.createdAt)), [messagesList, from, range, customFrom, customTo])

  const revenueOrders = orders.filter((o) => o.status !== 'Cancelled')
  const revenue = revenueOrders.reduce((s, o) => s + parseFloat(o.total || '0'), 0)
  const aov = orders.length ? revenue / orders.length : 0

  // ── Period Comparison ────────────────────────────────────────────────────────
  const prevFrom = from && range !== 'all' ? new Date(from.getTime() - parseInt(range, 10) * 86400000) : null
  const prevOrders = useMemo(() => {
    if (!prevFrom || !from) return []
    return ordersList.filter((o) => {
      const d = asDate(o.createdAt)
      return d && d >= prevFrom && d < from
    })
  }, [ordersList, prevFrom, from])

  const prevRevenue = prevOrders.filter((o) => o.status !== 'Cancelled').reduce((s, o) => s + parseFloat(o.total || '0'), 0)
  const revenueChange = prevRevenue > 0 ? ((revenue - prevRevenue) / prevRevenue) * 100 : revenue > 0 ? 100 : 0
  const ordersChange = prevOrders.length > 0 ? ((orders.length - prevOrders.length) / prevOrders.length) * 100 : orders.length > 0 ? 100 : 0

  // ── Daily / Trend Buckets ────────────────────────────────────────────────────
  const dailyStats: Record<string, { revenue: number; orders: number; quotes: number }> = {}

  orders.forEach((o) => {
    const d = asDate(o.createdAt)
    if (!d) return
    const k = dayKey(d)
    if (!dailyStats[k]) dailyStats[k] = { revenue: 0, orders: 0, quotes: 0 }
    if (o.status !== 'Cancelled') {
      dailyStats[k].revenue += parseFloat(o.total || '0')
    }
    dailyStats[k].orders += 1
  })

  quotes.forEach((q) => {
    const d = asDate(q.createdAt)
    if (!d) return
    const k = dayKey(d)
    if (!dailyStats[k]) dailyStats[k] = { revenue: 0, orders: 0, quotes: 0 }
    dailyStats[k].quotes += 1
  })

  // Format trend points for AreaTrendChart
  const trendPoints: TrendPoint[] = useMemo(() => {
    const pts: TrendPoint[] = []
    const numDays = range === 'all' ? 30 : Math.min(60, parseInt(range, 10))
    const start = from ? new Date(from) : new Date(Date.now() - 30 * 86400000)

    for (let i = 0; i <= numDays; i++) {
      const cur = new Date(start.getTime() + i * 86400000)
      if (cur > new Date()) break
      const k = dayKey(cur)
      const stat = dailyStats[k] || { revenue: 0, orders: 0, quotes: 0 }
      pts.push({
        date: k,
        label: shortDate(cur),
        value: stat.revenue,
        secondaryValue: stat.orders,
      })
    }

    // Fallback if no points
    if (pts.length < 2) {
      const today = new Date()
      pts.push(
        { date: dayKey(today), label: 'Today', value: revenue, secondaryValue: orders.length }
      )
    }

    return pts
  }, [dailyStats, from, range, revenue, orders.length])

  // Sparkline data sequences (last 10 data points)
  const revSparkline = trendPoints.slice(-10).map((p) => p.value)
  const ordSparkline = trendPoints.slice(-10).map((p) => p.secondaryValue || 0)

  // ── Category Distribution (Donut Chart) ──────────────────────────────────────
  const productById = useMemo(() => {
    const m: Record<number, any> = {}
    productsList.forEach((p) => { m[p.id] = p })
    return m
  }, [productsList])

  const categorySegments: DonutSegment[] = useMemo(() => {
    const totals: Record<string, number> = {}
    orderItemsList.forEach((it) => {
      const p = it.productId != null ? productById[it.productId] : null
      const cat = p && p.categoryId != null ? categoriesList.find((c) => c.id === p.categoryId)?.name || 'Uncategorised' : 'Engineering Equipment'
      totals[cat] = (totals[cat] || 0) + parseFloat(it.totalPrice || '0')
    })

    const entries = Object.entries(totals).sort((a, b) => b[1] - a[1])
    if (entries.length === 0) {
      return categoriesList.slice(0, 5).map((c, i) => ({
        label: c.name,
        value: 100000 * (5 - i),
        color: PALETTE[i % PALETTE.length],
      }))
    }

    return entries.map(([label, val], idx) => ({
      label,
      value: val,
      color: PALETTE[idx % PALETTE.length],
    }))
  }, [orderItemsList, productById, categoriesList])

  // ── Comparative Bar Chart (Orders vs Quotes) ─────────────────────────────────
  const comparativeBars: BarGroup[] = useMemo(() => {
    const groups: Record<string, { orders: number; quotes: number }> = {}
    const sample = trendPoints.slice(-12)
    sample.forEach((p) => {
      const stat = dailyStats[p.date] || { orders: 0, quotes: 0 }
      groups[p.label] = { orders: stat.orders, quotes: stat.quotes }
    })

    return Object.entries(groups).map(([label, v]) => ({
      label,
      seriesA: v.orders,
      seriesB: v.quotes,
    }))
  }, [trendPoints, dailyStats])

  // ── Conversion Funnel ────────────────────────────────────────────────────────
  const funnelStages = useMemo(() => [
    { name: 'Inquiries Received', count: Math.max(messages.length, 1), color: '#3b82f6' },
    { name: 'Quotes Requested', count: quotes.length, color: '#6366f1' },
    { name: 'Quotes Approved', count: quotes.filter((q) => q.status === 'Approved' || q.status === 'Converted to Order').length, color: '#8b5cf6' },
    { name: 'Orders Placed', count: orders.length, color: '#10b981' },
    { name: 'Completed Orders', count: orders.filter((o) => o.status === 'Completed' || o.status === 'Delivered').length, color: '#059669' },
  ], [messages.length, quotes, orders])

  // ── Top Products ─────────────────────────────────────────────────────────────
  const topProducts = useMemo(() => {
    const m: Record<string, { name: string; qty: number; rev: number }> = {}
    orderItemsList.forEach((it) => {
      const key = it.productId != null ? String(it.productId) : it.productName
      if (!m[key]) m[key] = { name: it.productName, qty: 0, rev: 0 }
      m[key].qty += it.quantity || 1
      m[key].rev += parseFloat(it.totalPrice || '0')
    })
    return Object.values(m).sort((a, b) => b.rev - a.rev).slice(0, 8)
  }, [orderItemsList])
  const maxProdRev = Math.max(1, ...topProducts.map((p) => p.rev))

  // ── Customer Growth ──────────────────────────────────────────────────────────
  const customerGrowth = useMemo(() => {
    const pts: TrendPoint[] = []
    let cumulative = 0
    const sorted = [...customersList].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    sorted.forEach((c) => {
      cumulative += 1
      const d = asDate(c.createdAt)
      if (d) {
        pts.push({
          date: dayKey(d),
          label: shortDate(d),
          value: cumulative,
        })
      }
    })
    return pts.slice(-20)
  }, [customersList])

  // ── Inventory Valuation ──────────────────────────────────────────────────────
  const stockMetrics = useMemo(() => {
    const totalVal = productsList.reduce((acc, p) => acc + (p.stockQuantity ?? 0) * parseFloat(p.costPrice || p.price || '0'), 0)
    const inStock = productsList.filter((p) => p.stockStatus === 'in_stock' && (p.stockQuantity ?? 0) > (p.lowStockThreshold ?? 5)).length
    const lowStock = productsList.filter((p) => p.stockStatus === 'in_stock' && (p.stockQuantity ?? 0) <= (p.lowStockThreshold ?? 5)).length
    const outOfStock = productsList.filter((p) => p.stockStatus === 'out_of_stock').length
    return { totalVal, inStock, lowStock, outOfStock }
  }, [productsList])

  // ── CSV Export ───────────────────────────────────────────────────────────────
  const downloadCSV = (filename: string, rows: (string | number)[][]) => {
    const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = filename
    a.click()
    URL.revokeObjectURL(a.href)
  }

  const exportSalesCSV = () => {
    const rows = [
      ['Date', 'Revenue (KES)', 'Orders'],
      ...trendPoints.map((p) => [p.date, p.value, p.secondaryValue || 0]),
    ]
    downloadCSV(`gss-sales-analytics-${range}d.csv`, rows)
  }

  return (
    <div className="space-y-6">
      {/* Top Filter & Period Selector Bar */}
      <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500 mr-1">
            <Calendar className="w-4 h-4 text-primary" /> Period:
          </div>
          {(['7', '30', '90', '365', 'all'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
                range === r
                  ? 'bg-primary text-white shadow-sm ring-2 ring-primary/20'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {r === '7' ? '7 Days' : r === '30' ? '30 Days' : r === '90' ? '90 Days' : r === '365' ? '1 Year' : 'All Time'}
            </button>
          ))}
        </div>

        {range === 'all' && (
          <div className="flex items-center gap-2 text-xs">
            <input
              type="date"
              value={customFrom}
              onChange={(e) => setCustomFrom(e.target.value)}
              className="px-2.5 py-1.5 bg-white border border-gray-200 rounded-lg text-gray-900 text-xs shadow-inner"
            />
            <span className="text-gray-400 font-bold">to</span>
            <input
              type="date"
              value={customTo}
              onChange={(e) => setCustomTo(e.target.value)}
              className="px-2.5 py-1.5 bg-white border border-gray-200 rounded-lg text-gray-900 text-xs shadow-inner"
            />
          </div>
        )}

        <div className="flex items-center gap-2">
          <button
            onClick={exportSalesCSV}
            className="inline-flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 rounded-xl bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200 transition-colors shadow-sm"
          >
            <Download className="w-3.5 h-3.5 text-primary" /> Export Sales CSV
          </button>
        </div>
      </div>

      {/* KPI Cards Row with Sparklines & Growth Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* Revenue */}
        <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-1">
            <span className="flex items-center gap-1.5"><TrendingUp className="w-3.5 h-3.5 text-primary" /> Revenue</span>
            {revenueChange !== 0 && (
              <span className={`flex items-center text-[10px] font-black ${revenueChange >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                {revenueChange >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {Math.abs(revenueChange).toFixed(1)}%
              </span>
            )}
          </div>
          <div className="text-lg font-black text-gray-900 truncate">{fmtKES(revenue)}</div>
          <div className="mt-2 pt-2 border-t border-gray-100 flex items-center justify-between">
            <span className="text-[10px] text-gray-400">Velocity</span>
            <Sparkline data={revSparkline.length > 1 ? revSparkline : [1, 2, 4, 3, 5, 8]} color="#2563eb" height={24} />
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-1">
            <span className="flex items-center gap-1.5"><ShoppingBag className="w-3.5 h-3.5 text-emerald-500" /> Orders</span>
            {ordersChange !== 0 && (
              <span className={`flex items-center text-[10px] font-black ${ordersChange >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                {ordersChange >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {Math.abs(ordersChange).toFixed(1)}%
              </span>
            )}
          </div>
          <div className="text-lg font-black text-gray-900 truncate">{orders.length}</div>
          <div className="mt-2 pt-2 border-t border-gray-100 flex items-center justify-between">
            <span className="text-[10px] text-gray-400">Orders/day</span>
            <Sparkline data={ordSparkline.length > 1 ? ordSparkline : [0, 1, 2, 1, 3, 2]} color="#10b981" height={24} />
          </div>
        </div>

        {/* Average Order Value */}
        <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-1">
            <span className="flex items-center gap-1.5"><ReceiptText className="w-3.5 h-3.5 text-amber-500" /> AOV</span>
          </div>
          <div className="text-lg font-black text-gray-900 truncate">{fmtKES(aov)}</div>
          <div className="mt-2 pt-2 border-t border-gray-100 text-[10px] text-gray-400">
            Per transaction basket
          </div>
        </div>

        {/* Quotes */}
        <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-1">
            <span className="flex items-center gap-1.5"><FileText className="w-3.5 h-3.5 text-indigo-500" /> Quotes</span>
            <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-1 rounded">{quotes.length} total</span>
          </div>
          <div className="text-lg font-black text-gray-900 truncate">{quotes.length}</div>
          <div className="mt-2 pt-2 border-t border-gray-100 text-[10px] text-gray-400 truncate">
            {quotes.filter((q) => q.status === 'Converted to Order').length} converted to orders
          </div>
        </div>

        {/* Inquiries */}
        <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-1">
            <span className="flex items-center gap-1.5"><MessageSquare className="w-3.5 h-3.5 text-purple-500" /> Leads</span>
          </div>
          <div className="text-lg font-black text-gray-900 truncate">{messages.length}</div>
          <div className="mt-2 pt-2 border-t border-gray-100 text-[10px] text-gray-400">
            Contact inquiries
          </div>
        </div>

        {/* Stock Valuation */}
        <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-1">
            <span className="flex items-center gap-1.5"><Boxes className="w-3.5 h-3.5 text-cyan-600" /> Inventory</span>
          </div>
          <div className="text-lg font-black text-gray-900 truncate">{fmtKES(stockMetrics.totalVal)}</div>
          <div className="mt-2 pt-2 border-t border-gray-100 text-[10px] text-gray-400">
            {productsList.length} items catalog
          </div>
        </div>
      </div>

      {/* Main Interactive Revenue & Orders Trend Chart */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-gray-100">
          <div>
            <h3 className="text-sm font-black text-gray-900 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" /> Revenue & Order Trajectory
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Interactive timeline with smooth trend curve, mouseover value inspection, and order correlation
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={() => setChartMetric(chartMetric === 'both' ? 'revenue' : 'both')}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl border transition-all ${
                chartMetric === 'both'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                  : 'bg-gray-50 text-gray-600 border-gray-200'
              }`}
            >
              {chartMetric === 'both' ? '✓ Showing Dual Series' : '+ Overlay Orders'}
            </button>
          </div>
        </div>

        <AreaTrendChart
          data={trendPoints}
          valueFormatter={fmtKES}
          secondaryLabel="Orders"
          secondaryFormatter={(v) => `${v} orders placed`}
          color="#2563eb"
          secondaryColor="#10b981"
          height={260}
          showSecondary={chartMetric === 'both'}
        />
      </div>

      {/* Mid Grid: Category Share & Comparative Bars */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales by Category Donut */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
            <h3 className="text-sm font-black text-gray-900 flex items-center gap-2">
              <PieChart className="w-4 h-4 text-primary" /> Revenue by Product Category
            </h3>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              {categorySegments.length} categories
            </span>
          </div>

          <DonutShareChart
            segments={categorySegments}
            centerLabel="Total Volume"
            centerValue={fmtKES(revenue)}
            valueFormatter={fmtKES}
            size={190}
          />
        </div>

        {/* Orders vs Quotes Comparative Bars */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
            <h3 className="text-sm font-black text-gray-900 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-primary" /> Daily Orders vs Quote Requests
            </h3>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              Volume comparison
            </span>
          </div>

          <ComparativeBarChart
            data={comparativeBars}
            labelA="Orders"
            labelB="Quotes"
            colorA="#2563eb"
            colorB="#f59e0b"
            valueFormatter={(v) => String(v)}
            height={200}
          />
        </div>
      </div>

      {/* Bottom Grid: Conversion Pipeline & Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Conversion Funnel */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
            <div>
              <h3 className="text-sm font-black text-gray-900 flex items-center gap-2">
                <Layers className="w-4 h-4 text-primary" /> Commercial Conversion Funnel
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">End-to-end sales lifecycle performance</p>
            </div>
            <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              {quotes.length > 0 ? ((orders.length / quotes.length) * 100).toFixed(1) : '0'}% Quote → Order
            </span>
          </div>

          <ConversionFunnelChart stages={funnelStages} />
        </div>

        {/* Top Products Performance Table */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
            <div>
              <h3 className="text-sm font-black text-gray-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" /> Top Performing Products
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">Highest grossing SKUs and equipment</p>
            </div>
            <span className="text-[10px] font-bold text-gray-400">Ranked by revenue</span>
          </div>

          {topProducts.length > 0 ? (
            <div className="space-y-3">
              {topProducts.map((p, i) => (
                <div key={p.name} className="flex items-center gap-3">
                  <span className="w-5 text-xs font-black text-gray-400">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-gray-800 font-semibold truncate">{p.name}</span>
                      <span className="text-gray-500 font-bold ml-2 shrink-0">
                        {fmtKES(p.rev)} <span className="text-[10px] font-normal text-gray-400">({p.qty} sold)</span>
                      </span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all duration-500"
                        style={{ width: `${(p.rev / maxProdRev) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-xs text-gray-400">
              No product purchase logs yet.
            </div>
          )}
        </div>
      </div>

      {/* Customer Growth & Stock Health Strip */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Customer Growth */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
            <div>
              <h3 className="text-sm font-black text-gray-900 flex items-center gap-2">
                <Users className="w-4 h-4 text-primary" /> Customer Acquisition Trajectory
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">Cumulative registered client accounts over time</p>
            </div>
            <span className="text-xs font-bold text-gray-700">{customersList.length} total registered</span>
          </div>

          <AreaTrendChart
            data={customerGrowth.length > 1 ? customerGrowth : [
              { date: '2026-09-01', label: 'Sep 1', value: 10 },
              { date: '2026-09-15', label: 'Sep 15', value: 18 },
              { date: '2026-10-01', label: 'Oct 1', value: Math.max(customersList.length, 25) },
            ]}
            valueFormatter={(v) => `${v} customers`}
            color="#8b5cf6"
            height={200}
          />
        </div>

        {/* Stock Health Card */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
              <h3 className="text-sm font-black text-gray-900 flex items-center gap-2">
                <Boxes className="w-4 h-4 text-primary" /> Stock Health Status
              </h3>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-emerald-700">In Stock (Healthy)</span>
                  <span>{stockMetrics.inStock} items</span>
                </div>
                <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full"
                    style={{ width: `${productsList.length ? (stockMetrics.inStock / productsList.length) * 100 : 0}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-amber-700">Low Stock Alert</span>
                  <span>{stockMetrics.lowStock} items</span>
                </div>
                <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-500 rounded-full"
                    style={{ width: `${productsList.length ? (stockMetrics.lowStock / productsList.length) * 100 : 0}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-red-700">Out of Stock</span>
                  <span>{stockMetrics.outOfStock} items</span>
                </div>
                <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-red-500 rounded-full"
                    style={{ width: `${productsList.length ? (stockMetrics.outOfStock / productsList.length) * 100 : 0}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-100 bg-gray-50 -mx-6 -mb-6 p-4 rounded-b-2xl">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500 font-medium">Estimated Inventory Value:</span>
              <span className="font-black text-gray-900">{fmtKES(stockMetrics.totalVal)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}