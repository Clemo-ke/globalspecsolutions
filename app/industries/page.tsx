import React from 'react'
import Link from 'next/link'
import { MainHeader } from '@/components/main-header'
import { getIndustries, getSiteSettings } from '@/lib/db-data'
import { Building2, Radio, Landmark, HeartPulse, ShieldCheck, ArrowRight, Layers } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default async function IndustriesPage() {
  const [industriesList, siteSettings] = await Promise.all([getIndustries(), getSiteSettings()])

  const getIndustryIcon = (iconName?: string) => {
    switch (iconName) {
      case 'Radio':
        return <Radio className="w-8 h-8 text-primary" />
      case 'Building2':
        return <Building2 className="w-8 h-8 text-primary" />
      case 'Landmark':
        return <Landmark className="w-8 h-8 text-primary" />
      case 'HeartPulse':
        return <HeartPulse className="w-8 h-8 text-primary" />
      default:
        return <Layers className="w-8 h-8 text-primary" />
    }
  }

  return (
    <div className="w-full bg-background min-h-screen flex flex-col">
      <MainHeader siteSettings={siteSettings} />

      <main className="flex-1">
        {/* Hero Header */}
        <section className="bg-slate-950 text-white py-16 px-4 border-b border-slate-800">
          <div className="max-w-7xl mx-auto text-center space-y-4">
            <span className="text-xs font-extrabold uppercase tracking-widest text-primary block">Sector Specialization</span>
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight">Industries We Serve</h1>
            <p className="text-slate-400 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
              GlobalSpec Solutions delivers tailored critical power, data infrastructure, and renewable energy systems engineered specifically for mission-critical enterprise environments.
            </p>
          </div>
        </section>

        {/* Industries Grid */}
        <section className="py-16 max-w-7xl mx-auto px-4 md:px-6 w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {industriesList.map((ind) => (
              <div
                key={ind.id}
                className="bg-card border border-border/80 rounded-2xl p-8 shadow-sm hover:shadow-md hover:border-primary/50 transition-all flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:scale-105 transition-transform">
                    {getIndustryIcon(ind.icon)}
                  </div>
                  <h3 className="text-2xl font-extrabold tracking-tight">{ind.name}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{ind.description}</p>
                </div>

                <div className="pt-6 border-t border-border/40 mt-6 flex items-center justify-between">
                  <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4" /> ISO Compliant Delivery
                  </span>
                  <Link href={`/quote?industry=${ind.slug}`}>
                    <Button variant="ghost" size="sm" className="gap-1 text-primary font-bold hover:text-primary">
                      Inquire for Sector <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
