import ProductCard from '@/components/store/ProductCard'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

interface PageProps {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ sort?: string; page?: string }>
}

const CATEGORY_META: Record<string, { name: string; description: string; emoji: string }> = {
  'fresh-produce': { name: 'Fresh Produce', description: 'Farm-fresh fruits, vegetables, and herbs sourced directly from trusted farms.', emoji: '🥬' },
  'dairy-cheese': { name: 'Dairy & Cheese', description: 'Artisanal cheeses, fresh dairy products, and creamery favorites.', emoji: '🧀' },
  'bakery': { name: 'Bakery & Boulangerie', description: 'Handcrafted breads, croissants, and artisan baked goods.', emoji: '🥐' },
  'chocolates': { name: 'Chocolates & Confectionery', description: 'Premium chocolates, truffles, and sweet indulgences from around the world.', emoji: '🍫' },
  'tea-coffee': { name: 'Tea, Coffee & Infusions', description: 'Single-origin teas, specialty coffees, and wellness infusions.', emoji: '☕' },
  'snacks': { name: 'Snacks & Treats', description: 'Gourmet snacking for every craving and occasion.', emoji: '🍿' },
  'cold-beverages': { name: 'Cold Beverages', description: 'Premium cold drinks, kombuchas, juices, and mixers.', emoji: '🧃' },
  'organic': { name: 'Organic & Natural', description: 'Certified organic products for a healthier lifestyle.', emoji: '🌱' },
  'gluten-free': { name: 'Gluten Free', description: 'Delicious gluten-free alternatives for every meal.', emoji: '🌾' },
  'butchery-seafood': { name: 'Butchery & Seafood', description: 'Premium cuts, fresh seafood, and deli meats.', emoji: '🦐' },
}

async function getCategoryProducts(slug: string, sort?: string) {
  const { data: category } = await supabase.from('categories').select('id').eq('slug', slug).single()
  if (!category) return []

  let query = supabase.from('products').select('*').eq('is_active', true).eq('category_id', category.id)
  if (sort === 'price_asc') query = query.order('price', { ascending: true })
  else if (sort === 'price_desc') query = query.order('price', { ascending: false })
  else query = query.order('created_at', { ascending: false })

  const { data } = await query.limit(60)
  return data || []
}

export default async function CategoryPage({ params, searchParams }: PageProps) {
  const { slug } = await params
  const { sort } = await searchParams
  const meta = CATEGORY_META[slug] || { name: slug, description: '', emoji: '🛒' }
  const products = await getCategoryProducts(slug, sort)

  return (
    <div className="container-custom py-8">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-brand-600">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/products" className="hover:text-brand-600">Products</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-800">{meta.name}</span>
      </nav>

      <div className="mb-8">
        <div className="flex items-center gap-4 mb-3">
          <span className="text-4xl">{meta.emoji}</span>
          <h1 className="section-title">{meta.name}</h1>
        </div>
        {meta.description && <p className="text-gray-600 max-w-2xl">{meta.description}</p>}
      </div>

      <div className="flex items-center justify-between mb-6 border-b pb-4">
        <span className="text-sm text-gray-500">{products.length} products</span>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-500">Sort by:</span>
          {[
            { label: 'Newest', value: '' },
            { label: 'Price ↑', value: 'price_asc' },
            { label: 'Price ↓', value: 'price_desc' },
          ].map(s => (
            <Link key={s.value}
              href={`/category/${slug}?sort=${s.value}`}
              className={`px-3 py-1.5 rounded-lg transition-colors ${(sort || '') === s.value ? 'bg-brand-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
              {s.label}
            </Link>
          ))}
        </div>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">🛒</div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No products in this category yet</h3>
          <p className="text-gray-500 mb-4">Check back soon or explore other categories.</p>
          <Link href="/products" className="btn-primary inline-flex">Browse All Products</Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}
