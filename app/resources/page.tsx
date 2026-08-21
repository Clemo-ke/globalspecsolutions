import React from 'react'
import Link from 'next/link'
import { MainHeader } from '@/components/main-header'
import { getResources, getSiteSettings } from '@/lib/db-data'
import { Download, FileText, ShieldCheck, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default async function ResourcesPage() {
  const [resourcesList, siteSettings] = await Promise.all([getResources(), getSiteSettings()])

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
            <span className="text-xs text-slate-500 font-medium">GlobalSpec Solutions / Resources</span>
          </div>
        </div>

        {/* Hero Header */}
          <div className="max-w-7xl mx-auto text-center space-y-4">
            <span className="text-xs font-extrabold uppercase tracking-widest text-primary block">Technical Documentation</span>
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight">Resources & Downloads</h1>
            <p className="text-slate-400 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
              Access official GlobalSpec company profiles, Struxureware DCIM technical blueprints, datasheets, and energy audit whitepapers.
            </p>
          </div>
        </section>

        <section className="py-16 max-w-7xl mx-auto px-4 md:px-6 w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {resourcesList.map((item) => (
              <div
                key={item.id}
                className="bg-card border border-border/80 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-md bg-accent/10 text-accent text-xs font-bold">
                      {item.category}
                    </span>
                    {item.fileSize && <span className="text-xs font-mono text-muted-foreground">{item.fileSize}</span>}
                  </div>
                  <h3 className="text-xl font-extrabold tracking-tight">{item.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{item.description}</p>
                </div>

                <div className="pt-6 border-t border-border/40 mt-6 flex items-center justify-between">
                  <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4" /> Verified Documentation
                  </span>
                  <a href={item.fileUrl} download target="_blank" rel="noopener noreferrer">
                    <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold gap-2">
                      Download PDF <Download className="w-4 h-4" />
                    </Button>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
