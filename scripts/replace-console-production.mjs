#!/usr/bin/env node
/**
 * Replace console.* calls with logger.* in production code
 * Excludes: tests, logger.ts itself, and node_modules
 */

import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

const files = [
  'app/(website)/layout.tsx',
  'app/(website)/checkout/success/page.tsx',
  'app/(admin)/admin/newsletter/page.tsx',
  'app/(admin)/admin/wholesale/page.tsx',
  'app/api/admin/stripe-mode/route.ts',
  'app/(admin)/admin/stripe-mode/StripeModeToggle.tsx',
  'app/api/admin/wholesale/[id]/status/route.ts',
  'app/api/admin/wholesale/export/route.ts',
  'app/(admin)/admin/wholesale/WholesaleStatusButton.tsx',
  'app/api/admin/newsletter/export/route.ts',
  'app/(website)/blends/[slug]/page.tsx',
  'lib/supabase/queries/products.ts',
  'lib/sanity.client.typed.ts',
  'lib/email/send.ts',
  'lib/actions.ts',
  'app/(admin)/admin/users/page.tsx',
  'app/(admin)/admin/subscriptions/page.tsx',
];

let totalReplacements = 0;
let totalFiles = 0;

files.forEach(file => {
  const fullPath = resolve(process.cwd(), file);

  try {
    let content = readFileSync(fullPath, 'utf8');
    const originalContent = content;

    // Check if logger is already imported
    const hasLoggerImport = /import.*{.*logger.*}.*from.*['"].*logger/.test(content);

    // Check if file has any console statements
    const hasConsole = /console\.(error|warn|log|info|debug)\(/.test(content);

    if (!hasConsole) {
      console.log(`⏭️  ${file} - No console statements found`);
      return;
    }

    // Add logger import if missing
    if (!hasLoggerImport && hasConsole) {
      // Find the first import statement
      const importMatch = content.match(/^import\s+.*?;$/m);
      if (importMatch) {
        const insertAfter = content.indexOf(importMatch[0]) + importMatch[0].length;
        content = content.slice(0, insertAfter) + "\nimport { logger } from '@/lib/logger';" + content.slice(insertAfter);
        console.log(`  ✅ Added logger import to ${file}`);
      }
    }

    // Replace console statements
    let fileReplacements = 0;
    const replacements = [
      { from: /console\.error\(/g, to: 'logger.error(', name: 'error' },
      { from: /console\.warn\(/g, to: 'logger.warn(', name: 'warn' },
      { from: /console\.log\(/g, to: 'logger.info(', name: 'log→info' },
      { from: /console\.info\(/g, to: 'logger.info(', name: 'info' },
      { from: /console\.debug\(/g, to: 'logger.debug(', name: 'debug' },
    ];

    replacements.forEach(({ from, to, name }) => {
      const matches = content.match(from);
      if (matches) {
        content = content.replace(from, to);
        fileReplacements += matches.length;
        console.log(`  ✅ Replaced ${matches.length} console.${name} calls`);
      }
    });

    // Only write if changes were made
    if (content !== originalContent) {
      writeFileSync(fullPath, content, 'utf8');
      totalReplacements += fileReplacements;
      totalFiles++;
      console.log(`✅ ${file} - ${fileReplacements} replacements\n`);
    }

  } catch (error) {
    console.error(`❌ Error processing ${file}:`, error.message);
  }
});

console.log('\n' + '='.repeat(60));
console.log(`🎉 Replacement complete!`);
console.log(`   Files modified: ${totalFiles}`);
console.log(`   Total replacements: ${totalReplacements}`);
console.log('='.repeat(60));
