import { supabase } from '@/lib/supabase'
import { formatPrice } from '@/lib/utils'
import { ShoppingCart, Package, Users, DollarSign, TrendingUp, ArrowUpRight, ArrowDownRight, Clock } from 'lucide-react'
import Link from 'next/link'

async function getStats() {
  const [ordersRes, productsRes, customersRes] = await Promise.all([
    supabase.from('orders').select('total, status, created_at').order('created_at', { ascending: false }),
    supabase.from('products').select('id, is_active').eq('is_active', true),
    supabase.from('profiles').select('id').eq('role', 'customer'),
  ])

  const orders = ordersRes.data || []
  const revenue = orders.filter(o => o.status !== 'cancelled').reduce((sum, o) => sum + o.total, 0)
  const pending = orders.filter(o => o.status === 'pending').length

  return {
    revenue,
    orderCount: orders.length,
    productCount: productsRes.data?.length || 0,
    customerCount: customersRes.data?.length || 0,
    recentOrders: orders.slice(0, 5),
    pending,
  }
}

export default async function AdminDashboard() {
  const stats = await getStats()

  const CARDS = [
    { title: 'Total Revenue', value: formatPrice(stats.revenue), icon: DollarSign, color: 'bg-brand-50 text-brand-600', change: '+12%', up: true },
    { title: 'Total Orders', value: stats.orderCount.toString(), icon: ShoppingCart, color: 'bg-blue-50 text-blue-600', change: '+8%', up: true },
    { title: 'Active Products', value: stats.productCount.toString(), icon: Package, color: 'bg-purple-50 text-purple-600', change: '+3', up: true },
    { title: 'Customers', value: stats.customerCount.toString(), icon: Users, color: 'bg-orange-50 text-orange-600', change: '+5%', up: true },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Dashboard Overview</h2>
        <p className="text-gray-500 text-sm mt-1">Welcome back! Here's what's happening today.</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {CARDS.map(({ title, value, icon: Icon, color, change, up }) => (
          <div key={title} className="bg-white rounded-2xl p-5 border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className={`text-xs font-medium flex items-center gap-0.5 ${up ? 'text-green-600' : 'text-red-500'}`}>
                {up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {change}
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            <p className="text-sm text-gray-500 mt-0.5">{title}</p>
          </div>
        ))}
      </div>

      {/* Pending orders alert */}
      {stats.pending > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-orange-500" />
            <p className="text-sm font-medium text-orange-800">{stats.pending} order{stats.pending > 1 ? 's' : ''} awaiting confirmation</p>
          </div>
          <Link href="/admin/orders?status=pending" className="text-sm font-semibold text-orange-700 hover:text-orange-800">View →</Link>
        </div>
      )}

      {/* Recent orders */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-50">
          <h3 className="font-bold text-gray-900">Recent Orders</h3>
          <Link href="/admin/orders" className="text-sm text-brand-600 hover:text-brand-700">View All →</Link>
        </div>
        {stats.recentOrders.length === 0 ? (
          <div className="text-center py-12 text-gray-400">No orders yet</div>
        ) : (
          <div className="divide-y divide-gray-50">
            {stats.recentOrders.map((order: any) => (
              <div key={order.id} className="flex items-center justify-between px-6 py-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-xs font-bold text-gray-600">
                    #{(order.id || '').slice(-4)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">{new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</p>
                    <p className="text-xs text-gray-400">{formatPrice(order.total)}</p>
                  </div>
                </div>
                <span className={`badge text-xs ${order.status === 'delivered' ? 'badge-green' : order.status === 'cancelled' ? 'bg-red-100 text-red-700' : 'badge-orange'}`}>
                  {order.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Add Product', href: '/admin/products/new', emoji: '➕' },
          { label: 'Add Category', href: '/admin/categories', emoji: '🏷️' },
          { label: 'View Orders', href: '/admin/orders', emoji: '📦' },
          { label: 'View Store', href: '/', emoji: '🛒' },
        ].map(a => (
          <Link key={a.label} href={a.href} className="bg-white border border-gray-100 rounded-2xl p-4 text-center hover:border-brand-200 hover:bg-brand-50 transition-all group">
            <span className="text-2xl block mb-1">{a.emoji}</span>
            <span className="text-sm font-medium text-gray-700 group-hover:text-brand-700">{a.label}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
