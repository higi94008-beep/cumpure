-- ============================================================
-- NATURE'S HARVEST – COMPLETE DATABASE SCHEMA
-- Run this in Supabase SQL Editor to set up your database
-- ============================================================

-- EXTENSIONS
create extension if not exists "uuid-ossp";

-- ============================================================
-- PROFILES TABLE
-- ============================================================
create table if not exists profiles (
  id uuid references auth.users on delete cascade primary key,
  email text unique not null,
  full_name text,
  phone text,
  avatar_url text,
  role text not null default 'customer' check (role in ('customer', 'admin')),
  rewards_points integer not null default 0,
  created_at timestamptz default now()
);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================
-- CATEGORIES TABLE
-- ============================================================
create table if not exists categories (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  slug text unique not null,
  description text,
  image_url text,
  parent_id uuid references categories(id) on delete set null,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz default now()
);

-- ============================================================
-- PRODUCTS TABLE
-- ============================================================
create table if not exists products (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  slug text unique not null,
  description text,
  price decimal(10,2) not null check (price >= 0),
  compare_price decimal(10,2) check (compare_price >= 0),
  category_id uuid references categories(id) on delete set null,
  images text[] default '{}',
  tags text[] default '{}',
  is_active boolean not null default true,
  is_featured boolean not null default false,
  stock_quantity integer not null default 0,
  unit text not null default 'piece',
  weight text,
  brand text,
  sku text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Updated_at trigger
create or replace function update_updated_at()
returns trigger as $$
begin new.updated_at = now(); return new; end;
$$ language plpgsql;

drop trigger if exists products_updated_at on products;
create trigger products_updated_at before update on products
  for each row execute procedure update_updated_at();

-- ============================================================
-- ORDERS TABLE
-- ============================================================
create table if not exists orders (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete set null,
  status text not null default 'pending'
    check (status in ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled')),
  total decimal(10,2) not null,
  subtotal decimal(10,2) not null,
  discount decimal(10,2) not null default 0,
  delivery_fee decimal(10,2) not null default 0,
  items jsonb not null default '[]',
  shipping_address jsonb,
  payment_method text,
  payment_status text not null default 'pending'
    check (payment_status in ('pending', 'paid', 'failed')),
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

drop trigger if exists orders_updated_at on orders;
create trigger orders_updated_at before update on orders
  for each row execute procedure update_updated_at();

-- ============================================================
-- CART ITEMS TABLE
-- ============================================================
create table if not exists cart_items (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  product_id uuid references products on delete cascade not null,
  quantity integer not null default 1 check (quantity > 0),
  created_at timestamptz default now(),
  unique(user_id, product_id)
);

-- ============================================================
-- BANNERS TABLE
-- ============================================================
create table if not exists banners (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  subtitle text,
  image_url text not null,
  link_url text,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz default now()
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

-- Profiles: users can read/update their own
alter table profiles enable row level security;
create policy "profiles_own" on profiles for all using (auth.uid() = id);
create policy "profiles_admin_read" on profiles for select using (true);

-- Categories: public read
alter table categories enable row level security;
create policy "categories_public_read" on categories for select using (true);
create policy "categories_admin_write" on categories for all using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);

-- Products: public read, admin write
alter table products enable row level security;
create policy "products_public_read" on products for select using (true);
create policy "products_admin_write" on products for all using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);

-- Orders: users can create and see their own; admins see all
alter table orders enable row level security;
create policy "orders_own_read" on orders for select using (
  auth.uid() = user_id or
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);
create policy "orders_insert_any" on orders for insert with check (true);
create policy "orders_admin_update" on orders for update using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);

-- Cart: own items only
alter table cart_items enable row level security;
create policy "cart_own" on cart_items for all using (auth.uid() = user_id);

-- Banners: public read
alter table banners enable row level security;
create policy "banners_public_read" on banners for select using (true);
create policy "banners_admin_write" on banners for all using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);

