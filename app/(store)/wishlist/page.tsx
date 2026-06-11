'use client'
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Heart, ShoppingCart, Trash2 } from 'lucide-react'
import { useCartStore } from '@/lib/cart-store'
import { formatPrice } from '@/lib/utils'
import toast from 'react-hot-toast'

// Demo wishlist items (in production, store in Supabase for logged-in users)
const DEMO_WISHLIST = [
  { id: '1', name: 'Organic Alphonso Mangoes', brand: 'Nature\'s Best', price: 649, compare_price: 799, unit: '1 kg', images: ['https://images.unsplash.com/photo-1553279768-865429fa0078?w=400'], slug: 'organic-alphonso-mangoes', stock_quantity: 50, tags: ['organic'], is_active: true, is_featured: false, category_id: '1', description: '', created_at: '' },
  { id: '2', name: 'Baby Spinach', brand: 'Fresh Farms', price: 89, compare_price: 120, unit: '200g', images: ['https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400'], slug: 'baby-spinach', stock_quantity: 30, tags: ['organic', 'fresh'], is_active: true, is_featured: false, category_id: '2', description: '', created_at: '' },
  { id: '3', name: 'Greek Yogurt', brand: 'Epigamia', price: 199, compare_price: 240, unit: '400g', images: ['https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400'], slug: 'greek-yogurt', stock_quantity: 20, tags: ['probiotic'], is_active: true, is_featured: false, category_id: '3', description: '', created_at: '' },
]

export default function WishlistPage() {
  const [items, setItems] = useState(DEMO_WISHLIST)
  const addItem = useCartStore(s => s.addItem)

  const removeFromWishlist = (id: string) => {
    setItems(prev => prev.filter(i => i.id !== id))
    toast.success('Removed from wishlist')
  }

  const moveToCart = (item: typeof DEMO_WISHLIST[0]) => {
    addItem({ id: item.id, name: item.name, price: item.price, compare_price: item.compare_price, images: item.images, unit: item.unit, brand: item.brand }, 1)
    removeFromWishlist(item.id)
    toast.success('Moved to cart!')
  }

  return (
    <div className="container-custom py-10">
      <div className="flex items-center gap-3 mb-8">
        <Heart className="w-6 h-6 text-red-500 fill-red-500" />
        <h1 className="text-2xl font-display font-bold text-gray-900">My Wishlist</h1>
        <span className="text-sm text-gray-400">({items.length} items)</span>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-20">
          <Heart className="w-16 h-16 text-gray-200 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-700 mb-2">Your wishlist is empty</h2>
          <p className="text-gray-500 mb-6">Save your favourite products here to buy them later.</p>
          <Link href="/products" className="btn-primary inline-flex">Start Shopping</Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map(item => {
            const discount = item.compare_price ? Math.round(((item.compare_price - item.price) / item.compare_price) * 100) : null
            return (
              <div key={item.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group">
                <div className="relative aspect-square">
                  <Image src={item.images[0]} alt={item.name} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                  {discount && (
                    <span className="absolute top-2 left-2 bg-orange-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">{discount}% off</span>
                  )}
                  <button onClick={() => removeFromWishlist(item.id)}
                    className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full shadow flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50">
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </div>
                <div className="p-3">
                  <p className="text-xs text-brand-600 font-medium mb-0.5">{item.brand}</p>
                  <Link href={`/products/${item.slug}`}>
                    <h3 className="text-sm font-semibold text-gray-800 hover:text-brand-600 line-clamp-2 mb-1">{item.name}</h3>
                  </Link>
                  <p className="text-xs text-gray-400 mb-2">{item.unit}</p>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="font-bold text-gray-900">{formatPrice(item.price)}</span>
                    {item.compare_price && <span className="text-xs text-gray-400 line-through">{formatPrice(item.compare_price)}</span>}
                  </div>
                  <button onClick={() => moveToCart(item)}
                    className="w-full flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium py-2 rounded-xl transition-colors">
                    <ShoppingCart className="w-3.5 h-3.5" />
                    Move to Cart
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
