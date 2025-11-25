import { HeroSectionComponent } from './HeroSection';
import { ContentSectionComponent } from './ContentSection';
import { CtaSectionComponent } from './CtaSection';
import { FeatureGridComponent } from './FeatureGrid';
import { ImageGalleryComponent } from './ImageGallery';
import { StatsSectionComponent } from './StatsSection';
import { TestimonialsSectionComponent } from './TestimonialsSection';
import { NewsletterSectionComponent } from './NewsletterSection';

interface SectionRendererProps {
  sections: any[];
}

export function SectionRenderer({ sections }: SectionRendererProps) {
  return (
    <>
      {sections.map((section, index) => {
        const sectionType = section._type;

        switch (sectionType) {
          case 'heroSection':
            return <HeroSectionComponent key={index} {...section} />;
          case 'contentSection':
            return <ContentSectionComponent key={index} {...section} />;
          case 'ctaSection':
            return <CtaSectionComponent key={index} {...section} />;
          case 'featureGrid':
            return <FeatureGridComponent key={index} {...section} />;
          case 'imageGallery':
            return <ImageGalleryComponent key={index} {...section} />;
          case 'statsSection':
            return <StatsSectionComponent key={index} {...section} />;
          case 'testimonialsSection':
            return <TestimonialsSectionComponent key={index} {...section} />;
          case 'newsletterSection':
            return <NewsletterSectionComponent key={index} {...section} />;
          default:
            console.warn(`Unknown section type: ${sectionType}`);
            return null;
        }
      })}
    </>
  );
}
