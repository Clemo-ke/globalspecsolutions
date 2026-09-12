'use client'

import React, { useState, useEffect } from 'react'
import { Search, Save, PackageMinus } from 'lucide-react'

interface Props {
  productsList: any[]
  flash: (msg: string, ok?: boolean) => void
}

const inputCls =
  'w-20 px-2 py-1.5 bg-white border border-gray-200 rounded-lg text-gray-900 text-xs focus:ring-2 focus:ring-primary focus:outline-none text-center'

export function InventoryManager({ productsList, flash }: Props) {
  const [rows, setRows] = useState<any[]>(
    productsList.map((p: any) => ({
      id: p.id,
      name: p.name,
      sku: p.sku,
      imageUrl: p.imageUrl,
      price: p.price || 0,
      stockQuantity: p.stockQuantity ?? 0,
      lowStockThreshold: p.lowStockThreshold ?? 5,
      stockStatus: p.stockStatus || 'in_stock',
    }))
  )
  const [filter, setFilter] = useState('All')
  const [search, setSearch] = useState('')
  const [saving, setSaving] = useState<number | null>(null)

  useEffect(() => {
    setRows(
      productsList.map((p: any) => ({
        id: p.id,
        name: p.name,
        sku: p.sku,
        imageUrl: p.imageUrl,
        price: p.price || 0,
        stockQuantity: p.stockQuantity ?? 0,
        lowStockThreshold: p.lowStockThreshold ?? 5,
        stockStatus: p.stockStatus || 'in_stock',
      }))
    )
  }, [productsList])

  const patch = (id: number, key: string, value: number | string) => {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, [key]: value } : r)))
  }

  const statusOf = (r: any) => {
    if (r.stockStatus === 'available_on_order' || r.stockStatus === 'out_of_stock') return r.stockStatus
    return r.stockQuantity <= 0 ? 'out_of_stock' : r.stockQuantity <= r.lowStockThreshold ? 'low' : 'in_stock'
  }

  const badgeOf = (s: string) => {
    switch (s) {
      case 'in_stock': return 'bg-emerald-50 text-emerald-700 border-emerald-200'
      case 'low': return 'bg-amber-50 text-amber-700 border-amber-200'
      case 'out_of_stock': return 'bg-red-50 text-red-700 border-red-200'
      case 'available_on_order': return 'bg-blue-50 text-blue-700 border-blue-200'
      default: return 'bg-gray-100 text-gray-500 border-gray-200'
    }
  }

  const handleSave = async (row: any) => {
    setSaving(row.id)
    const autoStatus = row.stockQuantity <= 0 ? 'out_of_stock' : row.stockStatus === 'out_of_stock' ? 'in_stock' : row.stockStatus
    try {
      const res = await fetch(`/api/admin/products/${row.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stockQuantity: Number(row.stockQuantity),
          lowStockThreshold: Number(row.lowStockThreshold),
          stockStatus: autoStatus,
        }),
      })
      if (res.ok) {
        patch(row.id, 'stockStatus', autoStatus)
        flash(`Stock updated for ${row.name}`)
      } else {
        flash('Failed to update stock', false)
      }
    } catch {
      flash('Failed to update stock', false)
    } finally {
      setSaving(null)
    }
  }

  const filtered = rows.filter((r) => {
    const s = statusOf(r)
    if (filter !== 'All' && s !== filter.toLowerCase().replace(/ /g, '_')) return false
    if (search && !(`${r.name} ${r.sku || ''}`).toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const counts = {
    All: rows.length,
    in_stock: rows.filter((r) => statusOf(r) === 'in_stock').length,
    low: rows.filter((r) => statusOf(r) === 'low').length,
    out_of_stock: rows.filter((r) => statusOf(r) === 'out_of_stock').length,
    available_on_order: rows.filter((r) => statusOf(r) === 'available_on_order').length,
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          {['All', 'in_stock', 'low', 'out_of_stock', 'available_on_order'].map((k) => (
            <button
              key={k}
              onClick={() => setFilter(k)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-full border transition-all ${filter === k ? 'bg-primary text-primary-foreground border-primary' : 'border-gray-200 text-gray-500 hover:border-gray-400'}`}
            >
              {k === 'in_stock' ? 'In Stock' : k === 'out_of_stock' ? 'Out of Stock' : k === 'available_on_order' ? 'On Order' : k === 'low' ? 'Low Stock' : 'All'} ({counts[k as keyof typeof counts]})
            </button>
          ))}
        </div>
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="w-full sm:w-64 pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-lg text-gray-900 text-xs focus:ring-2 focus:ring-primary focus:outline-none placeholder:text-gray-400"
          />
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 text-gray-400 uppercase font-semibold border-b border-gray-100">
              <tr>{['Product', 'SKU', 'Unit Price', 'Stock Qty', 'Low Threshold', 'Status', 'Actions'].map((h) => <th key={h} className="p-3 whitespace-nowrap">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((r) => {
                const s = statusOf(r)
                return (
                  <tr key={r.id} className={`hover:bg-gray-50 ${s === 'low' || s === 'out_of_stock' ? 'bg-red-50/50' : ''}`}>
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                          {r.imageUrl ? <img src={r.imageUrl} alt="" className="w-full h-full object-cover" /> : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400"><PackageMinus className="w-4 h-4" /></div>
                          )}
                        </div>
                        <span className="font-medium text-gray-800 max-w-[220px] truncate">{r.name}</span>
                      </div>
                    </td>
                    <td className="p-3 text-gray-400 font-mono">{r.sku || '—'}</td>
                    <td className="p-3 text-gray-900 font-bold whitespace-nowrap">KES {Number(r.price).toLocaleString()}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-1.5">
                        <button onClick={() => patch(r.id, 'stockQuantity', Math.max(0, Number(r.stockQuantity) - 1))} className="w-6 h-6 rounded bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold">−</button>
                        <input type="number" min={0} value={r.stockQuantity} onChange={(e) => patch(r.id, 'stockQuantity', e.target.value)} className={`${inputCls} ${s === 'low' || s === 'out_of_stock' ? 'border-red-300 text-red-600' : ''}`} />
                        <button onClick={() => patch(r.id, 'stockQuantity', Number(r.stockQuantity) + 1)} className="w-6 h-6 rounded bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold">+</button>
                      </div>
                    </td>
                    <td className="p-3">
                      <input
                        type="number"
                        min={0}
                        value={r.lowStockThreshold}
                        onChange={(e) => patch(r.id, 'lowStockThreshold', e.target.value)}
                        className={inputCls}
                      />
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${badgeOf(s)}`}>
                        {s === 'in_stock' ? 'In Stock' : s === 'low' ? 'Low Stock' : s === 'out_of_stock' ? 'Out of Stock' : 'On Order'}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleSave(r)}
                          disabled={saving === r.id}
                          className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1.5 rounded-lg border transition-all ${saving === r.id ? 'opacity-50 bg-gray-100 text-gray-400 border-gray-200' : 'bg-primary/10 text-primary border-primary/30 hover:bg-primary/20'}`}
                        >
                          <Save className="w-3 h-3" /> {saving === r.id ? 'Saving…' : 'Save'}
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-10 text-center text-gray-400">No products match the current filter.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}