'use client'

import React, { useRef, useState } from 'react'
import { Plus, Trash2, Check, X, Pencil, Save, Upload, FileText, Download, Eye, EyeOff, Star } from 'lucide-react'

interface Resource {
  id: number
  title: string
  slug: string
  category: string
  description?: string | null
  fileUrl: string
  fileSize?: string | null
  thumbnailUrl?: string | null
  isFeatured?: boolean
  isActive?: boolean
  createdAt?: string
}

interface Props {
  initialItems: Resource[]
  flash: (msg: string, ok?: boolean) => void
}

const CATEGORIES = ['Datasheet', 'Whitepaper', 'Case Study', 'Manual', 'Brochure', 'News']

const inputCls =
  'w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-gray-900 text-xs focus:ring-2 focus:ring-primary focus:outline-none placeholder:text-gray-400'

function slugify(s: string) {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
}

const emptyForm = (): Partial<Resource> & { isActive: boolean; isFeatured: boolean } => ({
  title: '',
  slug: '',
  category: 'Datasheet',
  description: '',
  fileUrl: '',
  fileSize: '',
  thumbnailUrl: '',
  isFeatured: false,
  isActive: true,
})

export function ResourcesManager({ initialItems, flash }: Props) {
  const [items, setItems] = useState<Resource[]>(initialItems)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState(emptyForm())
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  // ── File upload ────────────────────────────────────────────────────────────
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/admin/resources/upload', { method: 'POST', body: fd })
      const data = await res.json()
      if (res.ok) {
        setForm((prev) => ({
          ...prev,
          fileUrl: data.url,
          fileSize: data.fileSize || prev.fileSize,
        }))
        flash(`File uploaded: ${data.filename}`)
      } else {
        flash(data.error || 'Upload failed', false)
      }
    } catch {
      flash('Upload failed', false)
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  // ── Submit (create / update) ───────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.fileUrl) { flash('Please upload a file or enter a File URL', false); return }
    setSaving(true)
    try {
      const payload = {
        ...form,
        slug: form.slug ? slugify(form.slug) : slugify(form.title || ''),
      }
      const url = editingId ? `/api/admin/resources/${editingId}` : '/api/admin/resources'
      const res = await fetch(url, {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) { flash(data.error || 'Failed to save resource', false); return }

      if (editingId) {
        setItems((prev) => prev.map((i) => (i.id === editingId ? { ...i, ...payload } : i)))
        flash('Resource updated')
      } else {
        setItems((prev) => [{ ...payload, id: data.id, createdAt: new Date().toISOString() } as Resource, ...prev])
        flash('Resource created')
      }
      setShowForm(false)
      setEditingId(null)
      setForm(emptyForm())
    } catch {
      flash('Failed to save resource', false)
    } finally {
      setSaving(false)
    }
  }

  const startEdit = (item: Resource) => {
    setEditingId(item.id)
    setForm({
      title: item.title,
      slug: item.slug,
      category: item.category,
      description: item.description || '',
      fileUrl: item.fileUrl,
      fileSize: item.fileSize || '',
      thumbnailUrl: item.thumbnailUrl || '',
      isFeatured: Boolean(item.isFeatured),
      isActive: item.isActive !== false,
    })
    setShowForm(true)
    setTimeout(() => document.getElementById('resource-form-top')?.scrollIntoView({ behavior: 'smooth' }), 50)
  }

  const toggleActive = async (item: Resource) => {
    try {
      const res = await fetch(`/api/admin/resources/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !item.isActive }),
      })
      if (res.ok) {
        setItems((prev) => prev.map((x) => (x.id === item.id ? { ...x, isActive: !x.isActive } : x)))
        flash(`Resource ${item.isActive ? 'disabled' : 'enabled'}`)
      }
    } catch { flash('Failed to update resource', false) }
  }

  const remove = async (item: Resource) => {
    if (!confirm(`Delete "${item.title}"? This cannot be undone.`)) return
    try {
      const res = await fetch(`/api/admin/resources/${item.id}`, { method: 'DELETE' })
      if (res.ok) {
        setItems((prev) => prev.filter((x) => x.id !== item.id))
        flash('Resource deleted')
      } else {
        const d = await res.json().catch(() => ({}))
        flash(d.error || 'Failed to delete resource', false)
      }
    } catch { flash('Failed to delete resource', false) }
  }

  const cancel = () => {
    setShowForm(false)
    setEditingId(null)
    setForm(emptyForm())
  }

  return (
    <div className="space-y-4" id="resource-form-top">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <p className="text-xs text-gray-400">
          Manage downloadable resources — datasheets, whitepapers, case studies and manuals.
        </p>
        <button
          onClick={() => { if (showForm && !editingId) { cancel() } else { cancel(); setShowForm(true) } }}
          className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-lg border border-primary/40 bg-primary/10 text-primary hover:bg-primary/20 shrink-0 self-start sm:self-auto"
        >
          {showForm && !editingId ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
          {showForm && !editingId ? 'Cancel' : 'New Resource'}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-gray-50 border border-gray-200 rounded-2xl p-5 space-y-4"
        >
          <h3 className="text-[11px] font-bold text-primary uppercase tracking-wider">
            {editingId ? 'Edit Resource' : 'Add New Resource'}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Title */}
            <div className="sm:col-span-2">
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                Title *
              </label>
              <input
                required
                value={form.title ?? ''}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                onBlur={() => { if (!form.slug) setForm((p) => ({ ...p, slug: slugify(p.title || '') })) }}
                placeholder="e.g. GlobalSpec Company Profile 2024"
                className={inputCls}
              />
            </div>

            {/* Slug */}
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Slug</label>
              <input
                value={form.slug ?? ''}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                placeholder="auto-generated"
                className={inputCls}
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Category *</label>
              <select
                required
                value={form.category ?? 'Datasheet'}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className={inputCls}
              >
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            {/* Description */}
            <div className="sm:col-span-2">
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Description</label>
              <textarea
                rows={3}
                value={form.description ?? ''}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Short description shown to visitors"
                className={inputCls}
              />
            </div>

            {/* File Upload */}
            <div className="sm:col-span-2">
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                Resource File *
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="flex-1">
                  <input
                    value={form.fileUrl ?? ''}
                    onChange={(e) => setForm({ ...form, fileUrl: e.target.value })}
                    placeholder="Upload a file OR paste a URL"
                    className={inputCls}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  disabled={uploading}
                  className="inline-flex items-center justify-center gap-2 text-xs font-bold px-4 py-2 rounded-lg bg-primary/10 border border-primary/30 text-primary hover:bg-primary/20 disabled:opacity-50 shrink-0"
                >
                  <Upload className="w-3.5 h-3.5" />
                  {uploading ? 'Uploading…' : 'Upload File'}
                </button>
                <input
                  ref={fileRef}
                  type="file"
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.zip,image/*"
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </div>
              {form.fileUrl && (
                <div className="mt-2 flex items-center gap-2 text-[10px] text-emerald-600 font-semibold">
                  <Check className="w-3.5 h-3.5" />
                  <span className="truncate max-w-xs">{form.fileUrl}</span>
                  <a href={form.fileUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline ml-auto shrink-0">
                    Test link ↗
                  </a>
                </div>
              )}
            </div>

            {/* File Size */}
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                File Size (auto-filled on upload)
              </label>
              <input
                value={form.fileSize ?? ''}
                onChange={(e) => setForm({ ...form, fileSize: e.target.value })}
                placeholder="e.g. 3.2 MB"
                className={inputCls}
              />
            </div>

            {/* Thumbnail URL */}
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Thumbnail URL (optional)</label>
              <input
                value={form.thumbnailUrl ?? ''}
                onChange={(e) => setForm({ ...form, thumbnailUrl: e.target.value })}
                placeholder="https://… or leave blank"
                className={inputCls}
              />
            </div>
          </div>

          {/* Checkboxes */}
          <div className="flex flex-wrap items-center gap-6">
            <label className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={Boolean(form.isActive)}
                onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                className="accent-primary"
              />
              Active (visible on site)
            </label>
            <label className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={Boolean(form.isFeatured)}
                onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
                className="accent-primary"
              />
              Featured
            </label>
            <div className="flex items-center gap-2 ml-auto">
              <button
                type="button"
                onClick={cancel}
                className="text-xs font-bold px-4 py-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
              >
                {saving ? <><Save className="w-3.5 h-3.5 animate-pulse" /> Saving…</> : editingId ? 'Save Changes' : 'Create Resource'}
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Table / Cards */}
      {items.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center text-gray-400">
          <FileText className="w-8 h-8 mx-auto mb-3 text-gray-300" />
          <p className="text-xs">No resources yet. Add datasheets, whitepapers or case studies.</p>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 text-gray-400 uppercase font-semibold border-b border-gray-100">
                  <tr>
                    <th className="p-3 whitespace-nowrap">Resource</th>
                    <th className="p-3 whitespace-nowrap">Category</th>
                    <th className="p-3 whitespace-nowrap">File / Size</th>
                    <th className="p-3 whitespace-nowrap">Status</th>
                    <th className="p-3 whitespace-nowrap">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {items.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="p-3 font-medium text-gray-800 max-w-[220px]">
                        <div className="flex flex-col gap-0.5">
                          <span className="font-bold truncate">{item.title}</span>
                          {item.isFeatured && (
                            <span className="inline-flex items-center gap-1 text-[9px] font-bold text-amber-600">
                              <Star className="w-2.5 h-2.5" /> Featured
                            </span>
                          )}
                          {item.description && (
                            <span className="text-[10px] text-gray-400 truncate max-w-[200px]">{item.description}</span>
                          )}
                        </div>
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded-md bg-accent/10 text-accent text-[10px] font-bold">
                          {item.category}
                        </span>
                      </td>
                      <td className="p-3">
                        {item.fileUrl ? (
                          <a
                            href={item.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-primary hover:underline font-semibold"
                          >
                            <Download className="w-3 h-3" />
                            {item.fileSize || 'Download'}
                          </a>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${item.isActive !== false ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-gray-100 text-gray-400 border-gray-200'}`}>
                          {item.isActive !== false ? 'Active' : 'Disabled'}
                        </span>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => toggleActive(item)}
                            className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:border-gray-400 hover:bg-gray-50"
                            title={item.isActive ? 'Disable' : 'Enable'}
                          >
                            {item.isActive !== false ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                          <button
                            onClick={() => startEdit(item)}
                            className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:border-primary/40 hover:text-primary hover:bg-primary/5"
                            title="Edit"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => remove(item)}
                            className="p-1.5 rounded-lg border border-red-200 text-red-400 hover:bg-red-50"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden space-y-3">
            {items.map((item) => (
              <div key={item.id} className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-gray-900 text-sm truncate">{item.title}</div>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <span className="px-2 py-0.5 rounded-md bg-accent/10 text-accent text-[10px] font-bold">
                        {item.category}
                      </span>
                      {item.isFeatured && (
                        <span className="text-[9px] font-bold text-amber-600 flex items-center gap-0.5">
                          <Star className="w-2.5 h-2.5" /> Featured
                        </span>
                      )}
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${item.isActive !== false ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-gray-100 text-gray-400 border-gray-200'}`}>
                        {item.isActive !== false ? 'Active' : 'Disabled'}
                      </span>
                    </div>
                    {item.description && (
                      <p className="text-[11px] text-gray-400 mt-1 line-clamp-2">{item.description}</p>
                    )}
                  </div>
                </div>

                {item.fileUrl && (
                  <a
                    href={item.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
                  >
                    <Download className="w-3.5 h-3.5" />
                    {item.fileSize ? `Download (${item.fileSize})` : 'Download File'}
                  </a>
                )}

                <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                  <button
                    onClick={() => toggleActive(item)}
                    className="flex-1 inline-flex items-center justify-center gap-1 py-1.5 rounded-lg border border-gray-200 text-[11px] font-bold text-gray-500 hover:bg-gray-50"
                  >
                    {item.isActive !== false ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                    {item.isActive !== false ? 'Disable' : 'Enable'}
                  </button>
                  <button
                    onClick={() => startEdit(item)}
                    className="flex-1 inline-flex items-center justify-center gap-1 py-1.5 rounded-lg border border-primary/30 text-[11px] font-bold text-primary bg-primary/5 hover:bg-primary/10"
                  >
                    <Pencil className="w-3 h-3" /> Edit
                  </button>
                  <button
                    onClick={() => remove(item)}
                    className="flex-1 inline-flex items-center justify-center gap-1 py-1.5 rounded-lg border border-red-200 text-[11px] font-bold text-red-400 hover:bg-red-50"
                  >
                    <Trash2 className="w-3 h-3" /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
