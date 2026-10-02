'use client'

import React, { useEffect, useState, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useCart } from '@/components/cart-context'
import { useSession } from '@/lib/auth-client'
import {
  ShoppingCart,
  Menu,
  X,
  Search,
  Phone,
  Mail,
  ChevronRight,
  ChevronDown,
  ShieldCheck,
  Zap,
  UserRound,
  LayoutDashboard,
  LogIn,
  FileText,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

interface HeaderProps {
  categories?: { id: number; name: string; slug: string }[]
  siteSettings?: Record<string, string>
}

export function MainHeader({ categories = [], siteSettings = {} }: HeaderProps) {
  const { totalItems } = useCart()
  const { data: session } = useSession()
  const [isAdmin, setIsAdmin] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [scrolled, setScrolled] = useState(false)
  const [shopDropdownOpen, setShopDropdownOpen] = useState(false)
  const shopDropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let active = true
    fetch('/api/auth/session/role', { cache: 'no-store' })
      .then((res) => (res.ok ? res.json() : null))
      .then((payload) => {
        if (!active) return
        setIsAdmin(Boolean(payload?.isAdmin))
      })
      .catch(() => {
        if (!active) return
        const fallbackRole = String((session?.user as any)?.role || '').toLowerCase()
        setIsAdmin(fallbackRole === 'admin' || fallbackRole === 'super-admin')
      })

    return () => { active = false }
  }, [session?.user])

  // Track scroll for shadow
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  // Close shop dropdown when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (shopDropdownRef.current && !shopDropdownRef.current.contains(e.target as Node)) {
        setShopDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const phone = siteSettings.company_phone || '+254 721 113 431'
  const email = siteSettings.company_email || 'info@globalspecsolutions.com'

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/shop?search=${encodeURIComponent(searchQuery.trim())}`
    }
  }

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/departments', label: 'Departments' },
    { href: '/services', label: 'Services' },
    { href: '/industries', label: 'Industries' },
    { href: '/partners', label: 'Partners' },
    { href: '/resources', label: 'Resources' },
  ]

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/85 transition-shadow duration-200 ${
        scrolled ? 'shadow-md' : ''
      }`}
    >
      {/* Top utility bar */}
      <div className="bg-slate-950 text-slate-300 border-b border-slate-900 py-1.5 px-4 text-xs font-medium hidden sm:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <a
              href={`tel:${phone.split('/')[0].replace(/\s+/g, '')}`}
              className="flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-primary" />
              {phone}
            </a>
            <a
              href={`mailto:${email}`}
              className="flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <Mail className="w-3.5 h-3.5 text-accent" />
              {email}
            </a>
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" /> ISO Certified & Reliable
            </span>
            {isAdmin && (
              <Link href="/admin" className="flex items-center gap-1 text-primary hover:text-primary/80 transition-colors">
                <LayoutDashboard className="w-3.5 h-3.5" /> Admin
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 sm:h-18 flex items-center justify-between gap-4">
        {/* Brand logo */}
        <Link href="/" className="flex items-center gap-3 group shrink-0">
          <div className="relative overflow-hidden rounded-lg p-1 transition-transform group-hover:scale-105">
            <Image
              src="/logo.png"
              alt="Global Spec Solutions"
              width={140}
              height={45}
              className="h-9 sm:h-11 w-auto object-contain"
              priority
            />
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-1 text-sm font-semibold">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="px-3 py-2 rounded-md hover:bg-muted hover:text-primary transition-colors text-foreground/80 hover:text-primary"
            >
              {label}
            </Link>
          ))}

          {/* Shop dropdown */}
          <div className="relative" ref={shopDropdownRef}>
            <button
              onClick={() => setShopDropdownOpen(!shopDropdownOpen)}
              className="flex items-center gap-1 px-3 py-2 rounded-md hover:bg-muted text-foreground/80 hover:text-primary transition-colors"
            >
              Shop <ChevronDown className={`w-3.5 h-3.5 transition-transform ${shopDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            {shopDropdownOpen && (
              <div className="absolute top-full left-0 mt-1 w-64 bg-background border border-border rounded-xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-3 py-1.5 text-[10px] font-bold uppercase text-muted-foreground tracking-widest">
                  Product Categories
                </div>
                <Link
                  href="/shop"
                  onClick={() => setShopDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-muted hover:text-primary transition-colors font-semibold text-primary"
                >
                  <Zap className="w-4 h-4 text-amber-500 fill-amber-400/50" />
                  All Products
                </Link>
                {categories.slice(0, 6).map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/shop/${cat.slug}`}
                    onClick={() => setShopDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-muted hover:text-primary transition-colors text-foreground/80"
                  >
                    <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
                    {cat.name}
                  </Link>
                ))}
                <div className="border-t border-border mt-1 pt-1">
                  <Link
                    href="/quote"
                    onClick={() => setShopDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-muted hover:text-primary transition-colors text-foreground/80"
                  >
                    <FileText className="w-4 h-4 text-muted-foreground" />
                    Request a Quote
                  </Link>
                </div>
              </div>
            )}
          </div>

          <Link
            href="/#contact"
            className="px-3 py-2 rounded-md hover:bg-muted hover:text-primary transition-colors text-foreground/80"
          >
            Contact
          </Link>
        </nav>

        {/* Action icons */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Search Trigger */}
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="p-2 rounded-full hover:bg-muted text-foreground/70 hover:text-primary transition-colors"
            title="Search Products"
            aria-label="Search"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Account / Sign In */}
          {session?.user ? (
            <Link
              href="/account"
              className="hidden sm:flex p-2 rounded-full hover:bg-muted text-foreground/70 hover:text-primary transition-colors"
              title="My Account"
            >
              <UserRound className="w-5 h-5" />
            </Link>
          ) : (
            <Link
              href="/sign-in"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold border border-border rounded-full hover:bg-muted hover:text-primary transition-colors text-foreground/70"
              title="Sign In"
            >
              <LogIn className="w-3.5 h-3.5" />
              Sign In
            </Link>
          )}

          {/* Cart Icon */}
          <Link
            href="/cart"
            className="relative p-2 rounded-full hover:bg-muted text-foreground/70 hover:text-primary transition-colors"
            title="Shopping Cart"
            aria-label="Shopping Cart"
          >
            <ShoppingCart className="w-5 h-5" />
            {totalItems > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-accent text-white text-[9px] font-bold w-4.5 h-4.5 min-w-[18px] min-h-[18px] rounded-full flex items-center justify-center leading-none px-0.5">
                {totalItems > 99 ? '99+' : totalItems}
              </span>
            )}
          </Link>

          {/* Quote CTA - desktop only */}
          <Link href="/quote" className="hidden lg:block ml-1">
            <Button size="sm" className="bg-primary hover:bg-primary/90 text-white font-bold text-xs gap-1.5 rounded-full px-4">
              <FileText className="w-3.5 h-3.5" />
              Get a Quote
            </Button>
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-foreground/70 hover:bg-muted hover:text-primary rounded-lg transition-colors"
            aria-label={mobileMenuOpen ? 'Close Menu' : 'Open Menu'}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Expandable Search Input Bar */}
      {searchOpen && (
        <div className="border-t border-border/40 bg-card py-3 px-4 shadow-inner animate-in slide-in-from-top-2 duration-200">
          <form onSubmit={handleSearch} className="max-w-3xl mx-auto flex items-center gap-2">
            <Search className="w-4 h-4 text-muted-foreground ml-1 shrink-0" />
            <input
              type="text"
              placeholder="Search products, equipment, SKU..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-3 py-2 text-sm bg-transparent focus:outline-none"
              autoFocus
            />
            <Button type="submit" size="sm" className="rounded-full px-4">
              Search
            </Button>
            <button
              type="button"
              onClick={() => setSearchOpen(false)}
              className="p-2 text-muted-foreground hover:text-foreground rounded-full hover:bg-muted"
            >
              <X className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* Mobile Slide-down Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-border/40 bg-background px-5 py-5 shadow-xl animate-in slide-in-from-top-3 duration-200">
          {/* Mobile contact info */}
          <div className="mb-4 pb-4 border-b border-border/30 flex flex-col gap-2">
            <a href={`tel:${phone.split('/')[0].replace(/\s+/g, '')}`} className="flex items-center gap-2 text-xs text-muted-foreground">
              <Phone className="w-3.5 h-3.5 text-primary" /> {phone}
            </a>
            <a href={`mailto:${email}`} className="flex items-center gap-2 text-xs text-muted-foreground">
              <Mail className="w-3.5 h-3.5 text-accent" /> {email}
            </a>
          </div>

          <nav className="flex flex-col gap-0.5 font-semibold text-sm">
            {isAdmin && (
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between py-3 px-3 rounded-lg bg-primary/5 text-primary border border-primary/20 mb-2"
              >
                <span className="flex items-center gap-2">
                  <LayoutDashboard className="w-4 h-4" />
                  Admin Dashboard
                </span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            )}

            {[
              { href: '/', label: 'Home' },
              { href: '/departments', label: 'Departments' },
              { href: '/shop', label: 'Shop Products', highlight: true },
              { href: '/services', label: 'Services' },
              { href: '/industries', label: 'Industries' },
              { href: '/partners', label: 'Partners' },
              { href: '/resources', label: 'Resources' },
              { href: '/#portfolio', label: 'Portfolio' },
              { href: '/account', label: 'Account' },
              { href: '/#contact', label: 'Contact' },
            ].map(({ href, label, highlight }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between py-2.5 px-3 rounded-lg transition-colors ${
                  highlight
                    ? 'text-primary font-bold'
                    : 'text-foreground hover:bg-muted hover:text-primary'
                }`}
              >
                <span className="flex items-center gap-2">
                  {highlight && <Zap className="w-4 h-4 text-amber-500 fill-amber-400/50" />}
                  {label}
                </span>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </Link>
            ))}
          </nav>

          <div className="mt-5 pt-4 border-t border-border/30">
            <Link href="/quote" onClick={() => setMobileMenuOpen(false)}>
              <Button className="w-full bg-primary text-white font-bold gap-2">
                <FileText className="w-4 h-4" />
                Request a Quote
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
