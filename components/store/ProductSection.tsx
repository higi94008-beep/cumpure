'use client'
import Link from 'next/link'
import Image from 'next/image'
import { ShoppingCart, Heart } from 'lucide-react'
import { useState } from 'react'
import { useCartStore } from '@/lib/cart-store'
import { formatPrice, getDiscountPercent } from '@/lib/utils'
import toast from 'react-hot-toast'
import type { Product } from '@/types/database'

interface ProductSectionProps {
  title: string
  subtitle?: string
  products: Product[]
  viewAllHref?: string
  variant?: 'scroll' | 'grid'
}

export default function ProductSection({ title, subtitle, products, viewAllHref = '/products', variant = 'scroll' }: ProductSectionProps) {
  return (
    <section>
      <div className="flex items-start justify-between mb-5">
        <div>
          <h2 className="section-title">{title}</h2>
          {subtitle && <p className="text-gray-500 text-sm mt-1">{subtitle}</p>}
        </div>
        <Link href={viewAllHref} className="text-brand-600 hover:text-brand-700 text-sm font-medium flex-shrink-0 mt-1">
          View All →
        </Link>
      </div>

      {variant === 'scroll' ? (
        <div className="flex gap-4 overflow-x-auto pb-3 scrollbar-hide -mx-4 px-4">
          {products.map(product => (
            <div key={product.id} className="flex-shrink-0 w-44 sm:w-48">
              <MiniProductCard product={product} />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {products.map(product => (
            <MiniProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  )
}

function MiniProductCard({ product }: { product: Product }) {
  const [wished, setWished] = useState(false)
  const addItem = useCartStore(s => s.addItem)
  const discount = getDiscountPercent(product.price, product.compare_price)
  const image = product.images?.[0] || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400'

  return (
    <Link href={`/products/${product.slug}`} className="product-card group block">
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        <Image src={image} alt={product.name} fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="200px" />
        {discount && (
          <span className="absolute top-1.5 left-1.5 bg-orange-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
            -{discount}%
          </span>
        )}
        <button onClick={(e) => { e.preventDefault(); setWished(!wished) }}
          className="absolute top-1.5 right-1.5 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
          <Heart className={`w-3 h-3 ${wished ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
        </button>
      </div>
      <div className="p-2.5">
        {product.brand && <p className="text-xs text-brand-600 font-medium">{product.brand}</p>}
        <p className="text-sm font-semibold text-gray-800 line-clamp-2 my-0.5">{product.name}</p>
        <p className="text-xs text-gray-400 mb-2">{product.unit}</p>
        <div className="flex items-center justify-between">
          <div>
            <span className="font-bold text-sm text-gray-900">{formatPrice(product.price)}</span>
            {product.compare_price && (
              <span className="text-xs text-gray-400 line-through ml-1">{formatPrice(product.compare_price)}</span>
            )}
          </div>
          <button onClick={(e) => { e.preventDefault(); addItem({ id: product.id, name: product.name, price: product.price, compare_price: product.compare_price, images: product.images, unit: product.unit, brand: product.brand }); toast.success('Added to cart!') }}
            className="w-7 h-7 bg-brand-600 hover:bg-brand-700 text-white rounded-full flex items-center justify-center transition-colors">
            <ShoppingCart className="w-3 h-3" />
          </button>
        </div>
      </div>
    </Link>
  )
}
