# Scripts Directory

Utility scripts for managing the Portland Fresh e-commerce platform.

## Product Management

### Core Product Script

- **`seed-portland-fresh-products.mjs`** - Seed Portland Fresh sauce products
  - Creates products: Pesto, Salsa, Chimichurri, Zhug
  - Sets up variants with sizes (7oz, 8oz, 12oz, 16oz)
  - Run once during initial setup

### Stripe Integration

- **`setup-stripe-webhook.mjs`** - Register production webhook
- **`sync-stripe-prices.mjs`** - Sync prices from Stripe
- **`check-stripe-prices.mjs`** - Verify Stripe price configuration

## Database Management

### Migrations

- **`db-migrate.mjs`** - Run database migrations
- **`run-migrations.mjs`** - Execute pending migrations
- **`run-sql-migration.mjs`** - Run SQL migration files
- **`apply-sauce-migration.mjs`** - Apply sauce-specific schema changes

### Database Utilities

- **`validate-database.mjs`** - Validate database structure
- **`verify-database.mjs`** - Verify database health
- **`check-db.mjs`** - General database check

### Row-Level Security (RLS)

- **`check-rls-policies.mjs`** - Check RLS policies
- **`fix-rls-policy.mjs`** - Fix RLS policy issues
- **`list-all-policies.mjs`** - List all RLS policies

## User & Admin Management

- **`make-admin.mjs`** - Grant admin privileges to a user
- **`set-admin.mjs`** - Set admin status
- **`check-admin-status.mjs`** - Check if user is admin
- **`check-auth-users.mjs`** - Check Supabase auth users
- **`check-all-profiles.mjs`** - Check user profiles

## Discount Management

- **`setup-discounts.mjs`** - Set up discount system
- **`run-discount-migration.mjs`** - Run discount migrations
- **`apply-discount-migration.mjs`** - Apply discount schema

## Common Tasks

### Initial Setup

```bash
# 1. Run database migrations
node scripts/run-migrations.mjs

# 2. Seed products
node scripts/seed-portland-fresh-products.mjs

# 3. Set up Stripe webhook
node scripts/setup-stripe-webhook.mjs
```

### Create Admin User

```bash
node scripts/make-admin.mjs <user-email>
```

### Verify Setup

```bash
node scripts/validate-database.mjs
node scripts/check-stripe-prices.mjs
```

## Environment Variables Required

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://...supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Stripe
STRIPE_SECRET_KEY_TEST=sk_test_...
STRIPE_SECRET_KEY_PRODUCTION=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

## Product Management

Products are managed via the admin panel:
```
https://pdxfreshfoods.com/admin/products
```

The admin panel provides:
- Product details (name, slug, description, image)
- Variants (sizes, prices, Stripe price IDs)
- Ingredient management
- Auto-sync to Stripe
