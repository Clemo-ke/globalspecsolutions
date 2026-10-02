'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'
import { ArrowRight, Zap, TrendingDown, Clock, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function SolarCalculator() {
  const [monthlyBill, setMonthlyBill] = useState(250000)
  const [hoursPerDay, setHoursPerDay] = useState(14)

  // Calculation logic
  const solarOffset = hoursPerDay >= 20 ? 0.65 : hoursPerDay >= 14 ? 0.75 : 0.80
  const monthlySavings = Math.round(monthlyBill * solarOffset)
  const annualSavings = monthlySavings * 12
  // Cost estimate: ~KES 150,000 per kW installed; avg commercial: 1000–15000 kW range
  const estimatedSystemCost = Math.round(monthlyBill * 12 * 2.5)
  const paybackYears = (estimatedSystemCost / annualSavings).toFixed(1)

  const formatKES = (val: number) =>
    `KES ${val.toLocaleString('en-KE', { maximumFractionDigits: 0 })}`

  return (
    <section className="py-20 bg-slate-950 text-white border-y border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <span className="text-xs font-extrabold uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20 inline-block">
            Interactive Utility Tool
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Solar Energy & Power Cost Savings Calculator
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Estimate your monthly electricity cost reduction when switching to GlobalSpec commercial solar PV and hybrid battery energy storage.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 shadow-lg">
          {/* Sliders */}
          <div className="lg:col-span-7 space-y-8">
            {/* Monthly Bill Slider */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="text-xs font-bold uppercase text-slate-400 flex items-center gap-2">
                  <TrendingDown className="w-3.5 h-3.5 text-primary" />
                  Average Monthly Electricity Bill
                </label>
                <span className="text-xl font-black text-primary tabular-nums">
                  {formatKES(monthlyBill)}
                </span>
              </div>
              <input
                type="range"
                min="50000"
                max="2000000"
                step="50000"
                value={monthlyBill}
                onChange={(e) => setMonthlyBill(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                <span>KES 50K</span>
                <span>KES 2M</span>
              </div>
            </div>

            {/* Operating Hours Slider */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="text-xs font-bold uppercase text-slate-400 flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  Facility Operating Hours / Day
                </label>
                <span className="text-xl font-black text-amber-400 tabular-nums">
                  {hoursPerDay} hrs
                </span>
              </div>
              <input
                type="range"
                min="8"
                max="24"
                step="1"
                value={hoursPerDay}
                onChange={(e) => setHoursPerDay(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                <span>8 hrs</span>
                <span>24 hrs</span>
              </div>
            </div>

            {/* Results */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              <div className="p-4 bg-slate-950 rounded-xl border border-emerald-900/60 text-center">
                <Sun className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
                <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Est. Solar Offset</span>
                <span className="text-2xl font-black text-emerald-400">
                  {Math.round(solarOffset * 100)}%
                </span>
              </div>
              <div className="p-4 bg-slate-950 rounded-xl border border-primary/30 text-center">
                <TrendingDown className="w-4 h-4 text-primary mx-auto mb-1" />
                <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Monthly Savings</span>
                <span className="text-base font-black text-primary leading-tight">
                  ~{formatKES(monthlySavings)}
                </span>
              </div>
              <div className="p-4 bg-slate-950 rounded-xl border border-amber-900/60 text-center">
                <Clock className="w-4 h-4 text-amber-400 mx-auto mb-1" />
                <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Payback Period</span>
                <span className="text-2xl font-black text-amber-400">
                  {paybackYears} Yrs
                </span>
              </div>
            </div>

            <p className="text-[11px] text-slate-600 leading-relaxed">
              * Estimates are indicative and based on average commercial solar irradiance in Kenya (5.5 peak sun hours/day) and prevailing grid tariff rates. Contact our engineers for a detailed site assessment.
            </p>
          </div>

          {/* CTA Panel */}
          <div className="lg:col-span-5 bg-gradient-to-br from-primary/20 via-slate-900 to-slate-900 border border-primary/30 p-6 rounded-2xl flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <Zap className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-white">Ready to Cut Energy Overhead?</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm border-b border-slate-800 pb-2">
                  <span className="text-slate-400">Annual Savings Estimate</span>
                  <span className="font-bold text-emerald-400">{formatKES(annualSavings)}</span>
                </div>
                <div className="flex justify-between items-center text-sm border-b border-slate-800 pb-2">
                  <span className="text-slate-400">5-Year Savings</span>
                  <span className="font-bold text-white">{formatKES(annualSavings * 5)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400">10-Year Savings</span>
                  <span className="font-bold text-white">{formatKES(annualSavings * 10)}</span>
                </div>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Our certified energy engineers perform detailed load profile analysis, net-metering setup, and turnkey installation for commercial facilities across Kenya and East Africa.
              </p>
            </div>
            <Link href="/quote">
              <Button className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 rounded-xl shadow-lg shadow-primary/20 gap-2 text-sm">
                Request Full Technical Energy Audit <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
