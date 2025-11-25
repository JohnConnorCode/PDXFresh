import Image from 'next/image';
import { urlFor } from '@/lib/image';
import { Section } from '@/components/Section';
import { FadeIn } from '@/components/animations';
import { NewsletterForm } from '@/components/NewsletterForm';

interface NewsletterSectionProps {
  heading: string;
  subheading?: string;
  placeholder: string;
  buttonText: string;
  variant: string;
  image?: any;
}

export function NewsletterSectionComponent({
  heading,
  subheading,
  variant,
  image,
}: NewsletterSectionProps) {
  if (variant === 'banner') {
    return (
      <div className="bg-accent-primary text-white py-12">
        <Section>
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex-1">
              <h2 className="font-heading text-3xl md:text-4xl font-bold mb-2">{heading}</h2>
              {subheading && <p className="text-lg text-white/90">{subheading}</p>}
            </div>
            <div className="w-full md:w-auto md:min-w-[400px]">
              <NewsletterForm />
            </div>
          </div>
        </Section>
      </div>
    );
  }

  if (variant === 'with-image') {
    return (
      <Section className="bg-gradient-to-br from-accent-yellow/40 to-accent-green/20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <FadeIn direction="right">
            <div>
              <h2 className="font-heading text-4xl md:text-5xl font-bold mb-4">{heading}</h2>
              {subheading && <p className="text-xl text-gray-700 mb-6">{subheading}</p>}
              <NewsletterForm />
            </div>
          </FadeIn>
          {image && (
            <FadeIn direction="left" delay={0.2}>
              <div className="relative w-full h-96 rounded-2xl overflow-hidden shadow-2xl">
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

  // simple variant
  return (
    <Section className="bg-gradient-to-br from-accent-yellow/40 to-accent-green/20">
      <div className="max-w-2xl mx-auto text-center">
        <FadeIn direction="up">
          <h2 className="font-heading text-4xl md:text-5xl font-bold mb-4">{heading}</h2>
        </FadeIn>
        {subheading && (
          <FadeIn direction="up" delay={0.1}>
            <p className="text-xl text-gray-700 mb-8">{subheading}</p>
          </FadeIn>
        )}
        <FadeIn direction="up" delay={0.2}>
          <NewsletterForm />
        </FadeIn>
      </div>
    </Section>
  );
}
