'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

export interface CartItem {
  id: number
  name: string
  slug: string
  price: number
  imageUrl?: string
  quantity: number
}

interface CartContextType {
  cart: CartItem[]
  addToCart: (product: { id: number; name: string; slug: string; price: number; imageUrl?: string }, quantity?: number) => void
  removeFromCart: (id: number) => void
  updateQuantity: (id: number, quantity: number) => void
  clearCart: () => void
  totalItems: number
  subtotal: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    try {
      const saved = localStorage.getItem('globalspec_cart')
      if (saved) {
        setCart(JSON.parse(saved))
      }
    } catch (e) {
      console.error('Failed to load cart:', e)
    } finally {
      setIsLoaded(true)
    }
  }, [])

  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem('globalspec_cart', JSON.stringify(cart))
      } catch (e) {
        console.error('Failed to save cart:', e)
      }
    }
  }, [cart, isLoaded])

  const addToCart = (
    product: { id: number; name: string; slug: string; price: number; imageUrl?: string },
    quantity = 1
  ) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id)
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      }
      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          slug: product.slug,
          price: product.price,
          imageUrl: product.imageUrl,
          quantity,
        },
      ]
    })
  }

  const removeFromCart = (id: number) => {
    setCart((prev) => prev.filter((item) => item.id !== id))
  }

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id)
      return
    }
    setCart((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    )
  }

  const clearCart = () => {
    setCart([])
  }

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
