import { MainHeader } from '@/components/main-header'
import { ShopClient } from '@/components/shop-client'
import { FloatingWhatsApp } from '@/components/floating-whatsapp'
import { getProducts, getProductCategories, getSiteSettings } from '@/lib/db-data'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Equipment Shop & Products Catalog | Global Spec Solutions',
  description:
    'Browse our comprehensive catalog of critical power systems, UPS, data center infrastructure, renewable energy, and ICT solutions.',
}

interface ShopPageProps {
  searchParams: Promise<{ category?: string; search?: string }>
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const resolvedSearchParams = await searchParams
  const categorySlug = resolvedSearchParams.category || ''
  const search = resolvedSearchParams.search || ''

  const [products, categories, siteSettings] = await Promise.all([
    getProducts({ search }),
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
          initialSearch={search}
        />
      </main>
      <FloatingWhatsApp
        whatsappNumber={siteSettings.whatsapp_number}
        enabled={siteSettings.floating_whatsapp_enabled !== 'false'}
      />
    </div>
  )
}
