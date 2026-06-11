'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { User, Mail, Lock, LogOut, Package, Heart, Star } from 'lucide-react'
import toast from 'react-hot-toast'
import type { User as SupabaseUser } from '@supabase/supabase-js'
import Link from 'next/link'
import { formatPrice } from '@/lib/utils'

export default function AccountPage() {
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [orders, setOrders] = useState<any[]>([])

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setUser(data.session?.user || null))
    supabase.auth.onAuthStateChange((_, session) => setUser(session?.user || null))
  }, [])

  useEffect(() => {
    if (user) {
      supabase.from('orders').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(5)
        .then(({ data }) => setOrders(data || []))
    }
  }, [user])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) toast.error(error.message)
    else toast.success('Welcome back!')
    setLoading(false)
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.auth.signUp({ email, password, options: { data: { full_name: name } } })
    if (error) toast.error(error.message)
    else toast.success('Account created! Check your email to verify.')
    setLoading(false)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    toast.success('Logged out')
  }

  if (user) {
    return (
      <div className="container-custom py-8 max-w-4xl">
        <h1 className="text-2xl font-bold mb-8">My Account</h1>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <div className="bg-white border border-gray-100 rounded-2xl p-6 text-center">
              <div className="w-16 h-16 bg-brand-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <User className="w-8 h-8 text-brand-600" />
              </div>
              <h2 className="font-bold text-gray-900">{user.user_metadata?.full_name || 'Member'}</h2>
              <p className="text-sm text-gray-500 mb-4">{user.email}</p>
              <div className="bg-brand-50 rounded-xl p-3 mb-4">
                <p className="text-xs text-gray-500">Reward Points</p>
                <p className="text-2xl font-bold text-brand-600">0 pts</p>
              </div>
              <button onClick={handleLogout} className="flex items-center gap-2 text-sm text-red-500 hover:text-red-600 mx-auto">
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>

            <nav className="mt-4 space-y-1">
              {[
                { icon: Package, label: 'My Orders', href: '#orders' },
                { icon: Heart, label: 'Wishlist', href: '/wishlist' },
                { icon: Star, label: 'Rewards', href: '/rewards' },
              ].map(({ icon: Icon, label, href }) => (
                <Link key={label} href={href} className="flex items-center gap-3 px-4 py-3 text-sm text-gray-600 hover:text-brand-600 hover:bg-brand-50 rounded-xl transition-colors">
                  <Icon className="w-4 h-4" />
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="md:col-span-2">
            <div id="orders">
              <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Package className="w-5 h-5 text-brand-600" /> Recent Orders
              </h2>
              {orders.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-2xl">
                  <Package className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 mb-4">No orders yet</p>
                  <Link href="/products" className="btn-primary inline-flex text-sm">Start Shopping</Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {orders.map(order => (
                    <div key={order.id} className="bg-white border border-gray-100 rounded-2xl p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-gray-800">Order #{order.id.slice(-8).toUpperCase()}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-gray-900">{formatPrice(order.total)}</p>
                          <span className={`badge text-xs mt-1 ${order.status === 'delivered' ? 'badge-green' : 'badge-orange'}`}>{order.status}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container-custom py-12 flex justify-center">
      <div className="w-full max-w-md">
        <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm">
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-brand-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <User className="w-7 h-7 text-brand-600" />
            </div>
            <h1 className="font-display text-2xl font-bold text-gray-900">
              {mode === 'login' ? 'Welcome Back' : 'Create Account'}
            </h1>
          </div>

          <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
            <button onClick={() => setMode('login')} className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${mode === 'login' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'}`}>Login</button>
            <button onClick={() => setMode('signup')} className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${mode === 'signup' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'}`}>Sign Up</button>
          </div>

          <form onSubmit={mode === 'login' ? handleLogin : handleSignup} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type="text" required value={name} onChange={e => setName(e.target.value)} className="input-field pl-10" placeholder="Your full name" />
                </div>
              </div>
            )}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="input-field pl-10" placeholder="your@email.com" />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="password" required value={password} onChange={e => setPassword(e.target.value)} className="input-field pl-10" placeholder="••••••••" minLength={6} />
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full py-3.5">
              {loading ? 'Please wait...' : mode === 'login' ? 'Login' : 'Create Account'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