-- ============================================================
-- SEED: CATEGORIES
-- ============================================================
insert into categories (name, slug, description, image_url, sort_order, is_active) values
  ('Fresh Produce', 'fresh-produce', 'Farm-fresh fruits, vegetables, and herbs', 'https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=400', 1, true),
  ('Dairy & Cheese', 'dairy-cheese', 'Artisanal cheeses and fresh dairy', 'https://images.unsplash.com/photo-1559561853-08451507cbe7?w=400', 2, true),
  ('Butchery & Seafood', 'butchery-seafood', 'Premium meats and fresh seafood', 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400', 3, true),
  ('Bakery', 'bakery', 'Artisanal breads and baked goods', 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400', 4, true),
  ('Chocolates & Confectionery', 'chocolates', 'Premium chocolates and sweets', 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=400', 5, true),
  ('Tea, Coffee & Infusions', 'tea-coffee', 'Single origin teas and specialty coffees', 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=400', 6, true),
  ('Snacks & Treats', 'snacks', 'Gourmet snacking delights', 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400', 7, true),
  ('Cold Beverages', 'cold-beverages', 'Premium cold drinks and mixers', 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400', 8, true),
  ('Organic & Natural', 'organic', 'Certified organic products', 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400', 9, true),
  ('Gluten Free', 'gluten-free', 'Gluten-free essentials', 'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e?w=400', 10, true)
on conflict (slug) do nothing;

-- ============================================================
-- SEED: SAMPLE PRODUCTS
-- (Run after categories are inserted)
-- ============================================================
do $$
declare
  cat_fresh uuid;
  cat_dairy uuid;
  cat_bakery uuid;
  cat_choc uuid;
  cat_tea uuid;
  cat_snacks uuid;
  cat_bev uuid;
  cat_organic uuid;
  cat_gf uuid;
  cat_sea uuid;
begin
  select id into cat_fresh from categories where slug = 'fresh-produce';
  select id into cat_dairy from categories where slug = 'dairy-cheese';
  select id into cat_bakery from categories where slug = 'bakery';
  select id into cat_choc from categories where slug = 'chocolates';
  select id into cat_tea from categories where slug = 'tea-coffee';
  select id into cat_snacks from categories where slug = 'snacks';
  select id into cat_bev from categories where slug = 'cold-beverages';
  select id into cat_organic from categories where slug = 'organic';
  select id into cat_gf from categories where slug = 'gluten-free';
  select id into cat_sea from categories where slug = 'butchery-seafood';

  insert into products (name, slug, description, price, compare_price, category_id, images, tags, is_active, is_featured, stock_quantity, unit, brand) values
    ('Organic Avocados', 'organic-avocados', 'Creamy, ripe organic avocados hand-picked from certified farms.', 249, 299, cat_fresh, array['https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=600'], array['organic', 'fresh', 'healthy'], true, true, 50, '2 pcs', 'Farm Fresh'),
    ('Baby Spinach', 'baby-spinach', 'Tender young spinach leaves, perfect for salads and smoothies.', 89, 109, cat_fresh, array['https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=600'], array['organic', 'fresh', 'salad'], true, false, 30, '200g', 'Greens Co'),
    ('Heirloom Tomatoes', 'heirloom-tomatoes', 'A colourful mix of rare heirloom tomato varieties.', 149, null, cat_fresh, array['https://images.unsplash.com/photo-1546094096-0df4bcabd337?w=600'], array['fresh', 'local'], true, false, 25, '500g', 'Farm Direct'),
    ('French Brie Cheese', 'french-brie', 'Authentic soft-ripened brie with a creamy, buttery centre.', 599, 699, cat_dairy, array['https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=600'], array['cheese', 'imported', 'premium'], true, true, 20, '200g', 'Le Gourmet'),
    ('Greek Yogurt', 'greek-yogurt', 'Thick, protein-rich Greek yogurt made from whole milk.', 159, null, cat_dairy, array['https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600'], array['dairy', 'protein'], true, false, 40, '400g', 'Epigamia'),
    ('Sourdough Loaf', 'sourdough-loaf', 'Traditional 48-hour fermented sourdough with a crisp crust.', 299, 349, cat_bakery, array['https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=600'], array['bread', 'artisan', 'sourdough'], true, true, 15, '500g', 'Artisan Bakehouse'),
    ('Butter Croissants', 'butter-croissants', 'Flaky, buttery croissants baked fresh daily.', 249, null, cat_bakery, array['https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600'], array['bakery', 'french', 'pastry'], true, false, 20, '4 pcs', 'Le Petit'),
    ('Valrhona Dark Chocolate 70%', 'valrhona-dark-chocolate', 'Award-winning French dark chocolate with intense cocoa notes.', 449, 525, cat_choc, array['https://images.unsplash.com/photo-1481391243133-f96216dcb5d2?w=600'], array['chocolate', 'dark', 'premium', 'french'], true, true, 30, '70g', 'Valrhona'),
    ('Assorted Chocolate Truffles', 'chocolate-truffles', 'Hand-rolled Belgian chocolate truffles in five flavours.', 699, 799, cat_choc, array['https://images.unsplash.com/photo-1548907040-4baa42d10919?w=600'], array['chocolate', 'truffle', 'gift'], true, false, 25, '150g', 'Maison Cailler'),
    ('Darjeeling First Flush Tea', 'darjeeling-first-flush', 'The champagne of teas — delicate, muscatel notes from the first spring harvest.', 599, 699, cat_tea, array['https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=600'], array['tea', 'darjeeling', 'premium'], true, true, 35, '100g', 'Golden Tips'),
    ('Ethiopian Natural Coffee', 'ethiopian-natural-coffee', 'Single-origin Ethiopian beans with notes of blueberry and dark chocolate.', 799, null, cat_tea, array['https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=600'], array['coffee', 'single-origin', 'specialty'], true, false, 20, '250g', 'Blue Tokai'),
    ('Ceremonial Matcha Powder', 'ceremonial-matcha', 'Stone-ground first-flush matcha from Uji, Japan.', 349, 429, cat_tea, array['https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600'], array['matcha', 'tea', 'organic', 'japanese'], true, false, 25, '50g', 'Encha'),
    ('Smoked Norwegian Salmon', 'smoked-salmon', 'Cold-smoked Atlantic salmon with a silky texture.', 899, 999, cat_sea, array['https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600'], array['seafood', 'smoked', 'premium'], true, true, 15, '150g', 'Arctic King'),
    ('Premium Mixed Nuts', 'premium-mixed-nuts', 'A roasted blend of cashews, almonds, pistachios, and walnuts.', 499, 599, cat_snacks, array['https://images.unsplash.com/photo-1508061253366-f7da158b6d46?w=600'], array['nuts', 'healthy', 'snack', 'roasted'], true, false, 40, '400g', 'Happilo'),
    ('Kombucha Original', 'kombucha-original', 'Raw, naturally fermented kombucha with live cultures.', 149, 169, cat_bev, array['https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600'], array['kombucha', 'probiotic', 'healthy'], true, false, 50, '330ml', 'Raw Pressery'),
    ('Organic Quinoa', 'organic-quinoa', 'White quinoa from high-altitude Bolivian farms, certified organic.', 299, 349, cat_organic, array['https://images.unsplash.com/photo-1618759287629-ca263a8bf0dd?w=600'], array['quinoa', 'organic', 'grain', 'protein'], true, false, 30, '500g', 'True Elements'),
    ('Gluten Free Penne Pasta', 'gf-penne-pasta', 'Rice and corn-based pasta with the same al dente texture.', 249, null, cat_gf, array['https://images.unsplash.com/photo-1551892374-ecf8754cf8b0?w=600'], array['pasta', 'gluten-free', 'rice'], true, false, 25, '400g', 'Barilla'),
    ('Cold Brew Coffee Concentrate', 'cold-brew-coffee', 'Smooth 24-hour cold brew concentrate, ready to dilute and enjoy.', 199, 229, cat_bev, array['https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=600'], array['coffee', 'cold brew', 'ready-to-drink'], true, false, 35, '250ml', 'Third Wave Coffee')
  on conflict (slug) do nothing;
end $$;

-- ============================================================
-- Done! Make sure to:
-- 1. Set the NEXT_PUBLIC_SUPABASE_URL env var
-- 2. Set the NEXT_PUBLIC_SUPABASE_ANON_KEY env var
-- 3. Set the SUPABASE_SERVICE_ROLE_KEY env var
-- 4. Create an admin user via Supabase Auth > Add User, then
--    run: UPDATE profiles SET role = 'admin' WHERE email = 'your@email.com';
-- ============================================================
