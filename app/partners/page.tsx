import React from 'react'
import Link from 'next/link'
import { MainHeader } from '@/components/main-header'
import { getPartners, getSiteSettings } from '@/lib/db-data'
import { ExternalLink, ArrowRight, ShieldCheck } from 'lucide-react'

export default async function PartnersPage() {
  const [partnersList, siteSettings] = await Promise.all([getPartners(), getSiteSettings()])

  return (
    <div className="w-full bg-background min-h-screen flex flex-col">
      <MainHeader siteSettings={siteSettings} />

      <main className="flex-1">
        {/* Back to Home Header Bar */}
        <div className="bg-slate-50 border-b border-slate-200 py-3 px-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-primary transition-colors"
            >
              <ArrowRight className="w-4 h-4 rotate-180" /> Back to Home
            </Link>
            <span className="text-xs text-slate-500 font-medium">GlobalSpec Solutions / Partners</span>
          </div>
        </div>

        {/* Hero Header */}
        <section className="bg-slate-950 text-white py-16 px-4 border-b border-slate-800 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-0" />
          <div className="max-w-7xl mx-auto text-center space-y-4 relative z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-widest bg-primary/20 text-primary border border-primary/30">
              <ShieldCheck className="w-3.5 h-3.5" /> Technology Ecosystem
            </span>
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight">Our OEM Partners & Manufacturers</h1>
            <p className="text-slate-400 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
              GlobalSpec Solutions collaborates with world-leading electrical equipment manufacturers, renewable energy pioneers, and software creators to deliver Tier-1 enterprise reliability.
            </p>
          </div>
        </section>

        {/* Partners Grid */}
        <section className="py-16 max-w-7xl mx-auto px-4 md:px-6 w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {partnersList.map((partner) => (
              <div
                key={partner.id}
                className="group bg-card border border-border/80 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:border-primary/50 transition-all duration-300 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  {/* Logo Container */}
                  <div className="p-4 bg-white rounded-xl flex items-center justify-center h-24 border border-slate-100 shadow-inner overflow-hidden relative">
                    {partner.logoUrl ? (
                      <img
                        src={partner.logoUrl}
                        alt={partner.name}
                        className="max-h-14 max-w-[180px] w-auto object-contain group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <span className="font-extrabold text-xl text-slate-900 tracking-tight">{partner.name}</span>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="inline-block px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold border border-primary/20">
                      {partner.category || 'Technology Partner'}
                    </span>
                    {partner.isFeatured && (
                      <span className="text-[10px] font-bold text-amber-500 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-800">
                        ⭐ Official OEM
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-lg text-foreground">{partner.name}</h3>
                  {partner.description && (
                    <p className="text-muted-foreground text-xs leading-relaxed">{partner.description}</p>
                  )}
                </div>

                {partner.websiteUrl && (
                  <div className="pt-4 border-t border-border/40 mt-6 flex items-center justify-between">
                    <a
                      href={partner.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-semibold text-primary inline-flex items-center gap-1.5 hover:underline"
                    >
                      Visit Official Portal <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
