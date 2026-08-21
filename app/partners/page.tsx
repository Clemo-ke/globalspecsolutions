import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { MainHeader } from '@/components/main-header'
import { getPartners, getSiteSettings } from '@/lib/db-data'
import { ShieldCheck, ExternalLink, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

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
        <section className="bg-slate-950 text-white py-16 px-4 border-b border-slate-800">
          <div className="max-w-7xl mx-auto text-center space-y-4">
            <span className="text-xs font-extrabold uppercase tracking-widest text-primary block">Technology Ecosystem</span>
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight">Our OEM Partners & Manufacturers</h1>
            <p className="text-slate-400 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
              GlobalSpec Solutions collaborates with world-leading electrical equipment manufacturers and software creators to deliver Tier-1 reliability.
            </p>
          </div>
        </section>

        <section className="py-16 max-w-7xl mx-auto px-4 md:px-6 w-full">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {partnersList.map((partner) => (
              <div
                key={partner.id}
                className="bg-card border border-border/80 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-primary/50 transition-all flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="p-4 bg-white rounded-xl flex items-center justify-center h-20 border border-slate-100">
                    <span className="font-extrabold text-xl text-slate-900">{partner.name}</span>
                  </div>
                  <div className="inline-block px-2.5 py-1 rounded-md bg-primary/10 text-primary text-xs font-bold">
                    {partner.category || 'Technology Partner'}
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">{partner.description}</p>
                </div>

                {partner.websiteUrl && (
                  <div className="pt-4 border-t border-border/40 mt-6 flex items-center justify-between">
                    <a
                      href={partner.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-semibold text-primary inline-flex items-center gap-1 hover:underline"
                    >
                      Official Portal <ExternalLink className="w-3.5 h-3.5" />
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
