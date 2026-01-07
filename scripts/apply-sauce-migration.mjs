/**
 * Apply sauce fields migration to Supabase
 * Run with: node scripts/apply-sauce-migration.mjs
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load environment variables
const envPath = path.resolve(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Error: Missing environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function applyMigration() {
  console.log('Applying sauce fields migration...\n');

  // Check if columns already exist by trying to select them
  const { data, error: checkError } = await supabase
    .from('products')
    .select('id, category, weight, heat_level, contains_nuts')
    .limit(1);

  if (!checkError) {
    console.log('Columns already exist. Migration not needed.');
    return;
  }

  // Columns don't exist - we need to use a different approach
  // Since we can't run raw SQL, we'll need to apply via Supabase Dashboard or CLI

  console.log('The following columns need to be added to the products table:\n');
  console.log('  - category TEXT (CHECK: pesto, salsa, chimichurri, hot-sauce)');
  console.log('  - weight TEXT');
  console.log('  - heat_level TEXT (CHECK: Mild, Medium, Spicy)');
  console.log('  - contains_nuts BOOLEAN DEFAULT FALSE');
  console.log('\nPlease apply migration via Supabase Dashboard SQL Editor:');
  console.log('  1. Go to https://supabase.com/dashboard/project/qjgenpwbaquqrvyrfsdo/sql');
  console.log('  2. Run the SQL from: supabase/migrations/029_add_product_sauce_fields.sql');
  console.log('\nOr push via CLI if configured:');
  console.log('  npx supabase db push');
}

applyMigration();
