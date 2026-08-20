import { MainHeader } from '@/components/main-header'
import { ProductDetailClient } from '@/components/product-detail-client'
import { FloatingWhatsApp } from '@/components/floating-whatsapp'
import { getProductBySlug, getProductCategories, getSiteSettings } from '@/lib/db-data'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'

interface ProductPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const resolvedParams = await params
  const product = await getProductBySlug(resolvedParams.slug)
  if (!product) return { title: 'Product Not Found' }
  return {
    title: `${product.name} | Global Spec Solutions`,
    description: product.description || `View features and pricing for ${product.name}.`,
  }
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const resolvedParams = await params
  const product = await getProductBySlug(resolvedParams.slug)

  if (!product) {
    notFound()
  }

  const [categories, siteSettings] = await Promise.all([
    getProductCategories(),
    getSiteSettings(),
  ])

  const category = categories.find((c) => c.id === product.categoryId)

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <MainHeader categories={categories} siteSettings={siteSettings} />
      <main className="flex-1">
        <ProductDetailClient
          product={product as any}
          categoryName={category?.name}
          whatsappNumber={siteSettings.whatsapp_number}
        />
      </main>
      <FloatingWhatsApp
        whatsappNumber={siteSettings.whatsapp_number}
        enabled={siteSettings.floating_whatsapp_enabled !== 'false'}
      />
    </div>
  )
}
