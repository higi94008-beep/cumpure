'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { formatPrice } from '@/lib/utils'
import { Eye, X, ChevronDown } from 'lucide-react'
import type { Order } from '@/types/database'

const STATUS_OPTIONS = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'] as const
const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  processing: 'bg-purple-100 text-purple-800',
  shipped: 'bg-indigo-100 text-indigo-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from('orders').select('*').order('created_at', { ascending: false })
      setOrders(data || [])
      setLoading(false)
    }
    load()
  }, [])

  const filtered = orders.filter(o => !filter || o.status === filter)

  const updateStatus = async (id: string, status: string) => {
    await supabase.from('orders').update({ status }).eq('id', id)
    setOrders(orders.map(o => o.id === id ? { ...o, status: status as any } : o))
    if (selectedOrder?.id === id) setSelectedOrder({ ...selectedOrder, status: status as any })
  }

  const totalRevenue = orders.filter(o => o.status !== 'cancelled').reduce((s, o) => s + o.total, 0)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Orders</h2>
          <p className="text-gray-500 text-sm">{orders.length} total · {formatPrice(totalRevenue)} revenue</p>
        </div>
      </div>

      {/* Status filters */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
        <button onClick={() => setFilter('')} className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors flex-shrink-0 ${!filter ? 'bg-brand-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-brand-300'}`}>
          All ({orders.length})
        </button>
        {STATUS_OPTIONS.map(s => {
          const count = orders.filter(o => o.status === s).length
          return (
            <button key={s} onClick={() => setFilter(s)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors flex-shrink-0 capitalize ${filter === s ? 'bg-brand-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-brand-300'}`}>
              {s} ({count})
            </button>
          )
        })}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin w-8 h-8 border-4 border-brand-600 border-t-transparent rounded-full" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
                <tr>
                  <th className="text-left px-4 py-3">Order</th>
                  <th className="text-left px-4 py-3">Date</th>
                  <th className="text-left px-4 py-3">Items</th>
                  <th className="text-left px-4 py-3">Total</th>
                  <th className="text-left px-4 py-3">Payment</th>
                  <th className="text-left px-4 py-3">Status</th>
                  <th className="text-right px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.length === 0 ? (
                  <tr><td colSpan={7} className="text-center py-12 text-gray-400">No orders found</td></tr>
                ) : filtered.map(order => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-gray-600">#{order.id.slice(-8).toUpperCase()}</td>
                    <td className="px-4 py-3 text-gray-600 text-xs">{new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                    <td className="px-4 py-3 text-gray-600">{(order.items as any[])?.length || 0} items</td>
                    <td className="px-4 py-3 font-semibold text-gray-900">{formatPrice(order.total)}</td>
                    <td className="px-4 py-3">
                      <span className={`badge text-xs ${order.payment_status === 'paid' ? 'badge-green' : 'badge-orange'}`}>
                        {order.payment_status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="relative inline-block">
                        <select value={order.status} onChange={e => updateStatus(order.id, e.target.value)}
                          className={`appearance-none text-xs font-medium px-2 py-1 pr-6 rounded-full border-0 cursor-pointer ${STATUS_COLORS[order.status]} focus:outline-none`}>
                          {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                        <ChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none" />
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => setSelectedOrder(order)} className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors">
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order detail modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <div>
                <h3 className="font-bold text-lg">Order Details</h3>
                <p className="text-xs text-gray-500 font-mono">#{selectedOrder.id.slice(-8).toUpperCase()}</p>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-5">
              {/* Status */}
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Status</p>
                <div className="flex gap-2 flex-wrap">
                  {STATUS_OPTIONS.map(s => (
                    <button key={s} onClick={() => updateStatus(selectedOrder.id, s)}
                      className={`px-3 py-1 rounded-full text-xs font-medium capitalize transition-colors ${selectedOrder.status === s ? STATUS_COLORS[s] : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Items */}
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Items</p>
                <div className="space-y-2">
                  {(selectedOrder.items as any[])?.map((item, i) => (
                    <div key={i} className="flex items-center justify-between text-sm bg-gray-50 p-3 rounded-xl">
                      <span className="text-gray-700">{item.quantity}× {item.name}</span>
                      <span className="font-medium">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Totals */}
              <div className="border-t pt-4 space-y-2 text-sm">
                <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>{formatPrice(selectedOrder.subtotal)}</span></div>
                <div className="flex justify-between text-gray-600"><span>Delivery</span><span>{selectedOrder.delivery_fee === 0 ? 'FREE' : formatPrice(selectedOrder.delivery_fee)}</span></div>
                <div className="flex justify-between font-bold text-base pt-2 border-t"><span>Total</span><span>{formatPrice(selectedOrder.total)}</span></div>
              </div>

              {/* Address */}
              {selectedOrder.shipping_address && (
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Delivery Address</p>
                  <div className="bg-gray-50 p-3 rounded-xl text-sm text-gray-700">
                    {Object.values(selectedOrder.shipping_address as object).filter(Boolean).join(', ')}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
