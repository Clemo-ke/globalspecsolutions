import Image from 'next/image'
import Link from 'next/link'
import { MainHeader } from '@/components/main-header'
import { HeroCarousel } from '@/components/hero-carousel'
import { MovingServicesBanner } from '@/components/moving-services-banner'
import { ProductsSection } from '@/components/products-section'
import { SolutionsSection } from '@/components/solutions-section'
import { ClientsPortfolio } from '@/components/clients-portfolio'
import { ServicesShowcase } from '@/components/services-showcase'
import { FloatingWhatsApp } from '@/components/floating-whatsapp'
import { Button } from '@/components/ui/button'
import { Mail, Phone, MapPin, Zap, ArrowRight, ShieldCheck } from 'lucide-react'
import {
  getHeroSlides,
  getProductCategories,
  getProducts,
  getSolutions,
  getClients,
  getServices,
  getSiteSettings,
} from '@/lib/db-data'

export default async function HomePage() {
  const [heroSlides, categories, products, solutions, clients, services, siteSettings] = await Promise.all([
    getHeroSlides(),
    getProductCategories(),
    getProducts({ limit: 6 }),
    getSolutions(),
    getClients(),
    getServices(),
    getSiteSettings(),
  ])

  const phone = siteSettings.company_phone || '+254 721 113 431 / +254 725 440 342'
  const email = siteSettings.company_email || 'info@globalspecsolutions.com'
  const address = siteSettings.company_address || 'Barclays House, Mai Mahiu road off Langata Road, P.O Box 9520-00200 Nairobi, Kenya'

  return (
    <div className="w-full bg-background text-foreground flex flex-col min-h-screen">
      {/* Dynamic Navigation Bar */}
      <MainHeader categories={categories as any} siteSettings={siteSettings} />

      <main className="flex-1">
        {/* Dynamic Hero Section */}
        <HeroCarousel slides={heroSlides as any} />

        {/* Moving Services Slim Banner */}
        <MovingServicesBanner />

        {/* Featured Products Section */}
        <div id="products">
          <ProductsSection products={products as any} categories={categories as any} />
        </div>

        {/* Solutions Section */}
        <div id="solutions">
          <SolutionsSection solutions={solutions as any} />
        </div>

        {/* Interactive Solar & Power Savings Calculator */}
        <section className="py-20 bg-slate-950 text-white border-y border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
              <span className="text-xs font-extrabold uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20 inline-block">
                Interactive Utility Tool
              </span>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight">Solar Energy & Power Cost Savings Calculator</h2>
              <p className="text-slate-400 text-sm sm:text-base">
                Estimate your monthly electricity cost reduction when switching to GlobalSpec commercial solar PV and hybrid battery energy storage.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 shadow-2xl">
              <div className="lg:col-span-7 space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-extrabold uppercase text-slate-300">Average Monthly Electricity Bill (KES)</label>
                    <span className="text-lg font-black text-primary">KES 250,000</span>
                  </div>
                  <input type="range" min="50000" max="2000000" step="50000" defaultValue="250000" className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-primary" />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-extrabold uppercase text-slate-300">Facility Operating Hours / Day</label>
                    <span className="text-sm font-bold text-slate-200">14 Hours</span>
                  </div>
                  <input type="range" min="8" max="24" defaultValue="14" className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-primary" />
                </div>

                <div className="grid grid-cols-3 gap-4 pt-4">
                  <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-center">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Est. Solar Offset</span>
                    <span className="text-xl font-black text-emerald-400">75%</span>
                  </div>
                  <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-center">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Monthly Savings</span>
                    <span className="text-xl font-black text-primary">~KES 187,500</span>
                  </div>
                  <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-center">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Payback Period</span>
                    <span className="text-xl font-black text-amber-400">3.2 Years</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 bg-gradient-to-br from-primary/20 via-slate-950 to-slate-950 border border-primary/30 p-6 rounded-2xl flex flex-col justify-between space-y-6">
                <div className="space-y-3">
                  <h3 className="text-xl font-black text-white">Ready to Cut Energy Overhead?</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Our certified energy engineers perform detailed load profile analysis, net-metering setup, and turnkey installation for commercial facilities across Kenya and East Africa.
                  </p>
                </div>
                <Link href="/quote">
                  <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-extrabold py-3 rounded-xl shadow-lg gap-2 text-sm">
                    Request Full Technical Energy Audit <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <ServicesShowcase services={services as any} />

        {/* Clients Portfolio */}
        <div id="portfolio">
          <ClientsPortfolio clients={clients as any} />
        </div>

        {/* Contact Section */}
        <section id="contact" className="py-20 bg-card/60 border-t border-border/40">
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            <div className="text-center mb-14">
              <span className="text-xs font-extrabold uppercase tracking-widest text-primary block mb-2">Get In Touch</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold">Contact Our Engineering Team</h2>
              <p className="text-muted-foreground text-sm max-w-xl mx-auto mt-2">
                Have questions about critical power installations, energy audits, or custom equipment quotes? Speak with our specialists.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-14">
              <div className="p-6 bg-background border border-border/60 rounded-2xl shadow-sm space-y-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-base mb-1">Phone & Support</h4>
                  <p className="text-sm font-semibold text-muted-foreground">{phone}</p>
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1 font-medium">Available 24/7 for Critical Response</p>
                </div>
              </div>

              <div className="p-6 bg-background border border-border/60 rounded-2xl shadow-sm space-y-4">
                <div className="w-12 h-12 rounded-xl bg-accent/10 text-accent flex items-center justify-center">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-base mb-1">Email Inquiries</h4>
                  <p className="text-sm font-semibold text-muted-foreground">{email}</p>
                  <p className="text-xs text-muted-foreground mt-1">Prompt sales & technical responses</p>
                </div>
              </div>

              <div className="p-6 bg-background border border-border/60 rounded-2xl shadow-sm space-y-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-base mb-1">Office Location</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{address}</p>
                </div>
              </div>
            </div>

            {/* CTA Banner */}
            <div className="bg-gradient-to-r from-slate-900 via-primary/90 to-slate-950 text-white rounded-3xl p-10 sm:p-14 text-center relative overflow-hidden shadow-2xl">
              <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">Ready to Modernize Your Infrastructure?</h2>
              <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto mb-8 leading-relaxed">
                Contact our engineering consultants today for a comprehensive facility assessment and tailored quote.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <a href={`mailto:${email}`}>
                  <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold shadow-lg">
                    Request Consultation
                  </Button>
                </a>
                <Link href="/shop">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 font-bold">
                    Explore Shop Products
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Floating WhatsApp CTA */}
      <FloatingWhatsApp
        whatsappNumber={siteSettings.whatsapp_number}
        enabled={siteSettings.floating_whatsapp_enabled !== 'false'}
      />

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-300 py-16 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Image
                  src="/logo.png"
                  alt="Global Spec Solutions"
                  width={140}
                  height={45}
                  className="h-10 w-auto invert"
                />
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Premium electrical engineering, critical power UPS installations, data center infrastructure, and renewable energy solutions across East Africa.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-sm text-slate-100 mb-4 uppercase tracking-wider">Product Shop</h4>
              <ul className="space-y-2.5 text-xs text-slate-400">
                <li>
                  <Link href="/shop" className="hover:text-primary transition-colors">
                    All Shop Products
                  </Link>
                </li>
                <li>
                  <Link href="/shop/electrical-works" className="hover:text-primary transition-colors">
                    Electrical Works Equipment
                  </Link>
                </li>
                <li>
                  <Link href="/shop/renewable-energy" className="hover:text-primary transition-colors">
                    Solar Energy Systems
                  </Link>
                </li>
                <li>
                  <Link href="/shop/ict-infrastructure" className="hover:text-primary transition-colors">
                    ICT & Data Centre DCIM
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-sm text-slate-100 mb-4 uppercase tracking-wider">Quick Links</h4>
              <ul className="space-y-2.5 text-xs text-slate-400">
                <li>
                  <Link href="/services" className="hover:text-primary transition-colors">
                    Services
                  </Link>
                </li>
                <li>
                  <Link href="/#solutions" className="hover:text-primary transition-colors">
                    Solutions
                  </Link>
                </li>
                <li>
                  <Link href="/#portfolio" className="hover:text-primary transition-colors">
                    Client Portfolio
                  </Link>
                </li>
                <li>
                  <Link href="/cart" className="hover:text-primary transition-colors">
                    Shopping Cart
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-sm text-slate-100 mb-4 uppercase tracking-wider">Admin & Access</h4>
              <ul className="space-y-2.5 text-xs text-slate-400">
                <li>
                  <Link href="/admin" className="hover:text-primary transition-colors">
                    Admin Portal Login
                  </Link>
                </li>
                <li className="pt-2 text-[11px] text-slate-500">
                  <span>ISO Certified Enterprise Partner</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-900 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
            <p>&copy; {new Date().getFullYear()} Global Spec Solutions. All rights reserved.</p>
            <p>Modernized Database-Driven Platform</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
