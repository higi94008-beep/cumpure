import Link from 'next/link'
import { Star, Gift, ShoppingBag, Award, Zap, Crown } from 'lucide-react'

const TIERS = [
  { name: 'Fresh', icon: '🌱', points: '0 – 999', color: 'from-green-100 to-green-200', perks: ['1 point per ₹50 spent', 'Birthday bonus', 'Early sale access'] },
  { name: 'Gourmet', icon: '⭐', points: '1,000 – 4,999', color: 'from-blue-100 to-blue-200', perks: ['1.5x points multiplier', 'Free delivery on ₹400+', 'Exclusive recipes', 'Tasting event invites'] },
  { name: 'Premium', icon: '💎', points: '5,000+', color: 'from-purple-100 to-purple-200', perks: ['2x points multiplier', 'Always free delivery', 'Personal shopper', 'VIP product launches'] },
]

const HOW_IT_WORKS = [
  { icon: ShoppingBag, step: '01', title: 'Shop & Earn', desc: 'Earn reward points on every purchase. 1 point for every ₹50 spent.' },
  { icon: Star, step: '02', title: 'Climb Tiers', desc: 'Accumulate points to unlock Gourmet and Premium status with better perks.' },
  { icon: Gift, step: '03', title: 'Redeem Rewards', desc: 'Use your points for discounts, free products, and exclusive experiences.' },
]

export default function RewardsPage() {
  return (
    <div className="pb-16">
      {/* Hero */}
      <div className="bg-gradient-to-br from-brand-800 via-brand-700 to-green-600 text-white py-20">
        <div className="container-custom text-center">
          <div className="flex justify-center mb-4">
            <Crown className="w-14 h-14 text-yellow-300" />
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">Harvest Rewards</h1>
          <p className="text-brand-100 text-lg max-w-2xl mx-auto mb-8">
            Every rupee you spend brings you closer to exclusive perks, free products, and gourmet experiences.
          </p>
          <Link href="/account" className="inline-flex items-center gap-2 bg-white text-brand-700 font-bold px-8 py-3.5 rounded-full hover:bg-brand-50 transition-colors shadow-lg">
            <Zap className="w-5 h-5" />
            Join Rewards
          </Link>
        </div>
      </div>

      {/* How it works */}
      <div className="container-custom py-16">
        <h2 className="section-title text-center mb-12">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {HOW_IT_WORKS.map(({ icon: Icon, step, title, desc }) => (
            <div key={step} className="text-center">
              <div className="relative w-16 h-16 mx-auto mb-4">
                <div className="w-16 h-16 bg-brand-50 rounded-2xl flex items-center justify-center">
                  <Icon className="w-8 h-8 text-brand-600" />
                </div>
                <span className="absolute -top-2 -right-2 w-7 h-7 bg-brand-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {step}
                </span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
              <p className="text-gray-500 text-sm">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tiers */}
      <div className="bg-gray-50 py-16">
        <div className="container-custom">
          <h2 className="section-title text-center mb-12">Membership Tiers</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {TIERS.map(tier => (
              <div key={tier.name} className={`rounded-2xl bg-gradient-to-br ${tier.color} p-6 border border-white/50`}>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">{tier.icon}</span>
                  <div>
                    <h3 className="font-display text-xl font-bold text-gray-900">{tier.name}</h3>
                    <p className="text-sm text-gray-600">{tier.points} points</p>
                  </div>
                </div>
                <ul className="space-y-2">
                  {tier.perks.map(perk => (
                    <li key={perk} className="flex items-start gap-2 text-sm text-gray-700">
                      <span className="text-brand-600 mt-0.5">✓</span>
                      {perk}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="container-custom py-12 text-center">
        <h2 className="section-title mb-3">Start Earning Today</h2>
        <p className="text-gray-600 mb-6">Log in or create an account to start collecting points on your next order.</p>
        <div className="flex gap-4 justify-center">
          <Link href="/account" className="btn-primary">Create Account</Link>
          <Link href="/products" className="btn-outline">Shop Now</Link>
        </div>
      </div>
    </div>
  )
}
