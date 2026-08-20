'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ShoppingCart, Filter } from 'lucide-react'

const staggerDelay = (index: number) => index * 50

interface Product {
  id: number
  name: string
  description?: string
  categoryId: number
  price?: string
  imageUrl?: string
  features?: string
}

interface Category {
  id: number
  name: string
  color?: string
  icon?: string
}

interface ProductsSectionProps {
  products: Product[]
  categories: Category[]
}

export function ProductsSection({ products, categories }: ProductsSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  const filteredProducts = products.filter((product) => {
    const matchesCategory = !selectedCategory || product.categoryId === selectedCategory
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <section className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-balance">Our Products</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore our comprehensive range of premium products and solutions tailored for your business needs
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-4 py-2 border border-border rounded-lg bg-card focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === null ? 'default' : 'outline'}
              onClick={() => setSelectedCategory(null)}
              className="gap-2"
            >
              <Filter className="w-4 h-4" />
              All Products
            </Button>
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(category.id)}
                className={`${
                  selectedCategory === category.id
                    ? 'bg-primary hover:bg-primary/90'
                    : 'border-border hover:bg-card'
                }`}
              >
                {category.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredProducts.length > 0 ? (
            filteredProducts.slice(0, 6).map((product, index) => (
              <Card
                key={product.id}
                className="overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-border group"
                style={{
                  animation: `fadeInUp 0.5s ease-out ${staggerDelay(index)}ms both`,
                }}
              >
                {/* Product Image */}
                {product.imageUrl && (
                  <div className="w-full h-48 bg-gradient-to-br from-primary/10 to-accent/10 overflow-hidden">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}

                <CardHeader>
                  <CardTitle className="line-clamp-2">{product.name}</CardTitle>
                  {product.price && (
                    <div className="text-2xl font-bold text-primary">
                      Ksh {parseFloat(product.price).toLocaleString('en-KE', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                    </div>
                  )}
                </CardHeader>

                <CardContent className="space-y-4">
                  {product.description && (
                    <CardDescription className="line-clamp-2">
                      {product.description}
                    </CardDescription>
                  )}

                  {product.features && (
                    <div className="text-sm space-y-1">
                      <p className="font-semibold text-foreground">Features:</p>
                      <ul className="text-muted-foreground space-y-1">
                        {product.features.split(',').slice(0, 3).map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-accent mt-1">•</span>
                            <span>{feature.trim()}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <Button className="w-full gap-2 bg-accent hover:bg-accent/90 text-accent-foreground">
                    <ShoppingCart className="w-4 h-4" />
                    View Details
                  </Button>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground text-lg">No products found matching your criteria.</p>
            </div>
          )}
        </div>

        {/* View More Button */}
        {filteredProducts.length > 6 && (
          <div className="flex justify-center">
            <a href="/products">
              <Button size="lg" variant="outline" className="gap-2 border-primary text-primary hover:bg-primary/10">
                View All Products ({filteredProducts.length})
              </Button>
            </a>
          </div>
        )}
      </div>
    </section>
  )
}
