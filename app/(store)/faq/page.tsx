'use client'
import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

const FAQS = [
  {
    category: 'Orders & Delivery',
    items: [
      { q: 'What are the delivery timings?', a: 'We deliver from 8 AM to 10 PM, 7 days a week. For same-day delivery, orders must be placed before 2 PM.' },
      { q: 'Do you offer same-day delivery?', a: 'Yes! Orders placed before 2 PM are eligible for same-day delivery in select areas. You can check delivery availability by entering your pin code at checkout.' },
      { q: 'What is the minimum order value for free delivery?', a: 'Orders above ₹500 qualify for free delivery. A delivery charge of ₹40 applies to orders below this amount.' },
      { q: 'Can I track my order?', a: 'Yes, once your order is dispatched you will receive an SMS and email with a tracking link. You can also track your order from the My Orders section in your account.' },
    ]
  },
  {
    category: 'Products & Quality',
    items: [
      { q: 'Are your organic products certified?', a: 'Yes, all products labelled as organic carry valid certification from recognised bodies such as APEDA, IMO, or equivalent. Certification details are available on the product page.' },
      { q: 'How fresh is the produce?', a: 'We source directly from farms and deliver within 24–48 hours of harvest for most fresh produce. Each product page shows the expected freshness window.' },
      { q: 'Do you carry imported products?', a: 'Yes, our Gourmet & International section includes imported cheeses, deli meats, condiments, chocolates, and specialty ingredients from Europe, the US, and Southeast Asia.' },
    ]
  },
  {
    category: 'Returns & Refunds',
    items: [
      { q: 'What is your return policy?', a: 'We offer a 7-day return policy for non-perishable items. For fresh produce and dairy, please contact us within 24 hours of delivery if you are not satisfied.' },
      { q: 'How do I request a refund?', a: 'Contact our support team via WhatsApp, email, or phone. Provide your order number and a photo of the issue. Refunds are processed within 5–7 business days.' },
      { q: 'What if I receive a damaged product?', a: 'We apologise for the inconvenience. Please take a photo and contact us within 24 hours. We will arrange a replacement or full refund immediately.' },
    ]
  },
  {
    category: 'Account & Rewards',
    items: [
      { q: 'How do I earn Harvest Reward points?', a: 'You earn 1 point for every ₹10 spent. Points can be redeemed at a rate of 100 points = ₹10 off your next order. Points are credited after successful delivery.' },
      { q: 'Do my reward points expire?', a: 'Reward points expire 12 months from the date they were earned. You will receive a reminder email 30 days before expiry.' },
      { q: 'Can I use multiple payment methods in one order?', a: 'Currently, you can use reward points in combination with one other payment method (card, UPI, or net banking) per order.' },
    ]
  },
]

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-gray-100 last:border-0">
      <button className="w-full text-left py-4 flex items-start justify-between gap-4" onClick={() => setOpen(!open)}>
        <span className="font-medium text-gray-800 text-sm">{q}</span>
        {open ? <ChevronUp className="w-4 h-4 text-brand-500 flex-shrink-0 mt-0.5" /> : <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />}
      </button>
      {open && <p className="text-gray-600 text-sm pb-4 leading-relaxed">{a}</p>}
    </div>
  )
}

export default function FAQPage() {
  return (
    <div className="container-custom py-12 max-w-3xl">
      <div className="text-center mb-10">
        <h1 className="font-display text-3xl font-bold text-gray-900">Frequently Asked Questions</h1>
        <p className="text-gray-500 mt-2">Can not find your answer? <a href="/contact-us" className="text-brand-600 font-medium hover:underline">Contact our team</a></p>
      </div>

      <div className="space-y-8">
        {FAQS.map(section => (
          <div key={section.category} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="bg-brand-50 px-6 py-3 border-b border-brand-100">
              <h2 className="font-bold text-brand-800 text-sm">{section.category}</h2>
            </div>
            <div className="px-6">
              {section.items.map(item => <FAQItem key={item.q} q={item.q} a={item.a} />)}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
