/**
 * Product Queries for Supabase
 * Replaces Sanity GROQ queries with Supabase queries
 */

import { createClient } from '@/lib/supabase/server';
import { logger } from '@/lib/logger';
import { createClient as createBrowserClient } from '@supabase/supabase-js';
import { PORTLAND_FRESH_PRODUCTS, StaticProductData, StaticProductCategory } from '@/lib/data/portlandFreshProducts';

// =====================================================
// TYPE DEFINITIONS
// =====================================================

export interface Product {
  id: string;
  name: string;
  slug: string;
  tagline: string | null;
  description: any | null;
  story: any | null;
  detailed_function: any | null;
  how_to_use: any | null;
  function_list: string[] | null;
  best_for: string[] | null;
  ingredients_preview?: string[] | null;
  weight?: string | null;
  heat_level?: string | null;
  label_color: 'yellow' | 'red' | 'green' | 'blue' | null;
  image_url: string | null;
  image_alt: string | null;
  stripe_product_id: string | null;
  is_featured: boolean;
  is_active: boolean;
  display_order: number;
  meta_title: string | null;
  meta_description: string | null;
  created_at: string;
  updated_at: string;
  published_at: string | null;
  category?: StaticProductCategory | null;
  contains_nuts?: boolean | null;
}

export interface ProductWithIngredients extends Product {
  ingredients: Array<{
    id: string;
    display_order: number;
    ingredient: Ingredient;
  }>;
  variants: ProductVariant[];
}

export interface Ingredient {
  id: string;
  name: string;
  type: 'fruit' | 'root' | 'green' | 'herb' | 'other' | null;
  seasonality: string | null;
  function: any | null;
  sourcing_story: any | null;
  nutritional_profile: string | null;
  notes: string | null;
  image_url: string | null;
  image_alt: string | null;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  size_key: string;
  label: string;
  stripe_price_id: string;
  is_default: boolean;
  display_order: number;
  is_active: boolean;
  price_usd: number | null;
  sku: string | null;
  billing_type?: string;
  recurring_interval?: string;
  recurring_interval_count?: number;
  stock_quantity?: number | null;
  track_inventory?: boolean;
  low_stock_threshold?: number;
}

// =====================================================
// STATIC DATA HELPERS
// =====================================================

const STATIC_PRODUCT_MAP = new Map(PORTLAND_FRESH_PRODUCTS.map((product) => [product.slug, product]));

function createPortableTextBlock(slug: string, key: string, text?: string) {
  if (!text) return null;
  return [
    {
      _type: 'block',
      _key: `${slug}-${key}`,
      style: 'normal',
      children: [
        {
          _type: 'span',
          _key: `${slug}-${key}-0`,
          text,
        },
      ],
    },
  ];
}

function createPortableList(slug: string, key: string, items?: string[]) {
  if (!items || items.length === 0) return null;
  return items.map((item, index) => ({
    _type: 'block',
    _key: `${slug}-${key}-${index}`,
    style: 'normal',
    listItem: 'bullet',
    children: [
      {
        _type: 'span',
        _key: `${slug}-${key}-${index}-0`,
        text: item,
      },
    ],
  }));
}

function detectIngredientType(name: string): Ingredient['type'] {
  const lower = name.toLowerCase();
  if (lower.includes('parsley') || lower.includes('cilantro') || lower.includes('basil') || lower.includes('arugula') || lower.includes('spinach') || lower.includes('kale') || lower.includes('oregano')) {
    return 'herb';
  }
  if (lower.includes('tomato') || lower.includes('lemon') || lower.includes('lime') || lower.includes('apple')) {
    return 'fruit';
  }
  if (lower.includes('garlic') || lower.includes('onion')) {
    return 'root';
  }
  return 'other';
}

