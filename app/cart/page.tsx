import { MainHeader } from '@/components/main-header'
import { CartClient } from '@/components/cart-client'
import { getProductCategories, getSiteSettings } from '@/lib/db-data'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Shopping Cart & WhatsApp Checkout | Global Spec Solutions',
  description: 'Review your selected items and complete your order via WhatsApp.',
}

export default async function CartPage() {
  const [categories, siteSettings] = await Promise.all([
    getProductCategories(),
    getSiteSettings(),
  ])

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <MainHeader categories={categories} siteSettings={siteSettings} />
      <main className="flex-1">
        <CartClient />
      </main>
    </div>
  )
}
