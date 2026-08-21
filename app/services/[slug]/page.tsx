import React from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { MainHeader } from '@/components/main-header'
import { db } from '@/lib/db'
import { services } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { getSiteSettings } from '@/lib/db-data'
import { ArrowLeft, ShieldCheck, CheckCircle2, Phone, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  const [serviceList, siteSettings] = await Promise.all([
    db.select().from(services).where(eq(services.slug, slug)).limit(1),
    getSiteSettings(),
  ])

  const service = serviceList[0]

  if (!service) {
    notFound()
  }

  const phone = siteSettings.company_phone || '+254 721 113 431'
  const email = siteSettings.company_email || 'info@globalspecsolutions.com'

  return (
    <div className="w-full bg-white text-slate-900 min-h-screen flex flex-col font-sans">
      <MainHeader siteSettings={siteSettings} />

      <main className="flex-1">
        {/* Back to Home & Services Header */}
        <div className="bg-slate-50 border-b border-slate-200 py-3 px-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-primary transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Home
            </Link>
            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
              <Link href="/services" className="hover:underline">
                Services
              </Link>
              <span>/</span>
              <span className="text-slate-900 font-bold">{service.name}</span>
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <section className="bg-slate-900 text-white py-16 px-4 border-b border-slate-800">
          <div className="max-w-7xl mx-auto space-y-4">
            <span className="text-xs font-extrabold uppercase tracking-widest text-primary block">
              GlobalSpec Engineering Service
            </span>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight">{service.name}</h1>
            <p className="text-slate-300 max-w-3xl text-sm sm:text-base leading-relaxed font-normal">
              {service.description}
            </p>
          </div>
        </section>

        {/* Content Body */}
        <section className="py-16 max-w-7xl mx-auto px-4 md:px-6 w-full grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8 space-y-8">
            <div className="bg-white border border-slate-200 rounded-2xl p-8 space-y-6">
              <h2 className="text-2xl font-extrabold text-slate-900">Service Scope & Technical Overview</h2>
              <p className="text-slate-600 leading-relaxed font-normal">
                At GlobalSpec Business Solutions Ltd, we combine the skills, commitment, and experience of our specialist engineers to deliver robust {service.name.toLowerCase()} tailored for your facility.
              </p>
              <div className="space-y-3 pt-2">
                <h3 className="font-bold text-base text-slate-900">Key Deliverables:</h3>
                <ul className="space-y-2 text-sm text-slate-700">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Site survey, design specifications, and engineering consultation</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Turnkey installation of Tier-1 ISO compliant hardware & systems</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Testing, commissioning, and Struxureware DCIM monitoring integration</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>24/7 emergency maintenance and SLA technical support</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-6">
              <h3 className="text-lg font-extrabold text-slate-900">Need Service Assistance?</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Contact our engineering experts today for a custom evaluation or quotation.
              </p>

              <div className="space-y-3 text-xs">
                <div className="flex items-center gap-3 text-slate-700 font-semibold">
                  <Phone className="w-4 h-4 text-primary" />
                  <span>{phone}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-700 font-semibold">
                  <Mail className="w-4 h-4 text-accent" />
                  <span>{email}</span>
                </div>
              </div>

              <Link href="/quote" className="block">
                <Button className="w-full bg-primary hover:bg-primary/90 text-white font-bold">
                  Request Quotation
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
