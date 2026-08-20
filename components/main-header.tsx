'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useCart } from '@/components/cart-context'
import {
  ShoppingCart,
  Menu,
  X,
  Search,
  Phone,
  Mail,
  ChevronRight,
  ShieldCheck,
  Zap,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

interface HeaderProps {
  categories?: { id: number; name: string; slug: string }[]
  siteSettings?: Record<string, string>
}

export function MainHeader({ categories = [], siteSettings = {} }: HeaderProps) {
  const { totalItems } = useCart()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const phone = siteSettings.company_phone || '+254 721 113 431'
  const email = siteSettings.company_email || 'info@globalspecsolutions.com'

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/shop?search=${encodeURIComponent(searchQuery.trim())}`
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/80">
      {/* Top utility bar */}
      <div className="bg-muted/50 border-b border-border/40 py-1.5 px-4 text-xs font-medium text-muted-foreground hidden sm:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 hover:text-foreground transition-colors">
              <Phone className="w-3.5 h-3.5 text-primary" />
              <a href={`tel:${phone.replace(/\s+/g, '')}`}>{phone}</a>
            </span>
            <span className="flex items-center gap-1.5 hover:text-foreground transition-colors">
              <Mail className="w-3.5 h-3.5 text-accent" />
              <a href={`mailto:${email}`}>{email}</a>
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" /> ISO Certified & Reliable
            </span>
            <Link href="/admin" className="hover:text-primary transition-colors">
              Admin Portal
            </Link>
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 sm:h-20 flex items-center justify-between gap-4">
        {/* Brand logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative overflow-hidden rounded-lg p-1 transition-transform group-hover:scale-105">
            <Image
              src="/logo.png"
              alt="Global Spec Solutions"
              width={140}
              height={45}
              className="h-10 sm:h-12 w-auto object-contain"
              priority
            />
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-semibold">
          <Link href="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <Link href="/shop" className="hover:text-primary transition-colors flex items-center gap-1">
            <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
            Shop Products
          </Link>
          <Link href="/services" className="hover:text-primary transition-colors">
            Services
          </Link>
          <Link href="/#solutions" className="hover:text-primary transition-colors">
            Solutions
          </Link>
          <Link href="/#portfolio" className="hover:text-primary transition-colors">
            Portfolio
          </Link>
          <Link href="/#contact" className="hover:text-primary transition-colors">
            Contact
          </Link>
        </nav>

        {/* Action icons */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Search Trigger */}
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="p-2 rounded-full hover:bg-muted text-foreground transition-colors"
            title="Search Products"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Cart Icon Drawer Trigger */}
          <Link
            href="/cart"
            className="relative p-2 rounded-full hover:bg-muted text-foreground transition-colors"
            title="Shopping Cart"
          >
            <ShoppingCart className="w-5 h-5" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center animate-pulse">
                {totalItems}
              </span>
            )}
          </Link>

          {/* Quick CTA */}
          <Link href="/shop" className="hidden sm:inline-flex">
            <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-sm">
              Order Online
            </Button>
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 lg:hidden text-foreground hover:bg-muted rounded-lg"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Expandable Search Input Bar */}
      {searchOpen && (
        <div className="border-t border-border/40 bg-card py-3 px-4 shadow-inner animate-in slide-in-from-top-2 duration-200">
          <form onSubmit={handleSearch} className="max-w-3xl mx-auto flex items-center gap-2">
            <input
              type="text"
              placeholder="Search products, equipment, SKU..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-4 py-2 text-sm border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              autoFocus
            />
            <Button type="submit" size="sm">
              Search
            </Button>
            <button
              type="button"
              onClick={() => setSearchOpen(false)}
              className="p-2 text-muted-foreground hover:text-foreground"
            >
              <X className="w-5 h-5" />
            </button>
          </form>
        </div>
      )}

      {/* Mobile Slide-down Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-border/40 bg-background/98 px-6 py-6 space-y-4 shadow-2xl animate-in slide-in-from-top-3">
          <nav className="flex flex-col gap-3 font-semibold text-base">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 border-b border-border/30 flex items-center justify-between"
            >
              <span>Home</span>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </Link>
            <Link
              href="/shop"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 border-b border-border/30 flex items-center justify-between text-primary font-bold"
            >
              <span className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
                Shop Products
              </span>
              <ChevronRight className="w-4 h-4 text-primary" />
            </Link>
            <Link
              href="/services"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 border-b border-border/30 flex items-center justify-between"
            >
              <span>Services</span>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </Link>
            <Link
              href="/#solutions"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 border-b border-border/30 flex items-center justify-between"
            >
              <span>Solutions</span>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </Link>
            <Link
              href="/#portfolio"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 border-b border-border/30 flex items-center justify-between"
            >
              <span>Portfolio</span>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </Link>
            <Link
              href="/#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 border-b border-border/30 flex items-center justify-between"
            >
              <span>Contact</span>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </Link>
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 flex items-center justify-between text-muted-foreground"
            >
              <span>Admin Login</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
