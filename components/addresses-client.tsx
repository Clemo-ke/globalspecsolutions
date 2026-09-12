'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { MapPin, Plus, X, Check, Trash2, Edit2 } from 'lucide-react'

interface Address {
  id: number
  label?: string | null
  addressLine1: string
  addressLine2?: string | null
  city: string
  country?: string | null
  postalCode?: string | null
  isDefault?: boolean | null
}

interface AddressesClientProps {
  customerId: number | null
  initialAddresses: Address[]
}

const inputCls =
  'w-full px-3 py-2 text-sm border border-border rounded-md bg-background focus:ring-2 focus:ring-primary focus:outline-none'

const emptyForm = {
  label: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  country: 'Kenya',
  postalCode: '',
  isDefault: false,
}

export function AddressesClient({ customerId, initialAddresses }: AddressesClientProps) {
  const router = useRouter()
  const [addresses, setAddresses] = useState<Address[]>(initialAddresses)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const set = (patch: Partial<typeof form>) => setForm((f) => ({ ...f, ...patch }))

  const openAdd = () => {
    setEditingId(null)
    setForm(emptyForm)
    setErrorMsg('')
    setShowForm(true)
  }

  const openEdit = (a: Address) => {
    setEditingId(a.id)
    setForm({
      label: a.label || '',
      addressLine1: a.addressLine1,
      addressLine2: a.addressLine2 || '',
      city: a.city,
      country: a.country || 'Kenya',
      postalCode: a.postalCode || '',
      isDefault: Boolean(a.isDefault),
    })
    setErrorMsg('')
    setShowForm(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!customerId) {
      setErrorMsg('Sign in to an account to save addresses, or save an address during checkout.')
      return
    }
    if (!form.addressLine1.trim() || !form.city.trim()) {
      setErrorMsg('Address line 1 and city are required.')
      return
    }
    setLoading(true)
    setErrorMsg('')
    try {
      const isEdit = editingId !== null
      const res = await fetch(`/api/account/addresses${isEdit ? `/${editingId}` : ''}`, {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to save address')
      setShowForm(false)
      setEditingId(null)
      setForm(emptyForm)
      const refreshed = await fetch('/api/account/addresses')
      if (refreshed.ok) {
        setAddresses(await refreshed.json())
      }
      router.refresh()
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to save address.')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this address?')) return
    try {
      const res = await fetch(`/api/account/addresses/${id}`, { method: 'DELETE' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to delete address')
      setAddresses((prev) => prev.filter((a) => a.id !== id))
      router.refresh()
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to delete address.')
    }
  }

  const handleSetDefault = async (id: number) => {
    try {
      const res = await fetch(`/api/account/addresses/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ setDefault: true }),
      })
      if (!res.ok) throw new Error('Failed to set default')
      setAddresses((prev) => prev.map((a) => ({ ...a, isDefault: a.id === id })))
      router.refresh()
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to set default.')
    }
  }

  return (
    <div className="space-y-4">
      {addresses.length === 0 && !showForm ? (
        <div className="bg-card border border-border/60 rounded-xl p-10 text-center space-y-3">
          <MapPin className="w-8 h-8 text-muted-foreground mx-auto" />
          <p className="text-sm text-muted-foreground">No saved addresses yet.</p>
          <Button onClick={openAdd} className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold gap-2">
            <Plus className="w-4 h-4" /> Add Address
          </Button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {addresses.map((a) => (
              <div key={a.id} className="bg-card border border-border/60 rounded-xl p-4 space-y-2 relative">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold">{a.label || 'Address'}</span>
                    {a.isDefault && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary/10 text-primary border border-primary/20">
                        Default
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={() => openEdit(a)} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors" title="Edit">
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => handleDelete(a.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-muted-foreground hover:text-red-600 transition-colors" title="Delete">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {a.addressLine1}
                  {a.addressLine2 ? `, ${a.addressLine2}` : ''}
                  <br />
                  {a.city}
                  {a.postalCode ? `, ${a.postalCode}` : ''}
                  , {a.country || 'Kenya'}
                </p>
                {!a.isDefault && (
                  <button onClick={() => handleSetDefault(a.id)} className="text-[11px] font-semibold text-primary hover:underline">
                    Set as default
                  </button>
                )}
              </div>
            ))}
          </div>

          <Button onClick={openAdd} variant="outline" className="gap-2 border-border font-semibold">
            <Plus className="w-4 h-4" /> Add Address
          </Button>
        </>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-card border border-border/60 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold">{editingId ? 'Edit Address' : 'New Address'}</h3>
            <button type="button" onClick={() => setShowForm(false)} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>

          {errorMsg && <div className="p-3 text-xs bg-red-50 text-red-600 border border-red-200 rounded-md">{errorMsg}</div>}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold mb-1">Label</label>
              <input type="text" value={form.label} onChange={(e) => set({ label: e.target.value })} className={inputCls} placeholder="Home / Office" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold mb-1">Address Line 1 *</label>
              <input type="text" required value={form.addressLine1} onChange={(e) => set({ addressLine1: e.target.value })} className={inputCls} placeholder="Street, building, estate" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold mb-1">Address Line 2 (optional)</label>
              <input type="text" value={form.addressLine2} onChange={(e) => set({ addressLine2: e.target.value })} className={inputCls} placeholder="Apartment, floor, landmark" />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">City *</label>
              <input type="text" required value={form.city} onChange={(e) => set({ city: e.target.value })} className={inputCls} placeholder="Nairobi" />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Country</label>
              <input type="text" value={form.country} onChange={(e) => set({ country: e.target.value })} className={inputCls} />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Postal Code (optional)</label>
              <input type="text" value={form.postalCode} onChange={(e) => set({ postalCode: e.target.value })} className={inputCls} placeholder="00200" />
            </div>
            <div className="flex items-end pb-2">
              <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer">
                <input type="checkbox" checked={form.isDefault} onChange={(e) => set({ isDefault: e.target.checked })} className="accent-primary" />
                Set as default
              </label>
            </div>
          </div>

          <div className="flex gap-2">
            <Button type="submit" disabled={loading} className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold gap-2">
              {loading ? 'Saving...' : (<><Check className="w-4 h-4" /> {editingId ? 'Save Changes' : 'Save Address'}</>)}
            </Button>
            <Button type="button" variant="ghost" onClick={() => setShowForm(false)} className="font-semibold">
              Cancel
            </Button>
          </div>
        </form>
      )}
    </div>
  )
}