function createStaticIngredientEntries(staticProduct: StaticProductData) {
  return staticProduct.ingredients.map((ingredient, index) => ({
    id: `static-${staticProduct.slug}-ingredient-${index}`,
    display_order: index + 1,
    ingredient: {
      id: `static-ingredient-${staticProduct.slug}-${index}`,
      name: ingredient,
      type: detectIngredientType(ingredient),
      seasonality: null,
      function: null,
      sourcing_story: null,
      nutritional_profile: null,
      notes: null,
      image_url: null,
      image_alt: null,
    } as Ingredient,
  }));
}

function createStaticVariant(staticProduct: StaticProductData, productId: string) {
  return [
    {
      id: `static-${staticProduct.slug}-variant`,
      product_id: productId,
      size_key: 'container',
      label: `${staticProduct.weight} container`,
      stripe_price_id: '',
      is_default: true,
      display_order: 1,
      is_active: true,
      price_usd: staticProduct.price ?? null,
      sku: null,
      billing_type: undefined,
      recurring_interval: undefined,
      recurring_interval_count: undefined,
      stock_quantity: undefined,
      track_inventory: false,
      low_stock_threshold: undefined,
    },
  ];
}

function mapStaticProductToSummary(staticProduct: StaticProductData): Product {
  const now = new Date().toISOString();
  const summaryBlock = createPortableTextBlock(staticProduct.slug, 'summary', staticProduct.summary);
  const storyBlock = createPortableTextBlock(staticProduct.slug, 'story', staticProduct.story);
  const usesList = createPortableList(staticProduct.slug, 'uses', staticProduct.uses);

  return {
    id: `static-${staticProduct.slug}`,
    name: staticProduct.name,
    slug: staticProduct.slug,
    tagline: staticProduct.tagline,
    description: summaryBlock,
    story: storyBlock,
    detailed_function: storyBlock,
    how_to_use: usesList,
    function_list: staticProduct.uses,
    best_for: staticProduct.bestFor,
    ingredients_preview: staticProduct.ingredients,
    weight: staticProduct.weight,
    heat_level: staticProduct.heat || null,
    label_color: staticProduct.labelColor,
    image_url: staticProduct.image,
    image_alt: staticProduct.imageAlt,
    stripe_product_id: null,
    is_featured: staticProduct.isFeatured ?? true,
    is_active: true,
    display_order: staticProduct.displayOrder,
    meta_title: staticProduct.metaTitle ?? `${staticProduct.name} | Portland Fresh`,
    meta_description: staticProduct.metaDescription ?? staticProduct.summary,
    created_at: now,
    updated_at: now,
    published_at: now,
    category: staticProduct.category,
    contains_nuts: staticProduct.containsNuts ?? null,
  };
}

function mergeProductWithStaticSummary(product: Product): Product {
  const staticData = STATIC_PRODUCT_MAP.get(product.slug);
  if (!staticData) return product;
  const summaryBlock = createPortableTextBlock(staticData.slug, 'summary', staticData.summary);
  const storyBlock = createPortableTextBlock(staticData.slug, 'story', staticData.story);
  const usesList = createPortableList(staticData.slug, 'uses', staticData.uses);

  return {
    ...product,
    name: staticData.name,
    tagline: staticData.tagline,
    function_list: staticData.uses,
    best_for: staticData.bestFor,
    ingredients_preview: staticData.ingredients,
    weight: staticData.weight,
    heat_level: staticData.heat || null,
    label_color: staticData.labelColor,
    image_url: staticData.image,
    image_alt: staticData.imageAlt,
    is_featured: staticData.isFeatured ?? product.is_featured,
    display_order: staticData.displayOrder,
    meta_title: staticData.metaTitle ?? product.meta_title,
    meta_description: staticData.metaDescription ?? product.meta_description,
    description: product.description ?? summaryBlock,
    story: product.story ?? storyBlock,
    detailed_function: product.detailed_function ?? storyBlock,
    how_to_use: product.how_to_use ?? usesList,
    category: staticData.category,
    contains_nuts: staticData.containsNuts ?? null,
  };
}

