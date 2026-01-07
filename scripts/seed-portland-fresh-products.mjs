/**
 * Portland Fresh Products Seed Script
 *
 * Seeds the Supabase database with Portland Fresh sauce and pesto products.
 * Run with: node scripts/seed-portland-fresh-products.mjs
 *
 * Options:
 *   --force    Clear existing products and re-seed
 *   --dry-run  Preview changes without writing to database
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load environment variables
const envPath = path.resolve(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Error: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// Parse command line args
const args = process.argv.slice(2);
const forceMode = args.includes('--force');
const dryRun = args.includes('--dry-run');

// Portland Fresh product data
const PORTLAND_FRESH_PRODUCTS = [
  {
    slug: 'arugula-hazelnut',
    name: 'Arugula Hazelnut Pesto',
    tagline: 'Peppery arugula, toasted hazelnuts, and citrus brighten pasta, sandwiches, and roasted vegetables.',
    description: {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            { type: 'text', text: 'A 7 oz plant-based pesto blended with organic arugula, roasted hazelnuts, and apple cider vinegar for tangy depth.' }
          ]
        }
      ]
    },
    story: {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            { type: 'text', text: 'Inspired by the chef roots of founder Stew Joseph, this pesto layers hazelnuts from the Willamette Valley with lemon-forward aromatics for a balanced, spreadable finish.' }
          ]
        }
      ]
    },
    category: 'pesto',
    weight: '7 oz',
    heat_level: null,
    contains_nuts: true,
    function_list: ['Finish pasta', 'Spread on focaccia', 'Drizzle over roasted veg'],
    best_for: ['Pasta Night', 'Charcuterie Boards', 'Market Sandwiches'],
    label_color: 'green',
    image_url: '/arugula-hazelnut.jpg',
    image_alt: 'Portland Fresh Arugula Hazelnut pesto container',
    is_featured: true,
    is_active: true,
    display_order: 1,
    meta_title: 'Arugula Hazelnut Pesto | Portland Fresh',
    meta_description: 'Organic arugula and toasted hazelnuts blended into a bright pesto for pasta, sandwiches, and roasted vegetables.',
    published_at: new Date().toISOString(),
  },
  {
    slug: 'spicy-salsa',
    name: 'Spicy Salsa',
    tagline: 'Roma tomatoes, serrano heat, and fresh citrus for a Northwest take on salsa roja.',
    description: {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            { type: 'text', text: 'A 12 oz salsa built on organic tomatoes and serrano peppers with lemon and lime juice for layered acidity.' }
          ]
        }
      ]
    },
    story: {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            { type: 'text', text: 'Hand-cut vegetables simmered lightly before a coarse chop deliver a salsa with texture and heat worthy of Portland farmers\' markets.' }
          ]
        }
      ]
    },
    category: 'salsa',
    weight: '12 oz',
    heat_level: 'Spicy',
    contains_nuts: false,
    function_list: ['Top tacos', 'Fold into beans', 'Serve with chips and crudité'],
    best_for: ['Taco Tuesday', 'Game Day Spreads'],
    label_color: 'red',
    image_url: '/spicy-salsa.jpg',
    image_alt: 'Portland Fresh spicy salsa container',
    is_featured: true,
    is_active: true,
    display_order: 2,
    meta_title: 'Spicy Salsa | Portland Fresh',
    meta_description: 'Organic serrano peppers and roma tomatoes create a bright, spicy salsa from Portland Fresh.',
    published_at: new Date().toISOString(),
  },
  {
    slug: 'mild-salsa',
    name: 'Mild Salsa',
    tagline: 'All the farm-fresh tomato flavor with a softer finish for every palate.',
    description: {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            { type: 'text', text: 'Organic roma tomatoes with cilantro, garlic, and citrus deliver a mellow 12 oz salsa for everyday snacking.' }
          ]
        }
      ]
    },
    story: {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            { type: 'text', text: 'Handcrafted weekly for neighborhood markets, this mild salsa keeps the same produce lineup as the spicy version minus the serrano heat.' }
          ]
        }
      ]
    },
    category: 'salsa',
    weight: '12 oz',
    heat_level: 'Mild',
    contains_nuts: false,
    function_list: ['Layer on breakfast scrambles', 'Serve with chips', 'Bake over enchiladas'],
    best_for: ['Family Tables', 'Office Fridges'],
    label_color: 'yellow',
    image_url: '/Mild-Salsa.jpg',
    image_alt: 'Portland Fresh mild salsa container',
    is_featured: false,
    is_active: true,
    display_order: 3,
    meta_title: 'Mild Salsa | Portland Fresh',
    meta_description: 'Organic roma tomatoes, citrus, and herbs for a balanced mild salsa made weekly in Portland.',
    published_at: new Date().toISOString(),
  },
  {
    slug: 'spicy-chimichurri',
    name: 'Spicy Chimichurri',
    tagline: 'Parsley, serrano pepper, and oregano bring Argentine heat to roasted vegetables and flame-grilled proteins.',
    description: {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            { type: 'text', text: 'A 7 oz chimichurri that adds serrano peppers and red wine vinegar for bold acidity and spice.' }
          ]
        }
      ]
    },
    story: {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            { type: 'text', text: 'We mince organic parsley with red onion, serranos, and dried oregano before finishing with olive oil and citrus for a Portland riff on a steakhouse classic.' }
          ]
        }
      ]
    },
    category: 'chimichurri',
    weight: '7 oz',
    heat_level: 'Spicy',
    contains_nuts: false,
    function_list: ['Finish grilled meats', 'Drizzle over roasted vegetables', 'Stir into grains'],
    best_for: ['Weekend Grilling', 'Veggie Bowls'],
    label_color: 'green',
    image_url: '/spicy-chimi.jpg',
    image_alt: 'Portland Fresh spicy chimichurri container',
    is_featured: true,
    is_active: true,
    display_order: 4,
    meta_title: 'Spicy Chimichurri | Portland Fresh',
    meta_description: 'Organic parsley, serrano peppers, and red wine vinegar for a fiery chimichurri made weekly in Portland.',
    published_at: new Date().toISOString(),
  },
  {
    slug: 'chimichurri',
    name: 'Chimichurri',
    tagline: 'Bright parsley and oregano sauce without the serrano heat.',
    description: {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            { type: 'text', text: 'A 7 oz classic chimichurri featuring organic parsley, lemon juice, red wine vinegar, and garlic.' }
          ]
        }
      ]
    },
    story: {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            { type: 'text', text: 'A weekly farmers-market staple, this version keeps the flavor of fresh parsley and citrus while staying mild enough for any dish.' }
          ]
        }
      ]
    },
    category: 'chimichurri',
    weight: '7 oz',
    heat_level: 'Mild',
    contains_nuts: false,
    function_list: ['Dress grain bowls', 'Dip crudité', 'Finish tacos and sandwiches'],
    best_for: ['Meal Prep', 'Farmers-Market Picnics'],
    label_color: 'green',
    image_url: '/chimi.jpg',
    image_alt: 'Portland Fresh chimichurri container',
    is_featured: false,
    is_active: true,
    display_order: 5,
    meta_title: 'Chimichurri | Portland Fresh',
    meta_description: 'Organic parsley chimichurri with lemon juice and red wine vinegar, blended fresh every week.',
    published_at: new Date().toISOString(),
  },
  {
    slug: 'zhug',
    name: 'Zhug (Middle Eastern Hot Sauce)',
    tagline: 'Cilantro, serrano peppers, and citrus for a herbal Yemeni-style hot sauce.',
    description: {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            { type: 'text', text: 'A 7 oz green hot sauce zipping with parsley, cilantro, serranos, and sherry vinegar.' }
          ]
        }
      ]
    },
    story: {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            { type: 'text', text: 'Zhug is our nod to global pantry staples—blended fresh in Portland for spooning over roasted veg, falafel, or eggs.' }
          ]
        }
      ]
    },
    category: 'hot-sauce',
    weight: '7 oz',
    heat_level: 'Spicy',
    contains_nuts: false,
    function_list: ['Top eggs', 'Finish flatbreads', 'Swirl into yogurt dips'],
    best_for: ['Brunch Boards', 'Late-Night Snacks'],
    label_color: 'blue',
    image_url: '/zhug.jpg',
    image_alt: 'Portland Fresh zhug container',
    is_featured: false,
    is_active: true,
    display_order: 6,
    meta_title: 'Zhug Hot Sauce | Portland Fresh',
    meta_description: 'Cilantro, serrano peppers, and citrus create a Yemeni-inspired zhug hot sauce blended fresh in Portland.',
    published_at: new Date().toISOString(),
  },
  {
    slug: 'kale-cashew',
    name: 'Kale Cashew Pesto',
    tagline: 'Earthy kale with creamy cashews for a plant-based pesto that loves grain bowls.',
    description: {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            { type: 'text', text: 'A 7 oz vegan pesto with organic kale, cashew nuts, and lemony apple cider vinegar.' }
          ]
        }
      ]
    },
    story: {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            { type: 'text', text: 'Stew\'s chefs whip this pesto weekly with raw cashews for a creamy finish that still feels bright and herbaceous.' }
          ]
        }
      ]
    },
    category: 'pesto',
    weight: '7 oz',
    heat_level: null,
    contains_nuts: true,
    function_list: ['Toss with farro or quinoa', 'Spread on veggie wraps', 'Finish soups'],
    best_for: ['Meal Prep Bowls', 'Vegan Sandwiches'],
    label_color: 'green',
    image_url: '/kale-cashew.jpg',
    image_alt: 'Portland Fresh kale cashew pesto container',
    is_featured: false,
    is_active: true,
    display_order: 7,
    meta_title: 'Kale Cashew Pesto | Portland Fresh',
    meta_description: 'Organic kale and cashews blended into a dairy-free pesto perfect for bowls and sandwiches.',
    published_at: new Date().toISOString(),
  },
  {
    slug: 'spinach-pecan',
    name: 'Spinach Pecan Pesto',
    tagline: 'Toasted pecans and organic spinach for a slightly sweet, nutty pesto.',
    description: {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            { type: 'text', text: 'A 7 oz pesto mixing spinach, pecans, olive oil, and apple cider vinegar for a balanced spread.' }
          ]
        }
      ]
    },
    story: {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            { type: 'text', text: 'Built for farmers-market snacks, this pesto doubles as a dip thanks to toasted pecans and bright citrus.' }
          ]
        }
      ]
    },
    category: 'pesto',
    weight: '7 oz',
    heat_level: null,
    contains_nuts: true,
    function_list: ['Dip crudité', 'Dress potato salads', 'Spread on breakfast sandwiches'],
    best_for: ['Picnics', 'Snack Boards'],
    label_color: 'green',
    image_url: '/spinach-Pecan.jpg',
    image_alt: 'Portland Fresh spinach pecan pesto container',
    is_featured: false,
    is_active: true,
    display_order: 8,
    meta_title: 'Spinach Pecan Pesto | Portland Fresh',
    meta_description: 'Organic spinach and toasted pecans create a nutty pesto perfect for dipping or spreading.',
    published_at: new Date().toISOString(),
  },
];

// Ingredient data for linking
const PRODUCT_INGREDIENTS = {
  'arugula-hazelnut': [
    'Organic Arugula',
    'Olive Oil',
    'Hazelnuts',
    'Lemon Juice',
    'Organic Garlic',
    'Apple Cider Vinegar',
    'Sea Salt',
  ],
  'spicy-salsa': [
    'Organic Roma Tomatoes',
    'Organic Red Onion',
    'Organic White Onion',
    'Organic Cilantro',
    'Organic Garlic',
    'Lime Juice',
    'Organic Serrano Pepper',
    'Apple Cider Vinegar',
    'Lemon Juice',
    'Sea Salt',
    'Oregano',
  ],
  'mild-salsa': [
    'Organic Roma Tomatoes',
    'Organic Red Onion',
    'Organic White Onion',
    'Organic Cilantro',
    'Organic Garlic',
    'Lime Juice',
    'Lemon Juice',
    'Apple Cider Vinegar',
    'Sea Salt',
    'Oregano',
  ],
  'spicy-chimichurri': [
    'Organic Parsley',
    'Olive Oil',
    'Lemon Juice',
    'Organic Red Onion',
    'Serrano Peppers',
    'Red Wine Vinegar',
    'Organic Garlic',
    'Sea Salt',
    'Dried Oregano',
    'Spices',
  ],
  'chimichurri': [
    'Organic Parsley',
    'Olive Oil',
    'Lemon Juice',
    'Organic Red Onion',
    'Red Wine Vinegar',
    'Organic Garlic',
    'Sea Salt',
    'Dried Oregano',
  ],
  'zhug': [
    'Olive Oil',
    'Organic Cilantro',
    'Organic Parsley',
    'Serrano Peppers',
    'Lemon Juice',
    'Lime Juice',
    'Sherry Vinegar',
    'Salt',
    'Spices',
  ],
  'kale-cashew': [
    'Organic Kale',
    'Olive Oil',
    'Cashews',
    'Lemon Juice',
    'Organic Garlic',
    'Apple Cider Vinegar',
    'Sea Salt',
  ],
  'spinach-pecan': [
    'Organic Spinach',
    'Olive Oil',
    'Pecans',
    'Lemon Juice',
    'Organic Garlic',
    'Apple Cider Vinegar',
    'Sea Salt',
  ],
};

// Default variant pricing
const VARIANT_PRICES = {
  'arugula-hazelnut': 11,
  'spicy-salsa': 12,
  'mild-salsa': 11,
  'spicy-chimichurri': 11,
  'chimichurri': 10,
  'zhug': 11,
  'kale-cashew': 11,
  'spinach-pecan': 11,
};

async function seedProducts() {
  console.log('\\n--- Portland Fresh Product Seed Script ---\\n');

  if (dryRun) {
    console.log('DRY RUN MODE - No changes will be made\\n');
  }

  try {
    // Check existing products
    const { data: existingProducts, error: checkError } = await supabase
      .from('products')
      .select('id, slug, name')
      .limit(100);

    if (checkError) {
      console.error('Error checking existing products:', checkError);
      throw checkError;
    }

    const existingSlugs = new Set((existingProducts || []).map(p => p.slug));
    console.log(`Found ${existingProducts?.length || 0} existing products`);

    if (existingProducts && existingProducts.length > 0 && !forceMode) {
      console.log('\\nExisting products:');
      existingProducts.forEach(p => console.log(`  - ${p.slug}: ${p.name}`));
      console.log('\\nUse --force to clear and re-seed');

      // Check which products need to be added
      const newProducts = PORTLAND_FRESH_PRODUCTS.filter(p => !existingSlugs.has(p.slug));
      if (newProducts.length === 0) {
        console.log('\\nAll Portland Fresh products already exist. Nothing to do.');
        return;
      }

      console.log(`\\n${newProducts.length} new products to add:`);
      newProducts.forEach(p => console.log(`  + ${p.slug}: ${p.name}`));
    }

    // Force mode: clear existing products
    if (forceMode && !dryRun) {
      console.log('\\nForce mode: Clearing existing products...');

      // Delete in order: variants -> product_ingredients -> products -> ingredients
      await supabase.from('product_variants').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      await supabase.from('product_ingredients').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      await supabase.from('products').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      await supabase.from('ingredients').delete().neq('id', '00000000-0000-0000-0000-000000000000');

      console.log('Cleared existing data');
    }

    // Collect unique ingredients
    const allIngredients = new Set();
    Object.values(PRODUCT_INGREDIENTS).forEach(ingredients => {
      ingredients.forEach(ing => allIngredients.add(ing));
    });

    console.log(`\\nSeeding ${allIngredients.size} unique ingredients...`);

    if (!dryRun) {
      // Insert ingredients
      const ingredientsData = Array.from(allIngredients).map(name => ({
        name,
        type: detectIngredientType(name),
        notes: `Used in Portland Fresh sauces and pestos`,
      }));

      const { data: insertedIngredients, error: ingredientsError } = await supabase
        .from('ingredients')
        .upsert(ingredientsData, { onConflict: 'name', ignoreDuplicates: true })
        .select();

      if (ingredientsError) {
        console.error('Error inserting ingredients:', ingredientsError);
        throw ingredientsError;
      }

      console.log(`Inserted/updated ${insertedIngredients?.length || 0} ingredients`);

      // Build ingredient map
      const { data: allIngredientsDb } = await supabase.from('ingredients').select('id, name');
      const ingredientMap = new Map((allIngredientsDb || []).map(ing => [ing.name, ing.id]));

      // Insert products
      console.log(`\\nSeeding ${PORTLAND_FRESH_PRODUCTS.length} products...`);

      for (const product of PORTLAND_FRESH_PRODUCTS) {
        if (!forceMode && existingSlugs.has(product.slug)) {
          console.log(`  Skipping ${product.slug} (already exists)`);
          continue;
        }

        const { data: insertedProduct, error: productError } = await supabase
          .from('products')
          .upsert(product, { onConflict: 'slug' })
          .select()
          .single();

        if (productError) {
          console.error(`Error inserting product ${product.slug}:`, productError);
          continue;
        }

        console.log(`  + ${product.slug}: ${product.name}`);

        // Link ingredients
        const productIngredients = PRODUCT_INGREDIENTS[product.slug] || [];
        const ingredientLinks = productIngredients.map((ingName, index) => ({
          product_id: insertedProduct.id,
          ingredient_id: ingredientMap.get(ingName),
          display_order: index + 1,
        })).filter(link => link.ingredient_id);

        if (ingredientLinks.length > 0) {
          const { error: linkError } = await supabase
            .from('product_ingredients')
            .upsert(ingredientLinks, { onConflict: 'product_id,ingredient_id' });

          if (linkError) {
            console.error(`    Error linking ingredients for ${product.slug}:`, linkError);
          } else {
            console.log(`    Linked ${ingredientLinks.length} ingredients`);
          }
        }

        // Create default variant (no Stripe price yet)
        const price = VARIANT_PRICES[product.slug] || 10;
        const { error: variantError } = await supabase
          .from('product_variants')
          .upsert({
            product_id: insertedProduct.id,
            size_key: 'container',
            label: `${product.weight} container`,
            stripe_price_id: null, // Will be set when synced to Stripe
            is_default: true,
            display_order: 1,
            is_active: true,
            price_usd: price,
          }, { onConflict: 'product_id,size_key' });

        if (variantError && !variantError.message?.includes('stripe_price_id')) {
          console.error(`    Error creating variant for ${product.slug}:`, variantError);
        } else {
          console.log(`    Created variant: $${price}`);
        }
      }
    } else {
      console.log('\\nWould insert the following products:');
      PORTLAND_FRESH_PRODUCTS.forEach(p => {
        console.log(`  - ${p.slug}: ${p.name} (${p.category}, ${p.weight})`);
      });
    }

    console.log('\\n--- Seed completed ---\\n');
    console.log('Next steps:');
    console.log('  1. Run the migration: npx supabase db push');
    console.log('  2. Sync products to Stripe via /admin/products');
    console.log('  3. Verify products at /blends\\n');

  } catch (error) {
    console.error('\\nSeed failed:', error);
    process.exit(1);
  }
}

function detectIngredientType(name) {
  const lower = name.toLowerCase();
  if (lower.includes('parsley') || lower.includes('cilantro') || lower.includes('oregano') || lower.includes('basil')) {
    return 'herb';
  }
  if (lower.includes('arugula') || lower.includes('spinach') || lower.includes('kale')) {
    return 'green';
  }
  if (lower.includes('tomato') || lower.includes('lemon') || lower.includes('lime') || lower.includes('apple')) {
    return 'fruit';
  }
  if (lower.includes('garlic') || lower.includes('onion')) {
    return 'root';
  }
  return 'other';
}

seedProducts();
