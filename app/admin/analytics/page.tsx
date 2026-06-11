import { supabase } from '@/lib/supabase'
import { formatPrice } from '@/lib/utils'
import { TrendingUp, ShoppingCart, Users, Package } from 'lucide-react'

async function getAnalyticsData() {
  const [ordersRes, customersRes, productsRes] = await Promise.all([
    supabase.from('orders').select('total, status, created_at'),
    supabase.from('profiles').select('id, created_at').eq('role', 'customer'),
    supabase.from('products').select('id, name, is_active'),
  ])

  const orders = ordersRes.data || []
  const completedOrders = orders.filter(o => o.status !== 'cancelled')
  const revenue = completedOrders.reduce((sum, o) => sum + o.total, 0)
  const avgOrder = completedOrders.length > 0 ? revenue / completedOrders.length : 0

  // Monthly revenue (last 6 months)
  const monthlyData: Record<string, number> = {}
  completedOrders.forEach(o => {
    const month = new Date(o.created_at).toLocaleDateString('en-IN', { month: 'short', year: '2-digit' })
    monthlyData[month] = (monthlyData[month] || 0) + o.total
  })

  // Status breakdown
  const statusCount: Record<string, number> = {}
  orders.forEach(o => { statusCount[o.status] = (statusCount[o.status] || 0) + 1 })

  return {
    revenue,
    orderCount: orders.length,
    customerCount: customersRes.data?.length || 0,
    productCount: productsRes.data?.filter(p => p.is_active).length || 0,
    avgOrder,
    monthlyData,
    statusCount,
  }
}

export default async function AnalyticsPage() {
  const data = await getAnalyticsData()

  const STATUS_COLORS: Record<string, string> = {
    pending: 'bg-yellow-400',
    confirmed: 'bg-blue-400',
    processing: 'bg-purple-400',
    shipped: 'bg-indigo-400',
    delivered: 'bg-green-500',
    cancelled: 'bg-red-400',
  }

  const totalOrders = data.orderCount || 1
  const maxRevenue = Math.max(...Object.values(data.monthlyData), 1)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Analytics</h2>
        <p className="text-gray-500 text-sm mt-1">Business performance overview</p>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: 'Total Revenue', value: formatPrice(data.revenue), icon: TrendingUp, color: 'bg-brand-50 text-brand-600' },
          { title: 'Total Orders', value: data.orderCount.toString(), icon: ShoppingCart, color: 'bg-blue-50 text-blue-600' },
          { title: 'Customers', value: data.customerCount.toString(), icon: Users, color: 'bg-orange-50 text-orange-600' },
          { title: 'Active Products', value: data.productCount.toString(), icon: Package, color: 'bg-purple-50 text-purple-600' },
        ].map(({ title, value, icon: Icon, color }) => (
          <div key={title} className="bg-white rounded-2xl p-5 border border-gray-100">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color} mb-3`}>
              <Icon className="w-5 h-5" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            <p className="text-sm text-gray-500 mt-0.5">{title}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Revenue chart */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h3 className="font-bold text-gray-900 mb-6">Monthly Revenue</h3>
          {Object.keys(data.monthlyData).length === 0 ? (
            <div className="h-40 flex items-center justify-center text-gray-400 text-sm">No revenue data yet</div>
          ) : (
            <div className="space-y-3">
              {Object.entries(data.monthlyData).slice(-6).map(([month, rev]) => (
                <div key={month} className="flex items-center gap-3">
                  <span className="text-xs text-gray-500 w-16 flex-shrink-0">{month}</span>
                  <div className="flex-1 h-6 bg-gray-50 rounded-lg overflow-hidden">
                    <div className="h-full bg-brand-500 rounded-lg transition-all" style={{ width: `${(rev / maxRevenue) * 100}%` }} />
                  </div>
                  <span className="text-xs font-medium text-gray-700 w-20 text-right">{formatPrice(rev)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Order status breakdown */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h3 className="font-bold text-gray-900 mb-6">Order Status Breakdown</h3>
          {Object.keys(data.statusCount).length === 0 ? (
            <div className="h-40 flex items-center justify-center text-gray-400 text-sm">No orders yet</div>
          ) : (
            <div className="space-y-3">
              {Object.entries(data.statusCount).map(([status, count]) => (
                <div key={status} className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full flex-shrink-0 ${STATUS_COLORS[status] || 'bg-gray-400'}`} />
                  <span className="text-sm text-gray-600 capitalize flex-1">{status}</span>
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${STATUS_COLORS[status] || 'bg-gray-400'}`} style={{ width: `${(count / totalOrders) * 100}%` }} />
                  </div>
                  <span className="text-xs font-medium text-gray-700 w-8 text-right">{count}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Average order value */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h3 className="font-bold text-gray-900 mb-2">Average Order Value</h3>
        <p className="text-4xl font-bold text-brand-600">{formatPrice(Math.round(data.avgOrder))}</p>
        <p className="text-gray-500 text-sm mt-1">Across {data.orderCount} total orders</p>
      </div>
    </div>
  )
}
