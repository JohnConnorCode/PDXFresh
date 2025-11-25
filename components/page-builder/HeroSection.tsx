import Image from 'next/image';
import Link from 'next/link';
import { urlFor } from '@/lib/image';
import { Section } from '@/components/Section';
import { FadeIn } from '@/components/animations';

interface HeroSectionProps {
  variant: string;
  heading: string;
  subheading?: string;
  image?: any;
  ctaPrimary?: any;
  ctaSecondary?: any;
  backgroundColor: string;
}

const bgColorMap: Record<string, string> = {
  white: 'bg-white',
  'accent-cream': 'bg-accent-cream',
  'yellow-gradient': 'bg-gradient-to-br from-accent-yellow/40 to-accent-green/20',
  'green-gradient': 'bg-gradient-to-br from-accent-green/40 to-accent-primary/20',
};

export function HeroSectionComponent({
  variant,
  heading,
  subheading,
  image,
  ctaPrimary,
  ctaSecondary,
  backgroundColor,
}: HeroSectionProps) {
  const bgClass = bgColorMap[backgroundColor] || 'bg-white';

  if (variant === 'centered') {
    return (
      <Section className={`${bgClass} py-20 sm:py-32`}>
        <div className="text-center max-w-4xl mx-auto">
          <FadeIn direction="up" delay={0.1}>
            <h1 className="font-heading text-5xl sm:text-6xl md:text-7xl font-bold mb-6 leading-tight">
              {heading}
            </h1>
          </FadeIn>
          {subheading && (
            <FadeIn direction="up" delay={0.2}>
              <p className="text-xl sm:text-2xl text-gray-600 mb-8 leading-relaxed">
                {subheading}
              </p>
            </FadeIn>
          )}
          <FadeIn direction="up" delay={0.3}>
            <div className="flex gap-4 justify-center flex-wrap">
              {ctaPrimary && (
                <Link
                  href={ctaPrimary.target?.externalUrl || `/${ctaPrimary.target?.pageRef?.slug?.current}` || '#'}
                  className="px-8 py-4 bg-accent-primary text-white rounded-full font-semibold hover:opacity-90 transition-opacity"
                >
                  {ctaPrimary.label}
                </Link>
              )}
              {ctaSecondary && (
                <Link
                  href={ctaSecondary.target?.externalUrl || `/${ctaSecondary.target?.pageRef?.slug?.current}` || '#'}
                  className="px-8 py-4 border-2 border-black text-black rounded-full font-semibold hover:bg-black hover:text-white transition-colors"
                >
                  {ctaSecondary.label}
                </Link>
              )}
            </div>
          </FadeIn>
          {image && (
            <FadeIn direction="up" delay={0.4}>
              <div className="relative w-full h-96 mt-12 rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src={urlFor(image).url()}
                  alt={heading}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 1200px"
                />
              </div>
            </FadeIn>
          )}
        </div>
      </Section>
    );
  }

  if (variant === 'split-right' || variant === 'split-left') {
    return (
      <Section className={`${bgClass} py-20 sm:py-32`}>
        <div className={`grid md:grid-cols-2 gap-12 items-center ${variant === 'split-left' ? 'md:grid-flow-dense' : ''}`}>
          <div className={variant === 'split-left' ? 'md:col-start-2' : ''}>
            <FadeIn direction="up" delay={0.1}>
              <h1 className="font-heading text-5xl sm:text-6xl font-bold mb-6 leading-tight">
                {heading}
              </h1>
            </FadeIn>
            {subheading && (
              <FadeIn direction="up" delay={0.2}>
                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                  {subheading}
                </p>
              </FadeIn>
            )}
            <FadeIn direction="up" delay={0.3}>
              <div className="flex gap-4 flex-wrap">
                {ctaPrimary && (
                  <Link
                    href={ctaPrimary.target?.externalUrl || `/${ctaPrimary.target?.pageRef?.slug?.current}` || '#'}
                    className="px-8 py-4 bg-accent-primary text-white rounded-full font-semibold hover:opacity-90 transition-opacity"
                  >
                    {ctaPrimary.label}
                  </Link>
                )}
                {ctaSecondary && (
                  <Link
                    href={ctaSecondary.target?.externalUrl || `/${ctaSecondary.target?.pageRef?.slug?.current}` || '#'}
                    className="px-8 py-4 border-2 border-black text-black rounded-full font-semibold hover:bg-black hover:text-white transition-colors"
                  >
                    {ctaSecondary.label}
                  </Link>
                )}
              </div>
            </FadeIn>
          </div>
          {image && (
            <FadeIn direction={variant === 'split-left' ? 'right' : 'left'} delay={0.2}>
              <div className="relative w-full h-96 md:h-full min-h-[400px] rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src={urlFor(image).url()}
                  alt={heading}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </FadeIn>
          )}
        </div>
      </Section>
    );
  }

  // full-width variant
  return (
    <div className="relative h-[600px] w-full overflow-hidden">
      {image && (
        <Image
          src={urlFor(image).url()}
          alt={heading}
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
      )}
      <div className="absolute inset-0 bg-black/40" />
      <div className="relative z-10 h-full flex items-center">
        <Section>
          <div className="max-w-4xl">
            <FadeIn direction="up" delay={0.1}>
              <h1 className="font-heading text-5xl sm:text-6xl md:text-7xl font-bold text-white mb-6 leading-tight">
                {heading}
              </h1>
            </FadeIn>
            {subheading && (
              <FadeIn direction="up" delay={0.2}>
                <p className="text-xl sm:text-2xl text-white/90 mb-8 leading-relaxed">
                  {subheading}
                </p>
              </FadeIn>
            )}
            <FadeIn direction="up" delay={0.3}>
              <div className="flex gap-4 flex-wrap">
                {ctaPrimary && (
                  <Link
                    href={ctaPrimary.target?.externalUrl || `/${ctaPrimary.target?.pageRef?.slug?.current}` || '#'}
                    className="px-8 py-4 bg-accent-primary text-white rounded-full font-semibold hover:opacity-90 transition-opacity shadow-xl"
                  >
                    {ctaPrimary.label}
                  </Link>
                )}
                {ctaSecondary && (
                  <Link
                    href={ctaSecondary.target?.externalUrl || `/${ctaSecondary.target?.pageRef?.slug?.current}` || '#'}
                    className="px-8 py-4 bg-white text-black rounded-full font-semibold hover:bg-gray-100 transition-colors shadow-xl"
                  >
                    {ctaSecondary.label}
                  </Link>
                )}
              </div>
            </FadeIn>
          </div>
        </Section>
      </div>
    </div>
  );
}
