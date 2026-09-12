'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, ShoppingBag, FileText, MapPin, User as UserIcon } from 'lucide-react'

const tabs = [
  { href: '/account', label: 'Overview', icon: LayoutDashboard, exact: true },
  { href: '/account/orders', label: 'My Orders', icon: ShoppingBag },
  { href: '/account/quotes', label: 'My Quotes', icon: FileText },
  { href: '/account/addresses', label: 'Addresses', icon: MapPin },
  { href: '/account/profile', label: 'Profile', icon: UserIcon },
]

export function AccountNav() {
  const pathname = usePathname()
  return (
    <nav className="bg-card border border-border/60 rounded-xl p-3 space-y-1 lg:sticky lg:top-6">
      {tabs.map((tab) => {
        const active = tab.exact ? pathname === tab.href : pathname.startsWith(tab.href)
        const Icon = tab.icon
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`block px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2.5 ${
              active ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            <Icon className="w-4 h-4" /> {tab.label}
          </Link>
        )
      })}
    </nav>
  )
}