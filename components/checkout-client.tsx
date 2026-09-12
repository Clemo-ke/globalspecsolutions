'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useCart } from '@/components/cart-context'
import { Button } from '@/components/ui/button'
import {
  Lock,
  Truck,
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  ArrowLeft,
  MessageCircle,
  User as UserIcon,
  ShoppingCart,
  Ticket,
  X,
} from 'lucide-react'

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

interface DeliveryMethod {
  id: string
  name: string
  cost: number
  note?: string
}

interface PaymentMethod {
  id: string
  name: string
  instructions?: string
}

interface CheckoutClientProps {
  sessionUser: { id: string | null; name: string | null; email: string | null }
  customer: { id: number | null; name: string | null; phone: string | null; company: string | null; email: string | null }
  addresses: Address[]
  deliveryMethods: DeliveryMethod[]
  paymentMethods: PaymentMethod[]
  whatsappNumber?: string
}

const inputCls =
  'w-full px-3 py-2 text-sm border border-border rounded-md bg-background focus:ring-2 focus:ring-primary focus:outline-none'

export function CheckoutClient({
  sessionUser,
  customer,
  addresses,
  deliveryMethods,
  paymentMethods,
}: CheckoutClientProps) {
  const { cart, subtotal, clearCart } = useCart()
  const signedIn = Boolean(sessionUser.id)

  const [form, setForm] = useState({
    name: customer.name || sessionUser.name || '',
    phone: customer.phone || '',
    email: customer.email || sessionUser.email || '',
    company: customer.company || '',
    label: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    country: 'Kenya',
    postalCode: '',
    notes: '',
  })
  const [selectedAddressId, setSelectedAddressId] = useState<number | ''>('')
  const [deliveryId, setDeliveryId] = useState<string>(deliveryMethods[0]?.id || '')
  const [paymentId, setPaymentId] = useState<string>(paymentMethods[0]?.id || '')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [latestOrder, setLatestOrder] = useState<{ orderNumber: string; whatsappUrl: string } | null>(null)
  const [addressToSave, setAddressToSave] = useState(false)
  const [couponInput, setCouponInput] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null)
  const [applyingCoupon, setApplyingCoupon] = useState(false)
  const [couponError, setCouponError] = useState('')

  const deliveryMethod = deliveryMethods.find((d) => d.id === deliveryId)
  const paymentMethod = paymentMethods.find((p) => p.id === paymentId)
  const deliveryCost = deliveryMethod?.cost || 0
  const discount = appliedCoupon?.discount || 0
  const total = subtotal + deliveryCost - discount

  const set = (patch: Partial<typeof form>) => setForm((f) => ({ ...f, ...patch }))

  const applyCoupon = async () => {
    const code = couponInput.trim()
    if (!code || applyingCoupon) return
    setApplyingCoupon(true)
    setCouponError('')
    try {
      const res = await fetch(`/api/coupons/validate?code=${encodeURIComponent(code)}&subtotal=${subtotal}`)
      const data = await res.json()
      if (!res.ok || !data.valid) {
        setCouponError(data.error || 'Invalid coupon code.')
        setAppliedCoupon(null)
        return
      }
      setAppliedCoupon({ code: data.code, discount: data.discount })
      setCouponInput('')
    } catch {
      setCouponError('Could not validate coupon. Please try again.')
    } finally {
      setApplyingCoupon(false)
    }
  }

  const selectSavedAddress = (address: Address | null) => {
    if (!address) {
      setSelectedAddressId('')
      set({ addressLine1: '', addressLine2: '', city: '', country: 'Kenya', postalCode: '' })
      return
    }
    setSelectedAddressId(address.id)
    set({
      label: address.label || '',
      addressLine1: address.addressLine1,
      addressLine2: address.addressLine2 || '',
      city: address.city,
      country: address.country || 'Kenya',
      postalCode: address.postalCode || '',
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim() || !form.phone.trim() || !form.email.trim()) {
      setErrorMsg('Please complete your name, phone number, and email.')
      return
    }
    if (!deliveryMethod) {
      setErrorMsg('Please choose a delivery method.')
      return
    }
    if (!paymentMethod) {
      setErrorMsg('Please choose a payment method.')
      return
    }
    if (deliveryMethod.id !== 'pickup' && (!form.addressLine1.trim() || !form.city.trim())) {
      setErrorMsg('Please complete your delivery address.')
      return
    }

    setLoading(true)
    setErrorMsg('')

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: sessionUser.id,
          customerName: form.name.trim(),
          customerPhone: form.phone.trim(),
          customerEmail: form.email.trim(),
          companyName: form.company.trim() || null,
          deliveryLocation: deliveryMethod.id === 'pickup' ? `${deliveryMethod.name} — ${form.city}` : `${form.addressLine1} ${form.addressLine2}, ${form.city}, ${form.postalCode}, ${form.country}`.trim(),
          deliveryMethod: { id: deliveryMethod.id, name: deliveryMethod.name, cost: deliveryCost },
          paymentMethod: { id: paymentMethod.id, name: paymentMethod.name },
          shippingAddress: {
            label: form.label || null,
            addressLine1: form.addressLine1.trim() || null,
            addressLine2: form.addressLine2.trim() || null,
            city: form.city.trim() || null,
            country: form.country.trim() || 'Kenya',
            postalCode: form.postalCode.trim() || null,
          },
          saveAddress: addressToSave,
          notes: form.notes.trim(),
          couponCode: appliedCoupon?.code || undefined,
          items: cart.map((i) => ({ id: i.id, name: i.name, quantity: i.quantity, price: i.price })),
          subtotal,
          total,
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Failed to place order')
      }

      clearCart()
      setLatestOrder({ orderNumber: data.orderNumber, whatsappUrl: data.whatsappUrl })
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred during checkout.')
    } finally {
      setLoading(false)
    }
  }

  if (cart.length === 0 && !latestOrder) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-20 h-20 bg-muted/60 rounded-full flex items-center justify-center mx-auto text-muted-foreground">
          <ShoppingCart className="w-10 h-10" />
        </div>
        <h1 className="text-3xl font-bold">Your Cart is Empty</h1>
        <p className="text-muted-foreground max-w-md mx-auto">Add products to your cart before proceeding to checkout.</p>
        <Link href="/shop">
          <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
            Browse Product Shop <ArrowLeft className="w-4 h-4 rotate-180" />
          </Button>
        </Link>
      </div>
    )
  }

  if (latestOrder) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-20 h-20 bg-emerald-600/15 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-10 h-10 text-emerald-600" />
        </div>
        <h1 className="text-3xl font-bold">Order Placed Successfully</h1>
        <p className="text-muted-foreground">
          Your order <span className="font-bold text-foreground">#{latestOrder.orderNumber}</span> has been recorded. Our
          sales team will confirm your order and delivery on WhatsApp shortly.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a href={latestOrder.whatsappUrl} target="_blank" rel="noopener noreferrer">
            <Button size="lg" className="w-full gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold">
              <MessageCircle className="w-5 h-5" /> Confirm on WhatsApp
            </Button>
          </a>
          <Link href={signedIn ? '/account/orders' : '/shop'}>
            <Button size="lg" variant="outline" className="w-full gap-2">
              {signedIn ? 'View My Orders' : 'Continue Shopping'}
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-10">
      <div className="flex items-center gap-3 mb-8">
        <Link href="/cart" className="text-xs font-semibold text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Cart
        </Link>
        <span className="text-muted-foreground">/</span>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Checkout</h1>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Customer + Delivery + Payment */}
        <div className="lg:col-span-7 space-y-5">
          {!signedIn && (
            <div className="p-4 bg-muted/30 border border-border rounded-xl text-xs flex items-center justify-between gap-3">
              <span className="text-muted-foreground">Have an account? Track your orders and save addresses.</span>
              <Link href="/sign-in" className="text-primary font-bold whitespace-nowrap">
                Sign in
              </Link>
            </div>
          )}

          {/* Contact Information */}
          <section className="bg-card border border-border/60 rounded-xl p-5 space-y-4">
            <h2 className="flex items-center gap-2 text-sm font-bold text-foreground">
              <UserIcon className="w-4 h-4 text-primary" /> Contact Information
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold mb-1">Full Name *</label>
                <input type="text" required value={form.name} onChange={(e) => set({ name: e.target.value })} className={inputCls} placeholder="John Doe" />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Phone (WhatsApp) *</label>
                <input type="tel" required value={form.phone} onChange={(e) => set({ phone: e.target.value })} className={inputCls} placeholder="+254 7XX XXX XXX" />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Email *</label>
                <input type="email" required value={form.email} onChange={(e) => set({ email: e.target.value })} className={inputCls} placeholder="john@example.com" />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Company (optional)</label>
                <input type="text" value={form.company} onChange={(e) => set({ company: e.target.value })} className={inputCls} placeholder="Company Ltd" />
              </div>
            </div>
          </section>

          {/* Delivery Address */}
          <section className="bg-card border border-border/60 rounded-xl p-5 space-y-4">
            <h2 className="flex items-center gap-2 text-sm font-bold text-foreground">
              <Truck className="w-4 h-4 text-primary" /> Delivery Address
            </h2>

            {addresses.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                {addresses.map((a) => (
                  <button
                    key={a.id}
                    type="button"
                    onClick={() => selectSavedAddress(selectedAddressId === a.id ? null : a)}
                    className={`px-3 py-1.5 rounded-full text-[10px] font-bold border transition-colors ${
                      selectedAddressId === a.id ? 'bg-primary text-primary-foreground border-primary' : 'bg-transparent text-muted-foreground border-border hover:border-primary/40'
                    }`}
                  >
                    {a.label || 'Saved'} — {a.city}
                  </button>
                ))}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold mb-1">Address Line 1 *</label>
                <input type="text" required={deliveryId !== 'pickup'} value={form.addressLine1} onChange={(e) => set({ addressLine1: e.target.value })} className={inputCls} placeholder="Street, building, estate" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold mb-1">Address Line 2 (optional)</label>
                <input type="text" value={form.addressLine2} onChange={(e) => set({ addressLine2: e.target.value })} className={inputCls} placeholder="Apartment, floor, landmark" />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">City *</label>
                <input type="text" required={deliveryId !== 'pickup'} value={form.city} onChange={(e) => set({ city: e.target.value })} className={inputCls} placeholder="Nairobi" />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Country</label>
                <input type="text" value={form.country} onChange={(e) => set({ country: e.target.value })} className={inputCls} />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Postal Code (optional)</label>
                <input type="text" value={form.postalCode} onChange={(e) => set({ postalCode: e.target.value })} className={inputCls} placeholder="00200" />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Address Label (optional)</label>
                <input type="text" value={form.label} onChange={(e) => set({ label: e.target.value })} className={inputCls} placeholder="Office / Home" />
              </div>
            </div>

            {signedIn && (
              <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer">
                <input type="checkbox" checked={addressToSave} onChange={(e) => setAddressToSave(e.target.checked)} className="accent-primary" />
                Save this address to my account
              </label>
            )}
          </section>

          {/* Delivery Method */}
          <section className="bg-card border border-border/60 rounded-xl p-5 space-y-3">
            <h2 className="flex items-center gap-2 text-sm font-bold text-foreground">
              <Truck className="w-4 h-4 text-primary" /> Delivery Method
            </h2>
            {deliveryMethods.length === 0 && <p className="text-xs text-muted-foreground">No delivery options configured.</p>}
            {deliveryMethods.map((d) => (
              <label
                key={d.id}
                className={`flex items-center justify-between gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                  deliveryId === d.id ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/40'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input type="radio" name="delivery" checked={deliveryId === d.id} onChange={() => setDeliveryId(d.id)} className="accent-primary" />
                  <div>
                    <p className="text-sm font-semibold">{d.name}</p>
                    {d.note && <p className="text-[11px] text-muted-foreground">{d.note}</p>}
                  </div>
                </div>
                <span className="text-sm font-bold">{d.cost === 0 ? 'Free' : `KES ${d.cost.toLocaleString()}`}</span>
              </label>
            ))}
          </section>

          {/* Payment Method */}
          <section className="bg-card border border-border/60 rounded-xl p-5 space-y-3">
            <h2 className="flex items-center gap-2 text-sm font-bold text-foreground">
              <CreditCard className="w-4 h-4 text-primary" /> Payment Method
            </h2>
            {paymentMethods.length === 0 && <p className="text-xs text-muted-foreground">No payment options configured.</p>}
            {paymentMethods.map((p) => (
              <label
                key={p.id}
                className={`flex items-center justify-between gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                  paymentId === p.id ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/40'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input type="radio" name="payment" checked={paymentId === p.id} onChange={() => setPaymentId(p.id)} className="accent-primary" />
                  <div>
                    <p className="text-sm font-semibold">{p.name}</p>
                    {p.instructions && <p className="text-[11px] text-muted-foreground">{p.instructions}</p>}
                  </div>
                </div>
              </label>
            ))}
          </section>

          {/* Notes */}
          <section className="bg-card border border-border/60 rounded-xl p-5 space-y-2">
            <label className="block text-xs font-semibold">Order Notes / Specifications</label>
            <textarea
              rows={2}
              value={form.notes}
              onChange={(e) => set({ notes: e.target.value })}
              className={inputCls}
              placeholder="Special installation requirements or requests..."
            />
          </section>
        </div>

        {/* Right: Order Summary */}
        <div className="lg:col-span-5">
          <div className="bg-card border border-border/60 rounded-xl p-5 space-y-4 sticky top-6">
            <h2 className="text-sm font-bold border-b border-border/60 pb-3">Order Summary</h2>

            <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-muted rounded-md overflow-hidden shrink-0 border relative">
                    {item.imageUrl ? (
                      <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[9px] text-muted-foreground">No img</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link href={`/shop/product/${item.slug}`} className="text-xs font-semibold line-clamp-1 hover:text-primary transition-colors">
                      {item.name}
                    </Link>
                    <span className="text-[11px] text-muted-foreground">x{item.quantity}</span>
                  </div>
                  <span className="text-xs font-bold whitespace-nowrap">KES {(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-border/60 pt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-semibold">KES {subtotal.toLocaleString()}</span>
              </div>

              {appliedCoupon ? (
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <Ticket className="w-3.5 h-3.5 text-primary" />
                    Coupon <span className="font-bold text-foreground">{appliedCoupon.code}</span>
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="font-semibold text-emerald-600">−KES {discount.toLocaleString()}</span>
                    <button type="button" onClick={() => setAppliedCoupon(null)} className="text-muted-foreground hover:text-destructive transition-colors" aria-label="Remove coupon">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-2 pt-1">
                  <div className="flex items-center flex-1 gap-2 px-2.5 py-1.5 border border-border rounded-md bg-background focus-within:ring-2 focus-within:ring-primary">
                    <Ticket className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), applyCoupon())}
                      placeholder="Discount code"
                      className="w-full bg-transparent text-xs outline-none placeholder:text-muted-foreground/60 uppercase"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={applyCoupon}
                    disabled={applyingCoupon || !couponInput.trim()}
                    className="px-3 py-1.5 text-xs font-bold border border-primary/40 text-primary rounded-md hover:bg-primary hover:text-primary-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {applyingCoupon ? '...' : 'Apply'}
                  </button>
                </div>
              )}
              {couponError && <p className="text-[11px] text-destructive">{couponError}</p>}

              <div className="flex justify-between">
                <span className="text-muted-foreground">Delivery</span>
                <span className="font-semibold">{deliveryCost === 0 ? 'Free' : `KES ${deliveryCost.toLocaleString()}`}</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-primary border-t border-border/40 pt-2">
                <span>Total</span>
                <span>KES {Math.max(0, total).toLocaleString()}</span>
              </div>
            </div>

            {errorMsg && (
              <div className="p-3 text-xs bg-destructive/10 text-destructive border border-destructive/20 rounded-md">{errorMsg}</div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full py-6 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-base gap-2"
            >
              {loading ? (
                'Placing Order...'
              ) : (
                <>
                  <Lock className="w-4 h-4" /> Place Order
                </>
              )}
            </Button>

            <div className="p-3 bg-muted/30 rounded-lg flex items-center gap-2 text-[11px] text-muted-foreground">
              <ShieldCheck className="w-4 h-4 text-primary shrink-0" />
              Order is recorded in our system and confirmed with our sales team on WhatsApp. No online payment is taken at this step.
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}