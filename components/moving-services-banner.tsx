'use client'

import React from 'react'
import Link from 'next/link'
import { Zap, Cpu, Sun, Shield, Settings, Server, Wrench, ArrowRight } from 'lucide-react'

export function MovingServicesBanner() {
  const items = [
    { icon: Zap, text: 'Electrical Works & Critical Power UPS Systems', href: '/services/electrical-works' },
    { icon: Server, text: 'ICT Infrastructure & Data Centre Setup', href: '/services/ict-infrastructure' },
    { icon: Sun, text: 'Renewable Energy & Solar Installations', href: '/services/renewable-energy' },
    { icon: Cpu, text: 'Software Integration, DCIM & Struxureware', href: '/services/software-and-integrations' },
    { icon: Shield, text: '24/7 Cybersecurity & Environmental Monitoring', href: '/contact' },
    { icon: Wrench, text: 'Preventative Maintenance & Emergency Support', href: '/contact' },
  ]

  // Duplicate items array to ensure a seamless infinite scroll loop
  const marqueeItems = [...items, ...items, ...items]

  return (
    <section className="w-full bg-slate-950 border-y border-slate-800/80 py-3.5 overflow-hidden select-none relative z-20">
      <div className="flex w-full overflow-x-hidden">
        <div className="flex animate-marquee space-x-8 whitespace-nowrap shrink-0 items-center">
          {marqueeItems.map((item, idx) => {
            const Icon = item.icon
            return (
              <Link
                key={idx}
                href={item.href}
                className="inline-flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-slate-300 hover:text-primary transition-colors group cursor-pointer"
              >
                <span className="p-1.5 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                  <Icon className="w-4 h-4" />
                </span>
                <span>{item.text}</span>
                <ArrowRight className="w-3 h-3 text-slate-600 group-hover:text-primary group-hover:translate-x-0.5 transition-all ml-1" />
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
