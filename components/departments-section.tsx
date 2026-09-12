'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Check } from 'lucide-react'
import { CategoryIcon } from '@/components/category-icon'

interface Department {
  id: number
  slug: string
  name: string
  mainFunction?: string | null
  description?: string | null
  capabilities?: string | null
  icon?: string | null
  imageUrl?: string | null
}

export function DepartmentsSection({ departments }: { departments: Department[] }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const active = departments[activeIndex] || departments[0]

  const capabilities = active.capabilities ? active.capabilities.split(',').map((c) => c.trim()).filter(Boolean) : []

  return (
    <section className="py-20 border-t border-border/40">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16">
          {/* Left: editorial intro */}
          <div className="md:col-span-5">
            <span className="text-xs font-semibold text-primary uppercase tracking-widest">Departments</span>
            <h2 className="mt-3 text-3xl md:text-4xl font-medium tracking-tight text-foreground text-balance">
              Seven engineering departments. One accountable partner.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Each of our seven departments is led by technical specialists. Select a department to see its
              core function, capabilities, and the systems we engineer.
            </p>

            <div className="mt-8 space-y-0.5">
              {departments.map((dep, i) => {
                const isActive = i === activeIndex
                return (
                  <button
                    key={dep.id}
                    onClick={() => setActiveIndex(i)}
                    className={`w-full text-left flex items-baseline gap-4 px-4 py-3 border-l-2 transition-all ${
                      isActive
                        ? 'border-l-primary bg-primary/5'
                        : 'border-l-border hover:border-l-primary/40 hover:bg-muted/40'
                    }`}
                  >
                    <span className={`text-xs font-semibold tabular-nums ${isActive ? 'text-primary' : 'text-muted-foreground/60'}`}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className={`text-sm tracking-tight ${isActive ? 'font-semibold text-foreground' : 'font-medium text-muted-foreground'}`}>
                      {dep.name}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Right: active department detail panel */}
          <div className="md:col-span-7">
            {active && (
              <div className="border border-border rounded-xl overflow-hidden bg-card sticky top-24">
                <div className="relative h-52 md:h-64 w-full bg-slate-100">
                  {active.imageUrl ? (
                    <Image
                      src={active.imageUrl}
                      alt={active.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 60vw"
                      className="object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-primary/40">
                      <CategoryIcon name={active.icon} className="w-14 h-14" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-background/90 backdrop-blur border border-border">
                    <span className="p-1 rounded-md bg-primary/10 text-primary">
                      <CategoryIcon name={active.icon} className="w-4 h-4" />
                    </span>
                    <span className="text-xs font-semibold text-foreground">{active.name}</span>
                  </div>
                </div>

                <div className="p-6 md:p-8">
                  <div className="text-xs font-semibold uppercase tracking-widest text-primary">
                    {active.mainFunction}
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{active.description}</p>

                  {capabilities.length > 0 && (
                    <div className="mt-6">
                      <div className="text-xs font-semibold uppercase tracking-widest text-foreground/60 mb-3">
                        Capabilities
                      </div>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
                        {capabilities.map((cap, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-xs text-muted-foreground">
                            <Check size={13} className="text-primary mt-0.5 flex-shrink-0" />
                            {cap}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <Link
                    href={`/departments/${active.slug}`}
                    className="inline-flex items-center gap-2 mt-7 text-xs font-semibold text-primary hover:text-primary/80 transition-colors"
                  >
                    Explore Department
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}