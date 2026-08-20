'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useCart } from '@/components/cart-context'
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Lock,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

export function CartClient() {
  const { cart, updateQuantity, removeFromCart, clearCart, subtotal, totalItems } = useCart()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    location: '',
    notes: '',
  })
  const [errorMsg, setErrorMsg] = useState('')

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.phone || !formData.email) {
      setErrorMsg('Please complete your name, phone number, and email.')
      return
    }

    setLoading(true)
    setErrorMsg('')

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: formData.name,
          customerPhone: formData.phone,
          customerEmail: formData.email,
          deliveryLocation: formData.location,
          notes: formData.notes,
          items: cart,
          subtotal,
          total: subtotal,
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Failed to place order')
      }

      // Clear cart on successful order submission
      clearCart()

      // Redirect to WhatsApp
      if (data.whatsappUrl) {
        window.location.href = data.whatsappUrl
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred during checkout.')
    } finally {
      setLoading(false)
    }
  }

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-20 h-20 bg-muted/60 rounded-full flex items-center justify-center mx-auto text-muted-foreground">
          <ShoppingCart className="w-10 h-10" />
        </div>
        <h1 className="text-3xl font-bold">Your Cart is Empty</h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          Explore our wide range of electrical equipment, UPS systems, solar solutions, and ICT infrastructure to add products to your cart.
        </p>
        <Link href="/shop">
          <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
            Browse Product Shop <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-12">
      <h1 className="text-3xl font-extrabold mb-8 flex items-center gap-3">
        <ShoppingCart className="w-8 h-8 text-primary" /> Shopping Cart ({totalItems} items)
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Cart Item Listing */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-card border border-border/60 rounded-xl overflow-hidden shadow-sm">
            <div className="p-4 bg-muted/40 border-b border-border/60 font-semibold text-sm grid grid-cols-12 gap-2 text-muted-foreground">
              <span className="col-span-6">Product</span>
              <span className="col-span-3 text-center">Quantity</span>
              <span className="col-span-3 text-right">Total Price</span>
            </div>

            <div className="divide-y divide-border/60">
              {cart.map((item) => (
                <div key={item.id} className="p-4 grid grid-cols-12 gap-4 items-center">
                  <div className="col-span-6 flex items-center gap-3">
                    <div className="w-14 h-14 bg-muted rounded-lg overflow-hidden shrink-0 border relative">
                      {item.imageUrl ? (
                        <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                          No img
                        </div>
                      )}
                    </div>
                    <div>
                      <Link href={`/shop/product/${item.slug}`} className="font-semibold text-sm hover:text-primary transition-colors line-clamp-1">
                        {item.name}
                      </Link>
                      <span className="text-xs text-muted-foreground block">
                        KES {item.price.toLocaleString()} each
                      </span>
                    </div>
                  </div>

                  <div className="col-span-3 flex items-center justify-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-1 border border-border rounded hover:bg-muted"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-1 border border-border rounded hover:bg-muted"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="col-span-3 text-right flex items-center justify-end gap-3">
                    <span className="font-bold text-sm text-primary">
                      KES {(item.price * item.quantity).toLocaleString()}
                    </span>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-muted-foreground hover:text-destructive transition-colors p-1"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 bg-muted/20 border-t border-border/60 flex items-center justify-between">
              <button
                onClick={clearCart}
                className="text-xs text-muted-foreground hover:text-destructive transition-colors flex items-center gap-1 font-medium"
              >
                <Trash2 className="w-3.5 h-3.5" /> Clear Cart
              </button>
              <Link href="/shop" className="text-xs font-semibold text-primary hover:underline flex items-center gap-1">
                Add More Products <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <p className="font-bold text-emerald-900 dark:text-emerald-200">Direct Business Order Guarantee</p>
              <p className="text-emerald-700 dark:text-emerald-400">
                Your order is logged directly into our official system and instantly transmitted to our sales management team on WhatsApp for prompt processing and invoicing.
              </p>
            </div>
          </div>
        </div>

        {/* WhatsApp Checkout Customer Form */}
        <div className="lg:col-span-5">
          <div className="bg-card border border-border/60 rounded-xl p-6 shadow-md space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-2 border-b border-border/60 pb-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" /> Complete WhatsApp Checkout
            </h2>

            {errorMsg && (
              <div className="p-3 text-xs bg-destructive/10 text-destructive border border-destructive/20 rounded-md">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleCheckout} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-border rounded-md bg-background focus:ring-2 focus:ring-primary focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold mb-1">Phone Number (WhatsApp) *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+254 7XX XXX XXX"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-border rounded-md bg-background focus:ring-2 focus:ring-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-border rounded-md bg-background focus:ring-2 focus:ring-primary focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Delivery / Facility Location</label>
                <input
                  type="text"
                  placeholder="Nairobi Industrial Area, Building A..."
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-border rounded-md bg-background focus:ring-2 focus:ring-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Order Notes / Specifications</label>
                <textarea
                  rows={2}
                  placeholder="Any special installation requirements or requests..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-border rounded-md bg-background focus:ring-2 focus:ring-primary focus:outline-none"
                />
              </div>

              <div className="border-t border-border/60 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-semibold">KES {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Taxes & Shipping</span>
                  <span className="text-xs text-muted-foreground">Calculated on WhatsApp</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-primary border-t border-border/40 pt-2">
                  <span>Total Amount</span>
                  <span>KES {subtotal.toLocaleString()}</span>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full py-6 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-base shadow-lg transition-all gap-2"
              >
                {loading ? (
                  'Processing Order...'
                ) : (
                  <>
                    <Lock className="w-4 h-4" /> Submit Order to WhatsApp
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
