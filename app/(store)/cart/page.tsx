'use client'
import { useCartStore } from '@/lib/cart-store'
import { formatPrice } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from 'lucide-react'

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalItems, totalPrice } = useCartStore()
  const subtotal = totalPrice()
  const delivery = subtotal > 500 ? 0 : 49
  const total = subtotal + delivery

  if (items.length === 0) {
    return (
      <div className="container-custom py-20 text-center">
        <ShoppingBag className="w-16 h-16 text-gray-200 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-700 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-6">Looks like you haven't added anything yet!</p>
        <Link href="/products" className="btn-primary inline-flex">Start Shopping</Link>
      </div>
    )
  }

  return (
    <div className="container-custom py-8">
      <div className="flex items-center gap-3 mb-8">
        <Link href="/products" className="text-brand-600 hover:text-brand-700">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-bold">Your Cart ({totalItems()} items)</h1>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 space-y-3">
          {items.map(({ product, quantity }) => (
            <div key={product.id} className="flex items-center gap-4 bg-white border border-gray-100 rounded-2xl p-4">
              <div className="relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden bg-gray-50">
                <Image
                  src={product.images?.[0] || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=200'}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-brand-600 font-medium">{product.brand}</p>
                <p className="font-semibold text-gray-800 truncate">{product.name}</p>
                <p className="text-xs text-gray-400">{product.unit}</p>
                <p className="font-bold text-gray-900 mt-1">{formatPrice(product.price)}</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                  <button onClick={() => updateQuantity(product.id, quantity - 1)}
                    className="w-8 h-8 flex items-center justify-center hover:bg-gray-50">
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="w-8 text-center text-sm font-semibold">{quantity}</span>
                  <button onClick={() => updateQuantity(product.id, quantity + 1)}
                    className="w-8 h-8 flex items-center justify-center hover:bg-gray-50">
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
                <button onClick={() => removeItem(product.id)}
                  className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div>
          <div className="bg-white border border-gray-100 rounded-2xl p-6 sticky top-24">
            <h2 className="font-bold text-lg mb-4">Order Summary</h2>
            <div className="space-y-3 text-sm mb-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Delivery</span>
                <span className={delivery === 0 ? 'text-brand-600 font-medium' : 'font-medium'}>
                  {delivery === 0 ? 'FREE' : formatPrice(delivery)}
                </span>
              </div>
              {delivery > 0 && (
                <p className="text-xs text-gray-400">Add {formatPrice(500 - subtotal)} more for free delivery</p>
              )}
            </div>
            <div className="border-t pt-4 mb-6">
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>
            <Link href="/checkout" className="btn-primary w-full py-4 text-base">
              Proceed to Checkout
            </Link>
            <Link href="/products" className="btn-ghost w-full mt-3 text-sm">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
