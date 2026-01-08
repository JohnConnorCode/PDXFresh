'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import clsx from 'clsx';

interface BlendCardProps {
  blend: any;
}

const labelColorMap = {
  yellow: 'bg-accent-yellow',
  red: 'bg-accent-primary',
  green: 'bg-accent-green',
  blue: 'bg-blue-500',
};

export function BlendCard({ blend }: BlendCardProps) {
  const slug = typeof blend.slug === 'string' ? blend.slug : (blend.slug?.current || blend.id || '');
  const imageUrl = blend.image_url || blend.image?.asset?.url;
  const category = (blend.category || blend.category_name || blend.categoryLabel) as string | undefined;
  const readableCategory = category ? category.replace(/-/g, ' ') : undefined;

  // Don't render if no valid slug
  if (!slug) {
    console.error('BlendCard: No valid slug found for blend:', blend);
    return null;
  }

  return (
    <Link href={`/blends/${slug}`}>
      <motion.div
        className="group cursor-pointer"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.5, ease: [0.25, 0.4, 0.25, 1] }}
      >
        <div className="relative overflow-hidden rounded-lg bg-gray-100 mb-4 shadow-sm hover:shadow-md transition-shadow duration-300">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={blend.image_alt || blend.name}
              width={800}
              height={600}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="w-full h-64 object-cover"
            />
          ) : (
            <div className="w-full h-64 flex items-center justify-center bg-gray-100">
              <span className="font-heading text-4xl font-bold text-gray-400">{blend.name}</span>
            </div>
          )}
          {readableCategory && (
            <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/60 text-white text-[11px] font-semibold uppercase tracking-wide">
              {readableCategory}
            </div>
          )}
          {(blend.label_color || blend.labelColor) && (
            <div
              className={clsx(
                'absolute top-3 right-3 w-8 h-8 rounded-full',
                labelColorMap[(blend.label_color || blend.labelColor) as keyof typeof labelColorMap]
              )}
            />
          )}
        </div>
        <h3 className="font-heading text-lg font-bold mb-1">{blend.name}</h3>
        <p className="text-sm text-muted mb-3">{blend.tagline}</p>
        {(blend.weight || blend.heat_level || blend.contains_nuts) && (
          <p className="text-xs font-semibold text-gray-500 mb-3">
            {blend.weight ? blend.weight : ''}
            {blend.weight && blend.heat_level ? ' • ' : ''}
            {blend.heat_level ? `${blend.heat_level} heat` : ''}
            {(blend.weight || blend.heat_level) && blend.contains_nuts ? ' • ' : ''}
            {blend.contains_nuts ? 'Contains nuts' : ''}
          </p>
        )}
        {blend.ingredients_preview && (
          <p className="text-xs text-gray-500 mb-3">
            <span className="font-semibold text-gray-600">Ingredients:</span>{' '}
            {blend.ingredients_preview.slice(0, 3).join(', ')}
            {blend.ingredients_preview.length > 3 ? '...' : ''}
          </p>
        )}
        {(blend.function_list || blend.functionList) && (blend.function_list || blend.functionList).length > 0 && (
          <div className="flex flex-wrap gap-2">
            <span className="text-[11px] uppercase tracking-wide text-gray-400 w-full">Serving ideas</span>
            {(blend.function_list || blend.functionList).slice(0, 3).map((func: string) => (
              <span
                key={func}
                className="text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-700"
              >
                {func}
              </span>
            ))}
          </div>
        )}
      </motion.div>
    </Link>
  );
}
