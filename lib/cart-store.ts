'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Product } from '@/types/database'

export interface CartProduct {
  id: string
  name: string
  price: number
  compare_price: number | null
  images: string[]
  unit: string
  brand: string | null
}

interface CartEntry {
  product: CartProduct
  quantity: number
}

interface CartStore {
  items: CartEntry[]
  addItem: (product: CartProduct, quantity?: number) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  totalItems: () => number
  totalPrice: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product, quantity = 1) => {
        const existing = get().items.find(i => i.product.id === product.id)
        if (existing) {
          set({ items: get().items.map(i => i.product.id === product.id ? { ...i, quantity: i.quantity + quantity } : i) })
        } else {
          set({ items: [...get().items, { product, quantity }] })
        }
      },
      removeItem: (productId) => set({ items: get().items.filter(i => i.product.id !== productId) }),
      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId)
          return
        }
        set({ items: get().items.map(i => i.product.id === productId ? { ...i, quantity } : i) })
      },
      clearCart: () => set({ items: [] }),
      totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
      totalPrice: () => get().items.reduce((sum, i) => sum + i.product.price * i.quantity, 0),
    }),
    { name: 'natures-harvest-cart' }
  )
)
