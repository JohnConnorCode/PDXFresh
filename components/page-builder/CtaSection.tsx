import Link from 'next/link';
import { Section } from '@/components/Section';
import { FadeIn } from '@/components/animations';

interface CtaSectionProps {
  heading: string;
  subheading?: string;
  ctaPrimary: any;
  ctaSecondary?: any;
  variant: string;
  backgroundColor: string;
}

const bgColorMap: Record<string, string> = {
  'accent-primary': 'bg-accent-primary text-white',
  'accent-yellow': 'bg-accent-yellow text-black',
  'accent-cream': 'bg-accent-cream text-black',
  white: 'bg-white text-black',
};

export function CtaSectionComponent({
  heading,
  subheading,
  ctaPrimary,
  ctaSecondary,
  variant,
  backgroundColor,
}: CtaSectionProps) {
  const bgClass = bgColorMap[backgroundColor] || 'bg-accent-primary text-white';
  const isWhiteText = backgroundColor === 'accent-primary';

  if (variant === 'banner') {
    return (
      <div className={`${bgClass} py-12`}>
        <Section>
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="font-heading text-3xl font-bold mb-2">{heading}</h2>
              {subheading && <p className="text-lg opacity-90">{subheading}</p>}
            </div>
            <div className="flex gap-4 flex-shrink-0">
              {ctaPrimary && (
                <Link
                  href={ctaPrimary.target?.externalUrl || `/${ctaPrimary.target?.pageRef?.slug?.current}` || '#'}
                  className={`px-8 py-4 rounded-full font-semibold transition-all ${
                    isWhiteText
                      ? 'bg-white text-accent-primary hover:bg-gray-100'
                      : 'bg-accent-primary text-white hover:opacity-90'
                  }`}
                >
                  {ctaPrimary.label}
                </Link>
              )}
              {ctaSecondary && (
                <Link
                  href={ctaSecondary.target?.externalUrl || `/${ctaSecondary.target?.pageRef?.slug?.current}` || '#'}
                  className="px-8 py-4 border-2 border-current rounded-full font-semibold hover:bg-current hover:bg-opacity-10 transition-colors"
                >
                  {ctaSecondary.label}
                </Link>
              )}
            </div>
          </div>
        </Section>
      </div>
    );
  }

  if (variant === 'box') {
    return (
      <Section>
        <FadeIn direction="up">
          <div className={`${bgClass} rounded-2xl p-12 text-center`}>
            <h2 className="font-heading text-4xl font-bold mb-4">{heading}</h2>
            {subheading && <p className="text-xl opacity-90 mb-8">{subheading}</p>}
            <div className="flex gap-4 justify-center flex-wrap">
              {ctaPrimary && (
                <Link
                  href={ctaPrimary.target?.externalUrl || `/${ctaPrimary.target?.pageRef?.slug?.current}` || '#'}
                  className={`px-8 py-4 rounded-full font-semibold transition-all ${
                    isWhiteText
                      ? 'bg-white text-accent-primary hover:bg-gray-100'
                      : 'bg-accent-primary text-white hover:opacity-90'
                  }`}
                >
                  {ctaPrimary.label}
                </Link>
              )}
              {ctaSecondary && (
                <Link
                  href={ctaSecondary.target?.externalUrl || `/${ctaSecondary.target?.pageRef?.slug?.current}` || '#'}
                  className="px-8 py-4 border-2 border-current rounded-full font-semibold hover:bg-current hover:bg-opacity-10 transition-colors"
                >
                  {ctaSecondary.label}
                </Link>
              )}
            </div>
          </div>
        </FadeIn>
      </Section>
    );
  }

  // centered variant
  return (
    <Section className={bgClass}>
      <div className="text-center max-w-3xl mx-auto">
        <FadeIn direction="up">
          <h2 className="font-heading text-4xl sm:text-5xl font-bold mb-4">{heading}</h2>
        </FadeIn>
        {subheading && (
          <FadeIn direction="up" delay={0.1}>
            <p className="text-xl opacity-90 mb-8">{subheading}</p>
          </FadeIn>
        )}
        <FadeIn direction="up" delay={0.2}>
          <div className="flex gap-4 justify-center flex-wrap">
            {ctaPrimary && (
              <Link
                href={ctaPrimary.target?.externalUrl || `/${ctaPrimary.target?.pageRef?.slug?.current}` || '#'}
                className={`px-8 py-4 rounded-full font-semibold transition-all ${
                  isWhiteText
                    ? 'bg-white text-accent-primary hover:bg-gray-100'
                    : 'bg-accent-primary text-white hover:opacity-90'
                }`}
              >
                {ctaPrimary.label}
              </Link>
            )}
            {ctaSecondary && (
              <Link
                href={ctaSecondary.target?.externalUrl || `/${ctaSecondary.target?.pageRef?.slug?.current}` || '#'}
                className="px-8 py-4 border-2 border-current rounded-full font-semibold hover:bg-current hover:bg-opacity-10 transition-colors"
              >
                {ctaSecondary.label}
              </Link>
            )}
          </div>
        </FadeIn>
      </div>
    </Section>
  );
}
