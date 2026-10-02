import Image from 'next/image'
import Link from 'next/link'
import { MainHeader } from '@/components/main-header'
import { HeroCarousel } from '@/components/hero-carousel'
import { MobileCompanyHero } from '@/components/mobile-company-hero'
import { CompanyStats } from '@/components/company-stats'
import { MovingServicesBanner } from '@/components/moving-services-banner'
import { ProductsSection } from '@/components/products-section'
import { SolutionsSection } from '@/components/solutions-section'
import { DepartmentsSection } from '@/components/departments-section'
import { ClientsPortfolio } from '@/components/clients-portfolio'
import { ServicesShowcase } from '@/components/services-showcase'
import { SolarCalculator } from '@/components/solar-calculator'
import { FloatingWhatsApp } from '@/components/floating-whatsapp'
import { Button } from '@/components/ui/button'
import {
  Mail,
  Phone,
  MapPin,
  Zap,
  ArrowRight,
  ShieldCheck,
  Award,
  Globe,
  Users,
  CheckCircle2,
  Building2,
} from 'lucide-react'
import {
  getHeroSlides,
  getProductCategories,
  getProducts,
  getSolutions,
  getClients,
  getServices,
  getSiteSettings,
  getDepartments,
} from '@/lib/db-data'

export default async function HomePage() {
  const [heroSlides, categories, products, solutions, clients, services, siteSettings, departments] = await Promise.all([
    getHeroSlides(),
    getProductCategories(),
    getProducts({ limit: 6 }),
    getSolutions(),
    getClients(),
    getServices(),
    getSiteSettings(),
    getDepartments(),
  ])

  const phone = siteSettings.company_phone || '+254 722 795 726 / +254 720 891 035'
  const email = siteSettings.company_email || 'info@globalspecsolutions.com'
  const address = siteSettings.company_address || 'Barclay House, Mai Mahiu Rd, P.O. Box 101736 - 00101, Nairobi, Kenya'

  return (
    <div className="w-full bg-background text-foreground flex flex-col min-h-screen">
      {/* Dynamic Navigation Bar */}
      <MainHeader categories={categories as any} siteSettings={siteSettings} />

      <main className="flex-1">
        {/* Desktop Hero Carousel — hidden on mobile */}
        <HeroCarousel slides={heroSlides as any} />

        {/* Mobile Company Profile Hero — visible only on small screens */}
        <MobileCompanyHero />

        {/* Company Stats Bar */}
        <CompanyStats />

        {/* Moving Services Slim Banner */}
        <MovingServicesBanner />

        {/* Departments Section */}
        <div id="departments">
          <DepartmentsSection departments={departments as any} />
        </div>

        {/* Featured Products Section */}
        <div id="products">
          <ProductsSection products={products as any} categories={categories as any} />
        </div>

        {/* Solutions Section */}
        <div id="solutions">
          <SolutionsSection solutions={solutions as any} />
        </div>

        {/* Interactive Solar & Power Savings Calculator */}
        <SolarCalculator />

        {/* Services Section */}
        <ServicesShowcase services={services as any} />

        {/* Why Choose Us / Trust Section */}
        <section className="py-20 bg-slate-50 border-t border-slate-100">
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            <div className="text-center mb-14">
              <span className="text-xs font-extrabold uppercase tracking-widest text-primary block mb-2">Why GlobalSpec</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Your Trusted Engineering Partner
              </h2>
              <p className="text-muted-foreground text-sm max-w-xl mx-auto mt-3">
                From design to commissioning, we deliver end-to-end engineering solutions with unmatched technical expertise and accountability.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  icon: ShieldCheck,
                  color: 'emerald',
                  title: 'ISO Certified Quality',
                  desc: 'All installations and projects adhere to ISO quality standards, Kenya Bureau of Standards (KEBS), and IEC/BS electrical codes.',
                },
                {
                  icon: Globe,
                  color: 'primary',
                  title: 'East Africa Coverage',
                  desc: 'Operating across Kenya, Uganda, Tanzania, Rwanda, and beyond — with dedicated field engineering teams in all regions.',
                },
                {
                  icon: Zap,
                  color: 'amber',
                  title: '24/7 Critical Response',
                  desc: 'Emergency support for UPS, generator, and data centre systems. We guarantee response times for all mission-critical contracts.',
                },
                {
                  icon: Award,
                  color: 'primary',
                  title: 'Certified Partnerships',
                  desc: 'Authorized partners and integrators for APC by Schneider Electric, Eaton, Socomec, ABB, and leading global OEMs.',
                },
                {
                  icon: Users,
                  color: 'emerald',
                  title: 'Expert Engineering Team',
                  desc: '7 specialized departments led by registered engineers with decades of combined commercial and industrial project experience.',
                },
                {
                  icon: Building2,
                  color: 'amber',
                  title: 'Turnkey Project Delivery',
                  desc: 'Full EPC capability — from feasibility study and design, to procurement, construction, commissioning, and O&M support.',
                },
              ].map(({ icon: Icon, color, title, desc }) => (
                <div
                  key={title}
                  className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow group"
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                    color === 'emerald' ? 'bg-emerald-50 text-emerald-600' :
                    color === 'amber' ? 'bg-amber-50 text-amber-600' :
                    'bg-primary/10 text-primary'
                  }`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-base text-slate-900 mb-2">{title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>

            {/* Certifications row */}
            <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
              {[
                'ISO 9001:2015 Quality Management',
                'KEBS Registered Firm',
                'ERC Licensed',
                'NCA Registered Contractor',
                'Schneider Electric Partner',
              ].map((cert) => (
                <span key={cert} className="flex items-center gap-2 text-xs font-semibold text-slate-600 bg-white border border-slate-200 px-4 py-2 rounded-full shadow-sm">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  {cert}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Clients Portfolio */}
        <div id="portfolio">
          <ClientsPortfolio clients={clients as any} />
        </div>

        {/* Contact Section */}
        <section id="contact" className="py-20 bg-card/60 border-t border-border/40">
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            <div className="text-center mb-14">
              <span className="text-xs font-extrabold uppercase tracking-widest text-primary block mb-2">Get In Touch</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Contact Our Engineering Team</h2>
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
                  <a href={`tel:${phone.split('/')[0].replace(/\s+/g, '')}`} className="text-sm font-semibold text-muted-foreground hover:text-primary transition-colors">{phone}</a>
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1 font-medium">Available 24/7 for Critical Response</p>
                </div>
              </div>

              <div className="p-6 bg-background border border-border/60 rounded-2xl shadow-sm space-y-4">
                <div className="w-12 h-12 rounded-xl bg-accent/10 text-accent flex items-center justify-center">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-base mb-1">Email Inquiries</h4>
                  <a href={`mailto:${email}`} className="text-sm font-semibold text-muted-foreground hover:text-primary transition-colors">{email}</a>
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
            <div className="bg-gradient-to-r from-slate-900 via-primary/90 to-slate-950 text-white rounded-2xl p-10 sm:p-14 text-center relative overflow-hidden shadow-xl">
              {/* Background decoration */}
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white via-transparent to-transparent pointer-events-none" />
              <h2 className="text-3xl sm:text-4xl font-extrabold mb-4 relative">
                Ready to Modernize Your Infrastructure?
              </h2>
              <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto mb-8 leading-relaxed relative">
                Contact our engineering consultants today for a comprehensive facility assessment and tailored quote. Download our company profile to learn more about our capabilities.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4 relative">
                <a href="/company-profile.pdf" download target="_blank" rel="noopener noreferrer">
                  <Button size="lg" className="bg-accent hover:bg-accent/90 text-white font-bold shadow-lg gap-2">
                    <Zap className="w-4 h-4" />
                    Download Company Profile (PDF)
                  </Button>
                </a>
                <a href={`mailto:${email}`}>
                  <Button size="lg" variant="outline" className="border-white/60 text-white hover:bg-white/10 font-bold">
                    Request Consultation
                  </Button>
                </a>
                <Link href="/shop">
                  <Button size="lg" variant="ghost" className="text-white hover:bg-white/10 font-bold">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 mb-12">
            <div className="sm:col-span-2 md:col-span-1 space-y-4">
              <div className="flex items-center gap-2">
                <Image
                  src="/logo.png"
                  alt="Global Spec Solutions"
                  width={140}
                  height={45}
                  className="h-10 w-auto invert"
                />
              </div>
              <p className="text-xs text-slate-400 leading-relaxed max-w-xs">
                Premium electrical engineering, critical power UPS installations, data center infrastructure, and renewable energy solutions across East Africa.
              </p>
              <div className="flex gap-3 pt-2">
                <a
                  href={`https://wa.me/${siteSettings.whatsapp_number?.replace(/\D/g, '') || '254721113431'}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                  WhatsApp Us
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-sm text-slate-100 mb-4 uppercase tracking-wider">Product Shop</h4>
              <ul className="space-y-2.5 text-xs text-slate-400">
                <li><Link href="/shop" className="hover:text-primary transition-colors">All Shop Products</Link></li>
                <li><Link href="/shop/electrical-works" className="hover:text-primary transition-colors">Electrical Works Equipment</Link></li>
                <li><Link href="/shop/renewable-energy" className="hover:text-primary transition-colors">Solar Energy Systems</Link></li>
                <li><Link href="/shop/ict-infrastructure" className="hover:text-primary transition-colors">ICT & Data Centre DCIM</Link></li>
                <li><Link href="/shop/generators-backup" className="hover:text-primary transition-colors">Generators & Backup</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-sm text-slate-100 mb-4 uppercase tracking-wider">Quick Links</h4>
              <ul className="space-y-2.5 text-xs text-slate-400">
                <li><Link href="/departments" className="hover:text-primary transition-colors">Departments</Link></li>
                <li><Link href="/services" className="hover:text-primary transition-colors">Services</Link></li>
                <li><Link href="/industries" className="hover:text-primary transition-colors">Industries</Link></li>
                <li><Link href="/partners" className="hover:text-primary transition-colors">Partners</Link></li>
                <li><Link href="/resources" className="hover:text-primary transition-colors">Resources & Datasheets</Link></li>
                <li><Link href="/quote" className="hover:text-primary transition-colors">Request a Quote</Link></li>
                <li><Link href="/#portfolio" className="hover:text-primary transition-colors">Client Portfolio</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-sm text-slate-100 mb-4 uppercase tracking-wider">Certifications & Quality</h4>
              <ul className="space-y-2.5 text-xs text-slate-400">
                <li className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>ISO 9001:2015 Certified</span>
                </li>
                <li className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>ERC Licensed Engineers</span>
                </li>
                <li className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>NCA Registered Contractor</span>
                </li>
                <li className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Schneider Electric Partner</span>
                </li>
              </ul>
              <div className="mt-6 p-3 bg-slate-900 rounded-lg border border-slate-800">
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Enterprise Electrical Engineering partner across East Africa — Kenya, Uganda, Tanzania & Rwanda
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-900 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
            <p>&copy; {new Date().getFullYear()} Global Spec Solutions Ltd. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <Link href="/sign-in" className="hover:text-slate-300 transition-colors">Sign In</Link>
              <Link href="/sign-up" className="hover:text-slate-300 transition-colors">Create Account</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
