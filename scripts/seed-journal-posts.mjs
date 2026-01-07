#!/usr/bin/env node

/**
 * Seed Journal Posts to Sanity
 *
 * This script creates/updates journal posts in Sanity CMS.
 * Run with: node scripts/seed-journal-posts.mjs
 *
 * Note: Requires SANITY_API_TOKEN environment variable with write access.
 */

import { createClient } from '@sanity/client';
import { config } from 'dotenv';

config({ path: '.env.local' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  token: process.env.SANITY_WRITE_TOKEN || process.env.SANITY_API_TOKEN,
  apiVersion: '2024-01-01',
  useCdn: false,
});

// Helper to create portable text from markdown-like content
function createPortableText(content) {
  return content.split('\n\n').map((paragraph, index) => {
    // Check if it's a heading
    if (paragraph.startsWith('## ')) {
      return {
        _type: 'block',
        _key: `block-${index}`,
        style: 'h2',
        children: [{ _type: 'span', _key: `span-${index}`, text: paragraph.replace('## ', '') }],
      };
    }
    if (paragraph.startsWith('### ')) {
      return {
        _type: 'block',
        _key: `block-${index}`,
        style: 'h3',
        children: [{ _type: 'span', _key: `span-${index}`, text: paragraph.replace('### ', '') }],
      };
    }
    // Regular paragraph
    return {
      _type: 'block',
      _key: `block-${index}`,
      style: 'normal',
      children: [{ _type: 'span', _key: `span-${index}`, text: paragraph }],
    };
  });
}

