#!/usr/bin/env node

/**
 * Audit Email Templates
 * Check for DRY compliance, Ambassador CTA, and best practices
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '..', '.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function audit() {
  const { data: templates } = await supabase
    .from('email_template_versions')
    .select('template_name, html_template, category, description')
    .eq('version_type', 'published')
    .order('template_name');

  console.log('=== EMAIL TEMPLATE AUDIT ===\n');

  let dryCount = 0;
  let notDryTemplates = [];
  let hasAmbassadorCTA = 0;
  let missingAmbassadorCTA = [];
  let bestPracticeIssues = [];

  for (const t of templates) {
    const html = t.html_template || '';

    // Check DRY
    const hasDryStyles = html.includes('{{standardStyles}}');
    const hasDryHeader = html.includes('{{standardHeader}}');
    const hasDryFooter = html.includes('{{standardFooter}}');
    const isDry = hasDryStyles && hasDryHeader && hasDryFooter;

    // Check Ambassador CTA
    const hasAmbassador = html.toLowerCase().includes('ambassador') ||
                          html.toLowerCase().includes('refer a friend') ||
                          html.toLowerCase().includes('referral');

    // Check best practices
    const issues = [];
    if (!html.includes('<!DOCTYPE html>')) issues.push('Missing DOCTYPE');
    if (!html.includes('meta charset')) issues.push('Missing charset meta');
    if (!html.includes('viewport')) issues.push('Missing viewport meta');
    if (!html.includes('unsubscribe') && t.category !== 'internal') issues.push('Missing unsubscribe link');
    if (html.includes('http://') && !html.includes('http://localhost')) issues.push('Has non-HTTPS links');

    // Status
    if (isDry) dryCount++;
    else notDryTemplates.push({ name: t.template_name, missing: { styles: !hasDryStyles, header: !hasDryHeader, footer: !hasDryFooter } });

    if (hasAmbassador) hasAmbassadorCTA++;
    else if (t.category !== 'internal' && !t.template_name.includes('contact')) {
      missingAmbassadorCTA.push(t.template_name);
    }

    if (issues.length > 0) {
      bestPracticeIssues.push({ name: t.template_name, issues });
    }

    const status = isDry ? '✅' : '❌';
    const ambassadorStatus = hasAmbassador ? '📢' : '  ';
    console.log(`${status} ${ambassadorStatus} ${t.template_name} (${t.category})`);
    if (!isDry) {
      console.log(`     Missing: ${!hasDryStyles ? 'styles ' : ''}${!hasDryHeader ? 'header ' : ''}${!hasDryFooter ? 'footer' : ''}`);
    }
  }

  console.log('\n=== SUMMARY ===');
  console.log(`\nDRY Compliance: ${dryCount}/${templates.length}`);
  if (notDryTemplates.length > 0) {
    console.log('Non-DRY templates:');
    notDryTemplates.forEach(t => console.log(`  - ${t.name}`));
  }

  console.log(`\nAmbassador CTA: ${hasAmbassadorCTA}/${templates.length - 1}`); // -1 for contact form
  if (missingAmbassadorCTA.length > 0) {
    console.log('Missing Ambassador CTA:');
    missingAmbassadorCTA.forEach(t => console.log(`  - ${t}`));
  }

  console.log('\n=== BEST PRACTICE ISSUES ===');
  if (bestPracticeIssues.length === 0) {
    console.log('No issues found!');
  } else {
    bestPracticeIssues.forEach(t => {
      console.log(`${t.name}: ${t.issues.join(', ')}`);
    });
  }

  // Check the standard footer for Ambassador CTA
  console.log('\n=== STANDARD FOOTER CHECK ===');
  const edgeFunctionPath = join(__dirname, '..', 'supabase', 'functions', 'send-email', 'index.ts');
  const fs = await import('fs');
  const edgeCode = fs.readFileSync(edgeFunctionPath, 'utf-8');

  const footerMatch = edgeCode.match(/const STANDARD_FOOTER = `([\s\S]*?)`;/);
  if (footerMatch) {
    console.log('Current footer:');
    console.log(footerMatch[1].trim());

    if (!footerMatch[1].toLowerCase().includes('ambassador') && !footerMatch[1].toLowerCase().includes('refer')) {
      console.log('\n⚠️  STANDARD_FOOTER is missing Ambassador CTA!');
    }
  }
}

audit();
