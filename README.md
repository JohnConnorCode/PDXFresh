# Portland Fresh — Next.js E-Commerce

A production-ready e-commerce platform for **Portland Fresh** artisan sauces, pestos, and salsas. Built with **Next.js 14** (App Router), **Supabase**, and **Stripe**.

## Features

- **E-Commerce Ready**: Full checkout flow with Stripe integration
- **Fast & Accessible**: Lighthouse-optimized (90+), TypeScript, Tailwind CSS
- **SEO Ready**: Dynamic metadata, structured data, XML sitemap, robots.txt
- **Admin Dashboard**: Product management, order tracking, user administration
- **Supabase Backend**: Authentication, database, real-time updates

## Tech Stack

- **Framework**: Next.js 14+ (App Router, TypeScript, React Server Components)
- **Styling**: Tailwind CSS, CSS variables for theming
- **Database**: Supabase (PostgreSQL)
- **Payments**: Stripe (checkout, subscriptions, webhooks)
- **Images**: `next/image` with optimized loading
- **Deploy**: Vercel (optimized)

## Products

Portland Fresh offers artisan sauces including:
- **Pestos**: Basil, Arugula-Hazelnut, Kale-Cashew, Spinach-Pecan
- **Salsas**: Mild, Spicy
- **Chimichurri**: Classic, Spicy
- **Zhug**: Traditional Yemeni green sauce

## Getting Started

### 1. Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account
- Stripe account

### 2. Clone & Install

```bash
git clone https://github.com/JohnConnorCode/PDXFresh.git
cd PDXFresh
npm install
```

### 3. Environment Setup

Create `.env.local` based on `.env.example`:

```env
# Site
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Stripe
STRIPE_SECRET_KEY_TEST=sk_test_xxx
STRIPE_SECRET_KEY_PRODUCTION=sk_live_xxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_TEST=pk_test_xxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_PRODUCTION=pk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
```

### 4. Seed Products

```bash
node scripts/seed-portland-fresh-products.mjs
```

### 5. Run Development Server

```bash
npm run dev
```

Visit:
- **Site**: http://localhost:3000
- **Admin**: http://localhost:3000/admin

## Pages & Routing

| Route | Description |
|-------|-------------|
| `/` | Homepage |
| `/blends` | Product catalog (Sauce Pantry) |
| `/blends/[slug]` | Individual product page |
| `/cart` | Shopping cart |
| `/checkout` | Stripe checkout |
| `/account` | User account |
| `/admin` | Admin dashboard |
| `/admin/products` | Product management |
| `/admin/orders` | Order management |

## Admin Features

Access admin at `/admin` (requires admin user):

- **Products**: Create, edit, delete products with variants
- **Orders**: View and manage orders
- **Users**: User management
- **Stripe Sync**: Auto-sync products to Stripe

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import in Vercel dashboard
3. Add environment variables
4. Deploy

### Environment Variables

Set these in Vercel:
- All `NEXT_PUBLIC_*` variables
- All Supabase keys
- All Stripe keys
- `STRIPE_WEBHOOK_SECRET`

## Development Commands

```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run linter
```

## Scripts

```bash
# Seed products
node scripts/seed-portland-fresh-products.mjs

# Database migrations
node scripts/run-migrations.mjs

# Make user admin
node scripts/make-admin.mjs <email>

# Validate database
node scripts/validate-database.mjs
```

## License

Proprietary. All rights reserved.

---

**Built with care for Portland Fresh**
