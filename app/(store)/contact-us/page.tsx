'use client'
import { useState } from 'react'
import { Mail, Phone, MapPin, Clock, Send, MessageCircle } from 'lucide-react'
import toast from 'react-hot-toast'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await new Promise(r => setTimeout(r, 1000))
    toast.success("Message sent! We'll get back to you within 24 hours.")
    setForm({ name: '', email: '', subject: '', message: '' })
    setLoading(false)
  }

  return (
    <div className="pb-16">
      {/* Hero */}
      <div className="bg-brand-700 text-white py-16">
        <div className="container-custom text-center">
          <h1 className="font-display text-4xl font-bold mb-3">Contact Us</h1>
          <p className="text-brand-200">We'd love to hear from you. Our team is always happy to help.</p>
        </div>
      </div>

      <div className="container-custom py-12">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact info */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-6">Get in Touch</h2>
            <div className="space-y-5">
              {[
                { icon: Mail, title: 'Email Us', value: 'cs@natures-harvest.com', href: 'mailto:cs@natures-harvest.com' },
                { icon: Phone, title: 'Call Us', value: '+91 88000 77745', href: 'tel:+918800077745' },
                { icon: MapPin, title: 'Our Office', value: 'Nature\'s Harvest HQ, Bandra West, Mumbai, Maharashtra 400050' },
                { icon: Clock, title: 'Working Hours', value: 'Monday – Saturday: 9am to 6pm IST' },
              ].map(({ icon: Icon, title, value, href }) => (
                <div key={title} className="flex gap-4">
                  <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-brand-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-700">{title}</p>
                    {href ? (
                      <a href={href} className="text-sm text-brand-600 hover:underline">{value}</a>
                    ) : (
                      <p className="text-sm text-gray-600">{value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 bg-brand-50 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <MessageCircle className="w-5 h-5 text-brand-600" />
                <h3 className="font-semibold text-gray-800">WhatsApp Support</h3>
              </div>
              <p className="text-sm text-gray-600 mb-3">For quick help with your orders, reach us on WhatsApp.</p>
              <a href="https://wa.me/918800077745"
                className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-medium px-5 py-2.5 rounded-xl text-sm transition-colors">
                Chat on WhatsApp
              </a>
            </div>
          </div>

          {/* Contact form */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-6">Send a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Name *</label>
                  <input type="text" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="input-field" placeholder="Your name" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Email *</label>
                  <input type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="input-field" placeholder="your@email.com" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Subject</label>
                <input type="text" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} className="input-field" placeholder="How can we help?" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Message *</label>
                <textarea required rows={5} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} className="input-field resize-none" placeholder="Tell us more about your query..." />
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full py-3.5">
                <Send className="w-4 h-4" />
                {loading ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
