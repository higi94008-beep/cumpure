# 🌿 Nature's Harvest — Full-Stack E-Commerce

A premium organic & gourmet grocery e-commerce platform built with Next.js 14, Supabase, and Tailwind CSS. Inspired by naturesbasket.co.in.

## ✅ Pages & Features

### Store (Customer-Facing)
| Route | Description |
|-------|-------------|
| `/` | Homepage with hero banner, categories, product sections |
| `/products` | Full product listing with filters & search |
| `/products/[slug]` | Product detail with gallery, cart, wishlist |
| `/category/[slug]` | Category page with sorted products |
| `/cart` | Cart with quantity controls, order summary |
| `/checkout` | 3-step checkout (address → payment → success) |
| `/account` | Login/signup + order history |
| `/wishlist` | Saved products |
| `/blog` | Blog listing |
| `/blog/[slug]` | Blog post detail |
| `/about-us` | Brand story, values, stats |
| `/contact-us` | Contact form + WhatsApp |
| `/rewards` | Harvest Rewards program (3 tiers) |
| `/store-locator` | Store locations across India |
| `/faq` | Accordion FAQ by category |
| `/privacy-policy` | Privacy policy |
| `/terms-of-use` | Terms of use |

### Admin Panel (`/admin`)
| Route | Description |
|-------|-------------|
| `/admin` | Dashboard with revenue, orders, quick stats |
| `/admin/products` | Full product CRUD (add/edit/delete) |
| `/admin/orders` | Orders with status management |
| `/admin/categories` | Category CRUD |
| `/admin/customers` | Customer list |
| `/admin/analytics` | Revenue charts, order breakdown |

## 🚀 Deployment Guide

### Step 1 — Supabase Setup

1. Go to [supabase.com](https://supabase.com) → Create new project
2. In SQL Editor, run the full contents of `supabase/migration.sql`
3. Go to **Project Settings → API** and copy:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon / public key` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role key` → `SUPABASE_SERVICE_ROLE_KEY`

### Step 2 — Create Admin User

In Supabase Dashboard → **Authentication → Users** → Add user → enter email + password.

Then in SQL Editor:
```sql
UPDATE profiles SET role = 'admin' WHERE email = 'your-admin@email.com';
```

### Step 3 — Local Development

```bash
cp .env.local.example .env.local
# Fill in your Supabase credentials in .env.local

npm install
npm run dev
# Open http://localhost:3000
```

### Step 4 — Deploy to Vercel

```bash
npm i -g vercel
vercel
```

When prompted, add these environment variables:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

Or connect your GitHub repo directly at [vercel.com](https://vercel.com) and set env vars in project settings.

## 🗄️ Database Schema

| Table | Description |
|-------|-------------|
| `profiles` | User accounts (extends Supabase auth.users) |
| `categories` | Product categories with slug |
| `products` | Products with images, variants, tags |
| `orders` | Customer orders with items (JSONB) |
| `cart_items` | Persistent cart for logged-in users |
| `banners` | Homepage promotional banners |

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: Supabase (PostgreSQL + Auth + RLS)
- **Styling**: Tailwind CSS + custom brand tokens
- **State**: Zustand (cart, persistent)
- **Icons**: Lucide React
- **Fonts**: Playfair Display + Inter
- **Hosting**: Vercel

## 🎨 Customisation

- **Brand colours**: Edit `tailwind.config.ts` → `brand` palette
- **Store name**: Global find-replace "Nature's Harvest"
- **Categories**: Update seed data in `migration.sql`
- **Products**: Add via Admin panel or `lib/seed-data.ts`
