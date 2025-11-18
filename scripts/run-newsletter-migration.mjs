import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read the migration file
const sql = readFileSync(join(__dirname, '..', 'supabase/migrations/013_newsletter_subscribers.sql'), 'utf-8');

console.log('Please run this SQL in your Supabase SQL Editor:');
console.log('https://supabase.com/dashboard/project/qjgenpwbaquqrvyrfsdo/sql/new');
console.log('\n' + '='.repeat(80));
console.log(sql);
console.log('='.repeat(80));
console.log('\nAfter running the SQL, the newsletter and wholesale inquiry features will be fully functional.');
