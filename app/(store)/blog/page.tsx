import Link from 'next/link'
import Image from 'next/image'
import { Clock, User, ArrowRight } from 'lucide-react'

const BLOG_POSTS = [
  {
    slug: 'health-benefits-organic-produce',
    title: "Why Organic Produce Is Worth the Extra Rupees",
    excerpt: "Discover the science behind organic farming and how choosing organic can transform your family's health over time.",
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800',
    category: 'Health & Wellness',
    author: 'Priya Sharma',
    readTime: '5 min read',
    date: 'June 2, 2026',
  },
  {
    slug: 'seasonal-eating-guide-summer',
    title: 'Your Complete Guide to Summer Seasonal Eating',
    excerpt: 'Learn which fruits and vegetables are at their peak in summer and how to make the most of seasonal bounty.',
    image: 'https://images.unsplash.com/photo-1490885578174-acda8905c2c6?w=800',
    category: 'Food & Nutrition',
    author: 'Ankit Patel',
    readTime: '7 min read',
    date: 'May 28, 2026',
  },
  {
    slug: 'how-to-store-fresh-produce',
    title: 'The Right Way to Store Fresh Produce at Home',
    excerpt: 'Expert tips to keep your fruits and vegetables fresh longer, saving money and reducing food waste.',
    image: 'https://images.unsplash.com/photo-1506484381205-f7945653044d?w=800',
    category: 'Kitchen Tips',
    author: 'Meena Iyer',
    readTime: '4 min read',
    date: 'May 20, 2026',
  },
  {
    slug: 'superfoods-everyone-should-know',
    title: '10 Indian Superfoods You Should Add to Your Diet',
    excerpt: 'From moringa to amla, India has a treasure trove of nutrient-dense foods used for centuries.',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800',
    category: 'Health & Wellness',
    author: 'Dr. Sunita Rao',
    readTime: '8 min read',
    date: 'May 15, 2026',
  },
  {
    slug: 'guide-to-artisan-cheese',
    title: "A Beginner's Guide to Artisan Cheese in India",
    excerpt: "India's artisan cheese scene is booming. Here's how to explore and pair local cheeses like a pro.",
    image: 'https://images.unsplash.com/photo-1452195100486-9cc805987862?w=800',
    category: 'Gourmet',
    author: 'Rohan Verma',
    readTime: '6 min read',
    date: 'May 10, 2026',
  },
  {
    slug: 'sustainable-grocery-shopping',
    title: 'How to Make Your Grocery Shopping More Sustainable',
    excerpt: 'Small changes in your shopping habits can make a big difference for the planet. Here is where to start.',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800',
    category: 'Sustainability',
    author: 'Priya Sharma',
    readTime: '5 min read',
    date: 'May 5, 2026',
  },
]

export default function BlogPage() {
  const featured = BLOG_POSTS[0]
  const rest = BLOG_POSTS.slice(1)

  return (
    <div className="container-custom py-10">
      <div className="text-center mb-10">
        <span className="text-brand-600 text-sm font-semibold uppercase tracking-widest">Our Journal</span>
        <h1 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mt-2">Fresh Reads</h1>
        <p className="text-gray-500 mt-2 max-w-xl mx-auto">Tips, guides, and stories about good food, healthy living, and sustainable choices.</p>
      </div>

      {/* Featured post */}
      <div className="rounded-3xl overflow-hidden bg-white border border-gray-100 shadow-sm mb-10 grid md:grid-cols-2 hover:shadow-md transition-shadow">
        <div className="relative aspect-video md:aspect-auto min-h-64">
          <Image src={featured.image} alt={featured.title} fill className="object-cover" />
          <span className="absolute top-4 left-4 bg-brand-600 text-white text-xs font-bold px-3 py-1 rounded-full">{featured.category}</span>
        </div>
        <div className="p-8 flex flex-col justify-center">
          <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
            <span className="flex items-center gap-1"><User className="w-3 h-3" />{featured.author}</span>
            <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{featured.readTime}</span>
          </div>
          <h2 className="font-display text-2xl font-bold text-gray-900 mb-3">{featured.title}</h2>
          <p className="text-gray-600 text-sm leading-relaxed mb-5">{featured.excerpt}</p>
          <Link href={`/blog/${featured.slug}`} className="inline-flex items-center gap-2 text-brand-600 font-semibold text-sm hover:text-brand-700">
            Read More <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rest.map(post => (
          <div key={post.slug} className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group">
            <div className="relative aspect-video">
              <Image src={post.image} alt={post.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
              <span className="absolute top-3 left-3 bg-white text-brand-700 text-xs font-bold px-2 py-0.5 rounded-full shadow">{post.category}</span>
            </div>
            <div className="p-5">
              <div className="flex items-center gap-3 text-xs text-gray-400 mb-2">
                <span>{post.author}</span>
                <span>{post.readTime}</span>
                <span>{post.date}</span>
              </div>
              <h3 className="font-display font-bold text-gray-900 mb-2 group-hover:text-brand-600 transition-colors">{post.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 mb-4">{post.excerpt}</p>
              <Link href={`/blog/${post.slug}`} className="text-brand-600 text-sm font-semibold hover:text-brand-700 flex items-center gap-1">
                Read More <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
