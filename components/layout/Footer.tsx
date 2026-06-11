import Link from 'next/link'
import { Mail, Phone, Youtube, Linkedin, Facebook, Instagram, Twitter } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-16 pb-8">
      <div className="container-custom">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-brand-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg font-display">N</span>
              </div>
              <div>
                <div className="text-white font-display font-bold text-lg">Nature's Harvest</div>
                <div className="text-brand-400 text-xs">Your Gourmet Destination</div>
              </div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed mb-5">
              Your trusted source for premium organic foods, artisan products, and gourmet delights. Farm fresh, delivered with love.
            </p>
            <div className="space-y-2 mb-5">
              <a href="mailto:cs@natures-harvest.com" className="flex items-center gap-2 text-sm text-gray-400 hover:text-brand-400 transition-colors">
                <Mail className="w-4 h-4 flex-shrink-0" />cs@natures-harvest.com
              </a>
              <a href="tel:+918800077745" className="flex items-center gap-2 text-sm text-gray-400 hover:text-brand-400 transition-colors">
                <Phone className="w-4 h-4 flex-shrink-0" />+91 88000 77745
              </a>
            </div>
            <div className="flex gap-3">
              {[
                { icon: Instagram, href: '#', label: 'Instagram' },
                { icon: Facebook, href: '#', label: 'Facebook' },
                { icon: Twitter, href: '#', label: 'Twitter' },
                { icon: Youtube, href: '#', label: 'YouTube' },
              ].map(({ icon: Icon, href, label }) => (
                <a key={label} href={href} aria-label={label}
                  className="w-9 h-9 bg-gray-700 hover:bg-brand-600 rounded-full flex items-center justify-center transition-colors">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-white font-semibold mb-4">Shop</h4>
            <ul className="space-y-2">
              {[
                { label: 'Fresh Produce', href: '/category/fresh-produce' },
                { label: 'Dairy & Cheese', href: '/category/dairy-cheese' },
                { label: 'Tea & Coffee', href: '/category/tea-coffee' },
                { label: 'Chocolates', href: '/category/chocolates' },
                { label: 'Organic Range', href: '/category/organic' },
                { label: 'Bakery & Breads', href: '/category/bakery' },
                { label: 'Gourmet Imports', href: '/category/gourmet' },
              ].map(l => (
                <li key={l.href}><Link href={l.href} className="text-sm text-gray-400 hover:text-brand-400 transition-colors">{l.label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Information */}
          <div>
            <h4 className="text-white font-semibold mb-4">Information</h4>
            <ul className="space-y-2">
              {[
                { label: 'About Us', href: '/about-us' },
                { label: 'Blog', href: '/blog' },
                { label: 'Store Locator', href: '/store-locator' },
                { label: 'Rewards Program', href: '/rewards' },
                { label: 'Contact Us', href: '/contact-us' },
                { label: 'FAQ', href: '/faq' },
              ].map(l => (
                <li key={l.href}><Link href={l.href} className="text-sm text-gray-400 hover:text-brand-400 transition-colors">{l.label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              {[
                { label: 'Privacy Policy', href: '/privacy-policy' },
                { label: 'Terms of Use', href: '/terms-of-use' },
                { label: 'Wishlist', href: '/wishlist' },
                { label: 'My Account', href: '/account' },
                { label: 'Track Order', href: '/account' },
              ].map(l => (
                <li key={l.href}><Link href={l.href} className="text-sm text-gray-400 hover:text-brand-400 transition-colors">{l.label}</Link></li>
              ))}
            </ul>
          </div>
        </div>

        {/* Payment icons row */}
        <div className="border-t border-gray-700 pt-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500">© {new Date().getFullYear()} Nature's Harvest. All rights reserved.</p>
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <span className="border border-gray-700 rounded px-2 py-0.5">VISA</span>
              <span className="border border-gray-700 rounded px-2 py-0.5">MC</span>
              <span className="border border-gray-700 rounded px-2 py-0.5">UPI</span>
              <span className="border border-gray-700 rounded px-2 py-0.5">NET BANKING</span>
              <span className="border border-gray-700 rounded px-2 py-0.5">COD</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
