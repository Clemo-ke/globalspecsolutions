'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useCart } from '@/components/cart-context'
import {
  ShoppingCart,
  Check,
  Plus,
  Minus,
  MessageCircle,
  ShieldCheck,
  Zap,
  ArrowLeft,
  Share2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ProductDetailClientProps {
  product: {
    id: number
    slug: string
    name: string
    sku?: string | null
    description?: string | null
    categoryId: number
    price?: string | null
    salePrice?: string | null
    imageUrl?: string | null
    images?: string | null
    features?: string | null
    specifications?: string | null
    stockStatus?: string | null
  }
  categoryName?: string
  whatsappNumber?: string
}

export function ProductDetailClient({ product, categoryName, whatsappNumber = '+254721113431' }: ProductDetailClientProps) {
  const { addToCart } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [activeImage, setActiveImage] = useState(product.imageUrl || '/placeholder.jpg')
  const [added, setAdded] = useState(false)

  // Parse additional images array if existing
  let gallery: string[] = []
  if (product.imageUrl) gallery.push(product.imageUrl)
  if (product.images) {
    try {
      const parsed = JSON.parse(product.images)
      if (Array.isArray(parsed)) gallery.push(...parsed)
    } catch {}
  }
  gallery = Array.from(new Set(gallery))

  const priceNum = product.salePrice
    ? parseFloat(product.salePrice)
    : product.price
    ? parseFloat(product.price)
    : 0

  const handleAddToCart = () => {
    addToCart(
      {
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: priceNum,
        imageUrl: product.imageUrl || undefined,
      },
      quantity
    )
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const cleanNum = whatsappNumber.replace(/[^0-9]/g, '')
  const directInquiryMsg = `Hello Global Spec Solutions! I would like to inquire about ${product.name} (SKU: ${product.sku || 'N/A'}).`
  const directWhatsAppUrl = `https://wa.me/${cleanNum}?text=${encodeURIComponent(directInquiryMsg)}`

  // Parse features
  const featureList = product.features ? product.features.split(',').map((f) => f.trim()) : []

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-10 space-y-12">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
        <Link href="/shop" className="hover:text-primary transition-colors flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Shop
        </Link>
        <span>/</span>
        {categoryName && (
          <>
            <span>{categoryName}</span>
            <span>/</span>
          </>
        )}
        <span className="text-foreground line-clamp-1">{product.name}</span>
      </div>

      {/* Main Detail Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Gallery Section */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative aspect-square w-full bg-card border border-border/60 rounded-2xl overflow-hidden shadow-sm">
            <Image
              src={activeImage}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
          </div>

          {gallery.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {gallery.map((imgUrl, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(imgUrl)}
                  className={`relative w-20 h-20 rounded-xl border-2 overflow-hidden shrink-0 transition-all ${
                    activeImage === imgUrl ? 'border-primary shadow-md' : 'border-border/60 hover:border-primary/50'
                  }`}
                >
                  <Image src={imgUrl} alt={`Thumbnail ${idx}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info & Purchase Section */}
        <div className="lg:col-span-6 space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            {product.sku && (
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground bg-muted px-2.5 py-1 rounded-md inline-block">
                SKU: {product.sku}
              </span>
            )}
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
              {product.name}
            </h1>

            {/* Pricing Tag */}
            <div className="flex items-baseline gap-3">
              {product.salePrice ? (
                <>
                  <span className="text-3xl font-extrabold text-primary">
                    KES {parseFloat(product.salePrice).toLocaleString()}
                  </span>
                  <span className="text-lg text-muted-foreground line-through">
                    KES {parseFloat(product.price || '0').toLocaleString()}
                  </span>
                </>
              ) : (
                <span className="text-3xl font-extrabold text-primary">
                  KES {parseFloat(product.price || '0').toLocaleString()}
                </span>
              )}
            </div>

            {product.description && (
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            )}

            {/* Features Bullet List */}
            {featureList.length > 0 && (
              <div className="border-t border-border/60 pt-4 space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">Key Technical Features</h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {featureList.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-muted-foreground">
                      <Zap className="w-3.5 h-3.5 text-primary shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Purchasing Controls */}
          <div className="space-y-4 border-t border-border/60 pt-6">
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Quantity</span>
              <div className="flex items-center border border-border rounded-xl bg-card">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2.5 hover:bg-muted text-foreground transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-10 text-center font-bold text-sm">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2.5 hover:bg-muted text-foreground transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Button
                size="lg"
                onClick={handleAddToCart}
                className={`w-full gap-2 font-bold shadow-md transition-all ${
                  added
                    ? 'bg-emerald-600 hover:bg-emerald-600 text-white'
                    : 'bg-primary hover:bg-primary/90 text-primary-foreground'
                }`}
              >
                {added ? (
                  <>
                    <Check className="w-5 h-5" /> Added to Cart!
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-5 h-5" /> Add to Shopping Cart
                  </>
                )}
              </Button>

              <a href={directWhatsAppUrl} target="_blank" rel="noopener noreferrer" className="w-full">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full gap-2 font-bold border-emerald-600 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
                >
                  <MessageCircle className="w-5 h-5 text-emerald-600" /> Direct WhatsApp Inquiry
                </Button>
              </a>
            </div>

            <div className="p-3 bg-muted/40 rounded-xl flex items-center justify-between text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5 font-medium">
                <ShieldCheck className="w-4 h-4 text-primary" /> Genuine Equipment Guarantee
              </span>
              <span>Available for Dispatch</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
