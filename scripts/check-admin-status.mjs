/**
 * Check and optionally set admin status for a user
 * Usage: node scripts/check-admin-status.mjs [email]
 */

import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '..', '.env.local') });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const email = process.argv[2];

if (!email) {
  console.log('\n📧 Usage: node scripts/check-admin-status.mjs <email>\n');
  console.log('Example: node scripts/check-admin-status.mjs user@example.com\n');
  process.exit(1);
}

console.log(`\n🔍 Checking admin status for: ${email}\n`);

// Get auth user
const authRes = await fetch(`${SUPABASE_URL}/auth/v1/admin/users`, {
  headers: {
    'apikey': SUPABASE_KEY,
    'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY || SUPABASE_KEY}`
  }
});

let userId = null;

if (authRes.ok) {
  const users = await authRes.json();
  const user = users.users?.find((u) => u.email === email);
  if (user) {
    userId = user.id;
    console.log(`✅ Found auth user: ${user.email}`);
    console.log(`   User ID: ${userId}`);
  }
}

if (!userId) {
  // Try to find by email in profiles
  const profileRes = await fetch(
    `${SUPABASE_URL}/rest/v1/profiles?email=eq.${encodeURIComponent(email)}&select=*`,
    {
      headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` }
    }
  );
  const profiles = await profileRes.json();

  if (profiles && profiles.length > 0) {
    userId = profiles[0].id;
    console.log(`✅ Found profile: ${profiles[0].email}`);
    console.log(`   User ID: ${userId}`);
  } else {
    console.log(`❌ No user found with email: ${email}`);
    process.exit(1);
  }
}

// Get profile
const profileRes = await fetch(
  `${SUPABASE_URL}/rest/v1/profiles?id=eq.${userId}&select=*`,
  {
    headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` }
  }
);
const profiles = await profileRes.json();

if (!profiles || profiles.length === 0) {
  console.log(`\n❌ Profile not found. Creating one...\n`);

  // Create profile
  await fetch(`${SUPABASE_URL}/rest/v1/profiles`, {
    method: 'POST',
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    },
    body: JSON.stringify({
      id: userId,
      email: email,
      is_admin: true
    })
  });

  console.log(`✅ Profile created with admin access\n`);
} else {
  const profile = profiles[0];
  console.log(`\n📋 Profile Status:`);
  console.log(`   Email: ${profile.email}`);
  console.log(`   Admin: ${profile.is_admin ? '✅ YES' : '❌ NO'}`);
  console.log(`   Name: ${profile.full_name || '(not set)'}`);

  if (!profile.is_admin) {
    console.log(`\n🔧 Setting admin status to TRUE...`);

    await fetch(`${SUPABASE_URL}/rest/v1/profiles?id=eq.${userId}`, {
      method: 'PATCH',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({ is_admin: true })
    });

    console.log(`✅ Admin status updated!\n`);
  } else {
    console.log(`\n✅ User already has admin access\n`);
  }
}

console.log(`💡 Refresh the page to see the admin link in the dropdown\n`);
