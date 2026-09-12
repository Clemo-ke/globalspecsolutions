'use client'

import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight, ChevronUp, X, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface HeroSlide {
  id: number
  title: string
  subtitle?: string
  description?: string
  imageUrl?: string
  ctaText?: string
  ctaLink?: string
}

interface HeroCarouselProps {
  slides: HeroSlide[]
}

export function HeroCarousel({ slides }: HeroCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlay, setIsAutoPlay] = useState(true)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (!isAutoPlay || slides.length === 0) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [isAutoPlay, slides.length])

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length)
    setIsAutoPlay(false)
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length)
    setIsAutoPlay(false)
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
    setIsAutoPlay(false)
  }

  if (!slides || slides.length === 0) {
    return (
      <div className="h-96 bg-gradient-to-r from-primary/20 to-accent/20 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Welcome to Global Spec Solutions</h2>
          <p className="text-muted-foreground">Hero carousel content will appear here</p>
        </div>
      </div>
    )
  }

  const currentSlide = slides[currentIndex]

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 group pointer-events-none overflow-hidden md:static md:z-auto md:pointer-events-auto md:overflow-visible">
      {/* Expanding Carousel */}
      <div className={`pointer-events-auto relative w-full h-[min(55vh,420px)] md:h-[70vh] lg:h-[78vh] md:max-h-[760px] ${
        isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-full'
      } group-hover:opacity-100 group-hover:translate-y-0 md:opacity-100 md:translate-y-0 transition-all duration-500 ease-out md:transition-none shadow-2xl rounded-t-2xl md:shadow-none md:rounded-none`}>
        {/* Main Carousel */}
        <div className="relative w-full h-full overflow-hidden rounded-t-2xl">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-all duration-1000 ease-out ${
                index === currentIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
              }`}
            >
              {/* Background Image with Gradient Overlay */}
              <div className="relative w-full h-full">
                {slide.imageUrl ? (
                  <img
                    src={slide.imageUrl}
                    alt={slide.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary/40 via-primary/20 to-accent/40" />
                )}

                {/* Premium Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              </div>

              {/* Content */}
              <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-16">
                <div className={`max-w-3xl transition-all duration-1000 ${
                  index === currentIndex 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-8'
                }`}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-1 w-10 bg-accent rounded-full"></div>
                    {slide.subtitle && (
                      <span className="text-accent font-semibold tracking-widest text-xs md:text-sm">
                        {slide.subtitle}
                      </span>
                    )}
                  </div>

                  <h1 className="text-2xl md:text-5xl lg:text-6xl font-bold text-white mb-2 md:mb-4 text-balance leading-[1.05] tracking-tight">
                    {slide.title}
                  </h1>

                  {slide.description && (
                    <p className="hidden md:block text-base md:text-lg text-white/85 mb-6 max-w-2xl leading-relaxed">
                      {slide.description}
                    </p>
                  )}

                  {slide.ctaText && slide.ctaLink && (
                    <div className="flex items-center gap-4">
                      <a href={slide.ctaLink}>
                        <Button
                          size="lg"
                          className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-6 py-2.5 h-auto text-sm"
                        >
                          {slide.ctaText}
                        </Button>
                      </a>
                      <a
                        href={slide.ctaLink}
                        className="hidden md:flex text-white hover:text-accent transition-colors items-center gap-2 font-semibold"
                      >
                        Learn more <ArrowRight className="w-4 h-4" />
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={goToPrevious}
          className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 z-10 bg-white/15 hover:bg-accent transition-all p-2.5 md:p-3 rounded-full backdrop-blur-sm"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-white" />
        </button>
        <button
          onClick={goToNext}
          className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 z-10 bg-white/15 hover:bg-accent transition-all p-2.5 md:p-3 rounded-full backdrop-blur-sm"
          aria-label="Next slide"
        >
          <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-white" />
        </button>

        {/* Dot Indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-2.5 bg-black/30 backdrop-blur-sm px-4 py-2.5 rounded-full">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`transition-all rounded-full cursor-pointer ${
                index === currentIndex
                  ? 'bg-accent w-7 h-2'
                  : 'bg-white/40 hover:bg-white/60 w-2 h-2'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Slide Counter */}
        <div className="absolute top-4 right-4 z-10 bg-black/40 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs font-semibold">
          {currentIndex + 1} / {slides.length}
        </div>

        {/* Close button */}
        <button
          onClick={() => setIsOpen(false)}
          aria-label="Close promotions"
          className="md:hidden absolute top-4 left-4 z-10 w-8 h-8 bg-black/40 hover:bg-accent backdrop-blur-sm text-white rounded-full flex items-center justify-center cursor-pointer transition-all"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Collapsed hover/tap tab */}
      <button
        aria-label="Show promotions"
        onClick={() => setIsOpen(true)}
        className={`md:hidden ${
          isOpen ? 'hidden' : 'flex'
        } pointer-events-auto absolute bottom-0 inset-x-0 z-10 h-9 md:h-10 bg-slate-900/90 backdrop-blur-md text-white items-center justify-center gap-2 cursor-pointer group-hover:hidden transition-all`}
      >
        <ChevronUp className="w-4 h-4 text-accent" />
        <span className="text-[11px] md:text-xs font-semibold tracking-[0.2em] uppercase">Promotions</span>
      </button>
    </div>
  )
}
