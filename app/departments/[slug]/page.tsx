import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { MainHeader } from '@/components/main-header'
import { CategoryIcon } from '@/components/category-icon'
import { getDepartmentBySlug, getProductsByDepartment, getSiteSettings } from '@/lib/db-data'
import { ArrowLeft, Check, ArrowRight, Package } from 'lucide-react'

export default async function DepartmentDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const [department, siteSettings] = await Promise.all([getDepartmentBySlug(slug), getSiteSettings()])
  if (!department) notFound()

  const products = await getProductsByDepartment(slug)
  const capabilities = department.capabilities ? department.capabilities.split(',').map((c: string) => c.trim()).filter(Boolean) : []

  return (
    <div className="w-full bg-background text-foreground min-h-screen flex flex-col">
      <MainHeader siteSettings={siteSettings} />

      <main className="flex-1">
        <div className="bg-muted/40 border-b border-border py-3 px-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <Link
              href="/departments"
              className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-primary transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> All Departments
            </Link>
            <span className="text-xs text-muted-foreground font-medium">GlobalSpec Solutions / Departments / {department.name}</span>
          </div>
        </div>

        {/* Department hero */}
        <section className="border-b border-border">
          <div className="max-w-7xl mx-auto px-4 md:px-6 py-14 md:py-16 grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
            <div className="md:col-span-7">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/5 border border-primary/20 text-primary">
                <span className="p-1 rounded-md bg-primary/10">
                  <CategoryIcon name={department.icon} className="w-4 h-4" />
                </span>
                <span className="text-xs font-semibold">{department.name}</span>
              </div>
              <h1 className="mt-5 text-4xl md:text-5xl font-medium tracking-tight text-balance">{department.name}</h1>
              <p className="mt-3 text-sm font-medium text-primary">{department.mainFunction}</p>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground max-w-xl">{department.description}</p>

              {capabilities.length > 0 && (
                <div className="mt-8">
                  <div className="text-xs font-semibold uppercase tracking-widest text-foreground/60 mb-3">Capabilities</div>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
                    {capabilities.map((cap, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <Check size={14} className="text-primary mt-0.5 flex-shrink-0" />
                        {cap}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="md:col-span-5">
              <div className="relative h-64 md:h-80 w-full rounded-xl overflow-hidden border border-border bg-slate-100">
                {department.imageUrl ? (
                  <Image
                    src={department.imageUrl}
                    alt={department.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 40vw"
                    className="object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-primary/40">
                    <CategoryIcon name={department.icon} className="w-16 h-16" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Products in this department */}
        <section className="max-w-7xl mx-auto px-4 md:px-6 py-14">
          <div className="flex items-end justify-between mb-8">
            <div>
              <span className="text-xs font-semibold text-primary uppercase tracking-widest">Product Catalog</span>
              <h2 className="mt-2 text-2xl md:text-3xl font-medium tracking-tight">Products in this department</h2>
            </div>
            <Link href="/shop" className="inline-flex items-center gap-2 text-xs font-semibold text-primary hover:text-primary/80 shrink-0">
              View full shop <ArrowRight size={14} />
            </Link>
          </div>

          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((prod: any) => (
                <Link
                  key={prod.id}
                  href={`/shop/product/${prod.slug}`}
                  className="group border border-border rounded-xl overflow-hidden bg-card hover:border-primary/40 transition-colors"
                >
                  <div className="relative h-44 w-full bg-slate-100">
                    {prod.imageUrl ? (
                      <Image src={prod.imageUrl} alt={prod.name} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/40">
                        <Package className="w-10 h-10" />
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="text-sm font-semibold tracking-tight group-hover:text-primary transition-colors">{prod.name}</h3>
                    {prod.shortDescription && <p className="mt-1 text-xs text-muted-foreground leading-relaxed line-clamp-2">{prod.shortDescription}</p>}
                    <div className="mt-3 text-sm font-semibold text-foreground">
                      KES {parseFloat(prod.salePrice || prod.price || '0').toLocaleString()}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="border border-dashed border-border rounded-xl p-12 text-center">
              <Package className="w-8 h-8 mx-auto text-muted-foreground/40" />
              <p className="mt-3 text-sm text-muted-foreground">No products published in this department yet.</p>
              <Link href="/shop" className="inline-flex items-center gap-2 mt-4 text-xs font-semibold text-primary">
                Browse the full product catalog <ArrowRight size={14} />
              </Link>
            </div>
          )}
        </section>
      </main>
    </div>
  )
}