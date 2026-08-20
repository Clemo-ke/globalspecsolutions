'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useCart } from '@/components/cart-context'
import { ShoppingCart, Filter, Search, Check, Zap, ArrowUpDown } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ShopProduct {
  id: number
  slug: string
  name: string
  sku?: string | null
  description?: string | null
  categoryId: number
  price?: string | null
  salePrice?: string | null
  imageUrl?: string | null
  features?: string | null
  stockStatus?: string | null
  isFeatured?: boolean | null
}

interface ShopCategory {
  id: number
  slug: string
  name: string
  description?: string | null
  icon?: string | null
}

interface ShopClientProps {
  initialProducts: ShopProduct[]
  categories: ShopCategory[]
  selectedCategorySlug?: string
  initialSearch?: string
}

export function ShopClient({
  initialProducts,
  categories,
  selectedCategorySlug = '',
  initialSearch = '',
}: ShopClientProps) {
  const { addToCart } = useCart()
  const [searchTerm, setSearchTerm] = useState(initialSearch)
  const [activeCategory, setActiveCategory] = useState(selectedCategorySlug)
  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high' | 'name'>('featured')
  const [addedNoticeId, setAddedNoticeId] = useState<number | null>(null)

  const handleAddToCart = (product: ShopProduct) => {
    const priceNum = product.salePrice
      ? parseFloat(product.salePrice)
      : product.price
      ? parseFloat(product.price)
      : 0

    addToCart(
      {
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: priceNum,
        imageUrl: product.imageUrl || undefined,
      },
      1
    )

    setAddedNoticeId(product.id)
    setTimeout(() => setAddedNoticeId(null), 2000)
  }

  // Filter products locally
  const filteredProducts = initialProducts.filter((product) => {
    const categoryMatch = !activeCategory || categories.find((c) => c.slug === activeCategory)?.id === product.categoryId
    const searchLower = searchTerm.toLowerCase()
    const searchMatch =
      !searchTerm ||
      product.name.toLowerCase().includes(searchLower) ||
      (product.description && product.description.toLowerCase().includes(searchLower)) ||
      (product.sku && product.sku.toLowerCase().includes(searchLower))

    return categoryMatch && searchMatch
  })

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const priceA = parseFloat(a.salePrice || a.price || '0')
    const priceB = parseFloat(b.salePrice || b.price || '0')

    if (sortBy === 'price-low') return priceA - priceB
    if (sortBy === 'price-high') return priceB - priceA
    if (sortBy === 'name') return a.name.localeCompare(b.name)
    return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0)
  })

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-10">
      {/* Shop Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-primary/90 to-slate-950 text-white rounded-2xl p-8 sm:p-12 mb-10 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl -z-0" />
        <div className="relative z-10 max-w-2xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-accent text-accent-foreground mb-4">
            <Zap className="w-3.5 h-3.5 fill-current" /> Official Equipment Store
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4">
            Professional Business Equipment & Solutions
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Browse our catalog of critical power, UPS systems, solar power installations, data center infrastructure, and ICT monitoring equipment. Order directly to WhatsApp.
          </p>
        </div>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-8">
        {/* Search bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by product name, SKU, keywords..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-sm border border-border/80 rounded-xl bg-card focus:ring-2 focus:ring-primary focus:outline-none shadow-sm"
          />
        </div>

        {/* Sort Selector */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
            <ArrowUpDown className="w-3.5 h-3.5" /> Sort:
          </span>
          <select
            value={sortBy}
            onChange={(e: any) => setSortBy(e.target.value)}
            className="px-3 py-2 text-sm border border-border/80 rounded-xl bg-card focus:ring-2 focus:ring-primary focus:outline-none font-medium"
          >
            <option value="featured">Featured First</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="name">Product Name (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
        <button
          onClick={() => setActiveCategory('')}
          className={`px-4 py-2 text-xs font-semibold rounded-full whitespace-nowrap transition-all ${
            !activeCategory
              ? 'bg-primary text-primary-foreground shadow-md'
              : 'bg-card border border-border hover:bg-muted text-foreground'
          }`}
        >
          All Products ({initialProducts.length})
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.slug)}
            className={`px-4 py-2 text-xs font-semibold rounded-full whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeCategory === cat.slug
                ? 'bg-primary text-primary-foreground shadow-md'
                : 'bg-card border border-border hover:bg-muted text-foreground'
            }`}
          >
            {cat.icon && <span>{cat.icon}</span>}
            {cat.name}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      {sortedProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedProducts.map((product) => {
            const price = parseFloat(product.price || '0')
            const salePrice = product.salePrice ? parseFloat(product.salePrice) : null

            return (
              <div
                key={product.id}
                className="group bg-card border border-border/60 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                {/* Product image section */}
                <div className="relative aspect-square w-full bg-gradient-to-br from-muted/40 to-muted/80 overflow-hidden">
                  {product.imageUrl ? (
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-sm text-muted-foreground">
                      No Image
                    </div>
                  )}

                  {product.isFeatured && (
                    <span className="absolute top-3 left-3 bg-accent text-accent-foreground text-[10px] font-bold px-2.5 py-1 rounded-full shadow-md">
                      Featured
                    </span>
                  )}
                </div>

                {/* Product Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    {product.sku && (
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                        SKU: {product.sku}
                      </span>
                    )}
                    <Link
                      href={`/shop/product/${product.slug}`}
                      className="font-bold text-base hover:text-primary transition-colors line-clamp-2 leading-snug"
                    >
                      {product.name}
                    </Link>
                    {product.description && (
                      <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                        {product.description}
                      </p>
                    )}
                  </div>

                  {/* Pricing and Action */}
                  <div className="pt-2 border-t border-border/40 flex items-center justify-between">
                    <div>
                      {salePrice ? (
                        <div className="flex items-baseline gap-2">
                          <span className="text-lg font-extrabold text-primary">
                            KES {salePrice.toLocaleString()}
                          </span>
                          <span className="text-xs text-muted-foreground line-through">
                            KES {price.toLocaleString()}
                          </span>
                        </div>
                      ) : (
                        <span className="text-lg font-extrabold text-primary">
                          KES {price.toLocaleString()}
                        </span>
                      )}
                    </div>

                    <Button
                      size="sm"
                      onClick={() => handleAddToCart(product)}
                      className={`gap-1.5 font-semibold transition-all ${
                        addedNoticeId === product.id
                          ? 'bg-emerald-600 hover:bg-emerald-600 text-white'
                          : 'bg-primary hover:bg-primary/90 text-primary-foreground'
                      }`}
                    >
                      {addedNoticeId === product.id ? (
                        <>
                          <Check className="w-4 h-4" /> Added!
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="w-4 h-4" /> Add
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-20 bg-muted/20 border border-dashed border-border rounded-2xl space-y-3">
          <p className="text-lg font-bold text-muted-foreground">No products match your filter parameters.</p>
          <button
            onClick={() => {
              setSearchTerm('')
              setActiveCategory('')
            }}
            className="text-sm text-primary font-semibold hover:underline"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  )
}
