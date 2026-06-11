import HeroBanner from '@/components/store/HeroBanner'
import CategoryGrid from '@/components/store/CategoryGrid'
import ProductSection from '@/components/store/ProductSection'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import Image from 'next/image'

async function getFeaturedProducts() {
  const { data } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .eq('is_featured', true)
    .order('created_at', { ascending: false })
    .limit(10)
  return data || []
}

async function getAllProducts() {
  const { data } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(20)
  return data || []
}

const PROMO_BANNERS = [
  { title: 'Gluten Free Essentials', subtitle: 'Everyday staples, minus the gluten', href: '/category/gluten-free', bg: 'from-amber-100 to-orange-100', textColor: 'text-amber-800', image: 'https://images.unsplash.com/photo-1551892374-ecf8754cf8b0?w=600' },
  { title: 'The Dairy Creamery', subtitle: 'From farm to your table daily', href: '/category/dairy-cheese', bg: 'from-blue-50 to-indigo-100', textColor: 'text-blue-900', image: 'https://images.unsplash.com/photo-1559561853-08451507cbe7?w=600' },
]

export default async function HomePage() {
  const [featured, allProducts] = await Promise.all([getFeaturedProducts(), getAllProducts()])

  const trending = allProducts.slice(0, 10)
  const dailyEssentials = allProducts.slice(5, 15)

  return (
    <div className="space-y-12 pb-16">
      {/* Hero */}
      <section className="container-custom pt-6">
        <HeroBanner />
      </section>

      {/* Trust bar */}
      <section className="bg-brand-50 border-y border-brand-100">
        <div className="container-custom py-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: '🌿', title: '100% Organic', desc: 'Certified organic products' },
              { icon: '🚚', title: 'Same Day Delivery', desc: 'Order before 2 PM' },
              { icon: '🔒', title: 'Secure Payments', desc: 'All major methods accepted' },
              { icon: '⭐', title: 'Premium Quality', desc: 'Curated gourmet selection' },
            ].map(item => (
              <div key={item.title} className="flex items-center gap-3 text-sm">
                <span className="text-2xl">{item.icon}</span>
                <div>
                  <p className="font-semibold text-gray-800">{item.title}</p>
                  <p className="text-gray-500 text-xs">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="container-custom">
        <CategoryGrid />
      </section>

      {/* Featured products */}
      {featured.length > 0 && (
        <section className="container-custom">
          <ProductSection
            title="Curated Picks"
            subtitle="Editor's selection of premium gourmet finds"
            products={featured}
            viewAllHref="/products?featured=true"
          />
        </section>
      )}

      {/* Promo banners */}
      <section className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {PROMO_BANNERS.map(banner => (
            <Link key={banner.href} href={banner.href}
              className={`relative rounded-2xl overflow-hidden h-40 bg-gradient-to-r ${banner.bg} flex items-center p-8 group`}>
              <Image src={banner.image} alt={banner.title} fill
                className="object-cover opacity-20 group-hover:opacity-30 transition-opacity" />
              <div className="relative">
                <h3 className={`font-display text-2xl font-bold ${banner.textColor}`}>{banner.title}</h3>
                <p className={`${banner.textColor} opacity-70 text-sm mt-1`}>{banner.subtitle}</p>
                <span className={`inline-block mt-3 text-xs font-semibold ${banner.textColor} border border-current px-3 py-1 rounded-full`}>
                  Shop Now →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Trending products */}
      {trending.length > 0 && (
        <section className="container-custom">
          <ProductSection
            title="Trending Near You"
            subtitle="What your neighbours are loving this week"
            products={trending}
            viewAllHref="/products?sort=popular"
          />
        </section>
      )}

      {/* Daily essentials */}
      {dailyEssentials.length > 0 && (
        <section className="container-custom">
          <ProductSection
            title="Daily Essentials"
            subtitle="Stock up on your everyday favourites"
            products={dailyEssentials}
            viewAllHref="/products"
            variant="grid"
          />
        </section>
      )}

      {/* App download banner */}
      <section className="container-custom">
        <div className="bg-brand-800 rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6 text-white">
          <div>
            <h2 className="font-display text-2xl md:text-3xl font-bold mb-2">Download Our App</h2>
            <p className="text-brand-200 text-sm">Get exclusive app-only deals and track your orders in real-time.</p>
            <div className="flex gap-3 mt-4">
              <a href="#" className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-xl text-sm font-medium">
                <span>🍎</span> App Store
              </a>
              <a href="#" className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-xl text-sm font-medium">
                <span>▶</span> Google Play
              </a>
            </div>
          </div>
          <div className="text-6xl">📱</div>
        </div>
      </section>
    </div>
  )
}