function ensureStaticSummaries(products: Product[]): Product[] {
  const summaries = products
    .filter((product) => STATIC_PRODUCT_MAP.has(product.slug))
    .map((product) => mergeProductWithStaticSummary(product));

  if (summaries.length === 0) {
    return PORTLAND_FRESH_PRODUCTS.map(mapStaticProductToSummary);
  }

  const existing = new Set(summaries.map((product) => product.slug));
  PORTLAND_FRESH_PRODUCTS.forEach((staticProduct) => {
    if (!existing.has(staticProduct.slug)) {
      summaries.push(mapStaticProductToSummary(staticProduct));
    }
  });

  return summaries.sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
}

function mapStaticProductToDetail(staticProduct: StaticProductData): ProductWithIngredients {
  const summary = mapStaticProductToSummary(staticProduct);
  return {
    ...summary,
    description: staticProduct.summary,
    story: staticProduct.story,
    detailed_function: null,
    how_to_use: null,
    ingredients: createStaticIngredientEntries(staticProduct),
    variants: createStaticVariant(staticProduct, summary.id),
  };
}

function mergeProductDetailWithStatic(product: ProductWithIngredients): ProductWithIngredients {
  const staticData = STATIC_PRODUCT_MAP.get(product.slug);
  if (!staticData) return product;
  return {
    ...product,
    name: staticData.name,
    tagline: staticData.tagline,
    image_url: staticData.image,
    image_alt: staticData.imageAlt,
    function_list: staticData.uses,
    best_for: staticData.bestFor,
    ingredients_preview: staticData.ingredients,
    weight: staticData.weight,
    heat_level: staticData.heat || null,
    label_color: staticData.labelColor,
    meta_title: staticData.metaTitle ?? product.meta_title,
    meta_description: staticData.metaDescription ?? product.meta_description,
    ingredients:
      product.ingredients && product.ingredients.length > 0
        ? product.ingredients
        : createStaticIngredientEntries(staticData),
    variants:
      product.variants && product.variants.length > 0
        ? product.variants
        : createStaticVariant(staticData, product.id),
  };
}

// =====================================================
// QUERY FUNCTIONS
// =====================================================

/**
 * Get all published products (blends)
 * Replaces: blendsQuery from Sanity
 */
export async function getAllProducts(): Promise<Product[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('products')
    .select(
      `
      id,
      name,
      slug,
      tagline,
      image_url,
      image_alt,
      label_color,
      function_list,
      is_featured,
      display_order
    `
    )
    .eq('is_active', true)
    .not('published_at', 'is', null)
    .order('display_order', { ascending: true });

  if (error) {
    logger.error('Error fetching products:', error);
    return PORTLAND_FRESH_PRODUCTS.map(mapStaticProductToSummary);
  }

  return ensureStaticSummaries((data as Product[]) || []);
}

/**
 * Product with minimum price calculated from variants
 */
export interface ProductWithMinPrice extends Product {
  min_price: number | null;
}

function mapStaticProductToMinPrice(staticProduct: StaticProductData): ProductWithMinPrice {
  return {
    ...mapStaticProductToSummary(staticProduct),
    min_price: staticProduct.price ?? null,
  };
}

function ensureStaticMinPriceSummaries(products: ProductWithMinPrice[]): ProductWithMinPrice[] {
  const summaries = products
    .filter((product) => STATIC_PRODUCT_MAP.has(product.slug))
    .map((product) => ({
      ...mergeProductWithStaticSummary(product),
      min_price: product.min_price,
    }));

  if (summaries.length === 0) {
    return PORTLAND_FRESH_PRODUCTS.map(mapStaticProductToMinPrice);
  }

  const existing = new Set(summaries.map((product) => product.slug));
  PORTLAND_FRESH_PRODUCTS.forEach((staticProduct) => {
    if (!existing.has(staticProduct.slug)) {
      summaries.push(mapStaticProductToMinPrice(staticProduct));
    }
  });

  return summaries.sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
}

/**
 * Get all products with their minimum variant price
 * Used for pricing pages where we need to show "From $X"
 */
