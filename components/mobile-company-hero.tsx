'use client'

import Link from 'next/link'
import { ArrowRight, ShieldCheck, Zap, Globe } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function MobileCompanyHero() {
  return (
    // Only visible on small screens
    <section className="md:hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 text-white px-5 py-10">
      <div className="max-w-md mx-auto space-y-6">
        {/* Trust badge */}
        <div className="flex items-center gap-2">
          <div className="h-[2px] w-8 bg-primary rounded-full" />
          <span className="text-primary font-bold tracking-widest text-[10px] uppercase">
            Engineering Excellence · East Africa
          </span>
        </div>

        {/* Headline */}
        <div className="space-y-3">
          <h1 className="text-3xl font-bold leading-tight tracking-tight">
            Advanced Electrical &{' '}
            <span className="text-primary">Critical Power</span>{' '}
            Infrastructure
          </h1>
          <p className="text-sm text-slate-400 leading-relaxed">
            Premium UPS systems, solar energy, data centre infrastructure, and comprehensive electrical engineering for commercial and industrial sectors across Kenya and East Africa.
          </p>
        </div>

        {/* Key stats — compact */}
        <div className="grid grid-cols-3 gap-3 py-4 border-y border-slate-700/50">
          {[
            { value: '15+', label: 'Years' },
            { value: '500+', label: 'Projects' },
            { value: '200+', label: 'Clients' },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-2xl font-black text-primary">{s.value}</div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Trust signals */}
        <div className="flex flex-wrap gap-2">
          {[
            { icon: ShieldCheck, label: 'ISO Certified' },
            { icon: Zap, label: 'UPS & Critical Power' },
            { icon: Globe, label: 'East Africa Coverage' },
          ].map(({ icon: Icon, label }) => (
            <span key={label} className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-300 bg-slate-800 px-3 py-1.5 rounded-full border border-slate-700">
              <Icon className="w-3 h-3 text-primary" />
              {label}
            </span>
          ))}
        </div>

        {/* CTAs */}
        <div className="flex gap-3">
          <Link href="/shop" className="flex-1">
            <Button className="w-full bg-primary hover:bg-primary/90 text-white font-bold gap-2 text-sm">
              Browse Shop <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Link href="/quote" className="flex-1">
            <Button variant="outline" className="w-full border-slate-600 text-white hover:bg-slate-800 font-bold text-sm">
              Get a Quote
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
