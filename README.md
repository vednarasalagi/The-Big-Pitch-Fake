# THE BIG PITCH

A high-performance digital products marketplace built with React, Vite, Supabase, and Razorpay.

## Key Features

- **Luxury Monochrome Aesthetic**: Strict black and white palette, razor-sharp alignment, and editorial typography.
- **Role-Based Admin Access**: The Admin Panel is hidden from normal visitors and only visible to authorized admin accounts.
- **Catalog Management**: Add, update, delete, and toggle digital products with custom prices, file formats, and download links.
- **Razorpay Payment Gateway**: Instant Indian Rupee (₹) checkout for digital downloads.
- **Supabase Backend**: Authentication (strictly Email and Password) and database tables with Row Level Security.
- **Customer Deliverables**: "My Purchases" library providing permanent access to download links and payment receipts.

## Environment Variables (.env)

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_RAZORPAY_KEY_ID=your-razorpay-key-id
VITE_ADMIN_EMAILS=info.sigtrek@gmail.com,your-email@domain.com
```

## Database Setup

Run the SQL migration script located at `supabase/schema.sql` in your Supabase SQL Editor. It creates:
- `products`: Digital catalog with prices, file formats, and download links.
- `orders`: Verified customer transactions and deliverables.
- `profiles`: User account data linked with Supabase Auth.
- Row-Level Security (RLS) policies.

## Development & Build

```bash
# Install dependencies
npm install

# Run local development server
npm run dev

# Production build
npm run build
```
