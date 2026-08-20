'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Trash2, Edit2, Plus } from 'lucide-react'

interface Product {
  id: number
  name: string
  description?: string
  categoryId: number
  price?: string
  imageUrl?: string
  features?: string
}

interface ProductsManagerProps {
  products: Product[]
  categories: Array<{ id: number; name: string }>
  onAdd: (product: Omit<Product, 'id'>) => Promise<void>
  onUpdate: (id: number, product: Partial<Product>) => Promise<void>
  onDelete: (id: number) => Promise<void>
}

export function ProductsManager({
  products,
  categories,
  onAdd,
  onUpdate,
  onDelete,
}: ProductsManagerProps) {
  const [editingId, setEditingId] = useState<number | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [formData, setFormData] = useState<Partial<Product>>({ categoryId: categories[0]?.id })
  const [isLoading, setIsLoading] = useState(false)

  const handleEdit = (product: Product) => {
    setEditingId(product.id)
    setFormData(product)
  }

  const handleAdd = () => {
    setIsAdding(true)
    setFormData({ categoryId: categories[0]?.id })
    setEditingId(null)
  }

  const handleSave = async () => {
    setIsLoading(true)
    try {
      if (editingId) {
        await onUpdate(editingId, formData)
        setEditingId(null)
      } else if (isAdding) {
        await onAdd(formData as Omit<Product, 'id'>)
        setIsAdding(false)
      }
      setFormData({})
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    setEditingId(null)
    setIsAdding(false)
    setFormData({})
  }

  const getCategoryName = (id: number) => categories.find((c) => c.id === id)?.name

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Products</h2>
          <p className="text-muted-foreground">Manage product listings</p>
        </div>
        {!isAdding && !editingId && (
          <Button onClick={handleAdd} className="gap-2">
            <Plus className="w-4 h-4" />
            Add Product
          </Button>
        )}
      </div>

      {(isAdding || editingId) && (
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? 'Edit Product' : 'New Product'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Name</label>
              <Input
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Product name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <Textarea
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Product description"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Category</label>
                <select
                  value={formData.categoryId || ''}
                  onChange={(e) => setFormData({ ...formData, categoryId: parseInt(e.target.value) })}
                  className="w-full border rounded px-3 py-2 text-sm"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Price</label>
                <Input
                  value={formData.price || ''}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="$0.00"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Image URL</label>
              <Input
                value={formData.imageUrl || ''}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Features (comma-separated)</label>
              <Textarea
                value={formData.features || ''}
                onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                placeholder="Feature 1, Feature 2, Feature 3"
                rows={2}
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={handleCancel} disabled={isLoading}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={isLoading || !formData.name}>
                {isLoading ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {products.map((product) => (
          <Card key={product.id}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-lg">{product.name}</h3>
                    <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">
                      {getCategoryName(product.categoryId)}
                    </span>
                  </div>
                  {product.price && <p className="text-lg font-bold text-accent mt-1">${product.price}</p>}
                  {product.description && <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{product.description}</p>}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(product)}
                    disabled={isLoading || editingId !== null}
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDelete(product.id)}
                    disabled={isLoading}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
