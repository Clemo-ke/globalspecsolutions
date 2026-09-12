import { MainHeader } from '@/components/main-header'
import { CheckoutClient } from '@/components/checkout-client'
import { FloatingWhatsApp } from '@/components/floating-whatsapp'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { getSiteSettings, getDeliveryMethods, getPaymentMethods, getCustomerByUser, getCustomerAddresses } from '@/lib/db-data'
import { getProductCategories } from '@/lib/db-data'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Checkout | Global Spec Solutions',
  description: 'Complete your order with Global Spec Solutions.',
}

export default async function CheckoutPage() {
  const [session, siteSettings, categories] = await Promise.all([
    auth.api.getSession({ headers: await headers() }).catch(() => null),
    getSiteSettings(),
    getProductCategories(),
  ])

  const deliveryMethods = await getDeliveryMethods()
  const paymentMethods = await getPaymentMethods()

  let customer = null
  let addresses: any[] = []
  if (session?.user) {
    customer = await getCustomerByUser(session.user.id)
    if (customer) addresses = await getCustomerAddresses(customer.id)
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <MainHeader categories={categories} siteSettings={siteSettings} />
      <main className="flex-1">
        <CheckoutClient
          sessionUser={{
            id: session?.user?.id || null,
            name: session?.user?.name || null,
            email: session?.user?.email || null,
          }}
          customer={{
            id: customer?.id || null,
            name: customer?.name || null,
            phone: customer?.phone || null,
            company: customer?.company || null,
            email: customer?.email || null,
          }}
          addresses={addresses}
          deliveryMethods={deliveryMethods}
          paymentMethods={paymentMethods}
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