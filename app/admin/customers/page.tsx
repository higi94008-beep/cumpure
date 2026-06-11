import { supabase } from '@/lib/supabase'
import { Users, Mail } from 'lucide-react'

async function getCustomers() {
  const { data } = await supabase.from('profiles').select('*').eq('role', 'customer').order('created_at', { ascending: false })
  return data || []
}

export default async function AdminCustomersPage() {
  const customers = await getCustomers()

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900">Customers</h2>
        <p className="text-gray-500 text-sm">{customers.length} registered customers</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {customers.length === 0 ? (
          <div className="text-center py-20">
            <Users className="w-10 h-10 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400">No customers yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
                <tr>
                  <th className="text-left px-4 py-3">Customer</th>
                  <th className="text-left px-4 py-3">Email</th>
                  <th className="text-left px-4 py-3">Phone</th>
                  <th className="text-left px-4 py-3">Reward Points</th>
                  <th className="text-left px-4 py-3">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {customers.map((c: any) => (
                  <tr key={c.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-brand-100 rounded-full flex items-center justify-center text-xs font-bold text-brand-600">
                          {c.full_name?.[0]?.toUpperCase() || c.email?.[0]?.toUpperCase() || '?'}
                        </div>
                        <span className="font-medium text-gray-800">{c.full_name || 'No name'}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{c.email}</td>
                    <td className="px-4 py-3 text-gray-500">{c.phone || '—'}</td>
                    <td className="px-4 py-3">
                      <span className="badge badge-green">{c.rewards_points || 0} pts</span>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{new Date(c.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
