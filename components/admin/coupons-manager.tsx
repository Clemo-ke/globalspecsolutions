'use client'

import React, { useState } from 'react'
import { Plus, Trash2, Ticket, Check, X, Pencil } from 'lucide-react'

interface Props {
  couponsList: any[]
  flash: (msg: string, ok?: boolean) => void
}

const inputCls =
  'w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-gray-900 text-xs focus:ring-2 focus:ring-primary focus:outline-none placeholder:text-gray-400'

const emptyForm = {
  code: '',
  description: '',
  discountType: 'percent',
  discountValue: '10',
  minSubtotal: '',
  maxDiscount: '',
  usageLimit: '0',
  expiresAt: '',
  isActive: true,
}

export function CouponsManager({ couponsList, flash }: Props) {
  const [coupons, setCoupons] = useState<any[]>(couponsList)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState<any>(emptyForm)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [saving, setSaving] = useState(false)

  const badge = (c: any) => {
    const now = new Date()
    const expired = c.expiresAt && new Date(c.expiresAt) < now
    if (!c.isActive || expired) return 'bg-red-50 text-red-600 border-red-200'
    return 'bg-emerald-50 text-emerald-700 border-emerald-200'
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const payload = {
        ...form,
        code: form.code.trim().toUpperCase(),
        discountValue: Number(form.discountValue),
        minSubtotal: form.minSubtotal ? Number(form.minSubtotal) : null,
        maxDiscount: form.maxDiscount ? Number(form.maxDiscount) : null,
        usageLimit: Number(form.usageLimit || 0),
        expiresAt: form.expiresAt || null,
        isActive: Boolean(form.isActive),
      }
      const url = editingId ? `/api/admin/coupons/${editingId}` : '/api/admin/coupons'
      const res = await fetch(url, {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) {
        flash(data.error || 'Failed to save coupon', false)
        return
      }
      if (editingId) {
        setCoupons((prev) => prev.map((c) => (c.id === editingId ? { ...c, ...payload } : c)))
      } else {
        setCoupons((prev) => [{ ...payload, id: data.id, createdAt: new Date().toISOString() }, ...prev])
      }
      setShowForm(false)
      setForm(emptyForm)
      setEditingId(null)
      flash(editingId ? 'Coupon updated' : `Coupon ${payload.code} created`)
    } catch {
      flash('Failed to save coupon', false)
    } finally {
      setSaving(false)
    }
  }

  const toggleActive = async (c: any) => {
    try {
      const res = await fetch(`/api/admin/coupons/${c.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !c.isActive }),
      })
      if (res.ok) {
        setCoupons((prev) => prev.map((x) => (x.id === c.id ? { ...x, isActive: !c.isActive } : x)))
        flash(`Coupon ${c.code} ${c.isActive ? 'disabled' : 'enabled'}`)
      }
    } catch {
      flash('Failed to update coupon', false)
    }
  }

  const remove = async (c: any) => {
    try {
      const res = await fetch(`/api/admin/coupons/${c.id}`, { method: 'DELETE' })
      if (res.ok) {
        setCoupons((prev) => prev.filter((x) => x.id !== c.id))
        flash(`Coupon ${c.code} deleted`)
      }
    } catch {
      flash('Failed to delete coupon', false)
    }
  }

  const startEdit = (c: any) => {
    setEditingId(c.id)
    setForm({
      code: c.code,
      description: c.description || '',
      discountType: c.discountType || 'percent',
      discountValue: String(c.discountValue ?? '10'),
      minSubtotal: c.minSubtotal != null ? String(c.minSubtotal) : '',
      maxDiscount: c.maxDiscount != null ? String(c.maxDiscount) : '',
      usageLimit: String(c.usageLimit ?? 0),
      expiresAt: c.expiresAt ? String(c.expiresAt).slice(0, 10) : '',
      isActive: Boolean(c.isActive),
    })
    setShowForm(true)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-xs text-gray-400">Create discount codes customers can apply at checkout.</p>
        <button
          onClick={() => { setShowForm(!showForm); setEditingId(null); if (!showForm) setForm(emptyForm) }}
          className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-lg border border-primary/40 bg-primary/10 text-primary hover:bg-primary/20"
        >
          {showForm ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
          {showForm ? 'Cancel' : 'New Coupon'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-gray-50 border border-gray-200 rounded-2xl p-5 space-y-4">
          <h3 className="text-[11px] font-bold text-primary uppercase tracking-wider">{editingId ? 'Edit' : 'New'} Coupon</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Code *</label>
              <input required value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} placeholder="SAVE10" className={inputCls} />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Discount Type</label>
              <select value={form.discountType} onChange={(e) => setForm({ ...form, discountType: e.target.value })} className={inputCls}>
                <option value="percent">Percentage (%)</option>
                <option value="fixed">Fixed Amount (KES)</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Discount Value *</label>
              <input required type="number" min="0" step="0.01" value={form.discountValue} onChange={(e) => setForm({ ...form, discountValue: e.target.value })} className={inputCls} />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Min Subtotal</label>
              <input type="number" min="0" value={form.minSubtotal} onChange={(e) => setForm({ ...form, minSubtotal: e.target.value })} placeholder="Optional" className={inputCls} />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Max Discount</label>
              <input type="number" min="0" value={form.maxDiscount} onChange={(e) => setForm({ ...form, maxDiscount: e.target.value })} placeholder="Optional cap" className={inputCls} />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Usage Limit</label>
              <input type="number" min="0" value={form.usageLimit} onChange={(e) => setForm({ ...form, usageLimit: e.target.value })} placeholder="0 = unlimited" className={inputCls} />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Expires</label>
              <input type="date" value={form.expiresAt} onChange={(e) => setForm({ ...form, expiresAt: e.target.value })} className={inputCls} />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Description</label>
              <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="e.g. Launch week offer" className={inputCls} />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer">
              <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} className="accent-primary" />
              Active
            </label>
            <button type="submit" disabled={saving} className="ml-auto inline-flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50">
              {saving ? 'Saving…' : editingId ? 'Save Changes' : 'Create Coupon'}
            </button>
          </div>
        </form>
      )}

      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 text-gray-400 uppercase font-semibold border-b border-gray-100">
              <tr>{['Code', 'Discount', 'Min Subtotal', 'Usage', 'Status', 'Expires', 'Actions'].map((h) => <th key={h} className="p-3 whitespace-nowrap">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {coupons.map((c: any) => {
                const used = c.usedCount ?? 0
                const limit = c.usageLimit ?? 0
                return (
                  <tr key={c.id} className="hover:bg-gray-50">
                    <td className="p-3">
                      <span className="inline-flex items-center gap-1.5 font-mono font-bold text-primary"><Ticket className="w-3.5 h-3.5" /> {c.code}</span>
                      {c.description && <div className="text-[10px] text-gray-400 mt-0.5">{c.description}</div>}
                    </td>
                    <td className="p-3 text-gray-800 font-bold whitespace-nowrap">
                      {c.discountType === 'percent' ? `${c.discountValue}%` : `KES ${Number(c.discountValue).toLocaleString()}`}
                    </td>
                    <td className="p-3 text-gray-500">{c.minSubtotal != null ? `KES ${Number(c.minSubtotal).toLocaleString()}` : '—'}</td>
                    <td className="p-3 text-gray-500">{used}{limit > 0 ? ` / ${limit}` : ''}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${badge(c)}`}>
                        {!c.isActive ? 'Disabled' : c.expiresAt && new Date(c.expiresAt) < new Date() ? 'Expired' : 'Active'}
                      </span>
                    </td>
                    <td className="p-3 text-gray-400">{c.expiresAt ? new Date(c.expiresAt).toLocaleDateString() : 'Never'}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => toggleActive(c)} className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:border-gray-400 hover:bg-gray-50" title={c.isActive ? 'Disable' : 'Enable'}>
                          {c.isActive ? <X className="w-3.5 h-3.5" /> : <Check className="w-3.5 h-3.5" />}
                        </button>
                        <button onClick={() => startEdit(c)} className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:border-primary/40 hover:text-primary hover:bg-primary/5" title="Edit">
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => remove(c)} className="p-1.5 rounded-lg border border-red-200 text-red-400 hover:bg-red-50" title="Delete">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
              {coupons.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-10 text-center text-gray-400">No coupons yet — create your first promotion.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
