'use client'

import React from 'react'
import { MessageCircle } from 'lucide-react'

interface FloatingWhatsAppProps {
  whatsappNumber?: string
  enabled?: boolean
}

export function FloatingWhatsApp({ whatsappNumber = '+254721113431', enabled = true }: FloatingWhatsAppProps) {
  if (!enabled) return null

  const cleanNumber = whatsappNumber.replace(/[^0-9]/g, '')
  const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent('Hello Global Spec Solutions! I would like to inquire about your products and services.')}`

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 group flex items-center gap-3 bg-emerald-600 hover:bg-emerald-500 text-white p-3.5 sm:px-5 sm:py-3.5 rounded-full shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle className="w-6 h-6 animate-bounce" />
      <span className="hidden sm:inline font-bold text-sm tracking-wide">
        Chat on WhatsApp
      </span>
      <span className="absolute -top-1 -right-1 flex h-3 w-3 sm:hidden">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-400"></span>
      </span>
    </a>
  )
}
