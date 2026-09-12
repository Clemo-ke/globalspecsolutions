'use client'

import React, { useState } from 'react'
import { Plus, Trash2, Save, X, ShieldCheck, KeyRound } from 'lucide-react'

const ALL_PERMISSIONS = [
  'dashboard.view',
  'orders.manage',
  'inventory.manage',
  'customers.manage',
  'coupons.manage',
  'content.manage',
  'users.manage',
  'media.manage',
  'analytics.view',
  'settings.manage',
]

const inputCls = 'w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-gray-900 text-xs focus:ring-2 focus:ring-primary focus:outline-none placeholder:text-gray-400'

interface Props {
  rolesList: any[]
  canManageRoles: boolean
  flash: (msg: string, ok?: boolean) => void
}

export function RolesManager({ rolesList, canManageRoles, flash }: Props) {
  const [roles, setRoles] = useState<any[]>(rolesList)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState<any>({ name: '', slug: '', description: '', isAdmin: true, permissions: [] })

  const rolePermissions = (r: any) => r.permissions || []

  const togglePerm = (perm: string) => {
    setForm((prev: any) => {
      const has = prev.permissions.includes(perm)
      return { ...prev, permissions: has ? prev.permissions.filter((p: string) => p !== perm) : [...prev.permissions, perm] }
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch(editingId ? `/api/admin/roles/${editingId}` : '/api/admin/roles', {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) {
        flash(data.error || 'Failed to save role', false)
        return
      }
      if (editingId) {
        setRoles((prev) => prev.map((r) => (r.id === editingId ? { ...r, ...form } : r)))
      } else {
        setRoles((prev) => [...prev, { ...form, id: data.id, isSystem: false }])
      }
      setShowForm(false)
      setEditingId(null)
      setForm({ name: '', slug: '', description: '', isAdmin: true, permissions: [] })
      flash(editingId ? 'Role updated' : 'Role created')
    } catch {
      flash('Failed to save role', false)
    } finally {
      setSaving(false)
    }
  }

  const remove = async (r: any) => {
    if (r.isSystem) { flash('System roles cannot be deleted', false); return }
    try {
      const res = await fetch(`/api/admin/roles/${r.id}`, { method: 'DELETE' })
      const data = await res.json().catch(() => ({}))
      if (res.ok) {
        setRoles((prev) => prev.filter((x) => x.id !== r.id))
        flash(`Role ${r.name} deleted`)
      } else {
        flash(data.error || 'Failed to delete role', false)
      }
    } catch {
      flash('Failed to delete role', false)
    }
  }

  const startEdit = (r: any) => {
    if (r.isSystem) { flash('System roles are managed by the platform.', false); return }
    setEditingId(r.id)
    setForm({ name: r.name, slug: r.slug, description: r.description, isAdmin: Boolean(r.isAdmin), permissions: r.permissions ? [...r.permissions] : [] })
    setShowForm(true)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-xs text-gray-400">Roles control what each user can do in the admin. Super-admin and admin include all permissions.</p>
        {canManageRoles && (
          <button
            onClick={() => { setShowForm(!showForm); setEditingId(null); if (!showForm) setForm({ name: '', slug: '', description: '', isAdmin: true, permissions: [] }) }}
            className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-lg border border-primary/40 bg-primary/10 text-primary hover:bg-primary/20"
          >
            {showForm ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
            {showForm ? 'Cancel' : 'New Role'}
          </button>
        )}
      </div>

      {showForm && canManageRoles && (
        <form onSubmit={handleSubmit} className="bg-gray-50 border border-gray-200 rounded-2xl p-5 space-y-4">
          <h3 className="text-[11px] font-bold text-primary uppercase tracking-wider">{editingId ? 'Edit' : 'New'} Role</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Name</label>
              <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value, slug: form.slug || e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-') })} placeholder="e.g. Warehouse Manager" className={inputCls} />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Slug</label>
              <input required value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') })} className={inputCls} />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Description</label>
              <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="What is this role for?" className={inputCls} />
            </div>
          </div>

          <label className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer">
            <input type="checkbox" checked={Boolean(form.isAdmin)} onChange={(e) => setForm({ ...form, isAdmin: e.target.checked })} className="accent-primary" />
            Admin access (can open /admin)
          </label>

          <div>
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">
              <KeyRound className="w-3 h-3" /> Granular permissions
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
              {ALL_PERMISSIONS.map((perm) => {
                const label = perm.replace(/\./g, ' · ').replace(/\b\w/g, (l) => l.toUpperCase())
                const active = form.isAdmin || form.permissions.includes(perm)
                return (
                  <button
                    type="button"
                    key={perm}
                    disabled={form.isAdmin}
                    onClick={() => togglePerm(perm)}
                    className={`text-left text-[10px] px-2.5 py-2 rounded-lg border transition ${active ? 'border-primary/40 bg-primary/10 text-primary' : 'border-gray-200 text-gray-500 hover:border-gray-400'} disabled:opacity-70`}
                  >
                    {label}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button type="button" onClick={() => setShowForm(false)} className="text-xs font-bold px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50">Cancel</button>
            <button type="submit" disabled={saving} className="inline-flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50">
              {saving ? (<><Save className="w-3.5 h-3.5 animate-pulse" /> Saving…</>) : editingId ? 'Save Changes' : 'Create Role'}
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {roles.map((r: any) => {
          const perms = rolePermissions(r)
          return (
            <div key={r.id} className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <ShieldCheck className={`w-4 h-4 ${r.slug === 'super-admin' ? 'text-red-500' : r.slug === 'admin' ? 'text-primary' : 'text-gray-400'}`} />
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">{r.name}</h4>
                    <p className="text-[10px] text-gray-400">{r.slug}</p>
                  </div>
                </div>
                <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded bg-gray-100 text-gray-500 border border-gray-200">
                  {r.isSystem ? 'System' : 'Custom'}
                </span>
              </div>
              <p className="text-[11px] text-gray-500 min-h-[30px]">{r.description || 'No description'}</p>
              <div className="flex flex-wrap gap-1 mt-2 mb-3">
                {perms.slice(0, 5).map((p: string) => (
                  <span key={p} className="text-[9px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-500 border border-gray-200">{p}</span>
                ))}
                {perms.length > 5 && <span className="text-[9px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-400 border border-gray-200">+{perms.length - 5}</span>}
                {perms.length === 0 && <span className="text-[9px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-400 border border-gray-200">no explicit permissions</span>}
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                <span className="text-[10px] font-bold text-primary">{(perms?.length || 0)} permissions</span>
                {canManageRoles && (
                  <div className="flex gap-2">
                    <button onClick={() => startEdit(r)} className="text-[10px] font-bold text-gray-600 hover:text-gray-900">Edit</button>
                    <button onClick={() => remove(r)} className="text-[10px] font-bold text-red-400 hover:text-red-600">Delete</button>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
