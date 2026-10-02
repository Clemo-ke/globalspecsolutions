'use client'

import { useEffect, useState, useCallback } from 'react'
import { ChevronLeft, ChevronRight, ArrowRight, Play, Pause } from 'lucide-react'
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
  const [progress, setProgress] = useState(0)

  const SLIDE_DURATION = 6000

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % slides.length)
    setProgress(0)
  }, [slides.length])

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length)
    setProgress(0)
    setIsAutoPlay(false)
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
    setProgress(0)
    setIsAutoPlay(false)
  }

  useEffect(() => {
    if (!isAutoPlay || slides.length === 0) return
    const interval = setInterval(() => {
      setProgress(0)
      goToNext()
    }, SLIDE_DURATION)
    return () => clearInterval(interval)
  }, [isAutoPlay, slides.length, goToNext])

  // Progress bar animation
  useEffect(() => {
    if (!isAutoPlay) return
    setProgress(0)
    const start = Date.now()
    const frame = () => {
      const elapsed = Date.now() - start
      setProgress(Math.min((elapsed / SLIDE_DURATION) * 100, 100))
      if (elapsed < SLIDE_DURATION) requestAnimationFrame(frame)
    }
    const id = requestAnimationFrame(frame)
    return () => cancelAnimationFrame(id)
  }, [currentIndex, isAutoPlay])

  if (!slides || slides.length === 0) {
    return (
      <div className="hidden md:flex h-[70vh] bg-gradient-to-br from-slate-900 via-primary/30 to-slate-950 items-center justify-center">
        <div className="text-center text-white">
          <h2 className="text-3xl font-bold mb-2">Welcome to Global Spec Solutions</h2>
          <p className="text-white/70">Engineering Excellence Across East Africa</p>
        </div>
      </div>
    )
  }

  const currentSlide = slides[currentIndex]

  return (
    // Only visible on md+ screens
    <div className="hidden md:block relative w-full h-[70vh] lg:h-[78vh] max-h-[800px] overflow-hidden">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-all duration-1000 ease-out ${
            index === currentIndex ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-105 z-0'
          }`}
        >
          {/* Background */}
          <div className="relative w-full h-full">
            {slide.imageUrl ? (
              <img
                src={slide.imageUrl}
                alt={slide.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-slate-900 via-primary/30 to-slate-950" />
            )}
            {/* Gradient overlays */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10" />
          </div>

          {/* Content */}
          <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-16 lg:px-24">
            <div
              className={`max-w-3xl transition-all duration-1000 delay-200 ${
                index === currentIndex ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
            >
              {slide.subtitle && (
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-[2px] w-12 bg-accent rounded-full" />
                  <span className="text-accent font-semibold tracking-widest text-xs uppercase">
                    {slide.subtitle}
                  </span>
                </div>
              )}

              <h1 className="text-4xl lg:text-6xl xl:text-7xl font-bold text-white mb-5 leading-[1.05] tracking-tight text-balance">
                {slide.title}
              </h1>

              {slide.description && (
                <p className="text-lg text-white/80 mb-8 max-w-2xl leading-relaxed">
                  {slide.description}
                </p>
              )}

              {slide.ctaText && slide.ctaLink && (
                <div className="flex items-center gap-4">
                  <a href={slide.ctaLink}>
                    <Button
                      size="lg"
                      className="bg-accent hover:bg-accent/90 text-white font-bold px-8 py-3 h-auto text-base shadow-lg shadow-accent/30 gap-2"
                    >
                      {slide.ctaText}
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </a>
                  <a
                    href="/quote"
                    className="text-white/80 hover:text-white transition-colors text-sm font-semibold underline underline-offset-4"
                  >
                    Request a Quote
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={goToPrevious}
        className="absolute left-6 top-1/2 -translate-y-1/2 z-20 bg-white/10 hover:bg-accent transition-all duration-200 p-3 rounded-full backdrop-blur-sm border border-white/20 hover:border-accent"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6 text-white" />
      </button>
      <button
        onClick={goToNext}
        className="absolute right-6 top-1/2 -translate-y-1/2 z-20 bg-white/10 hover:bg-accent transition-all duration-200 p-3 rounded-full backdrop-blur-sm border border-white/20 hover:border-accent"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6 text-white" />
      </button>

      {/* Bottom Controls */}
      <div className="absolute bottom-6 left-8 md:left-16 lg:left-24 z-20 flex items-center gap-4">
        {/* Dot indicators */}
        <div className="flex gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`transition-all duration-300 rounded-full cursor-pointer ${
                index === currentIndex
                  ? 'bg-accent w-8 h-2.5'
                  : 'bg-white/40 hover:bg-white/70 w-2.5 h-2.5'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Auto-play toggle */}
        <button
          onClick={() => setIsAutoPlay(!isAutoPlay)}
          className="ml-2 p-1.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white/80 hover:text-white transition-all border border-white/20"
          aria-label={isAutoPlay ? 'Pause slideshow' : 'Play slideshow'}
        >
          {isAutoPlay ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
        </button>
      </div>

      {/* Slide counter */}
      <div className="absolute bottom-6 right-6 z-20 bg-black/40 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs font-semibold border border-white/10">
        {currentIndex + 1} / {slides.length}
      </div>

      {/* Progress bar */}
      {isAutoPlay && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/10 z-20">
          <div
            className="h-full bg-accent transition-none"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  )
}
