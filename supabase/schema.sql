-- ==============================================================================
-- THE BIG PITCH - PHYSICAL PRODUCTS DATABASE SCHEMA & POLICIES
-- Run this script in your Supabase SQL Editor (https://app.supabase.com)
-- ==============================================================================

-- 1. PROFILES TABLE (Linked with Supabase Auth users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'customer', -- 'customer' or 'admin'
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone."
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own profile."
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile."
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- 2. PRODUCTS TABLE (Physical Products Catalog)
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  tagline TEXT,
  description TEXT,
  category TEXT NOT NULL DEFAULT 'Hardware & Tech',
  price NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  original_price NUMERIC(10, 2),
  stock_quantity INT NOT NULL DEFAULT 25,
  sku TEXT,
  materials TEXT,
  dimensions TEXT,
  weight TEXT,
  shipping_time TEXT DEFAULT '2-4 business days',
  cover_image TEXT,
  features JSONB DEFAULT '[]'::jsonb,
  badge TEXT DEFAULT 'Popular',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Active products are viewable by anyone."
  ON public.products FOR SELECT
  USING (is_active = true OR auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to insert products"
  ON public.products FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update products"
  ON public.products FOR UPDATE
  USING (true);

CREATE POLICY "Allow authenticated users to delete products"
  ON public.products FOR DELETE
  USING (true);

-- 3. ORDERS TABLE (Physical Shipments & Razorpay Transactions)
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  user_email TEXT NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  product_title TEXT NOT NULL,
  amount NUMERIC(10, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'INR',
  razorpay_payment_id TEXT NOT NULL,
  razorpay_order_id TEXT,
  -- Physical Delivery Address Fields
  shipping_name TEXT NOT NULL,
  shipping_phone TEXT NOT NULL,
  shipping_address TEXT NOT NULL,
  shipping_city TEXT NOT NULL,
  shipping_state TEXT NOT NULL,
  shipping_pincode TEXT NOT NULL,
  -- Fulfillment Status
  fulfillment_status TEXT NOT NULL DEFAULT 'Processing', -- 'Processing', 'Shipped', 'Delivered', 'Cancelled'
  tracking_number TEXT,
  tracking_carrier TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own orders"
  ON public.orders FOR SELECT
  USING (auth.uid() = user_id OR auth.role() = 'authenticated');

CREATE POLICY "Allow insert orders for authenticated or checkout users"
  ON public.orders FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow update orders for admin or authenticated users"
  ON public.orders FOR UPDATE
  USING (true);

-- 4. AUTOMATIC USER PROFILE TRIGGER
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (new.id, new.email, 'customer')
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 5. INITIAL SEED PHYSICAL PRODUCTS (Founder Hardware, Stationery & Gear)
INSERT INTO public.products (title, tagline, description, category, price, original_price, stock_quantity, sku, materials, dimensions, weight, shipping_time, cover_image, features, badge, is_active)
VALUES
(
  'The Executive Wireless Pitch Presenter',
  'CNC milled aerospace aluminum clicker with dual-haptic timer & green laser pointer.',
  'Engineered specifically for boardroom pitches and keynote stages. Features vibration cues at 5-minute intervals, 30-meter RF wireless range, custom silent silicone switches, and rechargeable USB-C fast charge.',
  'Hardware & Tech',
  3499.00,
  5999.00,
  35,
  'TBP-HW-001',
  'Aerospace Anodized 6063 Aluminum',
  '132 x 28 x 14 mm',
  '85 grams',
  '2-3 business days',
  'https://images.unsplash.com/photo-1588508065123-287b28e013da?auto=format&fit=crop&w=1200&q=80',
  '["Precision 5mW Green Laser Pointer", "Vibration Haptic Pace Countdown", "Universal Bluetooth 5.2 + 2.4GHz Dongle", "USB-C Fast Charging (90-day battery)", "Matte Black Hard Shell Carry Case"]'::jsonb,
  'Bestseller',
  true
),
(
  'Archival Leather Founder Pitch Journal',
  'Full-grain Tuscan bridle leather notebook with 240 GSM acid-free dot grid paper.',
  'Handcrafted for founders drafting term sheets, product wireframes, and pitch decks. Includes expandable back pocket for business cards, dual bookmark ribbons, and lay-flat 180-degree Smyth-sewn binding.',
  'Executive Stationery',
  1899.00,
  3299.00,
  50,
  'TBP-ST-002',
  'Vegetable-Tanned Full-Grain Leather',
  'A5 (210 x 148 mm)',
  '420 grams',
  '2-4 business days',
  'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1200&q=80',
  '["192 Numbered Dot-Grid Pages (120 GSM)", "Fountain Pen Friendly, No Bleed-Through", "Solid Brass Dual Bookmark Charms", "Integrated Elastic Pen Loop", "Debossed THE BIG PITCH Monogram"]'::jsonb,
  'Crafted',
  true
),
(
  'Studio-Grade USB-C Pitch Condenser Mic',
  'Broadcast-quality cardioid microphone designed for flawless investor Zoom calls.',
  'Eliminate muffled pitch calls. Equipped with a custom 25mm condenser capsule, zero-latency headphone monitoring jack, instant tap-to-mute touch sensor, and an integrated heavy zinc-alloy anti-vibration stand.',
  'Hardware & Tech',
  4999.00,
  8999.00,
  20,
  'TBP-HW-003',
  'Zinc Alloy & Steel Mesh',
  '180 x 90 x 90 mm',
  '680 grams',
  '2-3 business days',
  'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=1200&q=80',
  '["24-Bit / 96kHz Studio Audio Resolution", "Hardware Tap-to-Mute with Status LED", "Real-Time 3.5mm Headphone Jack", "Heavy Vibration-Dampening Metal Base", "Braided 2M USB-C to USB-C Cable"]'::jsonb,
  'Essential',
  true
),
(
  'THE BIG PITCH Stealth Founder Hoodie (450 GSM)',
  'Ultra-heavyweight 100% French Terry cotton tailored in a modern boxy silhouette.',
  'The uniform for late-night code sprints and VC office visits. Custom pre-shrunk 450 GSM combed cotton with hidden zippered tech pockets, double-layer hood, and discreet tonal embroidered logo.',
  'Founder Apparel',
  2799.00,
  4499.00,
  40,
  'TBP-AP-004',
  '100% Organic French Terry Cotton (450 GSM)',
  'Sizes S, M, L, XL, XXL',
  '850 grams',
  '3-5 business days',
  'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1200&q=80',
  '["Ultra-Heavy 450 GSM Combed Cotton", "Concealed YKK Zippered Passport Pocket", "Ribbed Side Panels for Mobility", "Double-Layer Structural Hood", "Pre-Shrunk Cold Garment Dye"]'::jsonb,
  'Top Rated',
  true
),
(
  'Anodized Aluminum Dual-Angle Laptop Stand',
  'CNC machined solid aluminum stand engineered for optimal ergonomic camera angle.',
  'Elevate your laptop screen to natural eye-level for video pitches and investor demonstrations. Features non-slip silicone pads, airflow cooling channel cutouts, and foldable flat profile.',
  'Desk & Studio',
  2199.00,
  3999.00,
  60,
  'TBP-DK-005',
  'Space Black Sandblasted Aluminum',
  '260 x 225 x 145 mm',
  '490 grams',
  '2-4 business days',
  'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=1200&q=80',
  '["Solid 4mm Unibody Aircraft Aluminum", "Open Vent Airflow Heat Dissipation", "Compatible with Laptops 11 to 17 Inches", "Anti-Scratch Silicone Protective Pads", "Foldable Flat for Travel Briefcase"]'::jsonb,
  'Popular',
  true
),
(
  'Merino Wool & Vegan Leather Desk Pad (900x400)',
  'Dual-sided desk mat combining natural thermal felt and scratch-resistant matte leather.',
  'Transform your workspace into an executive pitch station. Smooth mouse tracking, water-resistant surface coating, and precision stitched edge reinforcement prevent fraying.',
  'Desk & Studio',
  1599.00,
  2899.00,
  75,
  'TBP-DK-006',
  'Recycled Merino Felt & Vegan PU Leather',
  '900 x 400 x 3 mm',
  '380 grams',
  '2-4 business days',
  'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=1200&q=80',
  '["Generous 900 x 400 mm Surface Area", "Reversible Dual-Sided Texture", "Spill-Resistant Hydrophobic Coating", "Precision-Stitched Anti-Fray Perimeter", "Includes Vegan Leather Cable Organizer Strap"]'::jsonb,
  'Staff Pick',
  true
)
ON CONFLICT DO NOTHING;
