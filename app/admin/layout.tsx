'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LayoutDashboard, Package, ShoppingCart, Users, Tag, BarChart3, Settings, LogOut, Menu, X, Store, Bell } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { href: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/products', icon: Package, label: 'Products' },
  { href: '/admin/orders', icon: ShoppingCart, label: 'Orders' },
  { href: '/admin/customers', icon: Users, label: 'Customers' },
  { href: '/admin/categories', icon: Tag, label: 'Categories' },
  { href: '/admin/analytics', icon: BarChart3, label: 'Analytics' },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user || null)
      setLoading(false)
      if (!data.session?.user) router.push('/admin/login')
    })
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-spin w-8 h-8 border-4 border-brand-600 border-t-transparent rounded-full" />
    </div>
  )

  if (!user) return null

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar overlay (mobile) */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={cn(
        'fixed lg:static inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-100 flex flex-col transition-transform duration-300 lg:translate-x-0',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        {/* Logo */}
        <div className="h-16 flex items-center gap-3 px-6 border-b border-gray-100">
          <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">N</span>
          </div>
          <div>
            <p className="font-bold text-gray-900 text-sm">Nature's Harvest</p>
            <p className="text-xs text-gray-400">Admin Panel</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1">
          {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
            const active = href === '/admin' ? pathname === '/admin' : pathname.startsWith(href)
            return (
              <Link key={href} href={href} onClick={() => setSidebarOpen(false)}
                className={cn('admin-nav-item', active && 'active')}>
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            )
          })}
        </nav>

        {/* User */}
        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-gray-50 mb-2">
            <div className="w-8 h-8 bg-brand-100 rounded-full flex items-center justify-center text-xs font-bold text-brand-600">
              {user.email?.[0]?.toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-gray-800 truncate">{user.email}</p>
              <p className="text-xs text-gray-400">Admin</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Link href="/" className="flex-1 flex items-center gap-2 text-xs text-gray-500 hover:text-brand-600 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors">
              <Store className="w-3 h-3" /> View Store
            </Link>
            <button onClick={handleLogout} className="flex-1 flex items-center gap-2 text-xs text-gray-500 hover:text-red-500 px-3 py-2 rounded-lg hover:bg-red-50 transition-colors">
              <LogOut className="w-3 h-3" /> Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 flex-shrink-0">
          <button className="lg:hidden" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <Menu className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="font-semibold text-gray-800 capitalize">
            {NAV_ITEMS.find(n => n.href === '/admin' ? pathname === '/admin' : pathname.startsWith(n.href))?.label || 'Admin'}
          </h1>
          <div className="flex items-center gap-3">
            <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <Bell className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
