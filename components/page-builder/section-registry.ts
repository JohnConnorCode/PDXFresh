/**
 * Section Registry
 *
 * Centralized registry of all page builder section types.
 * Makes it easy to add new sections without modifying SectionRenderer.
 */

import { ComponentType } from 'react';
import { HeroSectionComponent } from './HeroSection';
import { ContentSectionComponent } from './ContentSection';
import { CtaSectionComponent } from './CtaSection';
import { FeatureGridComponent } from './FeatureGrid';
import { ImageGalleryComponent } from './ImageGallery';
import { StatsSectionComponent } from './StatsSection';
import { TestimonialsSectionComponent } from './TestimonialsSection';
import { NewsletterSectionComponent } from './NewsletterSection';
import { FaqSectionComponent } from './FaqSection';
import { PricingSectionComponent } from './PricingSection';
import { VideoSectionComponent } from './VideoSection';
import { LogoCloudSectionComponent } from './LogoCloudSection';
import { ComparisonSectionComponent } from './ComparisonSection';

// Section component type
export type SectionComponent = ComponentType<any>;

// Registry mapping section type names to their components
export const sectionRegistry: Record<string, SectionComponent> = {
  // Original 8 sections
  heroSection: HeroSectionComponent,
  contentSection: ContentSectionComponent,
  ctaSection: CtaSectionComponent,
  featureGrid: FeatureGridComponent,
  imageGallery: ImageGalleryComponent,
  statsSection: StatsSectionComponent,
  testimonialsSection: TestimonialsSectionComponent,
  newsletterSection: NewsletterSectionComponent,
  // New 5 sections
  faqSection: FaqSectionComponent,
  pricingSection: PricingSectionComponent,
  videoSection: VideoSectionComponent,
  logoCloudSection: LogoCloudSectionComponent,
  comparisonSection: ComparisonSectionComponent,
};

// Get component for a section type
export function getSectionComponent(sectionType: string): SectionComponent | null {
  return sectionRegistry[sectionType] || null;
}

// Check if a section type is registered
export function isSectionRegistered(sectionType: string): boolean {
  return sectionType in sectionRegistry;
}

// Get all registered section types
export function getRegisteredSectionTypes(): string[] {
  return Object.keys(sectionRegistry);
}
