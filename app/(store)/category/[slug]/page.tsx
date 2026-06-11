'use client'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ShoppingCart, Heart, Star, Minus, Plus, Truck, Shield, RotateCcw } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useCartStore } from '@/lib/cart-store'
import { formatPrice, getDiscountPercent } from '@/lib/utils'
import toast from 'react-hot-toast'
import type { Product } from '@/types/database'

export default function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [activeImage, setActiveImage] = useState(0)
  const [wished, setWished] = useState(false)
  const addItem = useCartStore(s => s.addItem)

  useEffect(() => {
    params.then(({ slug }) => {
      supabase.from('products').select('*').eq('slug', slug).single().then(({ data }) => {
        setProduct(data)
        setLoading(false)
      })
    })
  }, [params])

  if (loading) return (
    <div className="container-custom py-12">
      <div className="animate-pulse">
        <div className="grid md:grid-cols-2 gap-12">
          <div className="aspect-square bg-gray-100 rounded-2xl" />
          <div className="space-y-4">
            <div className="h-8 bg-gray-100 rounded w-3/4" />
            <div className="h-6 bg-gray-100 rounded w-1/2" />
            <div className="h-24 bg-gray-100 rounded" />
          </div>
        </div>
      </div>
    </div>
  )

  if (!product) return (
    <div className="container-custom py-20 text-center">
      <div className="text-5xl mb-4">😔</div>
      <h2 className="text-xl font-bold mb-2">Product not found</h2>
      <Link href="/products" className="btn-primary inline-flex mt-4">Browse Products</Link>
    </div>
  )

  const images = product.images?.length > 0 ? product.images : ['https://images.unsplash.com/photo-1542838132-92c53300491e?w=600']
  const discount = getDiscountPercent(product.price, product.compare_price)

  return (
    <div className="container-custom py-8">
      <nav className="text-sm text-gray-500 mb-6 flex items-center gap-2">
        <Link href="/" className="hover:text-brand-600">Home</Link>
        <span>/</span>
        <Link href="/products" className="hover:text-brand-600">Products</Link>
        <span>/</span>
        <span className="text-gray-800 line-clamp-1">{product.name}</span>
      </nav>
      <div className="grid md:grid-cols-2 gap-10 lg:gap-16">
        <div>
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-50 mb-3">
            <Image src={images[activeImage]} alt={product.name} fill className="object-cover" priority />
            {discount && <span className="absolute top-4 left-4 bg-orange-500 text-white font-bold px-3 py-1 rounded-full">{discount}% OFF</span>}
          </div>
          {images.length > 1 && (
            <div className="flex gap-2">
              {images.map((img, i) => (
                <button key={i} onClick={() => setActiveImage(i)} className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 transition-colors ${i === activeImage ? 'border-brand-500' : 'border-transparent'}`}>
                  <Image src={img} alt="" fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
        <div>
          {product.brand && <p className="text-brand-600 font-semibold text-sm mb-1">{product.brand}</p>}
          <h1 className="font-display text-2xl md:text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
          <p className="text-gray-500 text-sm mb-1">{product.unit}</p>
          <div className="flex items-center gap-2 mb-4">
            <div className="flex">{[1,2,3,4,5].map(s => <Star key={s} className={`w-4 h-4 ${s <= 4 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`} />)}</div>
            <span className="text-sm text-gray-500">(24 reviews)</span>
          </div>
          <div className="flex items-center gap-3 mb-6">
            <span className="text-3xl font-bold text-gray-900">{formatPrice(product.price)}</span>
            {product.compare_price && <>
              <span className="text-xl text-gray-400 line-through">{formatPrice(product.compare_price)}</span>
              <span className="badge badge-orange">{discount}% off</span>
            </>}
          </div>
          {product.description && <p className="text-gray-600 text-sm leading-relaxed mb-6">{product.description}</p>}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
              <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="w-10 h-10 flex items-center justify-center hover:bg-gray-50"><Minus className="w-4 h-4" /></button>
              <span className="w-12 text-center font-semibold">{quantity}</span>
              <button onClick={() => setQuantity(q => q + 1)} className="w-10 h-10 flex items-center justify-center hover:bg-gray-50"><Plus className="w-4 h-4" /></button>
            </div>
            <button onClick={() => { addItem({ id: product.id, name: product.name, price: product.price, compare_price: product.compare_price, images: product.images, unit: product.unit, brand: product.brand }, quantity); toast.success('Added to cart!') }} disabled={product.stock_quantity === 0} className="flex-1 btn-primary py-3">
              <ShoppingCart className="w-4 h-4" />{product.stock_quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>
            <button onClick={() => setWished(!wished)} className={`w-12 h-12 border-2 rounded-xl flex items-center justify-center transition-colors ${wished ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-brand-300'}`}>
              <Heart className={`w-5 h-5 ${wished ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
            </button>
          </div>
          {product.tags?.length > 0 && <div className="flex flex-wrap gap-2 mb-6">{product.tags.map(tag => <span key={tag} className="badge badge-green">{tag}</span>)}</div>}
          <div className="space-y-3 border-t pt-6">
            {[{icon: Truck, title: 'Same Day Delivery', desc: 'Order before 2PM'},{icon: Shield, title: '100% Authentic', desc: 'Genuine products'},{icon: RotateCcw, title: 'Easy Returns', desc: '7-day return policy'}].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-start gap-3">
                <div className="w-8 h-8 bg-brand-50 rounded-lg flex items-center justify-center flex-shrink-0"><Icon className="w-4 h-4 text-brand-600" /></div>
                <div><p className="text-sm font-medium text-gray-900">{title}</p><p className="text-xs text-gray-500">{desc}</p></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
