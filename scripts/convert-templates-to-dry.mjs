#!/usr/bin/env node

/**
 * Convert All Email Templates to DRY Format
 *
 * This script updates all templates to use {{standardStyles}}, {{standardHeader}}, {{standardFooter}}
 * placeholders instead of inline styles. The Edge Function will inject these at send time.
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing required environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Standard structure pattern - templates should follow this format
const TEMPLATE_STRUCTURE = `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>{{standardStyles}}</style>
  </head>
  <body>
    <div class="email-container">
      {{standardHeader}}
      <div class="content">
        <!-- CONTENT HERE -->
      </div>
      {{standardFooter}}
    </div>
  </body>
</html>
`.trim();

async function analyzeAndConvertTemplates() {
  console.log('📧 Analyzing and converting email templates to DRY format...\n');

  // Fetch all published templates
  const { data: templates, error } = await supabase
    .from('email_template_versions')
    .select('*')
    .eq('version_type', 'published')
    .order('template_name');

  if (error) {
    console.error('Failed to fetch templates:', error.message);
    process.exit(1);
  }

  console.log(`Found ${templates.length} published templates\n`);

  let alreadyDry = 0;
  let needsConversion = 0;
  let converted = 0;

  for (const template of templates) {
    const html = template.html_template || '';

    // Check if template already uses DRY placeholders
    const usesDryStyles = html.includes('{{standardStyles}}');
    const usesDryHeader = html.includes('{{standardHeader}}');
    const usesDryFooter = html.includes('{{standardFooter}}');

    if (usesDryStyles && usesDryHeader && usesDryFooter) {
      console.log(`✅ ${template.template_name} - Already DRY`);
      alreadyDry++;
      continue;
    }

    // Check what's missing
    const missing = [];
    if (!usesDryStyles) missing.push('styles');
    if (!usesDryHeader) missing.push('header');
    if (!usesDryFooter) missing.push('footer');

    console.log(`⚠️  ${template.template_name} - Missing DRY: ${missing.join(', ')}`);
    needsConversion++;

    // Try to extract the content section and rebuild with DRY template
    const contentMatch = html.match(/<div class="content">([\s\S]*?)<\/div>\s*(?:<div class="footer">|$)/);

    if (contentMatch && contentMatch[1]) {
      const content = contentMatch[1].trim();

      const newHtml = `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>{{standardStyles}}</style>
  </head>
  <body>
    <div class="email-container">
      {{standardHeader}}
      <div class="content">
        ${content}
      </div>
      {{standardFooter}}
    </div>
  </body>
</html>
      `.trim();

      // Update the template
      const { error: updateError } = await supabase
        .from('email_template_versions')
        .update({
          html_template: newHtml,
          published_at: new Date().toISOString(),
        })
        .eq('id', template.id);

      if (updateError) {
        console.error(`   ❌ Failed to convert ${template.template_name}:`, updateError.message);
      } else {
        console.log(`   ✅ Converted ${template.template_name} to DRY format`);
        converted++;
      }
    } else {
      console.log(`   ⚠️  Could not auto-convert ${template.template_name} - manual review needed`);
    }
  }

  console.log('\n📊 Summary:');
  console.log(`   Already DRY: ${alreadyDry}`);
  console.log(`   Needed conversion: ${needsConversion}`);
  console.log(`   Successfully converted: ${converted}`);

  if (converted > 0) {
    console.log('\n🎉 Templates converted! Deploy Edge Function to apply changes.');
  }
}

analyzeAndConvertTemplates();
