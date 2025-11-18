import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

console.log('Creating newsletter_subscribers table...');

// Create newsletter_subscribers table
const { error: table1Error } = await supabase.rpc('exec_sql', {
  sql: `
    CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      email TEXT UNIQUE NOT NULL,
      subscribed BOOLEAN DEFAULT true,
      source TEXT,
      subscribed_at TIMESTAMPTZ DEFAULT NOW(),
      unsubscribed_at TIMESTAMPTZ,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `
});

if (table1Error) {
  console.error('Error creating newsletter_subscribers:', table1Error);
  console.log('Trying direct SQL approach...');

  // Use direct SQL via fetch
  const { data, error } = await supabase.from('newsletter_subscribers').select('*').limit(1);

  if (error && error.code === '42P01') {
    console.error('Table does not exist and cannot be created via API. Please run migration manually in Supabase dashboard SQL editor.');
    process.exit(1);
  } else if (!error) {
    console.log('✓ Table newsletter_subscribers already exists');
  }
} else {
  console.log('✓ Created newsletter_subscribers table');
}

console.log('\nCreating wholesale_inquiries table...');

const { error: table2Error } = await supabase.rpc('exec_sql', {
  sql: `
    CREATE TABLE IF NOT EXISTS public.wholesale_inquiries (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      company TEXT NOT NULL,
      location TEXT NOT NULL,
      expected_volume TEXT NOT NULL,
      message TEXT,
      status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'closed')),
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
  `
});

if (table2Error) {
  console.error('Error creating wholesale_inquiries:', table2Error);
} else {
  console.log('✓ Created wholesale_inquiries table');
}

console.log('\n✅ Migration complete!');
console.log('\nNOTE: If tables could not be created, please run the migration manually in Supabase dashboard:');
console.log('Go to: https://supabase.com/dashboard/project/qjgenpwbaquqrvyrfsdo/editor');
console.log('Copy content from: supabase/migrations/013_newsletter_subscribers.sql');
