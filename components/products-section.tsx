'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useCart } from '@/components/cart-context'
import { Button } from '@/components/ui/button'
import { ShoppingCart, ArrowRight, Check, Filter, ChevronRight } from 'lucide-react'
import { CategoryIcon } from '@/components/category-icon'

const staggerDelay = (index: number) => index * 60

interface Product {
  id: number
  slug?: string
  name: string
  description?: string
  categoryId: number
  price?: string
  salePrice?: string
  imageUrl?: string
  features?: string
  stockStatus?: string
  isFeatured?: boolean
}

interface Category {
  id: number
  name: string
  slug?: string
  color?: string
  icon?: string
}

interface ProductsSectionProps {
  products: Product[]
  categories: Category[]
}

export function ProductsSection({ products, categories }: ProductsSectionProps) {
  const { addToCart } = useCart()
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)
  const [addedId, setAddedId] = useState<number | null>(null)

  const filteredProducts = products.filter((product) => {
    return !selectedCategory || product.categoryId === selectedCategory
  })

  const handleAddToCart = (product: Product) => {
    const price = product.salePrice
      ? parseFloat(product.salePrice)
      : product.price
      ? parseFloat(product.price)
      : 0

    addToCart({
      id: product.id,
      name: product.name,
      price,
      slug: product.slug || String(product.id),
      imageUrl: product.imageUrl || null,
    })

    setAddedId(product.id)
    setTimeout(() => setAddedId(null), 2000)
  }

  const getCategoryName = (catId: number) =>
    categories.find((c) => c.id === catId)?.name || ''

  return (
    <section className="py-20 bg-background border-t border-border/30">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-primary block mb-2">Featured Products</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-balance">
              Premium Equipment & Solutions
            </h2>
            <p className="text-sm text-muted-foreground mt-2 max-w-lg">
              From UPS & critical power to solar inverters, structured cabling and security systems — all available for purchase or enquiry.
            </p>
          </div>
          <Link href="/shop">
            <Button variant="outline" className="gap-2 border-primary/30 text-primary hover:bg-primary/5 font-bold shrink-0">
              View Full Shop <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold border transition-all ${
              selectedCategory === null
                ? 'bg-primary text-white border-primary shadow-sm shadow-primary/20'
                : 'border-border text-muted-foreground hover:border-primary/50 hover:text-primary'
            }`}
          >
            <Filter className="w-3.5 h-3.5" /> All
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id === selectedCategory ? null : category.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold border transition-all ${
                selectedCategory === category.id
                  ? 'bg-primary text-white border-primary shadow-sm shadow-primary/20'
                  : 'border-border text-muted-foreground hover:border-primary/50 hover:text-primary'
              }`}
            >
              <CategoryIcon name={category.icon} className="w-3.5 h-3.5" />
              {category.name}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
          {filteredProducts.length > 0 ? (
            filteredProducts.slice(0, 6).map((product, index) => {
              const displayPrice = product.salePrice
                ? parseFloat(product.salePrice)
                : product.price
                ? parseFloat(product.price)
                : null
              const originalPrice = product.salePrice && product.price ? parseFloat(product.price) : null
              const isAdded = addedId === product.id

              return (
                <div
                  key={product.id}
                  className="bg-card border border-border/60 rounded-xl overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 group flex flex-col"
                  style={{ animation: `fadeInUp 0.5s ease-out ${staggerDelay(index)}ms both` }}
                >
                  {/* Product Image */}
                  <Link href={`/shop/product/${product.slug || product.id}`} className="block">
                    <div className="w-full h-48 bg-gradient-to-br from-primary/5 to-accent/5 overflow-hidden relative">
                      {product.imageUrl ? (
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <CategoryIcon
                            name={categories.find((c) => c.id === product.categoryId)?.icon}
                            className="w-16 h-16 text-primary/20"
                          />
                        </div>
                      )}
                      {product.salePrice && (
                        <span className="absolute top-2 left-2 bg-accent text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                          SALE
                        </span>
                      )}
                      {product.isFeatured && !product.salePrice && (
                        <span className="absolute top-2 left-2 bg-primary text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                          FEATURED
                        </span>
                      )}
                    </div>
                  </Link>

                  {/* Content */}
                  <div className="p-5 flex flex-col flex-1">
                    {/* Category tag */}
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">
                      {getCategoryName(product.categoryId)}
                    </span>

                    <Link href={`/shop/product/${product.slug || product.id}`}>
                      <h3 className="font-bold text-sm text-foreground line-clamp-2 hover:text-primary transition-colors mb-2 leading-snug">
                        {product.name}
                      </h3>
                    </Link>

                    {product.description && (
                      <p className="text-xs text-muted-foreground line-clamp-2 mb-3 leading-relaxed">
                        {product.description}
                      </p>
                    )}

                    {product.features && (
                      <ul className="space-y-1 mb-3">
                        {product.features.split(',').slice(0, 2).map((f, idx) => (
                          <li key={idx} className="flex items-start gap-1.5 text-xs text-muted-foreground">
                            <Check className="w-3 h-3 text-primary mt-0.5 shrink-0" />
                            <span className="line-clamp-1">{f.trim()}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    <div className="mt-auto pt-4 border-t border-border/40 flex items-center justify-between gap-3">
                      <div>
                        {displayPrice ? (
                          <div className="flex items-baseline gap-2">
                            <span className="text-base font-black text-primary">
                              KES {displayPrice.toLocaleString('en-KE', { maximumFractionDigits: 0 })}
                            </span>
                            {originalPrice && (
                              <span className="text-xs text-muted-foreground line-through">
                                KES {originalPrice.toLocaleString('en-KE', { maximumFractionDigits: 0 })}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-xs font-semibold text-muted-foreground">Contact for Price</span>
                        )}
                      </div>
                      <button
                        onClick={() => handleAddToCart(product)}
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                          isAdded
                            ? 'bg-emerald-500 text-white'
                            : 'bg-primary text-white hover:bg-primary/90 active:scale-95'
                        }`}
                      >
                        {isAdded ? (
                          <><Check className="w-3.5 h-3.5" /> Added</>
                        ) : (
                          <><ShoppingCart className="w-3.5 h-3.5" /> Add</>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )
            })
          ) : (
            <div className="col-span-full text-center py-16">
              <Filter className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground font-medium">No products found in this category.</p>
              <button
                onClick={() => setSelectedCategory(null)}
                className="mt-3 text-primary text-sm font-semibold hover:underline"
              >
                View all products
              </button>
            </div>
          )}
        </div>

        {/* View All CTA */}
        <div className="flex justify-center">
          <Link href="/shop">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-white font-bold gap-2 shadow-sm shadow-primary/20">
              Browse Full Product Catalogue
              <ChevronRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
