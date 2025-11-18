/**
 * Sanity TypeScript Types
 * Auto-generated type definitions for Sanity schemas
 */

import type { PortableTextBlock } from 'sanity';
import type { Image, Slug, Reference } from 'sanity';

// Base types
export type SanityImage = Image & {
  alt?: string;
  caption?: string;
};

export type SanitySlug = Slug & {
  current: string;
};

export type SanityReference<T> = Reference & {
  _ref: string;
  _type: 'reference';
};

// Block Content
export type BlockContent = PortableTextBlock[];

// CTA (Call to Action)
export interface CTA {
  _id: string;
  _type: 'cta';
  title: string;
  label: string;
  variant?: 'primary' | 'secondary' | 'outline';
  target: {
    type: 'internal' | 'external';
    pageRef?: SanityReference<Page>;
    externalUrl?: string;
  };
}

// Site Settings
export interface SiteSettings {
  _id: string;
  _type: 'siteSettings';
  siteName: string;
  siteUrl: string;
  logo?: SanityImage;
  favicon?: SanityImage;
  contactEmail?: string;
  phoneNumber?: string;
  address?: string;
  socialLinks?: {
    platform: 'instagram' | 'facebook' | 'twitter' | 'linkedin' | 'youtube';
    url: string;
  }[];
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    titleTemplate?: string;
    twitterHandle?: string;
    ogImage?: SanityImage;
  };
}

// Navigation
export interface Navigation {
  _id: string;
  _type: 'navigation';
  primaryLinks?: {
    title: string;
    url: string;
    pageRef?: SanityReference<Page>;
  }[];
  footerLinks?: {
    title: string;
    links: {
      title: string;
      url: string;
      pageRef?: SanityReference<Page>;
    }[];
  }[];
  legalLinks?: {
    title: string;
    url: string;
    pageRef?: SanityReference<Page>;
  }[];
}

// Process Step
export interface ProcessStep {
  _id: string;
  _type: 'processStep';
  title: string;
  description: string;
  icon?: SanityImage;
  order: number;
}

// Standard
export interface Standard {
  _id: string;
  _type: 'standard';
  title: string;
  description: string;
  icon?: SanityImage;
  order: number;
}

// Testimonial
export interface Testimonial {
  _id: string;
  _type: 'testimonial';
  name: string;
  title?: string;
  company?: string;
  image?: SanityImage;
  quote: string;
  rating?: number;
  order?: number;
}

// Team Member
export interface TeamMember {
  _id: string;
  _type: 'teamMember';
  name: string;
  role: string;
  bio?: BlockContent;
  image?: SanityImage;
  socialLinks?: {
    platform: string;
    url: string;
  }[];
  order?: number;
}

// FAQ
export interface FAQ {
  _id: string;
  _type: 'faq';
  question: string;
  answer: BlockContent;
  category?: string;
  order?: number;
}

// Post
export interface Post {
  _id: string;
  _type: 'post';
  title: string;
  slug: SanitySlug;
  excerpt?: string;
  content: BlockContent;
  mainImage?: SanityImage;
  publishedAt?: string;
  author?: string;
  tags?: string[];
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
  };
}

// Page
export interface Page {
  _id: string;
  _type: 'page';
  title: string;
  slug: SanitySlug;
  content: BlockContent;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
  };
}

// Home Page
export interface HomePage {
  _id: string;
  _type: 'homePage';
  heroSlides?: {
    heading: string;
    subheading?: string;
    image: SanityImage;
    cta?: SanityReference<CTA>;
  }[];
  valueProps?: {
    title: string;
    description: string;
    icon?: SanityImage;
  }[];
  featuredBlendsHeading?: string;
  statsHeading?: string;
  processSteps?: SanityReference<ProcessStep>[];
  standards?: SanityReference<Standard>[];
  newsletterCta?: SanityReference<CTA>;
}

// About Page
export interface AboutPage {
  _id: string;
  _type: 'aboutPage';
  heroHeading?: string;
  heroSubheading?: string;
  heroImage?: SanityImage;
  missionStatement?: BlockContent;
  teamMembers?: SanityReference<TeamMember>[];
  values?: {
    title: string;
    description: string;
    icon?: SanityImage;
  }[];
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
  };
}

// Blends Page
export interface BlendsPage {
  _id: string;
  _type: 'blendsPage';
  heroHeading?: string;
  heroSubheading?: string;
  heroImage?: SanityImage;
  introText?: BlockContent;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
  };
}

// FAQ Page
export interface FAQPage {
  _id: string;
  _type: 'faqPage';
  heroHeading?: string;
  heroSubheading?: string;
  categories?: {
    title: string;
    faqs: SanityReference<FAQ>[];
  }[];
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
  };
}

