'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

export interface QuoteCartItem {
  id: number
  name: string
  sku?: string
  quantity: number
  notes?: string
}

interface QuoteCartContextType {
  quoteItems: QuoteCartItem[]
  addToQuote: (item: { id: number; name: string; sku?: string }) => void
  removeFromQuote: (id: number) => void
  updateQuantity: (id: number, quantity: number) => void
  clearQuote: () => void
  totalQuoteItems: number
}

const QuoteCartContext = createContext<QuoteCartContextType | undefined>(undefined)

export function QuoteCartProvider({ children }: { children: React.ReactNode }) {
  const [quoteItems, setQuoteItems] = useState<QuoteCartItem[]>([])

  useEffect(() => {
    try {
      const saved = localStorage.getItem('gss_quote_cart')
      if (saved) {
        setQuoteItems(JSON.parse(saved))
      }
    } catch (e) {
      console.error('Failed to load quote cart:', e)
    }
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem('gss_quote_cart', JSON.stringify(quoteItems))
    } catch (e) {
      console.error('Failed to save quote cart:', e)
    }
  }, [quoteItems])

  const addToQuote = (item: { id: number; name: string; sku?: string }) => {
    setQuoteItems((prev) => {
      const existing = prev.find((i) => i.id === item.id)
      if (existing) {
        return prev.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i))
      }
      return [...prev, { ...item, quantity: 1 }]
    })
  }

  const removeFromQuote = (id: number) => {
    setQuoteItems((prev) => prev.filter((i) => i.id !== id))
  }

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromQuote(id)
      return
    }
    setQuoteItems((prev) => prev.map((i) => (i.id === id ? { ...i, quantity } : i)))
  }

  const clearQuote = () => {
    setQuoteItems([])
  }

  const totalQuoteItems = quoteItems.reduce((acc, item) => acc + item.quantity, 0)

  return (
    <QuoteCartContext.Provider
      value={{
        quoteItems,
        addToQuote,
        removeFromQuote,
        updateQuantity,
        clearQuote,
        totalQuoteItems,
      }}
    >
      {children}
    </QuoteCartContext.Provider>
  )
}

export function useQuoteCart() {
  const context = useContext(QuoteCartContext)
  if (!context) {
    throw new Error('useQuoteCart must be used within a QuoteCartProvider')
  }
  return context
}
