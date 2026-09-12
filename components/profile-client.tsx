'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { CheckCircle2 } from 'lucide-react'

interface ProfileClientProps {
  customer: { id: number | null; name: string; phone: string; company: string; email: string }
}

const inputCls =
  'w-full px-3 py-2 text-sm border border-border rounded-md bg-background focus:ring-2 focus:ring-primary focus:outline-none'

export function ProfileClient({ customer }: ProfileClientProps) {
  const router = useRouter()
  const [form, setForm] = useState({ name: customer.name, phone: customer.phone, company: customer.company })
  const [loading, setLoading] = useState(false)
  const [notice, setNotice] = useState<{ text: string; ok: boolean } | null>(null)
  const hasCustomer = Boolean(customer.id)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim() || !form.phone.trim()) {
      setNotice({ text: 'Name and phone are required.', ok: false })
      return
    }
    setLoading(true)
    setNotice(null)
    try {
      const res = await fetch('/api/account/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name.trim(), phone: form.phone.trim(), company: form.company.trim() || null }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to update profile')
      setNotice({ text: 'Profile updated successfully.', ok: true })
      router.refresh()
    } catch (err: any) {
      setNotice({ text: err.message || 'Failed to update profile.', ok: false })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-card border border-border/60 rounded-xl p-5 space-y-4">
      {notice && (
        <div className={`p-3 text-xs rounded-md border flex items-center gap-2 ${notice.ok ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-red-50 text-red-600 border-red-200'}`}>
          {notice.ok && <CheckCircle2 className="w-4 h-4 shrink-0" />}
          {notice.text}
        </div>
      )}

      <div>
        <label className="block text-xs font-semibold mb-1">Full Name *</label>
        <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputCls} />
      </div>
      <div>
        <label className="block text-xs font-semibold mb-1">Phone (WhatsApp) *</label>
        <input type="tel" required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={inputCls} />
      </div>
      <div>
        <label className="block text-xs font-semibold mb-1">Company (optional)</label>
        <input type="text" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} className={inputCls} />
      </div>
      <div>
        <label className="block text-xs font-semibold mb-1">Email</label>
        <input type="email" disabled value={customer.email} className={`${inputCls} opacity-60 cursor-not-allowed`} />
        <p className="text-[11px] text-muted-foreground mt-1">Email is tied to your login and cannot be changed here.</p>
      </div>

      {!hasCustomer && (
        <p className="text-[11px] text-amber-600 bg-amber-50 border border-amber-200 rounded-md p-2.5">
          A customer profile will be created automatically when you place your first order.
        </p>
      )}

      <Button type="submit" disabled={loading} className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold sm:w-auto w-full">
        {loading ? 'Saving...' : 'Save Profile'}
      </Button>
    </form>
  )
}