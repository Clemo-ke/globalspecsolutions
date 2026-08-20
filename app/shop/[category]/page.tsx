import { MainHeader } from '@/components/main-header'
import { ShopClient } from '@/components/shop-client'
import { FloatingWhatsApp } from '@/components/floating-whatsapp'
import { getProducts, getProductCategories, getSiteSettings, getCategoryBySlug } from '@/lib/db-data'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'

interface CategoryPageProps {
  params: Promise<{ category: string }>
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const resolvedParams = await params
  const cat = await getCategoryBySlug(resolvedParams.category)
  if (!cat) return { title: 'Category Not Found' }
  return {
    title: `${cat.name} | Equipment Shop | Global Spec Solutions`,
    description: cat.description || `Browse our ${cat.name} products and solutions.`,
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const resolvedParams = await params
  const categorySlug = resolvedParams.category
  const category = await getCategoryBySlug(categorySlug)

  if (!category) {
    notFound()
  }

  const [products, categories, siteSettings] = await Promise.all([
    getProducts({ categoryId: category.id }),
    getProductCategories(),
    getSiteSettings(),
  ])

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <MainHeader categories={categories} siteSettings={siteSettings} />
      <main className="flex-1">
        <ShopClient
          initialProducts={products as any}
          categories={categories as any}
          selectedCategorySlug={categorySlug}
        />
      </main>
      <FloatingWhatsApp
        whatsappNumber={siteSettings.whatsapp_number}
        enabled={siteSettings.floating_whatsapp_enabled !== 'false'}
      />
    </div>
  )
}
