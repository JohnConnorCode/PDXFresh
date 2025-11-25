import Image from 'next/image';
import { urlFor } from '@/lib/image';
import { Section } from '@/components/Section';
import { FadeIn } from '@/components/animations';

interface ImageGalleryProps {
  heading?: string;
  images: Array<{
    asset: any;
    caption?: string;
  }>;
  layout: string;
}

export function ImageGalleryComponent({
  heading,
  images,
  layout,
}: ImageGalleryProps) {
  return (
    <Section>
      {heading && (
        <FadeIn direction="up">
          <h2 className="font-heading text-4xl font-bold mb-12 text-center">{heading}</h2>
        </FadeIn>
      )}
      <div className={`grid ${layout === 'masonry' ? 'md:grid-cols-3 gap-4' : 'md:grid-cols-3 gap-6'}`}>
        {images.map((image, index) => (
          <FadeIn key={index} direction="up" delay={index * 0.05}>
            <div className="relative w-full h-64 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow group">
              <Image
                src={urlFor(image).url()}
                alt={image.caption || 'Gallery image'}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              {image.caption && (
                <div className="absolute inset-x-0 bottom-0 bg-black/60 text-white p-3 text-sm">
                  {image.caption}
                </div>
              )}
            </div>
          </FadeIn>
        ))}
      </div>
    </Section>
  );
}
