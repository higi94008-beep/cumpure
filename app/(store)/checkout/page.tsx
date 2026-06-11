'use client'
import { useState } from 'react'
import { useCartStore } from '@/lib/cart-store'
import { formatPrice } from '@/lib/utils'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { CheckCircle2, MapPin, CreditCard, Package } from 'lucide-react'
import toast from 'react-hot-toast'

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCartStore()
  const router = useRouter()
  const [step, setStep] = useState<'address' | 'payment' | 'success'>('address')
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: '', email: '', phone: '', address: '', city: '', pincode: '', state: 'Maharashtra'
  })
  const [payment, setPayment] = useState('cod')

  const subtotal = totalPrice()
  const delivery = subtotal > 500 ? 0 : 49
  const total = subtotal + delivery

  const handlePlaceOrder = async () => {
    setLoading(true)
    try {
      const { error } = await supabase.from('orders').insert({
        status: 'pending',
        total,
        subtotal,
        discount: 0,
        delivery_fee: delivery,
        items: items.map(i => ({ product_id: i.product.id, name: i.product.name, price: i.product.price, quantity: i.quantity, image: i.product.images?.[0] || '' })),
        shipping_address: form,
        payment_method: payment,
        payment_status: 'pending',
      })
      if (error) throw error
      clearCart()
      setStep('success')
    } catch (err) {
      toast.error('Failed to place order. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0 && step !== 'success') {
    return (
      <div className="container-custom py-20 text-center">
        <h2 className="text-xl font-bold mb-4">Your cart is empty</h2>
        <Link href="/products" className="btn-primary inline-flex">Shop Now</Link>
      </div>
    )
  }

  if (step === 'success') {
    return (
      <div className="container-custom py-20 text-center max-w-md mx-auto">
        <CheckCircle2 className="w-20 h-20 text-brand-500 mx-auto mb-6" />
        <h1 className="font-display text-3xl font-bold text-gray-900 mb-3">Order Placed!</h1>
        <p className="text-gray-600 mb-6">Thank you for shopping with Nature's Harvest. You'll receive a confirmation shortly.</p>
        <div className="bg-brand-50 rounded-2xl p-6 text-left mb-6">
          <p className="text-sm text-gray-600">Order Total: <strong>{formatPrice(total)}</strong></p>
          <p className="text-sm text-gray-600 mt-1">Payment: <strong>{payment === 'cod' ? 'Cash on Delivery' : 'Online Payment'}</strong></p>
        </div>
        <Link href="/" className="btn-primary inline-flex">Back to Home</Link>
      </div>
    )
  }

  return (
    <div className="container-custom py-8 max-w-5xl">
      <h1 className="text-2xl font-bold mb-8">Checkout</h1>

      {/* Steps */}
      <div className="flex items-center gap-4 mb-8">
        {[
          { key: 'address', label: 'Delivery', icon: MapPin },
          { key: 'payment', label: 'Payment', icon: CreditCard },
        ].map(({ key, label, icon: Icon }, i) => (
          <div key={key} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step === key ? 'bg-brand-600 text-white' : 'bg-gray-100 text-gray-400'}`}>
              {i + 1}
            </div>
            <span className={`text-sm font-medium ${step === key ? 'text-brand-600' : 'text-gray-400'}`}>{label}</span>
            {i < 1 && <div className="w-12 h-px bg-gray-200 mx-2" />}
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {step === 'address' && (
            <div className="bg-white border border-gray-100 rounded-2xl p-6">
              <h2 className="font-semibold text-lg mb-6 flex items-center gap-2"><MapPin className="w-5 h-5 text-brand-600" />Delivery Address</h2>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { key: 'name', label: 'Full Name', placeholder: 'Your name', span: 1 },
                  { key: 'email', label: 'Email', placeholder: 'your@email.com', span: 1 },
                  { key: 'phone', label: 'Phone', placeholder: '+91 XXXXX XXXXX', span: 1 },
                  { key: 'pincode', label: 'Pincode', placeholder: '400001', span: 1 },
                  { key: 'address', label: 'Address', placeholder: 'Street, locality', span: 2 },
                  { key: 'city', label: 'City', placeholder: 'Mumbai', span: 1 },
                  { key: 'state', label: 'State', placeholder: 'Maharashtra', span: 1 },
                ].map(field => (
                  <div key={field.key} className={field.span === 2 ? 'col-span-2' : ''}>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">{field.label}</label>
                    <input
                      type="text"
                      placeholder={field.placeholder}
                      value={form[field.key as keyof typeof form]}
                      onChange={e => setForm({ ...form, [field.key]: e.target.value })}
                      className="input-field"
                    />
                  </div>
                ))}
              </div>
              <button onClick={() => setStep('payment')} className="btn-primary mt-6 w-full py-3.5">
                Continue to Payment
              </button>
            </div>
          )}

          {step === 'payment' && (
            <div className="bg-white border border-gray-100 rounded-2xl p-6">
              <h2 className="font-semibold text-lg mb-6 flex items-center gap-2"><CreditCard className="w-5 h-5 text-brand-600" />Payment Method</h2>
              <div className="space-y-3">
                {[
                  { value: 'cod', label: 'Cash on Delivery', desc: 'Pay when your order arrives' },
                  { value: 'upi', label: 'UPI Payment', desc: 'Pay via PhonePe, GPay, Paytm' },
                  { value: 'card', label: 'Credit / Debit Card', desc: 'Visa, Mastercard, Rupay' },
                ].map(opt => (
                  <label key={opt.value} className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-colors ${payment === opt.value ? 'border-brand-500 bg-brand-50' : 'border-gray-200 hover:border-gray-300'}`}>
                    <input type="radio" name="payment" value={opt.value} checked={payment === opt.value} onChange={e => setPayment(e.target.value)} className="accent-brand-600" />
                    <div>
                      <p className="font-medium text-gray-800">{opt.label}</p>
                      <p className="text-sm text-gray-500">{opt.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
              <button onClick={handlePlaceOrder} disabled={loading} className="btn-primary mt-6 w-full py-3.5 text-base">
                {loading ? 'Placing Order...' : `Place Order · ${formatPrice(total)}`}
              </button>
              <button onClick={() => setStep('address')} className="btn-ghost w-full mt-2 text-sm">
                ← Edit Address
              </button>
            </div>
          )}
        </div>

        {/* Order summary */}
        <div>
          <div className="bg-white border border-gray-100 rounded-2xl p-6">
            <h2 className="font-bold mb-4 flex items-center gap-2"><Package className="w-4 h-4" />Order Summary</h2>
            <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
              {items.map(({ product, quantity }) => (
                <div key={product.id} className="flex items-center gap-3 text-sm">
                  <span className="text-gray-500 bg-gray-100 rounded px-1.5 py-0.5 text-xs font-bold">{quantity}×</span>
                  <span className="flex-1 text-gray-700 text-xs line-clamp-1">{product.name}</span>
                  <span className="font-medium text-xs">{formatPrice(product.price * quantity)}</span>
                </div>
              ))}
            </div>
            <div className="border-t pt-4 space-y-2 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span><span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery</span>
                <span className={delivery === 0 ? 'text-brand-600 font-medium' : ''}>{delivery === 0 ? 'FREE' : formatPrice(delivery)}</span>
              </div>
              <div className="flex justify-between font-bold text-base pt-2 border-t">
                <span>Total</span><span>{formatPrice(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
