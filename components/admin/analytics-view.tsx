'use client'

import React, { useMemo, useState } from 'react'
import { TrendingUp, ShoppingBag, ReceiptText, Users, FileText, MessageSquare, Download, Filter, RotateCcw, Boxes } from 'lucide-react'

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

const fmtKES = (n: number) => `KES ${Number(n.toFixed(0)).toLocaleString()}`

const asDate = (v: any) => {
  if (!v) return null
  if (v instanceof Date) return v
  if (typeof v === 'string') {
    const d = new Date(v)
    return isNaN(d.getTime()) ? null : d
  }
  return null
}

const dayKey = (d: Date) => d.toISOString ? d.toISOString().slice(0, 10) : ''

export function AnalyticsView({ ordersList, orderItemsList, productsList, categoriesList, customersList, quotesList, messagesList, brandsList = [] }: Props) {
  const [range, setRange] = useState<'7' | '30' | '90' | 'all'>('30')
  const [customFrom, setCustomFrom] = useState('')
  const [customTo, setCustomTo] = useState('')

  const from = useMemo(() => {
    if (range === 'all') return null
    const d = new Date()
    d.setDate(d.getDate() - parseInt(range, 10))
    return d
  }, [range])

  const inRange = (v: any) => {
    if (!v || !from) return true
    const d = asDate(v)
    if (!d) return true
    if (range === 'all' && customFrom && customTo) {
      return d >= new Date(customFrom) && d <= new Date(customTo + 'T23:59:59')
    }
    return d >= from
  }

  const orders = useMemo(() => ordersList.filter((o: any) => inRange(o.createdAt)), [ordersList, from, range, customFrom, customTo])
  const customers = useMemo(() => customersList.filter((c: any) => inRange(c.createdAt)), [customersList, from, range, customFrom, customTo])
  const quotes = useMemo(() => quotesList.filter((q: any) => inRange(q.createdAt)), [quotesList, from, range, customFrom, customTo])
  const messages = useMemo(() => messagesList.filter((m: any) => inRange(m.createdAt)), [messagesList, from, range, customFrom, customTo])

  const revenueOrders = orders.filter((o: any) => o.status !== 'Cancelled')
  const revenue = revenueOrders.reduce((s, o) => s + parseFloat(o.total || '0'), 0)
  const aov = orders.length ? revenue / orders.length : 0

  // Revenue by day
  const buckets: Record<string, number> = {}
  revenueOrders.forEach((o: any) => {
    const d = asDate(o.createdAt)
    if (!d) return
    const k = dayKey(d)
    buckets[k] = (buckets[k] || 0) + parseFloat(o.total || '0')
  })
  const days = useMemo(() => {
    const arr: { key: string; value: number }[] = []
    if (range === 'all' && customFrom && customTo) {
      let cur = new Date(customFrom)
      const end = new Date(customTo)
      while (cur <= end) {
        const k = dayKey(new Date(cur))
        arr.push({ key: k, value: buckets[k] || 0 })
        cur = new Date(cur.getTime() + 86400000)
      }
    } else if (from) {
      for (let i = parseInt(range, 10) - 1; i >= 0; i--) {
        const d = new Date(from.getTime() + i * 86400000)
        const k = dayKey(d)
        arr.push({ key: k, value: buckets[k] || 0 })
      }
    } else {
      Object.keys(buckets).sort().forEach((k) => arr.push({ key: k, value: buckets[k] }))
    }
    return arr.slice(-31)
  }, [buckets, from, range, customFrom, customTo])

  const maxDay = Math.max(1, ...days.map((d) => d.value))

  // Orders by status
  const statusCounts = useMemo(() => {
    const m: Record<string, number> = {}
    orders.forEach((o: any) => { m[o.status] = (m[o.status] || 0) + 1 })
    return Object.entries(m).sort((a, b) => b[1] - a[1])
  }, [orders])
  const maxStatus = Math.max(1, ...statusCounts.map(([, n]) => n as number))

  // Sales by category
  const productById = useMemo(() => {
    const m: Record<number, any> = {}
    productsList.forEach((p: any) => { m[p.id] = p })
    return m
  }, [productsList])

  const categoryTotals = useMemo(() => {
    const m: Record<string, number> = {}
    orderItemsList.forEach((it: any) => {
      const p = it.productId != null ? productById[it.productId] : null
      const catName = p && p.categoryId != null ? (categoriesList.find((c: any) => c.id === p.categoryId)?.name || 'Uncategorised') : 'Uncategorised'
      m[catName] = (m[catName] || 0) + parseFloat(it.totalPrice || '0')
    })
    return Object.entries(m).sort((a, b) => b[1] - a[1])
  }, [orderItemsList, productById, categoriesList])
  const maxCat = Math.max(1, ...categoryTotals.map(([, n]) => n as number))

  // Top products
  const topProducts = useMemo(() => {
    const m: Record<string, { name: string; qty: number; rev: number }> = {}
    orderItemsList.forEach((it: any) => {
      const key = it.productId != null ? String(it.productId) : it.productName
      if (!m[key]) m[key] = { name: it.productName, qty: 0, rev: 0 }
      m[key].qty += it.quantity || 1
      m[key].rev += parseFloat(it.totalPrice || '0')
    })
    return Object.values(m).sort((a, b) => b.rev - a.rev).slice(0, 10)
  }, [orderItemsList])
  const maxProd = Math.max(1, ...topProducts.map((p) => p.rev))

  // Customer growth
  const growth = useMemo(() => {
    const all = [...customersList]
      .map((c) => asDate(c.createdAt))
      .filter(Boolean) as Date[]
    all.sort((a, b) => a.getTime() - b.getTime())
    const pts: { key: string; total: number }[] = []
    let total = 0
    const seen: Record<string, number> = {}
    all.forEach((d) => {
      const k = dayKey(d)
      seen[k] = (seen[k] || 0) + 1
    })
    Object.keys(seen).sort().forEach((k) => {
      total += seen[k]
      pts.push({ key: k, total })
    })
    return pts.slice(-31)
  }, [customersList])
  const maxGrowth = Math.max(1, ...growth.map((g) => g.total))

  // ── Refunds (Part 31) ──────────────────────────────────────────────────────
  const refundedTotal = orders.reduce((s, o) => s + parseFloat(o.refundedAmount || '0'), 0)
  const refundedCount = orders.filter((o) => parseFloat(o.refundedAmount || '0') > 0).length
  const maxOrderValue = Math.max(1, ...revenueOrders.map((o) => parseFloat(o.total || '0')))

  // ── Period comparison (current range vs the same length before it) ────────
  const prevFrom = from ? new Date(from.getTime() - parseInt(range, 10) * 86400000) : null
  const prevOrders = useMemo(() => {
    if (!prevFrom || !from) return []
    return ordersList.filter((o: any) => {
      const d = asDate(o.createdAt)
      return d && d >= prevFrom && d < from
    })
  }, [ordersList, prevFrom, from])
  const prevRevenue = prevOrders.filter((o: any) => o.status !== 'Cancelled').reduce((s, o) => s + parseFloat(o.total || '0'), 0)
  const revenueChange = prevRevenue > 0 ? ((revenue - prevRevenue) / prevRevenue) * 100 : revenue > 0 ? 100 : 0
  const ordersChange = prevOrders.length > 0 ? ((orders.length - prevOrders.length) / prevOrders.length) * 100 : orders.length > 0 ? 100 : 0

  // ── Quote conversion funnel (Part 15) ──────────────────────────────────────
  const QUOTE_FUNNEL = ['New', 'Under Review', 'Quotation Sent', 'Negotiating', 'Approved', 'Converted to Order']
  const quoteFunnel = useMemo(() => QUOTE_FUNNEL.map((s) => ({ status: s, count: quotes.filter((q: any) => q.status === s).length })), [quotes])
  const quoteConversionRate = quotes.length > 0 ? (quoteFunnel.find((f) => f.status === 'Converted to Order')?.count || 0) / quotes.length : 0

  // ── Inventory report (Part 18) ─────────────────────────────────────────────
  const invReport = useMemo(() => {
    const inStock = productsList.filter((p: any) => p.stockStatus === 'in_stock' && (p.stockQuantity ?? 0) > (p.lowStockThreshold ?? 5)).length
    const lowStock = productsList.filter((p: any) => p.stockStatus === 'in_stock' && (p.stockQuantity ?? 0) <= (p.lowStockThreshold ?? 5)).length
    const outOfStock = productsList.filter((p: any) => p.stockStatus === 'out_of_stock').length
    const onOrder = productsList.filter((p: any) => p.stockStatus === 'available_on_order').length
    return [
      { label: 'In stock', n: inStock, color: 'bg-emerald-500' },
      { label: 'Low stock', n: lowStock, color: 'bg-amber-500' },
      { label: 'Out of stock', n: outOfStock, color: 'bg-red-500' },
      { label: 'Available on order', n: onOrder, color: 'bg-blue-500' },
    ]
  }, [productsList])
  const maxInv = Math.max(1, ...invReport.map((r) => r.n))
  const stockValue = productsList.reduce((s, p) => s + (p.stockQuantity ?? 0) * parseFloat(p.costPrice || p.price || '0'), 0)

  // ── Sales by brand (Part 22) ───────────────────────────────────────────────
  const brandById = useMemo(() => {
    const m: Record<number, any> = {}
    brandsList.forEach((b: any) => { m[b.id] = b })
    return m
  }, [brandsList])
  const brandTotals = useMemo(() => {
    const m: Record<string, number> = {}
    orderItemsList.forEach((it: any) => {
      const p = it.productId != null ? productById[it.productId] : null
      const brandName = p && p.brandId != null ? (brandById[p.brandId]?.name || 'Unbranded') : 'Unbranded'
      m[brandName] = (m[brandName] || 0) + parseFloat(it.totalPrice || '0')
    })
    return Object.entries(m).sort((a, b) => b[1] - a[1])
  }, [orderItemsList, productById, brandById])
  const maxBrand = Math.max(1, ...brandTotals.map(([, n]) => n as number))

  const downloadCSV = (filename: string, rows: (string | number)[][]) => {
    const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = filename
    a.click()
    URL.revokeObjectURL(a.href)
  }

  const exportCSVs = {
    daily: () => downloadCSV('sales-by-day.csv', [['Date', 'Revenue (KES)'], ...days.map((d) => [d.key, d.value])]),
    statuses: () => downloadCSV('orders-by-status.csv', [['Status', 'Orders'], ...statusCounts.map(([k, n]) => [k, n])]),
    categories: () => downloadCSV('sales-by-category.csv', [['Category', 'Revenue (KES)'], ...categoryTotals.map(([k, n]) => [k, n])]),
    products: () => downloadCSV('top-products.csv', [['Product', 'Qty', 'Revenue (KES)'], ...topProducts.map((p) => [p.name, p.qty, p.rev])]),
    brands: () => downloadCSV('sales-by-brand.csv', [['Brand', 'Revenue (KES)'], ...brandTotals.map(([k, n]) => [k, n])]),
    inventory: () => downloadCSV('inventory-report.csv', [['Product', 'SKU', 'Stock', 'Status'], ...productsList.map((p) => [p.name, p.sku || '', p.stockQuantity ?? 0, p.stockStatus])]),
  }

  const card = 'bg-white border border-gray-200 rounded-2xl p-5 shadow-sm'

  const Bar = ({ v, max, label, extra }: { v: number; max: number; label?: string; extra?: string }) => (
    <div className="space-y-1">
      <div className="text-[10px] text-gray-400 truncate">{label || ''}</div>
      <div className="h-32 flex items-end bg-gray-50 rounded-lg p-1.5 border border-gray-100">
        <div
          className="w-full bg-primary/70 rounded transition-all"
          style={{ height: `${Math.max(2, (v / max) * 100)}%` }}
        />
      </div>
      <div className="text-[10px] font-bold text-gray-700">{fmtKES(v)}</div>
      {extra && <div className="text-[9px] text-gray-400">{extra}</div>}
    </div>
  )

  return (
    <div className="space-y-4">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="w-4 h-4 text-gray-400" />
          {(['7', '30', '90', 'all'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-full border transition-all ${range === r ? 'bg-primary text-primary-foreground border-primary' : 'border-gray-200 text-gray-500 hover:border-gray-400'}`}
            >
              {r === '7' ? 'Last 7 days' : r === '30' ? 'Last 30 days' : r === '90' ? 'Last 90 days' : 'All time'}
            </button>
          ))}
        </div>
        {range === 'all' && (
          <div className="flex items-center gap-2 text-xs">
            <input type="date" value={customFrom} onChange={(e) => setCustomFrom(e.target.value)} className="px-2 py-1.5 bg-white border border-gray-200 rounded-lg text-gray-900 text-xs" />
            <span className="text-gray-400">to</span>
            <input type="date" value={customTo} onChange={(e) => setCustomTo(e.target.value)} className="px-2 py-1.5 bg-white border border-gray-200 rounded-lg text-gray-900 text-xs" />
          </div>
        )}
        <div className="flex items-center gap-2">
          <button onClick={exportCSVs.daily} className="inline-flex items-center gap-1.5 text-[10px] font-bold px-3 py-2 rounded-lg border border-gray-200 text-gray-600 hover:border-gray-400">Sales CSV</button>
          <button onClick={exportCSVs.statuses} className="inline-flex items-center gap-1.5 text-[10px] font-bold px-3 py-2 rounded-lg border border-gray-200 text-gray-600 hover:border-gray-400">Orders CSV</button>
          <button onClick={exportCSVs.categories} className="inline-flex items-center gap-1.5 text-[10px] font-bold px-3 py-2 rounded-lg border border-gray-200 text-gray-600 hover:border-gray-400">Categories CSV</button>
          <button onClick={exportCSVs.products} className="inline-flex items-center gap-1.5 text-[10px] font-bold px-3 py-2 rounded-lg border border-gray-200 text-gray-600 hover:border-gray-400">Top Products CSV</button>
        </div>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {([
          { icon: <TrendingUp className="w-4 h-4" />, label: 'Revenue', value: fmtKES(revenue) },
          { icon: <ShoppingBag className="w-4 h-4" />, label: 'Orders', value: String(orders.length) },
          { icon: <ReceiptText className="w-4 h-4" />, label: 'Avg Order', value: fmtKES(aov) },
          { icon: <Users className="w-4 h-4" />, label: 'New Customers', value: String(customers.length) },
          { icon: <FileText className="w-4 h-4" />, label: 'Quotes', value: String(quotes.length) },
          { icon: <MessageSquare className="w-4 h-4" />, label: 'Inquiries', value: String(messages.length) },
          { icon: <RotateCcw className="w-4 h-4" />, label: 'Refunded', value: fmtKES(refundedTotal), sub: `${refundedCount} orders` },
        ] as { icon: React.ReactNode; label: string; value: string; sub?: string }[]).map((k) => (
          <div key={k.label} className={card}>
            <div className="flex items-center gap-2 text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-2">{k.icon}{k.label}</div>
            <div className="text-lg font-black text-gray-900 truncate">{k.value}</div>
            {k.sub && <div className="text-[9px] text-gray-400">{k.sub}</div>}
          </div>
        ))}
      </div>

      {/* Revenue trend */}
      <div className={card}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Revenue Trend</h3>
          <button onClick={exportCSVs.daily} className="inline-flex items-center gap-1 text-[10px] font-bold text-primary hover:underline"><Download className="w-3 h-3" /> CSV</button>
        </div>
        <div className="flex items-end gap-1.5 overflow-x-auto pb-2">
          {days.map((d) => (
            <div key={d.key} className="min-w-[24px] flex-1 max-w-[42px]">
              <Bar v={d.value} max={maxDay} label={d.key.slice(5)} />
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Orders by status */}
        <div className={card}>
          <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-4">Orders by Status</h3>
          <div className="space-y-3">
            {statusCounts.map(([s, n]) => (
              <div key={s}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-gray-700 font-semibold">{s}</span>
                  <span className="text-gray-400">{n}</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${((n as number) / maxStatus) * 100}%` }} />
                </div>
              </div>
            ))}
            {statusCounts.length === 0 && <p className="text-xs text-gray-400">No orders in this period.</p>}
          </div>
        </div>

        {/* Sales by category */}
        <div className={card}>
          <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-4">Sales by Category</h3>
          <div className="space-y-3">
            {categoryTotals.map(([c, n]) => (
              <div key={c}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-gray-700 font-semibold">{c}</span>
                  <span className="text-gray-400">{fmtKES(n as number)}</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: `${((n as number) / maxCat) * 100}%` }} />
                </div>
              </div>
            ))}
            {categoryTotals.length === 0 && <p className="text-xs text-gray-400">No sales recorded yet.</p>}
          </div>
        </div>
      </div>

      {/* Top products */}
      <div className={card}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Top Products by Revenue</h3>
          <button onClick={exportCSVs.products} className="inline-flex items-center gap-1 text-[10px] font-bold text-primary hover:underline"><Download className="w-3 h-3" /> CSV</button>
        </div>
        {topProducts.length > 0 ? (
          <div className="space-y-3">
            {topProducts.map((p, i) => (
              <div key={p.name} className="flex items-center gap-3">
                <span className="w-5 text-[10px] font-black text-gray-400">{i + 1}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-gray-700 font-medium truncate">{p.name}</span>
                    <span className="text-gray-400 ml-3 shrink-0">{p.qty} sold · {fmtKES(p.rev)}</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${(p.rev / maxProd) * 100}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-gray-400">No product sales yet.</p>
        )}
      </div>

      {/* Period comparison */}
      {from && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className={card}>
            <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-4">Period Comparison</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">Revenue vs previous period</span>
                <span className={`font-black ${revenueChange >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>{revenueChange >= 0 ? '+' : ''}{revenueChange.toFixed(1)}%</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: `${Math.min(100, Math.abs(revenueChange) * 1.5)}%` }} />
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">Orders vs previous period</span>
                <span className={`font-black ${ordersChange >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>{ordersChange >= 0 ? '+' : ''}{ordersChange.toFixed(1)}%</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${Math.min(100, Math.abs(ordersChange) * 1.5)}%` }} />
              </div>
              <div className="flex items-center justify-between text-xs pt-2 border-t border-gray-100">
                <span className="text-gray-400">This period</span>
                <span className="text-gray-800 font-bold">{fmtKES(revenue)} · {orders.length} orders</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-400">Previous</span>
                <span className="text-gray-600 font-bold">{fmtKES(prevRevenue)} · {prevOrders.length} orders</span>
              </div>
            </div>
          </div>

          {/* Quote conversion funnel */}
          <div className={card}>
            <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-4">Quote Conversion Funnel</h3>
            <div className="space-y-2.5">
              {quoteFunnel.map((f) => {
                const width = maxStatus >= 0 ? (f.count / Math.max(1, quotes.length)) * 100 : 0
                return (
                  <div key={f.status}>
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="text-gray-600">{f.status}</span>
                      <span className="text-gray-500">{f.count}</span>
                    </div>
                    <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${width}%` }} />
                    </div>
                  </div>
                )
              })}
              <div className="pt-2 border-t border-gray-200 flex items-center justify-between text-xs">
                <span className="text-gray-500">Conversion rate</span>
                <span className={`font-black ${quoteConversionRate > 0 ? 'text-emerald-600' : 'text-gray-400'}`}>{(quoteConversionRate * 100).toFixed(1)}%</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sales by brand */}
      <div className={card}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Sales by Brand</h3>
          <button onClick={exportCSVs.brands} className="inline-flex items-center gap-1 text-[10px] font-bold text-primary hover:underline"><Download className="w-3 h-3" /> CSV</button>
        </div>
        <div className="space-y-3">
          {brandTotals.length > 0 ? brandTotals.map(([b, n]) => (
            <div key={b}>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-gray-700 font-semibold">{b}</span>
                <span className="text-gray-500">{fmtKES(n as number)}</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-purple-500 rounded-full transition-all" style={{ width: `${((n as number) / maxBrand) * 100}%` }} />
              </div>
            </div>
          )) : <p className="text-xs text-gray-500">No branded sales recorded yet.</p>}
        </div>
      </div>

      {/* Inventory report */}
      <div className={card}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Inventory Report</h3>
          <button onClick={exportCSVs.inventory} className="inline-flex items-center gap-1 text-[10px] font-bold text-primary hover:underline"><Download className="w-3 h-3" /> CSV</button>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {invReport.map((r) => (
            <div key={r.label} className="bg-gray-50 border border-gray-200 rounded-xl p-4">
              <div className="text-2xl font-black text-gray-900">{r.n}</div>
              <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mt-1">{r.label}</div>
              <div className="h-1.5 mt-2 bg-gray-200 rounded-full overflow-hidden">
                <div className={`h-full ${r.color} rounded-full`} style={{ width: `${(r.n / maxInv) * 100}%` }} />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-3 flex items-center justify-between text-xs bg-gray-50 border border-gray-200 rounded-xl px-4 py-3">
          <span className="flex items-center gap-2 text-gray-500"><Boxes className="w-4 h-4" /> Stock value (at cost)</span>
          <span className="font-black text-gray-900">{fmtKES(stockValue)}</span>
        </div>
      </div>

      {/* Customer growth */}
      <div className={card}>
        <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-4">Customer Growth (cumulative)</h3>
        <div className="h-40 flex items-end gap-1 overflow-x-auto pb-2">
          {growth.map((g) => (
            <div key={g.key} className="min-w-[18px] flex-1 max-w-[36px]" title={`${g.key}: ${g.total}`}>
              <Bar v={g.total} max={maxGrowth} label={g.key.slice(5)} extra={g.key.slice(0, 4)} />
            </div>
          ))}
          {growth.length === 0 && <p className="text-xs text-gray-500">No customers yet.</p>}
        </div>
      </div>
    </div>
  )
}