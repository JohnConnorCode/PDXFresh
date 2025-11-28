import Image from 'next/image';
import Link from 'next/link';
import { Section } from '@/components/Section';
import { FadeIn } from '@/components/animations';
import { urlFor } from '@/lib/image';

interface Logo {
  image: {
    asset: any;
  };
  name: string;
  url?: string;
}

interface LogoCloudSectionProps {
  heading?: string;
  subheading?: string;
  logos: Logo[];
  variant?: 'grid' | 'carousel' | 'inline';
  grayscale?: boolean;
  backgroundColor?: string;
}

const bgColorMap: Record<string, string> = {
  white: 'bg-white',
  'accent-cream': 'bg-accent-cream',
  'gray-50': 'bg-gray-50',
};

export function LogoCloudSectionComponent({
  heading,
  subheading,
  logos,
  variant = 'grid',
  grayscale = true,
  backgroundColor = 'white',
}: LogoCloudSectionProps) {
  const bgClass = bgColorMap[backgroundColor] || 'bg-white';

  const LogoItem = ({ logo, index }: { logo: Logo; index: number }) => {
    const imageUrl = urlFor(logo.image).width(200).height(80).url();

    const imageElement = (
      <div
        className={`relative h-12 w-32 transition-all duration-300 ${
          grayscale ? 'grayscale opacity-60 hover:grayscale-0 hover:opacity-100' : ''
        }`}
      >
        <Image
          src={imageUrl}
          alt={logo.name}
          fill
          className="object-contain"
        />
      </div>
    );

    if (logo.url) {
      return (
        <FadeIn key={index} direction="up" delay={index * 0.05}>
          <Link
            href={logo.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            {imageElement}
          </Link>
        </FadeIn>
      );
    }

    return (
      <FadeIn key={index} direction="up" delay={index * 0.05}>
        {imageElement}
      </FadeIn>
    );
  };

  return (
    <Section className={bgClass}>
      {(heading || subheading) && (
        <FadeIn direction="up" className="text-center mb-10">
          {heading && (
            <h2 className="font-heading text-2xl font-bold mb-2 text-gray-500">
              {heading}
            </h2>
          )}
          {subheading && (
            <p className="text-gray-500">{subheading}</p>
          )}
        </FadeIn>
      )}

      {variant === 'grid' && (
        <div
          className={`grid gap-8 items-center justify-items-center ${
            logos.length <= 4
              ? 'grid-cols-2 md:grid-cols-4'
              : logos.length <= 6
                ? 'grid-cols-3 md:grid-cols-6'
                : 'grid-cols-3 md:grid-cols-4 lg:grid-cols-6'
          }`}
        >
          {logos.map((logo, index) => (
            <LogoItem key={index} logo={logo} index={index} />
          ))}
        </div>
      )}

      {variant === 'inline' && (
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
          {logos.map((logo, index) => (
            <LogoItem key={index} logo={logo} index={index} />
          ))}
        </div>
      )}

      {variant === 'carousel' && (
        <div className="relative overflow-hidden">
          <div className="flex animate-scroll gap-12">
            {/* Duplicate logos for infinite scroll effect */}
            {[...logos, ...logos].map((logo, index) => (
              <div key={index} className="flex-shrink-0">
                <LogoItem logo={logo} index={index % logos.length} />
              </div>
            ))}
          </div>
        </div>
      )}
    </Section>
  );
}
