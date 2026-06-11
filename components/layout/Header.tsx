'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ShoppingCart, Search, User, Menu, X, ChevronDown, Heart, MapPin, Star } from 'lucide-react'
import { useCartStore } from '@/lib/cart-store'
import { cn } from '@/lib/utils'

const NAV_CATEGORIES = [
  { label: 'Fresh Produce', href: '/category/fresh-produce' },
  { label: 'Dairy & Cheese', href: '/category/dairy-cheese' },
  { label: 'Bakery', href: '/category/bakery' },
  { label: 'Chocolates', href: '/category/chocolates' },
  { label: 'Tea & Coffee', href: '/category/tea-coffee' },
  { label: 'Snacks', href: '/category/snacks' },
  { label: 'Organic', href: '/category/organic' },
  { label: 'Gluten Free', href: '/category/gluten-free' },
  { label: 'Seafood', href: '/category/butchery-seafood' },
]

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [scrolled, setScrolled] = useState(false)
  const totalItems = useCartStore(s => s.totalItems())
  const router = useRouter()

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery)}`)
      setSearchOpen(false)
    }
  }

  return (
    <header className={cn('sticky top-0 z-50 bg-white transition-shadow duration-300', scrolled && 'shadow-md')}>
      {/* Top bar */}
      <div className="bg-brand-700 text-white text-xs py-2">
        <div className="container-custom flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="w-3 h-3" />
            <span>Delivering across Mumbai, Delhi, Bangalore & more</span>
          </div>
          <div className="hidden sm:flex items-center gap-4">
            <Link href="/rewards" className="flex items-center gap-1 hover:text-green-200 transition-colors">
              <Star className="w-3 h-3" />
              <span>Rewards</span>
            </Link>
            <span>|</span>
            <Link href="/account" className="hover:text-green-200 transition-colors">Login</Link>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="container-custom py-3">
        <div className="flex items-center gap-4">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-brand-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg font-display">N</span>
              </div>
              <div className="hidden sm:block">
                <div className="text-brand-700 font-display font-bold text-lg leading-tight">Nature's</div>
                <div className="text-brand-500 font-display text-sm -mt-1">Harvest</div>
              </div>
            </div>
          </Link>

          {/* Search bar */}
          <div className="flex-1 max-w-2xl">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search for organic fruits, artisan cheese, gourmet coffee..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full border-2 border-brand-200 focus:border-brand-500 rounded-full py-2.5 pl-5 pr-12 text-sm outline-none transition-colors"
              />
              <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-600">
                <Search className="w-5 h-5" />
              </button>
            </form>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Link href="/account" className="hidden md:flex btn-ghost text-sm">
              <User className="w-5 h-5" />
              <span className="hidden lg:inline">Account</span>
            </Link>
            <Link href="/wishlist" className="hidden md:flex btn-ghost text-sm">
              <Heart className="w-5 h-5" />
            </Link>
            <Link href="/cart" className="relative flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white px-4 py-2.5 rounded-full transition-colors text-sm font-medium">
              <ShoppingCart className="w-5 h-5" />
              <span className="hidden sm:inline">Cart</span>
              {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-orange-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {totalItems > 9 ? '9+' : totalItems}
                </span>
              )}
            </Link>
            <button className="md:hidden p-2" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Category nav */}
      <nav className="hidden md:block border-t border-gray-100 bg-white">
        <div className="container-custom">
          <ul className="flex items-center gap-1 overflow-x-auto py-2 scrollbar-hide">
            <li>
              <Link href="/products" className="flex items-center gap-1 text-sm font-semibold text-brand-700 hover:text-brand-600 px-3 py-1.5 rounded-lg hover:bg-brand-50 whitespace-nowrap transition-colors">
                All Products
              </Link>
            </li>
            {NAV_CATEGORIES.map(cat => (
              <li key={cat.href}>
                <Link href={cat.href} className="text-sm text-gray-600 hover:text-brand-600 px-3 py-1.5 rounded-lg hover:bg-brand-50 whitespace-nowrap transition-colors block">
                  {cat.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t bg-white shadow-lg">
          <div className="container-custom py-4 flex flex-col gap-2">
            {NAV_CATEGORIES.map(cat => (
              <Link key={cat.href} href={cat.href} onClick={() => setMobileOpen(false)}
                className="text-sm text-gray-700 hover:text-brand-600 py-2 border-b border-gray-50">
                {cat.label}
              </Link>
            ))}
            <Link href="/account" onClick={() => setMobileOpen(false)} className="text-sm text-gray-700 py-2">My Account</Link>
            <Link href="/rewards" onClick={() => setMobileOpen(false)} className="text-sm text-gray-700 py-2">Rewards</Link>
          </div>
        </div>
      )}
    </header>
  )
}
