import React from 'react'
import Link from 'next/link'
import { MainHeader } from '@/components/main-header'
import { DepartmentsSection } from '@/components/departments-section'
import { getDepartments, getSiteSettings } from '@/lib/db-data'
import { ArrowLeft } from 'lucide-react'

export default async function DepartmentsPage() {
  const [departments, siteSettings] = await Promise.all([getDepartments(), getSiteSettings()])

  return (
    <div className="w-full bg-background text-foreground min-h-screen flex flex-col">
      <MainHeader siteSettings={siteSettings} />

      <main className="flex-1">
        <div className="bg-muted/40 border-b border-border py-3 px-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-primary transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Home
            </Link>
            <span className="text-xs text-muted-foreground font-medium">GlobalSpec Solutions / Departments</span>
          </div>
        </div>

        <section className="max-w-7xl mx-auto px-4 md:px-6 pt-16 pb-4">
          <div className="max-w-2xl">
            <span className="text-xs font-semibold text-primary uppercase tracking-widest">Departments</span>
            <h1 className="text-4xl md:text-5xl font-medium tracking-tight mt-3 text-balance">
              Engineering, infrastructure and systems — organized into seven departments.
            </h1>
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
              GlobalSpec delivers through seven specialist departments, each with its own engineering team,
              capability stack and delivery standards. Select a department to explore its work.
            </p>
          </div>
        </section>

        <DepartmentsSection departments={departments as any} />
      </main>
    </div>
  )
}