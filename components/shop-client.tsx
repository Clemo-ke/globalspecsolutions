'use client'

import React, { useState, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useCart } from '@/components/cart-context'
import {
  ShoppingCart,
  Search,
  Check,
  Zap,
  ArrowUpDown,
  SlidersHorizontal,
  Tag,
  Star,
  ChevronDown,
  X,
  BadgePercent,
} from 'lucide-react'
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
  color?: string | null
}

interface ShopClientProps {
  initialProducts: ShopProduct[]
  categories: ShopCategory[]
  selectedCategorySlug?: string
  initialSearch?: string
}

function stockLabel(status: string | null | undefined) {
  switch (status) {
    case 'in_stock': return { text: 'In Stock', cls: 'text-emerald-600 bg-emerald-50 border-emerald-200' }
    case 'available_on_order': return { text: 'On Order', cls: 'text-amber-600 bg-amber-50 border-amber-200' }
    case 'out_of_stock': return { text: 'Out of Stock', cls: 'text-red-500 bg-red-50 border-red-200' }
    default: return { text: 'In Stock', cls: 'text-emerald-600 bg-emerald-50 border-emerald-200' }
  }
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
  const [showFilters, setShowFilters] = useState(false)
  const [priceMin, setPriceMin] = useState('')
  const [priceMax, setPriceMax] = useState('')
  const [onSaleOnly, setOnSaleOnly] = useState(false)

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

  // ─── Filtering ─────────────────────────────────────────────────────────────
  const filteredProducts = useMemo(() => {
    return initialProducts.filter((product) => {
      // Category filter
      const catMatch =
        !activeCategory ||
        categories.find((c) => c.slug === activeCategory)?.id === product.categoryId

      // Search filter
      const searchLower = searchTerm.toLowerCase()
      const searchMatch =
        !searchTerm ||
        product.name.toLowerCase().includes(searchLower) ||
        (product.description && product.description.toLowerCase().includes(searchLower)) ||
        (product.sku && product.sku.toLowerCase().includes(searchLower)) ||
        (product.features && product.features.toLowerCase().includes(searchLower))

      // Price range filter
      const effectivePrice = parseFloat(product.salePrice || product.price || '0')
      const minMatch = !priceMin || effectivePrice >= parseFloat(priceMin)
      const maxMatch = !priceMax || effectivePrice <= parseFloat(priceMax)

      // On-sale filter
      const saleMatch = !onSaleOnly || Boolean(product.salePrice)

      return catMatch && searchMatch && minMatch && maxMatch && saleMatch
    })
  }, [initialProducts, activeCategory, categories, searchTerm, priceMin, priceMax, onSaleOnly])

  // ─── Sorting ───────────────────────────────────────────────────────────────
  const sortedProducts = useMemo(() => {
    return [...filteredProducts].sort((a, b) => {
      const priceA = parseFloat(a.salePrice || a.price || '0')
      const priceB = parseFloat(b.salePrice || b.price || '0')
      if (sortBy === 'price-low') return priceA - priceB
      if (sortBy === 'price-high') return priceB - priceA
      if (sortBy === 'name') return a.name.localeCompare(b.name)
      return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0)
    })
  }, [filteredProducts, sortBy])

  // ─── Featured products for hero section ───────────────────────────────────
  const featuredProducts = initialProducts.filter((p) => p.isFeatured).slice(0, 4)

  const hasActiveFilters = searchTerm || activeCategory || priceMin || priceMax || onSaleOnly

  const resetFilters = () => {
    setSearchTerm('')
    setActiveCategory('')
    setPriceMin('')
    setPriceMax('')
    setOnSaleOnly(false)
  }

  // ─── Active category object ────────────────────────────────────────────────
  const activeCategoryObj = categories.find((c) => c.slug === activeCategory)

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 space-y-10">
      {/* ── Hero Banner ── */}
      <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-950 text-white rounded-2xl p-8 sm:p-12 relative overflow-hidden shadow-2xl">
        <div className="absolute right-0 top-0 w-96 h-96 bg-primary/15 rounded-full blur-3xl" />
        <div className="absolute left-1/2 bottom-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="relative z-10 max-w-2xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/30 text-blue-200 border border-primary/40 mb-4">
            <Zap className="w-3.5 h-3.5 fill-current" />
            globalspecsolutions.com — Official Equipment Store
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4 leading-tight">
            Professional Business<br />
            <span className="text-primary">Equipment & Solutions</span>
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Browse our catalog of critical power, UPS systems, solar power installations, data centre infrastructure, and ICT monitoring equipment. Order directly via WhatsApp.
          </p>
          <div className="flex items-center gap-4 mt-6 text-xs text-slate-400">
            <span className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-400" /> {initialProducts.length} Products</span>
            <span className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-400" /> {categories.length} Categories</span>
            <span className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-400" /> Nairobi Delivery</span>
          </div>
        </div>
      </div>

      {/* ── Featured Products Carousel ── */}
      {!activeCategory && !searchTerm && featuredProducts.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            <h2 className="font-bold text-lg text-foreground">Featured Products</h2>
            <span className="text-xs text-muted-foreground">— Top picks for enterprise clients</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {featuredProducts.map((product) => {
              const price = parseFloat(product.price || '0')
              const salePrice = product.salePrice ? parseFloat(product.salePrice) : null
              const discountPct = salePrice && price ? Math.round(((price - salePrice) / price) * 100) : null
              return (
                <Link
                  key={product.id}
                  href={`/shop/product/${product.slug}`}
                  className="group bg-gradient-to-br from-primary/5 to-blue-50 border-2 border-primary/20 rounded-2xl overflow-hidden hover:shadow-lg hover:border-primary/40 transition-all duration-300"
                >
                  <div className="relative aspect-square bg-white overflow-hidden">
                    {product.imageUrl ? (
                      <Image src={product.imageUrl} alt={product.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">No Image</div>
                    )}
                    {discountPct && (
                      <span className="absolute top-2 right-2 bg-red-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                        -{discountPct}%
                      </span>
                    )}
                    <span className="absolute top-2 left-2 bg-amber-400 text-amber-900 text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Star className="w-2.5 h-2.5 fill-current" /> Featured
                    </span>
                  </div>
                  <div className="p-3">
                    <p className="font-bold text-xs text-foreground leading-snug line-clamp-2">{product.name}</p>
                    <div className="mt-1.5">
                      {salePrice ? (
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-sm font-extrabold text-primary">KES {salePrice.toLocaleString()}</span>
                          <span className="text-[10px] text-muted-foreground line-through">KES {price.toLocaleString()}</span>
                        </div>
                      ) : (
                        <span className="text-sm font-extrabold text-primary">KES {price.toLocaleString()}</span>
                      )}
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      )}

      {/* ── Search + Filter Bar ── */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1 max-w-lg">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search products, SKU, features..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm border border-border/80 rounded-xl bg-card focus:ring-2 focus:ring-primary focus:outline-none shadow-sm"
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1 whitespace-nowrap">
              <ArrowUpDown className="w-3.5 h-3.5" /> Sort:
            </span>
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="px-3 py-2.5 text-sm border border-border/80 rounded-xl bg-card focus:ring-2 focus:ring-primary focus:outline-none font-medium"
            >
              <option value="featured">Featured First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Name (A–Z)</option>
            </select>
          </div>

          {/* Filter toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all ${showFilters ? 'bg-primary text-primary-foreground border-primary' : 'border-border bg-card hover:bg-muted'}`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
            {(priceMin || priceMax || onSaleOnly) && (
              <span className="w-2 h-2 bg-red-500 rounded-full" />
            )}
          </button>
        </div>

        {/* Expanded filter panel */}
        {showFilters && (
          <div className="p-4 bg-muted/30 border border-border/60 rounded-2xl space-y-4 animate-fadeInUp">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-1.5">Min Price (KES)</label>
                <input
                  type="number"
                  value={priceMin}
                  onChange={(e) => setPriceMin(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-border rounded-xl bg-card focus:ring-2 focus:ring-primary focus:outline-none"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-1.5">Max Price (KES)</label>
                <input
                  type="number"
                  value={priceMax}
                  onChange={(e) => setPriceMax(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-border rounded-xl bg-card focus:ring-2 focus:ring-primary focus:outline-none"
                  placeholder="10,000,000"
                />
              </div>
              <div className="flex items-end">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <div
                    onClick={() => setOnSaleOnly(!onSaleOnly)}
                    className={`w-10 h-6 rounded-full transition-all flex items-center px-0.5 ${onSaleOnly ? 'bg-primary' : 'bg-muted border border-border'}`}
                  >
                    <div className={`w-5 h-5 rounded-full bg-white shadow transition-all ${onSaleOnly ? 'translate-x-4' : 'translate-x-0'}`} />
                  </div>
                  <span className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                    <BadgePercent className="w-4 h-4 text-red-500" /> On Sale Only
                  </span>
                </label>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Category Pills ── */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none -mx-1 px-1">
        <button
          onClick={() => setActiveCategory('')}
          className={`px-4 py-2 text-xs font-semibold rounded-full whitespace-nowrap transition-all border ${!activeCategory ? 'bg-primary text-primary-foreground border-primary shadow-sm' : 'bg-card border-border hover:bg-muted text-foreground'}`}
        >
          All ({initialProducts.length})
        </button>
        {categories.map((cat) => {
          const count = initialProducts.filter((p) => p.categoryId === cat.id).length
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(activeCategory === cat.slug ? '' : cat.slug)}
              className={`px-4 py-2 text-xs font-semibold rounded-full whitespace-nowrap transition-all flex items-center gap-1.5 border ${activeCategory === cat.slug ? 'bg-primary text-primary-foreground border-primary shadow-sm' : 'bg-card border-border hover:bg-muted text-foreground'}`}
            >
              {cat.icon && <span>{cat.icon}</span>}
              {cat.name} ({count})
            </button>
          )
        })}
      </div>

      {/* ── Active category header ── */}
      {activeCategoryObj && (
        <div className="flex items-center gap-3 p-4 bg-primary/5 border border-primary/20 rounded-2xl">
          <span className="text-2xl">{activeCategoryObj.icon || '📦'}</span>
          <div>
            <h2 className="font-bold text-foreground">{activeCategoryObj.name}</h2>
            {activeCategoryObj.description && <p className="text-xs text-muted-foreground">{activeCategoryObj.description}</p>}
          </div>
          <span className="ml-auto text-xs font-semibold text-muted-foreground">{filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}</span>
        </div>
      )}

      {/* ── Results bar ── */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing <span className="font-bold text-foreground">{sortedProducts.length}</span> of{' '}
          <span className="font-bold text-foreground">{initialProducts.length}</span> products
        </p>
        {hasActiveFilters && (
          <button onClick={resetFilters} className="flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary/80 transition-colors">
            <X className="w-3.5 h-3.5" /> Clear all filters
          </button>
        )}
      </div>

      {/* ── Product Grid ── */}
      {sortedProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {sortedProducts.map((product) => {
            const price = parseFloat(product.price || '0')
            const salePrice = product.salePrice ? parseFloat(product.salePrice) : null
            const discountPct = salePrice && price ? Math.round(((price - salePrice) / price) * 100) : null
            const stock = stockLabel(product.stockStatus)
            const catObj = categories.find((c) => c.id === product.categoryId)

            return (
              <div
                key={product.id}
                className="group bg-card border border-border/60 rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
              >
                {/* Image */}
                <div className="relative aspect-[4/3] w-full bg-gradient-to-br from-muted/40 to-muted/80 overflow-hidden">
                  {product.imageUrl ? (
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">No Image</div>
                  )}

                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                    {product.isFeatured && (
                      <span className="bg-amber-400 text-amber-900 text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1 shadow">
                        <Star className="w-2.5 h-2.5 fill-current" /> Featured
                      </span>
                    )}
                    {catObj && (
                      <span className="bg-white/90 text-foreground text-[10px] font-bold px-2 py-0.5 rounded-full shadow backdrop-blur-sm">
                        {catObj.icon} {catObj.name}
                      </span>
                    )}
                  </div>

                  {discountPct && (
                    <span className="absolute top-3 right-3 bg-red-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow">
                      -{discountPct}%
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-1.5">
                    {product.sku && (
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">SKU: {product.sku}</span>
                    )}
                    <Link
                      href={`/shop/product/${product.slug}`}
                      className="font-bold text-sm text-foreground hover:text-primary transition-colors line-clamp-2 leading-snug block"
                    >
                      {product.name}
                    </Link>
                    {product.description && (
                      <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">{product.description}</p>
                    )}
                    {product.features && (
                      <div className="flex flex-wrap gap-1 pt-0.5">
                        {product.features.split(',').slice(0, 2).map((f, i) => (
                          <span key={i} className="text-[10px] bg-muted/60 text-muted-foreground px-2 py-0.5 rounded-full border border-border/50 font-medium">
                            {f.trim()}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Price + Action */}
                  <div className="pt-3 border-t border-border/40 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        {salePrice ? (
                          <div>
                            <div className="flex items-baseline gap-1.5">
                              <span className="text-lg font-extrabold text-primary">KES {salePrice.toLocaleString()}</span>
                            </div>
                            <span className="text-xs text-muted-foreground line-through">KES {price.toLocaleString()}</span>
                          </div>
                        ) : price > 0 ? (
                          <span className="text-lg font-extrabold text-primary">KES {price.toLocaleString()}</span>
                        ) : (
                          <span className="text-sm font-bold text-muted-foreground">Contact for Price</span>
                        )}
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${stock.cls}`}>{stock.text}</span>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className={`flex-1 gap-1.5 font-semibold text-xs transition-all ${addedNoticeId === product.id ? 'bg-emerald-600 hover:bg-emerald-600' : 'bg-primary hover:bg-primary/90'}`}
                        onClick={() => handleAddToCart(product)}
                        disabled={product.stockStatus === 'out_of_stock'}
                      >
                        {addedNoticeId === product.id ? (
                          <><Check className="w-3.5 h-3.5" /> Added!</>
                        ) : (
                          <><ShoppingCart className="w-3.5 h-3.5" /> Add to Cart</>
                        )}
                      </Button>
                      <Link href={`/shop/product/${product.slug}`}>
                        <Button size="sm" variant="outline" className="font-semibold text-xs border-border px-3">
                          View
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-20 bg-muted/20 border border-dashed border-border rounded-2xl space-y-3">
          <Search className="w-10 h-10 text-muted-foreground/40 mx-auto" />
          <p className="text-base font-bold text-muted-foreground">No products match your filters.</p>
          <p className="text-sm text-muted-foreground/70">Try adjusting your search term or clearing some filters.</p>
          <button onClick={resetFilters} className="text-sm text-primary font-semibold hover:underline">
            Reset All Filters
          </button>
        </div>
      )}
    </div>
  )
}
