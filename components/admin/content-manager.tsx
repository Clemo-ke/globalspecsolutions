'use client'

import React, { useState } from 'react'
import { Plus, Trash2, Check, X, Pencil, Save } from 'lucide-react'

export interface Field {
  key: string
  label: string
  type?: 'text' | 'textarea' | 'number' | 'select' | 'url'
  options?: string[]
  required?: boolean
  placeholder?: string
  colSpan?: number
}

export interface EntityConfig {
  api: string
  slug: string
  title: string
  icon?: React.ReactNode
  fields: Field[]
  columns: string[]
  renderCell: (item: any, key: string) => React.ReactNode
  emptyMessage: string
  badge?: (item: any) => React.ReactNode
  label: string
}

interface Props {
  config: EntityConfig
  initialItems: any[]
  flash: (msg: string, ok?: boolean) => void
}

const inputCls =
  'w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-gray-900 text-xs focus:ring-2 focus:ring-primary focus:outline-none placeholder:text-gray-400'

export function ContentManager({ config, initialItems, flash }: Props) {
  const [items, setItems] = useState<any[]>(initialItems)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState<Record<string, string | boolean>>({})

  const emptyForm = () => {
    const f: Record<string, string | boolean> = { isActive: true }
    for (const field of config.fields) {
      f[field.key] = field.type === 'number' ? '0' : ''
    }
    return f
  }

  const slugify = (s: string) =>
    s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')

  const ensureSlug = () => {
    setForm((prev) => {
      if (prev.slug) return prev
      const title = String(prev.title || prev.name || '')
      return { ...prev, slug: slugify(title) }
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const payload: Record<string, any> = { ...form }
      for (const field of config.fields) {
        if (field.type === 'number') {
          payload[field.key] = payload[field.key] === '' ? 0 : Number(payload[field.key])
        } else if ((payload[field.key] as string) === '') {
          payload[field.key] = null
          if (field.required) delete payload[field.key]
        }
      }
      if (payload.slug) payload.slug = slugify(String(payload.slug))

      const url = editingId ? `${config.api}/${editingId}` : config.api
      const res = await fetch(url, {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) {
        flash(data.error || `Failed to save ${config.label.toLowerCase()}`, false)
        return
      }
      if (editingId) {
        setItems((prev) => prev.map((i) => (i.id === editingId ? { ...i, ...payload } : i)))
      } else {
        setItems((prev) => [{ ...payload, id: data.id, createdAt: new Date().toISOString() }, ...prev])
      }
      setShowForm(false)
      setEditingId(null)
      setForm(emptyForm())
      flash(editingId ? `${config.label} updated` : `${config.label} created`)
    } catch {
      flash(`Failed to save ${config.label.toLowerCase()}`, false)
    } finally {
      setSaving(false)
    }
  }

  const toggleActive = async (item: any) => {
    try {
      const res = await fetch(`${config.api}/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !item.isActive }),
      })
      if (res.ok) {
        setItems((prev) => prev.map((x) => (x.id === item.id ? { ...x, isActive: !x.isActive } : x)))
        flash(`${config.label} ${item.isActive ? 'disabled' : 'enabled'}`)
      }
    } catch {
      flash(`Failed to update ${config.label.toLowerCase()}`, false)
    }
  }

  const remove = async (item: any) => {
    try {
      const res = await fetch(`${config.api}/${item.id}`, { method: 'DELETE' })
      if (res.ok) {
        setItems((prev) => prev.filter((x) => x.id !== item.id))
        flash(`${config.label} deleted`)
      } else {
        const data = await res.json().catch(() => ({}))
        flash(data.error || `Failed to delete ${config.label.toLowerCase()}`, false)
      }
    } catch {
      flash(`Failed to delete ${config.label.toLowerCase()}`, false)
    }
  }

  const startEdit = (item: any) => {
    setEditingId(item.id)
    const f: Record<string, string | boolean> = { isActive: Boolean(item.isActive) }
    for (const field of config.fields) {
      const v = item[field.key]
      f[field.key] = v == null ? (field.type === 'number' ? '0' : '') : String(v)
    }
    setForm(f)
    setShowForm(true)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-xs text-gray-400">Manage {config.title.toLowerCase()} shown across the public site.</p>
        <button
          onClick={() => { setShowForm(!showForm); setEditingId(null); if (!showForm) setForm(emptyForm()) }}
          className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-lg border border-primary/40 bg-primary/20 text-primary hover:bg-primary/30"
        >
          {showForm ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
          {showForm ? 'Cancel' : `New ${config.label}`}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-gray-50 border border-gray-200 rounded-2xl p-5 space-y-4">
          <h3 className="text-[11px] font-bold text-primary uppercase tracking-wider">{editingId ? 'Edit' : 'New'} {config.label}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Slug</label>
              <input value={String(form.slug ?? '')} onChange={(e) => setForm({ ...form, slug: e.target.value })} onBlur={ensureSlug} placeholder="auto-generated from title" className={inputCls} />
            </div>
            {config.fields.map((field) => (
              <div key={field.key} className={field.colSpan === 2 ? 'sm:col-span-2' : field.colSpan === 3 ? 'sm:col-span-3' : field.colSpan === 4 ? 'sm:col-span-4' : 'lg:col-span-1'}>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">{field.label}{field.required && ' *'}</label>
                {field.type === 'textarea' ? (
                  <textarea rows={3} required={field.required} value={String(form[field.key] ?? '')} onChange={(e) => setForm({ ...form, [field.key]: e.target.value })} placeholder={field.placeholder} className={inputCls} />
                ) : field.type === 'select' ? (
                  <select required={field.required} value={String(form[field.key] ?? '')} onChange={(e) => setForm({ ...form, [field.key]: e.target.value })} className={inputCls}>
                    <option value="">Select…</option>
                    {field.options?.map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                ) : (
                  <input
                    type={field.type === 'number' ? 'number' : 'text'}
                    step={field.type === 'number' ? 'any' : undefined}
                    required={field.required}
                    value={String(form[field.key] ?? '')}
                    onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                    placeholder={field.placeholder}
                    className={inputCls}
                  />
                )}
              </div>
            ))}
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Order</label>
              <input type="number" min="0" value={Number(form.orderPosition || 0)} onChange={(e) => setForm({ ...form, orderPosition: e.target.value })} className={inputCls} />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer">
              <input type="checkbox" checked={Boolean(form.isActive)} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} className="accent-primary" />
              Active
            </label>
            <button type="submit" disabled={saving} className="ml-auto inline-flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50">
              {saving ? (<><Save className="w-3.5 h-3.5 animate-pulse" /> Saving…</>) : editingId ? 'Save Changes' : `Create ${config.label}`}
            </button>
          </div>
        </form>
      )}

      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 text-gray-400 uppercase font-semibold border-b border-gray-100">
              <tr>{config.columns.map((h) => <th key={h} className="p-3 whitespace-nowrap">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {items.map((item: any) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  {config.columns.map((col, idx) => (
                    <td key={col} className={`p-3 ${idx >= 2 ? 'text-gray-500' : 'font-medium text-gray-800'}`}>
                      {config.renderCell(item, col)}
                      {col === config.columns[0] && config.badge && (
                        <span className="ml-2">{config.badge(item)}</span>
                      )}
                    </td>
                  ))}
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => toggleActive(item)} className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:border-gray-400 hover:bg-gray-50" title={item.isActive ? 'Disable' : 'Enable'}>
                        {item.isActive ? <X className="w-3.5 h-3.5" /> : <Check className="w-3.5 h-3.5" />}
                      </button>
                      <button onClick={() => startEdit(item)} className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:border-primary/40 hover:text-primary hover:bg-primary/5" title="Edit">
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => remove(item)} className="p-1.5 rounded-lg border border-red-200 text-red-400 hover:bg-red-50" title="Delete">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td colSpan={config.columns.length + 1} className="p-10 text-center text-gray-400">{config.emptyMessage}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}