export async function getAllProductsWithMinPrice(): Promise<ProductWithMinPrice[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('products')
    .select(
      `
      id,
      name,
      slug,
      tagline,
      image_url,
      image_alt,
      label_color,
      function_list,
      is_featured,
      display_order,
      product_variants(price_usd)
    `
    )
    .eq('is_active', true)
    .not('published_at', 'is', null)
    .order('display_order', { ascending: true });

  if (error) {
    logger.error('Error fetching products with prices:', error);
    return PORTLAND_FRESH_PRODUCTS.map(mapStaticProductToMinPrice);
  }

  const calculated = (data || []).map((product: any) => {
    const variants = product.product_variants || [];
    const prices = variants
      .map((v: { price_usd: number | null }) => v.price_usd)
      .filter((p: number | null): p is number => p !== null && p > 0);

    const minPrice = prices.length > 0 ? Math.min(...prices) : null;

    // Remove variants from the returned object, just keep min_price
    const { product_variants, ...productData } = product;
    return {
      ...productData,
      min_price: minPrice,
    } as ProductWithMinPrice;
  });

  return ensureStaticMinPriceSummaries(calculated);
}

/**
 * Get all products for static generation (no cookies, uses anon key)
 * Used in generateStaticParams where cookies() is not available
 */
export async function getAllProductsForStaticGen(): Promise<Product[]> {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data, error } = await supabase
    .from('products')
    .select(
      `
      id,
      name,
      slug,
      tagline,
      image_url,
      image_alt,
      label_color,
      function_list,
      is_featured,
      display_order
    `
    )
    .eq('is_active', true)
    .not('published_at', 'is', null)
    .order('display_order', { ascending: true});

  if (error) {
    logger.error('Error fetching products for static gen:', error);
    return PORTLAND_FRESH_PRODUCTS.map(mapStaticProductToSummary);
  }

  return ensureStaticSummaries((data as Product[]) || []);
}

/**
 * Get product by slug with full details including ingredients and variants
 * Replaces: blendQuery from Sanity
 */
export async function getProductBySlug(
  slug: string
): Promise<ProductWithIngredients | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('products')
    .select(
      `
      *,
      ingredients:product_ingredients(
        id,
        display_order,
        ingredient:ingredients(
          id,
          name,
          type,
          seasonality,
          function,
          sourcing_story,
          nutritional_profile,
          image_url,
          image_alt
        )
      ),
      variants:product_variants(
        id,
        product_id,
        size_key,
        label,
        stripe_price_id,
        is_default,
        display_order,
        is_active,
        price_usd,
        sku,
        billing_type,
        recurring_interval,
        recurring_interval_count,
        stock_quantity,
        track_inventory,
        low_stock_threshold
      )
    `
    )
    .eq('slug', slug)
    .eq('is_active', true)
    .not('published_at', 'is', null)
    .single();

  if (error) {
    logger.error('Error fetching product:', error);
    const fallback = STATIC_PRODUCT_MAP.get(slug);
    return fallback ? mapStaticProductToDetail(fallback) : null;
  }

  if (data) {
    data.ingredients = data.ingredients?.sort(
      (a: any, b: any) => a.display_order - b.display_order
    ) || [];
    data.variants = data.variants
      ?.filter((v: any) => v.is_active)
      .sort((a: any, b: any) => a.display_order - b.display_order) || [];
  }

  const staticData = STATIC_PRODUCT_MAP.get(slug);
  if (!data) {
    return staticData ? mapStaticProductToDetail(staticData) : null;
  }

  return mergeProductDetailWithStatic(data as ProductWithIngredients);
}

/**
 * Get active Stripe products for pricing page
 * Used by: /pricing page
 */
