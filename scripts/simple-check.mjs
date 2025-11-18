import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '..', '.env.local') });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Get red-bomb half_gallon variant
const res = await fetch(`${SUPABASE_URL}/rest/v1/product_variants?blend_slug=eq.red-bomb&size_key=eq.half_gallon&billing_type=eq.one_time&select=*`, {
  headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` }
});
const variants = await res.json();

console.log('Red Bomb half_gallon variant(s):');
console.log(JSON.stringify(variants, null, 2));
