import Image from 'next/image';
import { urlFor } from '@/lib/image';
import { Section } from '@/components/Section';
import { FadeIn, StaggerContainer } from '@/components/animations';

interface FeatureGridProps {
  heading?: string;
  subheading?: string;
  features: Array<{
    title: string;
    description?: string;
    image?: any;
    icon?: string;
  }>;
  columns: number;
}

export function FeatureGridComponent({
  heading,
  subheading,
  features,
  columns,
}: FeatureGridProps) {
  const gridColsMap: Record<number, string> = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-3',
    4: 'md:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <Section>
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
      <StaggerContainer
        className={`grid grid-cols-1 ${gridColsMap[columns] || 'md:grid-cols-3'} gap-8`}
      >
        {features.map((feature, index) => (
          <div
            key={index}
            className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-shadow"
          >
            {feature.image && (
              <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden">
                <Image
                  src={urlFor(feature.image).url()}
                  alt={feature.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
            )}
            <h3 className="font-heading text-2xl font-bold mb-3">{feature.title}</h3>
            {feature.description && (
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            )}
          </div>
        ))}
      </StaggerContainer>
    </Section>
  );
}
