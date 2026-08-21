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
