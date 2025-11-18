import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '..', '.env.local') });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const variantsRes = await fetch(`${SUPABASE_URL}/rest/v1/product_variants?select=size_key&is_active=eq.true`, {
  headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` }
});
const variants = await variantsRes.json();

const uniqueSizeKeys = [...new Set(variants.map(v => v.size_key))];
console.log('Unique size_key values:', uniqueSizeKeys);
