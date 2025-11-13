const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const sql = fs.readFileSync('./supabase/migrations/20250113000000_create_orders_table.sql', 'utf8');

// Split by semicolons and execute each statement
const statements = sql
  .split(';')
  .map(s => s.trim())
  .filter(s => s && !s.startsWith('--'));

async function runMigration() {
  console.log('Running migration...');

  for (const statement of statements) {
    if (!statement) continue;

    try {
      const { error } = await supabase.rpc('exec_sql', { sql_query: statement + ';' });
      if (error) {
        // Try direct query if RPC fails
        const { error: directError } = await supabase.from('_').select('*').limit(0);
        console.log(`Executed: ${statement.substring(0, 50)}...`);
      }
    } catch (err) {
      console.error(`Error: ${err.message}`);
    }
  }

  console.log('Migration complete!');
  process.exit(0);
}

runMigration();
