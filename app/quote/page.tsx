'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useQuoteCart } from '@/components/quote-cart-context'
import { MainHeader } from '@/components/main-header'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText, Trash2, Plus, Minus, Send, CheckCircle2, ArrowLeft, ShieldCheck } from 'lucide-react'

export default function QuotePage() {
  const { quoteItems, removeFromQuote, updateQuantity, clearQuote } = useQuoteCart()

  const [customerName, setCustomerName] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [customerEmail, setCustomerEmail] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [notes, setNotes] = useState('')

  const [loading, setLoading] = useState(false)
  const [submittedQuote, setSubmittedQuote] = useState<string | null>(null)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName,
          companyName,
          customerEmail,
          customerPhone,
          notes,
          items: quoteItems,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit quote request')
      }

      setSubmittedQuote(data.quoteNumber)
      clearQuote()
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full bg-background min-h-screen flex flex-col">
      <MainHeader />

      <main className="flex-1 py-12 max-w-7xl mx-auto px-4 md:px-6 w-full">
        {submittedQuote ? (
          <div className="max-w-2xl mx-auto text-center bg-card border border-border p-10 rounded-3xl shadow-xl space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h1 className="text-3xl font-extrabold">Quote Request Received!</h1>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Your formal Request for Quotation (RFQ) has been logged under reference{' '}
              <span className="font-mono font-bold text-primary">{submittedQuote}</span>. Our technical engineering specialists will review your specs and email a formal commercial proposal shortly.
            </p>
            <div className="pt-4 flex justify-center gap-4">
              <Link href="/shop">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold">
                  Return to Shop
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left side: Items in Quote Cart */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <Link href="/shop" className="text-xs font-semibold text-primary inline-flex items-center gap-1 mb-2 hover:underline">
                  <ArrowLeft className="w-3.5 h-3.5" /> Back to Marketplace
                </Link>
                <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-2">
                  <FileText className="w-8 h-8 text-primary" /> Request a Formal B2B Quote
                </h1>
                <p className="text-muted-foreground text-sm mt-1">
                  Compile equipment, critical power specs, or custom installation items into a formal quotation request.
                </p>
              </div>

              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="text-lg">Items in your RFQ ({quoteItems.length})</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {quoteItems.length === 0 ? (
                    <div className="text-center py-10 border border-dashed border-border rounded-xl">
                      <p className="text-muted-foreground text-sm">No specific products selected.</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        You can still submit custom project requirements using the form.
                      </p>
                      <Link href="/shop">
                        <Button variant="outline" size="sm" className="mt-4">
                          Browse Shop Products
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    quoteItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-muted/40 rounded-xl gap-4"
                      >
                        <div>
                          <h4 className="font-bold text-sm">{item.name}</h4>
                          {item.sku && <p className="text-xs font-mono text-muted-foreground">SKU: {item.sku}</p>}
                        </div>
                        <div className="flex items-center gap-4 w-full sm:w-auto justify-between">
                          <div className="flex items-center gap-2 bg-background border border-border rounded-lg p-1">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="p-1 hover:bg-muted rounded text-muted-foreground"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="text-xs font-mono px-2 font-bold">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="p-1 hover:bg-muted rounded text-muted-foreground"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <button
                            onClick={() => removeFromQuote(item.id)}
                            className="text-red-500 hover:text-red-600 p-1"
                            title="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Right side: Contact & Submission Form */}
            <div className="lg:col-span-5">
              <Card className="border-border shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg">Engineering & Company Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {error && <div className="p-3 bg-red-500/10 text-red-500 text-xs rounded-lg">{error}</div>}

                    <div>
                      <label className="text-xs font-bold block mb-1">Full Name *</label>
                      <input
                        type="text"
                        required
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="Eng. John Doe"
                        className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold block mb-1">Company / Organization</label>
                      <input
                        type="text"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder="Global Enterprise Ltd"
                        className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold block mb-1">Email Address *</label>
                        <input
                          type="email"
                          required
                          value={customerEmail}
                          onChange={(e) => setCustomerEmail(e.target.value)}
                          placeholder="j.doe@company.com"
                          className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold block mb-1">Phone / Mobile *</label>
                        <input
                          type="tel"
                          required
                          value={customerPhone}
                          onChange={(e) => setCustomerPhone(e.target.value)}
                          placeholder="+254 7..."
                          className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold block mb-1">Custom Notes / Installation Requirements</label>
                      <textarea
                        rows={4}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Mention site location, target timelines, delivery requirements, or technical specs..."
                        className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      ></textarea>
                    </div>

                    <div className="p-3 bg-muted/40 rounded-xl flex items-start gap-2.5 text-xs text-muted-foreground">
                      <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>Formal commercial quotes are processed within 4 business hours. Confidentiality assured.</span>
                    </div>

                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3 shadow-md gap-2"
                    >
                      {loading ? 'Submitting Request...' : 'Submit Quote Request'} <Send className="w-4 h-4" />
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
