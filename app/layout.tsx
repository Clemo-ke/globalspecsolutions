import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { CartProvider } from '@/components/cart-context'
import { QuoteCartProvider } from '@/components/quote-cart-context'
import './globals.css'

export const metadata: Metadata = {
  title: 'Global Spec Solutions - Professional Business & Electrical Solutions',
  description:
    'Premium electrical, solar, UPS critical power, and ICT business solutions for industrial and commercial sectors. Dynamic e-commerce shop with WhatsApp ordering.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#00BFFF' },
    { media: '(prefers-color-scheme: dark)', color: '#FF6B35' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-background">
      <body className="antialiased">
        <CartProvider>
          <QuoteCartProvider>
            {children}
          </QuoteCartProvider>
        </CartProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}

