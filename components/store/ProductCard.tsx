'use client'
import Image from 'next/image'
import Link from 'next/link'
import { ShoppingCart, Heart, Star } from 'lucide-react'
import { useState } from 'react'
import { useCartStore } from '@/lib/cart-store'
import { formatPrice, getDiscountPercent } from '@/lib/utils'
import toast from 'react-hot-toast'
import type { Product } from '@/types/database'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const [wished, setWished] = useState(false)
  const addItem = useCartStore(s => s.addItem)
  const discount = getDiscountPercent(product.price, product.compare_price)
  const image = product.images?.[0] || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400'

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      compare_price: product.compare_price,
      images: product.images,
      unit: product.unit,
      brand: product.brand,
    })
    toast.success(`${product.name} added to cart!`)
  }

  return (
    <Link href={`/products/${product.slug}`} className="product-card group block">
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        <Image
          src={image}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
        />
        {discount && (
          <span className="absolute top-2 left-2 bg-orange-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
            -{discount}%
          </span>
        )}
        {product.is_featured && (
          <span className="absolute top-2 right-8 bg-brand-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
            Featured
          </span>
        )}
        <button
          onClick={(e) => { e.preventDefault(); setWished(!wished) }}
          className="absolute top-2 right-2 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Heart className={`w-3.5 h-3.5 ${wished ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
        </button>
      </div>

      <div className="p-3">
        {product.brand && (
          <p className="text-xs text-brand-600 font-medium mb-0.5">{product.brand}</p>
        )}
        <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 mb-1 group-hover:text-brand-700 transition-colors">
          {product.name}
        </h3>
        <p className="text-xs text-gray-400 mb-2">{product.unit}</p>

        <div className="flex items-center justify-between">
          <div>
            <span className="font-bold text-gray-900">{formatPrice(product.price)}</span>
            {product.compare_price && (
              <span className="text-xs text-gray-400 line-through ml-1">{formatPrice(product.compare_price)}</span>
            )}
          </div>
          <button
            onClick={handleAddToCart}
            className="w-8 h-8 bg-brand-600 hover:bg-brand-700 text-white rounded-full flex items-center justify-center transition-colors shadow-sm"
            disabled={product.stock_quantity === 0}
          >
            <ShoppingCart className="w-3.5 h-3.5" />
          </button>
        </div>

        {product.stock_quantity === 0 && (
          <p className="text-xs text-red-500 mt-1">Out of stock</p>
        )}
      </div>
    </Link>
  )
}
