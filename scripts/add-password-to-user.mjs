#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';
import * as readline from 'readline';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing required environment variables');
  process.exit(1);
}

// Create Supabase admin client
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function prompt(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

async function addPasswordToUser(email, newPassword = null) {
  try {
    console.log(`\n🔍 Looking for user with email: ${email}`);

    // Get user by email using admin API
    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();

    if (listError) {
      console.error('Error listing users:', listError);
      rl.close();
      return;
    }

    const user = users.find(u => u.email === email);

    if (!user) {
      console.error(`❌ User not found with email: ${email}`);
      rl.close();
      return;
    }

    console.log(`✅ Found user:`);
    console.log(`   ID: ${user.id}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Created: ${user.created_at}`);
    console.log(`   Current identities: ${user.identities?.map(i => i.provider).join(', ') || 'none'}`);

    let password = newPassword;

    // If password not provided as argument, prompt for it
    if (!password) {
      password = await prompt('\n🔐 Enter new password (min 6 characters): ');

      if (password.length < 6) {
        console.error('❌ Password must be at least 6 characters long');
        rl.close();
        return;
      }

      const confirmPassword = await prompt('🔐 Confirm password: ');

      if (password !== confirmPassword) {
        console.error('❌ Passwords do not match');
        rl.close();
        return;
      }
    }

    console.log('\n📝 Updating user with password...');

    // Update user with password using admin API
    const { data: updatedUser, error: updateError } = await supabase.auth.admin.updateUserById(
      user.id,
      { password }
    );

    if (updateError) {
      console.error('❌ Error updating user:', updateError);
      rl.close();
      return;
    }

    console.log('✅ Password successfully added!');
    console.log(`\n🎉 You can now sign in with:`);
    console.log(`   Email: ${email}`);
    console.log(`   Password: [the password you just set]`);

    rl.close();
  } catch (err) {
    console.error('Unexpected error:', err);
    rl.close();
  }
}

// Get email and password from command line or use default
const email = process.argv[2] || 'jt.connor88@gmail.com';
const password = process.argv[3] || null;
addPasswordToUser(email, password);
