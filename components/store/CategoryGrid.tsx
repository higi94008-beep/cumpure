import Link from 'next/link'
import Image from 'next/image'

const CATEGORIES = [
  { name: 'Fresh Produce', slug: 'fresh-produce', image: 'https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=300', color: 'from-green-400 to-green-600' },
  { name: 'Dairy & Cheese', slug: 'dairy-cheese', image: 'https://images.unsplash.com/photo-1559561853-08451507cbe7?w=300', color: 'from-yellow-300 to-orange-400' },
  { name: 'Bakery', slug: 'bakery', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300', color: 'from-amber-400 to-amber-600' },
  { name: 'Chocolates', slug: 'chocolates', image: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=300', color: 'from-amber-800 to-amber-950' },
  { name: 'Tea & Coffee', slug: 'tea-coffee', image: 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=300', color: 'from-brand-600 to-brand-800' },
  { name: 'Snacks', slug: 'snacks', image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=300', color: 'from-orange-400 to-red-500' },
  { name: 'Cold Beverages', slug: 'cold-beverages', image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=300', color: 'from-cyan-400 to-blue-500' },
  { name: 'Seafood', slug: 'butchery-seafood', image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=300', color: 'from-blue-600 to-indigo-700' },
]

export default function CategoryGrid() {
  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <h2 className="section-title">Shop by Category</h2>
        <Link href="/products" className="text-brand-600 hover:text-brand-700 text-sm font-medium flex items-center gap-1">
          View All
        </Link>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {CATEGORIES.map(cat => (
          <Link key={cat.slug} href={`/category/${cat.slug}`}
            className="flex flex-col items-center gap-2 group">
            <div className={`w-full aspect-square rounded-2xl overflow-hidden relative bg-gradient-to-br ${cat.color}`}>
              <Image
                src={cat.image}
                alt={cat.name}
                fill
                className="object-cover mix-blend-overlay opacity-60 group-hover:scale-110 transition-transform duration-300"
              />
            </div>
            <span className="text-xs font-medium text-gray-700 text-center group-hover:text-brand-600 transition-colors">
              {cat.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  )
}
