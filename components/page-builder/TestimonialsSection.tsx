import { Section } from '@/components/Section';
import { FadeIn } from '@/components/animations';
import { TestimonialCarousel } from '@/components/TestimonialCarousel';
import { client } from '@/lib/sanity.client';

interface TestimonialsSectionProps {
  heading?: string;
  subheading?: string;
  testimonials: Array<any>;
  layout: string;
}

async function getTestimonials(refs: Array<any>) {
  if (!refs || refs.length === 0) return [];

  const ids = refs.map(ref => ref._ref).filter(Boolean);
  if (ids.length === 0) return [];

  const query = `*[_type == "testimonial" && _id in $ids]`;
  return client.fetch(query, { ids });
}

export async function TestimonialsSectionComponent({
  heading,
  subheading,
  testimonials,
}: TestimonialsSectionProps) {
  const resolvedTestimonials = await getTestimonials(testimonials);

  if (!resolvedTestimonials || resolvedTestimonials.length === 0) {
    return null;
  }

  return (
    <Section className="bg-gradient-to-br from-accent-cream to-accent-yellow/20">
      {(heading || subheading) && (
        <div className="text-center mb-12">
          {heading && (
            <FadeIn direction="up">
              <h2 className="font-heading text-4xl font-bold mb-4">{heading}</h2>
            </FadeIn>
          )}
          {subheading && (
            <FadeIn direction="up" delay={0.1}>
              <p className="text-xl text-gray-600">{subheading}</p>
            </FadeIn>
          )}
        </div>
      )}
      <TestimonialCarousel testimonials={resolvedTestimonials} />
    </Section>
  );
}