export async function getActiveStripeProducts(): Promise<ProductWithIngredients[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('products')
    .select(
      `
      id,
      name,
      slug,
      tagline,
      description,
      image_url,
      image_alt,
      stripe_product_id,
      is_featured,
      display_order,
      variants:product_variants(
        id,
        size_key,
        label,
        stripe_price_id,
        is_default,
        display_order,
        is_active,
        price_usd,
        billing_type,
        recurring_interval,
        recurring_interval_count,
        stock_quantity,
        track_inventory,
        low_stock_threshold
      )
    `
    )
    .eq('is_active', true)
    .not('published_at', 'is', null)
    .not('stripe_product_id', 'is', null)
    .order('display_order', { ascending: true });

  if (error) {
    logger.error('Error fetching Stripe products:', error);
    return PORTLAND_FRESH_PRODUCTS.map(mapStaticProductToDetail);
  }

  const productsWithVariants = (data || [])
    .filter((product: any) => STATIC_PRODUCT_MAP.has(product.slug) && product.variants && product.variants.length > 0)
    .map((product: any) => mergeProductDetailWithStatic(product as ProductWithIngredients));

  if (productsWithVariants.length === 0) {
    return PORTLAND_FRESH_PRODUCTS.map(mapStaticProductToDetail);
  }

  return productsWithVariants as ProductWithIngredients[];
}

/**
 * Get featured products
 */
export async function getFeaturedProducts(): Promise<Product[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('products')
    .select(
      `
      id,
      name,
      slug,
      tagline,
      image_url,
      image_alt,
      label_color,
      function_list,
      display_order
    `
    )
    .eq('is_active', true)
    .eq('is_featured', true)
    .not('published_at', 'is', null)
    .order('display_order', { ascending: true })
    .limit(6);

  if (error) {
    logger.error('Error fetching featured products:', error);
    return PORTLAND_FRESH_PRODUCTS.filter((product) => product.isFeatured !== false)
      .map(mapStaticProductToSummary)
      .sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
  }

  const merged = ensureStaticSummaries((data as Product[]) || []).filter((product) =>
    (STATIC_PRODUCT_MAP.get(product.slug)?.isFeatured ?? true)
  );

  if (merged.length === 0) {
    return PORTLAND_FRESH_PRODUCTS.filter((product) => product.isFeatured !== false)
      .map(mapStaticProductToSummary)
      .sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
  }

  return merged.sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
}

/**
 * Get all ingredients
 * Replaces: ingredientQuery from Sanity
 */
export async function getAllIngredients(): Promise<Ingredient[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('ingredients')
    .select('*')
    .order('name', { ascending: true });

  if (error) {
    logger.error('Error fetching ingredients:', error);
    return [];
  }

  return data as Ingredient[];
}

/**
 * Search products by name or function
 */
export async function searchProducts(query: string): Promise<Product[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('products')
    .select(
      `
      id,
      name,
      slug,
      tagline,
      image_url,
      label_color,
      function_list
    `
    )
    .eq('is_active', true)
    .not('published_at', 'is', null)
    .or(`name.ilike.%${query}%,tagline.ilike.%${query}%`)
    .order('display_order', { ascending: true });

  if (error) {
    logger.error('Error searching products:', error);
    return [];
  }

  return data as Product[];
}

// =====================================================
// ADMIN QUERIES (Requires authentication)
// =====================================================

/**
 * Get all products including drafts (admin only)
 */
export async function getAllProductsAdmin(): Promise<Product[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('display_order', { ascending: true });

  if (error) {
    logger.error('Error fetching products (admin):', error);
    return [];
  }

  return data as Product[];
}

/**
 * Get product by ID (admin only)
 */
export async function getProductById(id: string): Promise<ProductWithIngredients | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('products')
    .select(
      `
      *,
      ingredients:product_ingredients(
        id,
        display_order,
        ingredient:ingredients(*)
      ),
      variants:product_variants(*)
    `
    )
    .eq('id', id)
    .single();

  if (error) {
    logger.error('Error fetching product by ID:', error);
    return null;
  }

  // Sort by display_order
  if (data) {
    data.ingredients = data.ingredients?.sort(
      (a: any, b: any) => a.display_order - b.display_order
    ) || [];
    data.variants = data.variants?.sort(
      (a: any, b: any) => a.display_order - b.display_order
    ) || [];
  }

  return data as ProductWithIngredients;
}
