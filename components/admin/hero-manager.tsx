'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Trash2, Edit2, Plus } from 'lucide-react'

interface HeroSlide {
  id: number
  title: string
  subtitle?: string
  description?: string
  imageUrl?: string
  ctaText?: string
  ctaLink?: string
}

interface HeroManagerProps {
  slides: HeroSlide[]
  onAdd: (slide: Omit<HeroSlide, 'id'>) => Promise<void>
  onUpdate: (id: number, slide: Partial<HeroSlide>) => Promise<void>
  onDelete: (id: number) => Promise<void>
}

export function HeroManager({ slides, onAdd, onUpdate, onDelete }: HeroManagerProps) {
  const [editingId, setEditingId] = useState<number | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [formData, setFormData] = useState<Partial<HeroSlide>>({})
  const [isLoading, setIsLoading] = useState(false)

  const handleEdit = (slide: HeroSlide) => {
    setEditingId(slide.id)
    setFormData(slide)
  }

  const handleAdd = () => {
    setIsAdding(true)
    setFormData({})
    setEditingId(null)
  }

  const handleSave = async () => {
    setIsLoading(true)
    try {
      if (editingId) {
        await onUpdate(editingId, formData)
        setEditingId(null)
      } else if (isAdding) {
        await onAdd(formData as Omit<HeroSlide, 'id'>)
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Hero Carousel</h2>
          <p className="text-muted-foreground">Manage hero slide content</p>
        </div>
        {!isAdding && !editingId && (
          <Button onClick={handleAdd} className="gap-2">
            <Plus className="w-4 h-4" />
            Add Slide
          </Button>
        )}
      </div>

      {(isAdding || editingId) && (
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? 'Edit Slide' : 'New Slide'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Title</label>
              <Input
                value={formData.title || ''}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Slide title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Subtitle</label>
              <Input
                value={formData.subtitle || ''}
                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                placeholder="Slide subtitle"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <Textarea
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Slide description"
                className="resize-none"
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Image URL</label>
              <Input
                value={formData.imageUrl || ''}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">CTA Text</label>
                <Input
                  value={formData.ctaText || ''}
                  onChange={(e) => setFormData({ ...formData, ctaText: e.target.value })}
                  placeholder="Button text"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">CTA Link</label>
                <Input
                  value={formData.ctaLink || ''}
                  onChange={(e) => setFormData({ ...formData, ctaLink: e.target.value })}
                  placeholder="/products"
                />
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={handleCancel} disabled={isLoading}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={isLoading || !formData.title}>
                {isLoading ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {slides.map((slide) => (
          <Card key={slide.id}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{slide.title}</h3>
                  {slide.subtitle && <p className="text-sm text-muted-foreground">{slide.subtitle}</p>}
                  {slide.description && <p className="text-sm mt-2 line-clamp-2">{slide.description}</p>}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(slide)}
                    disabled={isLoading || editingId !== null}
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDelete(slide.id)}
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