// Process Page
export interface ProcessPage {
  _id: string;
  _type: 'processPage';
  heroHeading?: string;
  heroSubheading?: string;
  heroImage?: SanityImage;
  introText?: BlockContent;
  processSteps?: SanityReference<ProcessStep>[];
  standards?: SanityReference<Standard>[];
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
  };
}

// Ingredients Sourcing Page
export interface IngredientsSourcingPage {
  _id: string;
  _type: 'ingredientsSourcingPage';
  heroHeading?: string;
  heroSubheading?: string;
  heroImage?: SanityImage;
  introText?: BlockContent;
  ingredientCategories?: {
    categoryName: string;
    color: string;
    ingredients: string[];
  }[];
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
  };
}

// Subscriptions Page
export interface SubscriptionsPage {
  _id: string;
  _type: 'subscriptionsPage';
  heroHeading?: string;
  heroSubheading?: string;
  benefitsHeading?: string;
  benefits?: {
    title: string;
    description: string;
    icon?: SanityImage;
  }[];
  faqHeading?: string;
  faqs?: SanityReference<FAQ>[];
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
  };
}

// Wholesale Page
export interface WholesalePage {
  _id: string;
  _type: 'wholesalePage';
  heroHeading?: string;
  heroSubheading?: string;
  heroImage?: SanityImage;
  benefits?: {
    title: string;
    description: string;
    icon?: SanityImage;
  }[];
  pricing?: BlockContent;
  contactCta?: SanityReference<CTA>;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
  };
}

// Social Proof
export interface SocialProof {
  _id: string;
  _type: 'socialProof';
  stats?: {
    value: string;
    label: string;
  }[];
  featuredTestimonials?: SanityReference<Testimonial>[];
}

// Stripe Product (Subscription Plans)
export interface StripeProduct {
  _id: string;
  _type: 'stripeProduct';
  title: string;
  slug: SanitySlug;
  description?: string;
  badge?: string;
  featured?: boolean;
  isActive: boolean;
  stripeProductId: string;
  tierKey?: 'basic' | 'pro' | 'premium' | 'enterprise';
  variants: {
    sizeKey: 'gallon' | 'half_gallon' | 'shot';
    label: string;
    stripePriceId: string;
    isDefault?: boolean;
    uiOrder?: number;
  }[];
  uiOrder?: number;
  image?: SanityImage;
  ctaLabel?: string;
  notes?: string;
}

// Stripe Settings
export interface StripeSettings {
  _id: string;
  _type: 'stripeSettings';
  mode: 'test' | 'production';
  lastUpdated?: string;
}

// Subscription Page Settings
export interface SubscriptionPageSettings {
  _id: string;
  _type: 'subscriptionPageSettings';
  compareFeatures?: {
    featureName: string;
    basic?: boolean;
    pro?: boolean;
    premium?: boolean;
    enterprise?: boolean;
  }[];
  faq?: SanityReference<FAQ>[];
}

// Partnership Perk
export interface PartnershipPerk {
  _id: string;
  _type: 'partnershipPerk';
  title: string;
  description: string;
  tier: 'basic' | 'pro' | 'premium' | 'enterprise';
  icon?: SanityImage;
  order?: number;
}

// User Discount
export interface UserDiscount {
  _id: string;
  _type: 'userDiscount';
  discountCode: string;
  description: string;
  discountPercent: number;
  stripeCouponId?: string;
  isActive: boolean;
  validFrom?: string;
  validTo?: string;
  maxUses?: number;
  tier?: 'basic' | 'pro' | 'premium' | 'enterprise';
  priority?: number;
}

// Upsell Offer
export interface UpsellOffer {
  _id: string;
  _type: 'upsellOffer';
  title: string;
  description: string;
  productRef?: string;
  discountPercent?: number;
  isActive: boolean;
  triggerCondition?: 'cart_value' | 'product_category' | 'first_purchase' | 'subscription';
  priority?: number;
}

// Referral Reward
export interface ReferralReward {
  _id: string;
  _type: 'referralReward';
  title: string;
  description: string;
  rewardType: 'discount' | 'points' | 'free_product' | 'tier_upgrade';
  rewardValue?: number;
  stripeCouponId?: string;
  isActive: boolean;
  minReferrals?: number;
}

// Union types for queries
export type SanityDocument =
  | SiteSettings
  | Navigation
  | HomePage
  | AboutPage
  | BlendsPage
  | FAQPage
  | ProcessPage
  | IngredientsSourcingPage
  | SubscriptionsPage
  | WholesalePage
  | SocialProof
  | Page
  | Post
  | ProcessStep
  | Standard
  | Testimonial
  | TeamMember
  | FAQ
  | CTA
  | StripeProduct
  | StripeSettings
  | SubscriptionPageSettings
  | PartnershipPerk
  | UserDiscount
  | UpsellOffer
  | ReferralReward;