const journalPosts = [
  {
    _id: 'post-cold-press-vs-hpp',
    _type: 'post',
    title: 'Cold-Press vs. HPP: What Your Sauce Label Isn\'t Telling You',
    slug: { _type: 'slug', current: 'cold-press-vs-hpp' },
    excerpt: 'Most sauce labeled "cold-pressed" today isn\'t truly cold-pressed. Here\'s the difference that matters for your health—and why Portland Fresh chose a different path.',
    author: 'Portland Fresh',
    category: 'nutrition',
    isPublished: true,
    publishedAt: new Date().toISOString(),
    seo: {
      metaTitle: 'Cold-Press vs. HPP Sauce: The Truth About "Cold-Pressed" Labels | Portland Fresh',
      metaDescription: 'Discover why most "cold-pressed" sauce isn\'t what you think. Learn the difference between true hydraulic cold-pressing and HPP, and why it matters for nutrition.',
    },
    content: createPortableText(`## The Label Says Cold-Pressed. But Is It?

Walk down any grocery aisle and you'll see it everywhere: "Cold-Pressed." It sounds clean. Natural. Healthy. But here's what most people don't realize—the majority of packaged sauces wearing that label have been processed using a method called HPP (High-Pressure Processing) that fundamentally changes what ends up in your container.

## What HPP Actually Does

HPP isn't juicing. It's preservation.

After the sauce is packed, it's submerged in water and subjected to extreme pressure—up to 87,000 pounds per square inch. This crushes bacteria and extends shelf life from days to months.

The result? Sauce that can sit on a shelf for 30 to 60 days. Easier distribution. Smoother logistics. But also flatter flavor, dulled color, reduced enzyme activity, and a sensory profile that's safe—but no longer fresh.

## True Cold-Pressing Is Different

Genuine hydraulic cold-pressing works the way nature intended. Thousands of pounds of pressure extract sauce from whole fruits and vegetables without heat, without oxidation, and without compromise.

The trade-off? A shelf life of just 2 to 5 days. It requires real daily production, careful handling, and a commitment to freshness over convenience.

But that's exactly the point.

## What You Actually Get

When it comes to nutrition, the difference matters:

True cold-pressed sauce maintains higher levels of polyphenols, vitamin C, antioxidants, and active enzymes. These compounds are sensitive—they degrade under pressure, heat, and time. HPP is chosen for scalability, not nutritional quality.

## The Portland Fresh Standard

Here's how we see it:

HPP extends how long the sauce lasts.
Cold-pressing extends how much the sauce gives you.

Portland Fresh aligns with the original meaning of cold-pressing—prioritizing freshness, integrity, and nutrient density over shortcuts and shelf stability.

When you reach for Portland Fresh, you're tasting sauce the way it was meant to be made. No compromises. No fine print. Just real nourishment, pressed fresh and delivered fast.

That's the Portland Fresh difference.`),
  },
  {
    _id: 'post-best-times-for-drinks',
    _type: 'post',
    title: 'When to Use Each Portland Fresh Sauce: A Guide to Timing Your Meals',
    slug: { _type: 'slug', current: 'best-times-for-drinks' },
    excerpt: 'Your kitchen has a natural rhythm. Our sauces are designed to match it. Here\'s when to use each Portland Fresh sauce for maximum impact.',
    author: 'Portland Fresh',
    category: 'wellness',
    isPublished: true,
    publishedAt: new Date().toISOString(),
    seo: {
      metaTitle: 'Best Times to Use Portland Fresh Sauces: Timing Guide',
      metaDescription: 'Learn the optimal moments for each Portland Fresh sauce. Reset, Cleanse, Rise, and Balance—designed to work with your kitchen rhythm.',
    },
    content: createPortableText(`## Your Body Runs on Rhythm

Every system in your body follows a pattern. Energy rises and falls. Digestion activates and rests. Focus sharpens and softens. The key to real wellness isn't fighting these cycles—it's working with them.

That's why Portland Fresh sauces aren't random. Each one is designed to match a specific moment your kitchen moves through naturally throughout the day.

## RESET — Red Bomb
### Best in the Morning

This is your circulation activator.

Beet, strawberry, carrot, papaya, and red apple come together to wake up your bloodstream, boost morning energy naturally, and support digestion after an overnight fast.

Your body has been repairing all night. RESET helps it transition into action mode—gently, powerfully, and without the crash that comes from caffeine alone.

Best enjoyed: First thing in the morning, before or with breakfast.

## CLEANSE — Green Bomb
### Best Early Morning or Mid-Morning

Hydration meets detoxification.

Spinach, cucumber, celery, romaine, and green apple flush your system, deliver essential minerals, and reset your gut for the day ahead.

CLEANSE works best on an empty or near-empty stomach, when absorption is at its peak and your digestive system is ready to receive.

Best enjoyed: 20-30 minutes before breakfast, or mid-morning as a refresh.

## RISE — Yellow Bomb
### Best Midday or Afternoon

The afternoon slump is real. RISE is your answer.

Mango, orange, ginger, guava, and pineapple deliver a concentrated dose of vitamin C and anti-inflammatory compounds right when stress and fatigue naturally peak.

This isn't about masking tiredness—it's about giving your immune system and mood the raw materials they need to perform.

Best enjoyed: Between 12pm and 4pm, when energy naturally dips.

## BALANCE — Blue Bomb
### Best Midday or Early Evening

Stability without stimulation.

Nopal, spinach, cucumber, aloe, and watercress work together to stabilize blood sugar, support metabolism, and maintain steady energy through the second half of your day.

BALANCE is especially valuable for anyone managing energy fluctuations, supporting metabolic health, or simply wanting to stay sharp and grounded without a crash.

Best enjoyed: Lunch through early evening—whenever you need sustained, calm focus.

## The Pattern

Mornings are for cleansing and activating.
Afternoons are for lifting and defending.
Evenings are for balancing and stabilizing.

Portland Fresh drinks aren't random—they follow the natural rhythm of your body so every bottle matches the exact state you're in.

Choose your mood. Trust your body. Let Portland Fresh do the rest.`),
  },
];

async function seedJournalPosts() {
  console.log('🌱 Seeding journal posts to Sanity...\n');

  for (const post of journalPosts) {
    try {
      console.log(`📝 Creating/updating: "${post.title}"`);

      const result = await client.createOrReplace(post);
      console.log(`   ✅ Success: ${result._id}\n`);
    } catch (error) {
      console.error(`   ❌ Error creating "${post.title}":`, error.message);
    }
  }

  console.log('✨ Journal posts seeding complete!');
  console.log('\nPosts created:');
  journalPosts.forEach(post => {
    console.log(`  - ${post.title}`);
    console.log(`    URL: /journal/${post.slug.current}`);
  });
}

// Check for required environment variables
if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
  console.error('❌ Missing NEXT_PUBLIC_SANITY_PROJECT_ID environment variable');
  process.exit(1);
}

if (!process.env.SANITY_WRITE_TOKEN && !process.env.SANITY_API_TOKEN) {
  console.error('❌ Missing SANITY_WRITE_TOKEN environment variable');
  console.error('   You need a Sanity token with write access.');
  console.error('   Get one from: https://www.sanity.io/manage');
  process.exit(1);
}

seedJournalPosts().catch(console.error);
