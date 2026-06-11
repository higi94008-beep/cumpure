import Image from 'next/image'
import Link from 'next/link'
import { Leaf, Award, Truck, Users } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="pb-20">
      {/* Hero */}
      <div className="bg-gradient-to-br from-brand-800 to-brand-600 text-white py-20">
        <div className="container-custom text-center">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">Our Story</h1>
          <p className="text-brand-100 text-lg max-w-2xl mx-auto">
            Born from a love for real food, Nature's Harvest has been bringing premium quality gourmet groceries to food-loving homes since 2010.
          </p>
        </div>
      </div>

      {/* Story */}
      <div className="container-custom py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="section-title mb-4">From Farm to Your Table</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              We started with a simple belief: that everyone deserves access to the finest foods the world has to offer — without compromise on quality, freshness, or origin.
            </p>
            <p className="text-gray-600 leading-relaxed mb-4">
              From hand-picked Darjeeling first flush teas to wild-caught Alaskan salmon, we curate only the best. Every product is sourced directly from producers we trust and visit personally.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Today, we serve thousands of households across India, delivering the gourmet experience that was once reserved for specialty stores right to your doorstep.
            </p>
          </div>
          <div className="relative aspect-square rounded-2xl overflow-hidden">
            <Image src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=600" alt="Fresh produce" fill className="object-cover" />
          </div>
        </div>
      </div>

      {/* Values */}
      <div className="bg-gray-50 py-16">
        <div className="container-custom">
          <h2 className="section-title text-center mb-12">What We Stand For</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: Leaf, title: 'Organic First', desc: 'We prioritise certified organic and natural products in everything we offer.' },
              { icon: Award, title: 'Premium Quality', desc: 'Rigorous quality checks on every product before it reaches your basket.' },
              { icon: Truck, title: 'Fresh Delivery', desc: 'Temperature-controlled delivery to preserve freshness every time.' },
              { icon: Users, title: 'Community', desc: 'Supporting local farmers, artisans, and small-batch producers across India.' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="text-center">
                <div className="w-14 h-14 bg-brand-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-7 h-7 text-brand-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
                <p className="text-gray-500 text-sm">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Numbers */}
      <div className="container-custom py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { num: '15+', label: 'Years of Trust' },
            { num: '5,000+', label: 'Products Curated' },
            { num: '1M+', label: 'Happy Customers' },
            { num: '50+', label: 'Cities Served' },
          ].map(s => (
            <div key={s.label}>
              <p className="font-display text-4xl font-bold text-brand-600 mb-1">{s.num}</p>
              <p className="text-gray-500 text-sm">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="container-custom">
        <div className="bg-brand-700 text-white rounded-2xl p-10 text-center">
          <h2 className="font-display text-3xl font-bold mb-3">Ready to Explore?</h2>
          <p className="text-brand-200 mb-6">Discover thousands of premium products hand-picked for you.</p>
          <Link href="/products" className="inline-flex items-center gap-2 bg-white text-brand-700 font-semibold px-8 py-3 rounded-full hover:bg-brand-50 transition-colors">
            Start Shopping
          </Link>
        </div>
      </div>
    </div>
  )
}
