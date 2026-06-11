// Sample data for seeding / demo use
export const CATEGORIES = [
  { name: 'Fresh Produce', slug: 'fresh-produce', description: 'Farm-fresh fruits, vegetables and herbs', image_url: 'https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=400', sort_order: 1 },
  { name: 'Dairy & Cheese', slug: 'dairy-cheese', description: 'Artisanal cheeses and fresh dairy', image_url: 'https://images.unsplash.com/photo-1559561853-08451507cbe7?w=400', sort_order: 2 },
  { name: 'Butchery & Seafood', slug: 'butchery-seafood', description: 'Premium meats and fresh seafood', image_url: 'https://images.unsplash.com/photo-1565514158740-064f34bd5cfd?w=400', sort_order: 3 },
  { name: 'Bakery', slug: 'bakery', description: 'Artisanal breads and baked goods', image_url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400', sort_order: 4 },
  { name: 'Chocolates & Confectionery', slug: 'chocolates', description: 'Premium chocolates and sweets', image_url: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=400', sort_order: 5 },
  { name: 'Tea, Coffee & Infusions', slug: 'tea-coffee', description: 'Single origin teas and specialty coffees', image_url: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400', sort_order: 6 },
  { name: 'Snacks & Treats', slug: 'snacks', description: 'Gourmet snacking delights', image_url: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400', sort_order: 7 },
  { name: 'Cold Beverages', slug: 'cold-beverages', description: 'Premium cold drinks and mixers', image_url: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400', sort_order: 8 },
  { name: 'Organic & Natural', slug: 'organic', description: 'Certified organic products', image_url: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400', sort_order: 9 },
  { name: 'Gluten Free', slug: 'gluten-free', description: 'Gluten-free essentials', image_url: 'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e?w=400', sort_order: 10 },
]

export const SAMPLE_PRODUCTS = [
  { name: 'Organic Avocados', price: 249, compare_price: 299, brand: 'Farm Fresh', unit: '2 pcs', category: 'fresh-produce', image: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=400', tags: ['organic', 'fresh'], is_featured: true },
  { name: 'Baby Spinach', price: 89, compare_price: 109, brand: 'Greens Co', unit: '200g', category: 'fresh-produce', image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400', tags: ['organic', 'fresh', 'salad'] },
  { name: 'Heirloom Tomatoes', price: 149, compare_price: null, brand: 'Farm Direct', unit: '500g', category: 'fresh-produce', image: 'https://images.unsplash.com/photo-1546094096-0df4bcabd337?w=400', tags: ['fresh', 'local'] },
  { name: 'French Brie', price: 599, compare_price: 699, brand: 'Le Gourmet', unit: '200g', category: 'dairy-cheese', image: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=400', tags: ['cheese', 'imported'], is_featured: true },
  { name: 'Greek Yogurt', price: 159, compare_price: null, brand: 'Epigamia', unit: '400g', category: 'dairy-cheese', image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400', tags: ['dairy', 'protein'] },
  { name: 'Sourdough Loaf', price: 299, compare_price: 349, brand: 'Artisan Bakehouse', unit: '500g', category: 'bakery', image: 'https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=400', tags: ['bread', 'artisan'], is_featured: true },
  { name: 'Croissants (4 pcs)', price: 249, compare_price: null, brand: 'Le Petit', unit: '4 pcs', category: 'bakery', image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400', tags: ['bakery', 'french'] },
  { name: 'Valrhona Dark Chocolate', price: 449, compare_price: 525, brand: 'Valrhona', unit: '70g', category: 'chocolates', image: 'https://images.unsplash.com/photo-1481391243133-f96216dcb5d2?w=400', tags: ['chocolate', 'dark', 'premium'], is_featured: true },
  { name: 'Assorted Truffles', price: 699, compare_price: 799, brand: 'Maison Cailler', unit: '150g', category: 'chocolates', image: 'https://images.unsplash.com/photo-1548907040-4baa42d10919?w=400', tags: ['chocolate', 'truffle'] },
  { name: 'Darjeeling First Flush', price: 599, compare_price: 699, brand: 'Golden Tips', unit: '100g', category: 'tea-coffee', image: 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=400', tags: ['tea', 'darjeeling'], is_featured: true },
  { name: 'Single Origin Ethiopian Coffee', price: 799, compare_price: null, brand: 'Blue Tokai', unit: '250g', category: 'tea-coffee', image: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=400', tags: ['coffee', 'single-origin'] },
  { name: 'Matcha Green Tea Powder', price: 349, compare_price: 429, brand: 'Encha', unit: '50g', category: 'tea-coffee', image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400', tags: ['matcha', 'tea', 'organic'] },
  { name: 'Smoked Salmon', price: 899, compare_price: 999, brand: 'Arctic King', unit: '150g', category: 'butchery-seafood', image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400', tags: ['seafood', 'smoked'], is_featured: true },
  { name: 'Premium Mixed Nuts', price: 499, compare_price: 599, brand: 'Happilo', unit: '400g', category: 'snacks', image: 'https://images.unsplash.com/photo-1508061253366-f7da158b6d46?w=400', tags: ['nuts', 'healthy', 'snack'] },
  { name: 'Kombucha Original', price: 149, compare_price: 169, brand: 'Raw Pressery', unit: '330ml', category: 'cold-beverages', image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400', tags: ['kombucha', 'probiotic'] },
  { name: 'Organic Quinoa', price: 299, compare_price: 349, brand: 'True Elements', unit: '500g', category: 'organic', image: 'https://images.unsplash.com/photo-1618759287629-ca263a8bf0dd?w=400', tags: ['quinoa', 'organic', 'grain'] },
  { name: 'Gluten Free Pasta', price: 249, compare_price: null, brand: 'Barilla', unit: '400g', category: 'gluten-free', image: 'https://images.unsplash.com/photo-1551892374-ecf8754cf8b0?w=400', tags: ['pasta', 'gluten-free'] },
  { name: 'Cold Brew Coffee', price: 199, compare_price: 229, brand: 'Third Wave', unit: '250ml', category: 'cold-beverages', image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400', tags: ['coffee', 'cold brew'] },
]
