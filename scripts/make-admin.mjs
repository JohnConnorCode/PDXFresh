import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

const email = process.argv[2];

if (!email) {
  console.error('Usage: node scripts/make-admin.mjs <email>');
  process.exit(1);
}

(async () => {
  try {
    console.log(`Making ${email} an admin...`);

    // Call the RPC function to make the user admin
    const { data, error } = await supabase.rpc('make_user_admin', {
      user_email: email
    });

    if (error) {
      console.error('❌ Error:', error.message || error);
      if (error.message && error.message.includes('No auth user found')) {
        console.log('   The user needs to sign up first.');
      }
      process.exit(1);
    }

    console.log('✅ Successfully made user an admin:');
    console.log(JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Unexpected error:', err);
    process.exit(1);
  }
})();
