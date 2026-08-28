import Link from 'next/link'
import { MainHeader } from '@/components/main-header'
import { FloatingWhatsApp } from '@/components/floating-whatsapp'
import { getSolutionById, getSiteSettings, getProductCategories } from '@/lib/db-data'
import { ArrowLeft, Zap, CheckCircle2, ShieldCheck, Phone, MessageSquare, ArrowRight, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  const id = parseInt(resolvedParams.id, 10)
  const solution = !isNaN(id) ? await getSolutionById(id) : null

  return {
    title: solution ? `${solution.title} | Global Spec Solutions` : 'Solution Details | Global Spec Solutions',
    description: solution?.description || 'Enterprise engineering & power infrastructure solutions.',
  }
}

export default async function SolutionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const resolvedParams = await params
  const id = parseInt(resolvedParams.id, 10)

  const [solution, siteSettings, categories] = await Promise.all([
    !isNaN(id) ? getSolutionById(id) : null,
    getSiteSettings(),
    getProductCategories(),
  ])

  const whatsappNumber = siteSettings.whatsapp_number || '+254721113431'

  if (!solution) {
    return (
      <div className="min-h-screen bg-background flex flex-col justify-between">
        <MainHeader categories={categories as any} siteSettings={siteSettings} />
        <main className="flex-1 flex items-center justify-center p-6 text-center">
          <div className="max-w-md space-y-4">
            <Zap className="w-16 h-16 text-primary mx-auto opacity-50" />
            <h1 className="text-3xl font-extrabold text-slate-900">Solution Not Found</h1>
            <p className="text-slate-600 text-sm">The solution requested could not be located in our catalog.</p>
            <Link href="/solutions">
              <Button className="gap-2 bg-primary hover:bg-primary/90">
                <ArrowLeft className="w-4 h-4" /> View All Solutions
              </Button>
            </Link>
          </div>
        </main>
      </div>
    )
  }

  const benefitsList = solution.benefits
    ? solution.benefits.split(',').map((b: string) => b.trim()).filter(Boolean)
    : []

  const whatsappMessage = encodeURIComponent(
    `Hello Global Spec Solutions! I am interested in your Enterprise Solution: "${solution.title}". Please provide a quotation and technical specifications.`
  )

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <MainHeader categories={categories as any} siteSettings={siteSettings} />

      <main className="flex-1">
        {/* Breadcrumb Navigation Bar */}
        <div className="bg-white border-b border-slate-200 py-3 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <Link
              href="/solutions"
              className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-primary transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Solutions
            </Link>
            <span className="text-xs text-slate-500 font-medium truncate max-w-xs sm:max-w-md">
              GlobalSpec / Solutions / {solution.title}
            </span>
          </div>
        </div>

        {/* Hero Header */}
        <section className="bg-slate-900 text-white py-12 md:py-16 px-4 sm:px-6 border-b border-slate-800">
          <div className="max-w-7xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 text-primary border border-primary/30 text-xs font-bold uppercase tracking-wider">
              <Zap className="w-3.5 h-3.5" /> Enterprise Solution
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white max-w-4xl leading-tight">
              {solution.title}
            </h1>
            <p className="text-slate-300 text-base sm:text-lg max-w-3xl leading-relaxed">
              {solution.description}
            </p>
          </div>
        </section>

        {/* Main Content & Specs Grid */}
        <section className="py-12 md:py-16 max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Image & Detailed Scope */}
            <div className="lg:col-span-2 space-y-8">
              {/* Solution Banner Image */}
              <div className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-md relative group">
                {solution.imageUrl ? (
                  <img
                    src={solution.imageUrl}
                    alt={solution.title}
                    className="w-full h-72 sm:h-96 object-cover"
                  />
                ) : (
                  <div className="w-full h-72 bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
                    <Zap className="w-20 h-20 text-primary/40" />
                  </div>
                )}
                <div className="absolute bottom-4 left-4 bg-slate-950/80 backdrop-blur text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 border border-slate-700">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" /> ISO Certified Deployment
                </div>
              </div>

              {/* Solution Overview Card */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
                <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                  <FileText className="w-6 h-6 text-primary" /> Solution Architecture & Overview
                </h2>
                <p className="text-slate-600 leading-relaxed text-sm sm:text-base font-normal">
                  {solution.description}
                </p>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700">Key Standards & Guarantee</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Designed, supplied, installed, and commissioned by Global Spec Solutions certified field engineers. Backed by standard OEM warranty and 24/7 SLA maintenance options.
                  </p>
                </div>
              </div>

              {/* Key Benefits Grid */}
              {benefitsList.length > 0 && (
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">Key System Benefits</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {benefitsList.map((benefit: string, idx: number) => (
                      <div
                        key={idx}
                        className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100 flex items-start gap-3"
                      >
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                        <div>
                          <h3 className="font-bold text-slate-900 text-sm">{benefit}</h3>
                          <p className="text-xs text-slate-500 mt-0.5">Optimized for reliability and peak enterprise efficiency.</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Action Sidebar */}
            <div className="space-y-6">
              {/* Inquiry & WhatsApp CTA Box */}
              <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 space-y-6 border border-slate-800 shadow-xl sticky top-24">
                <div className="space-y-2">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-primary block">Turnkey Implementation</span>
                  <h3 className="text-xl font-extrabold text-white">Get a Custom Proposal</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Speak directly with an enterprise engineer to tailor this solution to your project site and specifications.
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  {/* WhatsApp Quick Order */}
                  <a
                    href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${whatsappMessage}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <Button className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold gap-2 py-3 h-auto shadow-lg shadow-emerald-900/30">
                      <MessageSquare className="w-4 h-4 fill-white" /> Request Quote on WhatsApp
                    </Button>
                  </a>

                  {/* Contact Form Link */}
                  <Link href="/#contact" className="block">
                    <Button variant="outline" className="w-full border-slate-700 text-slate-200 hover:bg-slate-800 font-bold gap-2 py-3 h-auto">
                      <Phone className="w-4 h-4 text-primary" /> Contact Sales Team
                    </Button>
                  </Link>

                  {/* Browse Products CTA */}
                  <Link href="/shop" className="block">
                    <Button variant="ghost" className="w-full text-slate-400 hover:text-white hover:bg-slate-800/50 text-xs font-semibold gap-1">
                      Browse Related Equipment Catalog <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                  </Link>
                </div>

                <div className="pt-4 border-t border-slate-800 space-y-2 text-[11px] text-slate-400">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Turnkey Site Assessment & Engineering</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                    <span>OEM Equipment & Full Warranty</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <FloatingWhatsApp
        whatsappNumber={siteSettings.whatsapp_number}
        enabled={siteSettings.floating_whatsapp_enabled !== 'false'}
      />
    </div>
  )
}
