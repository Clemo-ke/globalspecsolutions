'use client'

import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight, Play } from 'lucide-react'
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
    <div className="relative w-full h-screen max-h-96 md:max-h-screen overflow-hidden shadow-xl">
      {/* Main Carousel */}
      <div className="relative w-full h-full">
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
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-1 w-12 bg-accent rounded-full"></div>
                  {slide.subtitle && (
                    <span className="text-accent font-semibold tracking-widest text-sm">
                      {slide.subtitle}
                    </span>
                  )}
                </div>
                
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-4 md:mb-6 text-balance leading-tight">
                  {slide.title}
                </h1>
                
                {slide.description && (
                  <p className="text-base md:text-lg text-white/85 mb-8 max-w-2xl leading-relaxed">
                    {slide.description}
                  </p>
                )}
                
                {slide.ctaText && slide.ctaLink && (
                  <div className="flex items-center gap-4">
                    <a href={slide.ctaLink}>
                      <Button
                        size="lg"
                        className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-8 py-3 h-auto"
                      >
                        {slide.ctaText}
                      </Button>
                    </a>
                    <a 
                      href={slide.ctaLink}
                      className="text-white hover:text-accent transition-colors flex items-center gap-2 font-semibold"
                    >
                      Learn more →
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
        className="absolute left-6 top-1/2 -translate-y-1/2 z-10 bg-white/15 hover:bg-accent transition-all p-3 rounded-full backdrop-blur-sm group"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
      </button>
      <button
        onClick={goToNext}
        className="absolute right-6 top-1/2 -translate-y-1/2 z-10 bg-white/15 hover:bg-accent transition-all p-3 rounded-full backdrop-blur-sm group"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
      </button>

      {/* Dot Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex gap-3 bg-black/30 backdrop-blur-sm px-4 py-3 rounded-full">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`transition-all rounded-full cursor-pointer ${
              index === currentIndex
                ? 'bg-accent w-8 h-2'
                : 'bg-white/40 hover:bg-white/60 w-2 h-2'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Slide Counter */}
      <div className="absolute top-6 right-6 z-10 bg-black/40 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-semibold">
        {currentIndex + 1} / {slides.length}
      </div>
    </div>
  )
}
