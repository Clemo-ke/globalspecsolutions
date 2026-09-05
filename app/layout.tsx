import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { CartProvider } from '@/components/cart-context'
import { QuoteCartProvider } from '@/components/quote-cart-context'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'Global Spec Solutions - Professional Business & Electrical Solutions',
  description:
    'Premium electrical, solar, UPS critical power, and ICT business solutions for industrial and commercial sectors. Dynamic e-commerce shop with WhatsApp ordering.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/icon.svg',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#00BFFF',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`light bg-white text-slate-900 ${inter.className}`}>
      <body className="antialiased bg-white text-slate-900 font-sans">
        <CartProvider>
          <QuoteCartProvider>
            {children}
          </QuoteCartProvider>
        </CartProvider>
      </body>
    </html>
  )
}

