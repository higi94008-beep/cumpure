'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const SLIDES = [
  {
    id: 1,
    title: "Farm Fresh Organic Produce",
    subtitle: "Sourced directly from trusted farms. Delivered to your door.",
    cta: "Shop Fresh",
    href: "/category/fresh-produce",
    bg: "from-green-800 to-green-600",
    image: "https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=1200",
    badge: "Organic Certified",
  },
  {
    id: 2,
    title: "Artisan Chocolates & Confectionery",
    subtitle: "Handcrafted premium chocolates from around the world.",
    cta: "Explore Now",
    href: "/category/chocolates",
    bg: "from-amber-900 to-amber-700",
    image: "https://images.unsplash.com/photo-1481391243133-f96216dcb5d2?w=1200",
    badge: "Premium Import",
  },
  {
    id: 3,
    title: "Single Origin Teas & Coffees",
    subtitle: "Darjeeling first flush, Ethiopian naturals, and rare estate teas.",
    cta: "Discover Blends",
    href: "/category/tea-coffee",
    bg: "from-brand-900 to-brand-700",
    image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=1200",
    badge: "Award Winning",
  },
]

export default function HeroBanner() {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => setCurrent(c => (c + 1) % SLIDES.length), 5000)
    return () => clearInterval(timer)
  }, [])

  const slide = SLIDES[current]

  return (
    <div className="relative rounded-2xl overflow-hidden h-72 md:h-96 lg:h-[480px]">
      {/* Background */}
      <div className={`absolute inset-0 bg-gradient-to-r ${slide.bg} transition-all duration-700`} />
      <Image
        src={slide.image}
        alt={slide.title}
        fill
        className="object-cover mix-blend-overlay opacity-40"
        priority
      />

      {/* Content */}
      <div className="relative h-full flex items-center">
        <div className="container-custom">
          <div className="max-w-lg animate-fade-in" key={current}>
            <span className="inline-block bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full mb-4 backdrop-blur-sm">
              {slide.badge}
            </span>
            <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
              {slide.title}
            </h1>
            <p className="text-white/80 text-sm md:text-base mb-6">{slide.subtitle}</p>
            <Link href={slide.href}
              className="inline-flex items-center gap-2 bg-white text-brand-700 hover:bg-brand-50 font-semibold px-6 py-3 rounded-full transition-colors shadow-lg">
              {slide.cta}
            </Link>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {SLIDES.map((_, i) => (
          <button key={i} onClick={() => setCurrent(i)}
            className={`w-2 h-2 rounded-full transition-all ${i === current ? 'bg-white w-6' : 'bg-white/50'}`} />
        ))}
      </div>
      <button onClick={() => setCurrent(c => (c - 1 + SLIDES.length) % SLIDES.length)}
        className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-colors">
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button onClick={() => setCurrent(c => (c + 1) % SLIDES.length)}
        className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-colors">
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  )
}
