import React from 'react'
import Link from 'next/link'
import { MainHeader } from '@/components/main-header'
import { getServices, getSiteSettings } from '@/lib/db-data'
import { ShieldCheck, ArrowRight, ArrowLeft, Zap, Server, Sun, Cpu, Wrench } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default async function ServicesPage() {
  const [servicesList, siteSettings] = await Promise.all([getServices(), getSiteSettings()])

  const getServiceIcon = (iconName?: string) => {
    switch (iconName) {
      case 'Zap':
        return <Zap className="w-8 h-8 text-primary" />
      case 'Server':
        return <Server className="w-8 h-8 text-primary" />
      case 'Sun':
        return <Sun className="w-8 h-8 text-primary" />
      case 'Cpu':
        return <Cpu className="w-8 h-8 text-primary" />
      default:
        return <Wrench className="w-8 h-8 text-primary" />
    }
  }

  return (
    <div className="w-full bg-white text-slate-900 min-h-screen flex flex-col font-sans">
      <MainHeader siteSettings={siteSettings} />

      <main className="flex-1">
        {/* Back to Home Header Bar */}
        <div className="bg-slate-50 border-b border-slate-200 py-3 px-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-primary transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Home
            </Link>
            <span className="text-xs text-slate-500 font-medium">GlobalSpec Solutions / Services</span>
          </div>
        </div>

        {/* Hero Header */}
        <section className="bg-slate-900 text-white py-16 px-4 border-b border-slate-800">
          <div className="max-w-7xl mx-auto text-center space-y-4">
            <span className="text-xs font-extrabold uppercase tracking-widest text-primary block">Engineering Capabilities</span>
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight">Our Products & Services</h1>
            <p className="text-slate-300 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed font-normal">
              High-quality installation of Critical Power (UPS, DC Power Systems), Data Centre setup & DCIM, Renewable Solar Energy, and Software Integrations.
            </p>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-16 max-w-7xl mx-auto px-4 md:px-6 w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {servicesList.map((service) => (
              <div
                key={service.id}
                className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm hover:shadow-md hover:border-primary/50 transition-all flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:scale-105 transition-transform">
                    {getServiceIcon(service.icon ?? undefined)}
                  </div>
                  <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">{service.name}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed font-normal">{service.description}</p>
                </div>

                <div className="pt-6 border-t border-slate-100 mt-6 flex items-center justify-between">
                  <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4" /> ISO Certified Delivery
                  </span>
                  <Link href={`/services/${service.slug}`}>
                    <Button variant="outline" size="sm" className="gap-1 text-primary font-bold border-primary/30 hover:bg-primary/5">
                      Explore Service <ArrowRight className="w-4 h-4" />
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
