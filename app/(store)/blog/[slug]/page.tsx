import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Clock, User, Calendar } from 'lucide-react'

const POSTS: Record<string, {
  title: string; category: string; author: string; readTime: string; date: string;
  image: string; content: string;
}> = {
  'health-benefits-organic-produce': {
    title: 'Why Organic Produce Is Worth the Extra Rupees',
    category: 'Health & Wellness',
    author: 'Priya Sharma',
    readTime: '5 min read',
    date: 'June 2, 2026',
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=1200',
    content: `Organic farming has been practised for centuries across India, long before the term was coined. Today, choosing organic produce is one of the most impactful decisions a family can make for their long-term health.

**What Makes Produce Organic?**

Certified organic produce is grown without synthetic pesticides, chemical fertilisers, or genetically modified organisms. Farmers rely on crop rotation, composting, and natural pest control to maintain soil health and grow crops that are nutritionally dense.

**The Health Case**

Multiple peer-reviewed studies have found that organic fruits and vegetables contain higher levels of antioxidants — compounds that protect your cells from damage. One major meta-analysis found 19–69% higher concentrations of antioxidants in organic crops compared to conventionally grown alternatives.

Beyond antioxidants, organic produce has lower pesticide residues. While regulatory bodies set "safe" limits for pesticides, the long-term cumulative effect of exposure — especially in children — remains an area of active research. Choosing organic is a way to reduce that exposure.

**The Taste Difference**

Many home cooks notice a genuine difference in flavour with organic produce. This is partly because organic farming tends to prioritise flavour over yield and shelf-life, and partly because organic produce is often grown in healthier, mineral-rich soil.

**Making Organic Affordable**

Buying organic does not have to break the bank. Focus your organic spending on the "dirty dozen" — produce with the highest pesticide residues when grown conventionally, including strawberries, spinach, and apples. For thick-skinned produce like avocados and onions, conventional is often fine.

Shopping seasonally at Nature's Harvest ensures you get organic produce at its peak freshness and best price. Our sourcing partners harvest to order, which means fewer days between farm and fork.`,
  },
  'seasonal-eating-guide-summer': {
    title: 'Your Complete Guide to Summer Seasonal Eating',
    category: 'Food & Nutrition',
    author: 'Ankit Patel',
    readTime: '7 min read',
    date: 'May 28, 2026',
    image: 'https://images.unsplash.com/photo-1490885578174-acda8905c2c6?w=1200',
    content: `Summer in India brings an extraordinary bounty of produce. From Alphonso mangoes in Maharashtra to lychees in Bihar, the season is a celebration of colour, flavour, and nutrition.

**Why Eat Seasonally?**

Seasonal produce is picked at its nutritional peak. Out-of-season produce is often harvested early and ripened artificially, which affects both flavour and nutrient content. Seasonal eating also supports local farmers and reduces the carbon footprint of your food.

**Summer Stars**

Mangoes are the undisputed kings of Indian summer. Rich in vitamins A and C, they support immunity and skin health. Look for Alphonso from Ratnagiri, Kesar from Gujarat, and Dasheri from Uttar Pradesh — each with its own distinct flavour profile.

Watermelon and muskmelon are nature's hydration tools. Over 90% water, they help combat the dehydration that comes with summer heat while providing lycopene, a powerful antioxidant.

Raw mango (kaccha aam) is a summer staple in Indian cooking. Aam panna, the cooling drink made from raw mangoes, is loaded with vitamin C and has long been used to prevent heat stroke.

Jamun (Indian blackberry) appears in June and July. Its deep purple colour signals anthocyanins — antioxidants linked to heart and brain health. Jamun also has a low glycaemic index, making it a smart snack for those managing blood sugar.

**What to Cook**

Summer is the time for lighter preparations. Curd rice with raw mango, watermelon salads with chaat masala, mango lassi, and cold kokum sherbet are all seasonal, cooling, and deeply satisfying. Let the produce guide the menu rather than forcing heavy cooking onto delicate summer fruits.`,
  },
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = POSTS[params.slug]

  if (!post) {
    return (
      <div className="container-custom py-20 text-center">
        <h2 className="text-xl font-bold mb-4">Post not found</h2>
        <Link href="/blog" className="btn-primary inline-flex">Back to Blog</Link>
      </div>
    )
  }

  const paragraphs = post.content.split('\n\n')

  return (
    <div className="container-custom py-10 max-w-3xl">
      <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-brand-600 hover:text-brand-700 mb-6 font-medium">
        <ArrowLeft className="w-4 h-4" /> Back to Blog
      </Link>

      <span className="inline-block bg-brand-100 text-brand-700 text-xs font-bold px-3 py-1 rounded-full mb-4">{post.category}</span>
      <h1 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">{post.title}</h1>

      <div className="flex items-center gap-4 text-sm text-gray-500 mb-8 pb-8 border-b border-gray-100">
        <span className="flex items-center gap-1.5"><User className="w-4 h-4" />{post.author}</span>
        <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" />{post.date}</span>
        <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" />{post.readTime}</span>
      </div>

      <div className="relative rounded-2xl overflow-hidden aspect-video mb-8">
        <Image src={post.image} alt={post.title} fill className="object-cover" priority />
      </div>

      <div className="prose prose-gray max-w-none">
        {paragraphs.map((para, i) => {
          if (para.startsWith('**') && para.endsWith('**')) {
            return <h3 key={i} className="font-display text-xl font-bold text-gray-900 mt-8 mb-3">{para.slice(2, -2)}</h3>
          }
          return <p key={i} className="text-gray-600 leading-relaxed mb-4 text-base">{para}</p>
        })}
      </div>

      <div className="mt-12 pt-8 border-t border-gray-100">
        <h3 className="font-bold text-gray-900 mb-4">Continue Reading</h3>
        <Link href="/blog" className="btn-outline inline-flex">Browse All Articles</Link>
      </div>
    </div>
  )
}
