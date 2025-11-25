import { Section } from '@/components/Section';
import { RichText } from '@/components/RichText';
import { FadeIn } from '@/components/animations';

interface ContentSectionProps {
  heading?: string;
  content: any;
  layout: string;
  backgroundColor: string;
}

const bgColorMap: Record<string, string> = {
  white: 'bg-white',
  'accent-cream': 'bg-accent-cream',
  'accent-yellow/10': 'bg-accent-yellow/10',
  'accent-green/10': 'bg-accent-green/10',
};

export function ContentSectionComponent({
  heading,
  content,
  layout,
  backgroundColor,
}: ContentSectionProps) {
  const bgClass = bgColorMap[backgroundColor] || 'bg-white';

  if (layout === 'centered') {
    return (
      <Section className={bgClass}>
        <div className="max-w-3xl mx-auto text-center">
          {heading && (
            <FadeIn direction="up">
              <h2 className="font-heading text-4xl font-bold mb-8">{heading}</h2>
            </FadeIn>
          )}
          <FadeIn direction="up" delay={0.1}>
            <div className="prose prose-lg mx-auto">
              <RichText value={content} />
            </div>
          </FadeIn>
        </div>
      </Section>
    );
  }

  if (layout === 'two-column') {
    return (
      <Section className={bgClass}>
        {heading && (
          <FadeIn direction="up">
            <h2 className="font-heading text-4xl font-bold mb-8">{heading}</h2>
          </FadeIn>
        )}
        <FadeIn direction="up" delay={0.1}>
          <div className="prose prose-lg max-w-none columns-1 md:columns-2 gap-12">
            <RichText value={content} />
          </div>
        </FadeIn>
      </Section>
    );
  }

  // left layout
  return (
    <Section className={bgClass}>
      {heading && (
        <FadeIn direction="up">
          <h2 className="font-heading text-4xl font-bold mb-8">{heading}</h2>
        </FadeIn>
      )}
      <FadeIn direction="up" delay={0.1}>
        <div className="prose prose-lg max-w-none">
          <RichText value={content} />
        </div>
      </FadeIn>
    </Section>
  );
}
