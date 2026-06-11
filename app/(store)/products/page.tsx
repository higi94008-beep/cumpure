import ProductCard from '@/components/store/ProductCard'
import { supabase } from '@/lib/supabase'
import { Filter, SlidersHorizontal } from 'lucide-react'
import Link from 'next/link'

interface PageProps {
  searchParams: { search?: string; category?: string; sort?: string; featured?: string; page?: string }
}

async function getProducts(searchParams: PageProps['searchParams']) {
  let query = supabase.from('products').select('*').eq('is_active', true)

  if (searchParams.search) {
    query = query.ilike('name', `%${searchParams.search}%`)
  }
  if (searchParams.featured === 'true') {
    query = query.eq('is_featured', true)
  }
  if (searchParams.sort === 'price_asc') {
    query = query.order('price', { ascending: true })
  } else if (searchParams.sort === 'price_desc') {
    query = query.order('price', { ascending: false })
  } else {
    query = query.order('created_at', { ascending: false })
  }

  const { data } = await query.limit(60)
  return data || []
}

const CATEGORIES = [
  { name: 'All', slug: '' },
  { name: 'Fresh Produce', slug: 'fresh-produce' },
  { name: 'Dairy & Cheese', slug: 'dairy-cheese' },
  { name: 'Bakery', slug: 'bakery' },
  { name: 'Chocolates', slug: 'chocolates' },
  { name: 'Tea & Coffee', slug: 'tea-coffee' },
  { name: 'Snacks', slug: 'snacks' },
  { name: 'Organic', slug: 'organic' },
  { name: 'Gluten Free', slug: 'gluten-free' },
]

export default async function ProductsPage({ searchParams }: PageProps) {
  const products = await getProducts(searchParams)
  const title = searchParams.search
    ? `Search results for "${searchParams.search}"`
    : searchParams.featured === 'true' ? 'Curated Picks' : 'All Products'

  return (
    <div className="container-custom py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-brand-600">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-800">{title}</span>
      </nav>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar filters */}
        <aside className="lg:w-56 flex-shrink-0">
          <div className="sticky top-24">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4" />
              Filters
            </h3>
            <div className="space-y-1">
              {CATEGORIES.map(cat => (
                <Link
                  key={cat.slug}
                  href={cat.slug ? `/category/${cat.slug}` : '/products'}
                  className="block text-sm text-gray-600 hover:text-brand-600 hover:bg-brand-50 px-3 py-2 rounded-lg transition-colors"
                >
                  {cat.name}
                </Link>
              ))}
            </div>

            <div className="mt-6">
              <h4 className="font-semibold text-gray-900 mb-3 text-sm">Sort By</h4>
              <div className="space-y-1">
                {[
                  { label: 'Newest', value: '' },
                  { label: 'Price: Low to High', value: 'price_asc' },
                  { label: 'Price: High to Low', value: 'price_desc' },
                ].map(s => (
                  <Link key={s.value}
                    href={`/products?sort=${s.value}${searchParams.search ? `&search=${searchParams.search}` : ''}`}
                    className={`block text-sm px-3 py-2 rounded-lg transition-colors ${searchParams.sort === s.value || (!searchParams.sort && !s.value) ? 'bg-brand-50 text-brand-700 font-medium' : 'text-gray-600 hover:text-brand-600 hover:bg-brand-50'}`}>
                    {s.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Products */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-xl font-bold text-gray-900">{title}</h1>
            <span className="text-sm text-gray-500">{products.length} products</span>
          </div>

          {products.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">No products found</h3>
              <p className="text-gray-500 mb-4">Try adjusting your search or browse our categories.</p>
              <Link href="/products" className="btn-primary inline-flex">Browse All Products</Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
