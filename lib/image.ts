import imageUrlBuilder from '@sanity/image-url';
import { SanityImageSource } from '@sanity/image-url/lib/types/types';
import { client } from './sanity.client';
import type { SanityImage } from '../sanity/sanity.types';

const builder = imageUrlBuilder(client);

/**
 * Optimized image URL builder with best practices
 * @param source Sanity image source
 * @param options Image optimization options
 */
export function urlFor(
  source: SanityImageSource,
  options?: {
    width?: number;
    height?: number;
    quality?: number;
    fit?: 'clip' | 'crop' | 'fill' | 'fillmax' | 'max' | 'scale' | 'min';
  }
) {
  let imageBuilder = builder.image(source).auto('format'); // Auto-select best format (AVIF/WebP)

  if (options?.width) {
    imageBuilder = imageBuilder.width(options.width);
  }

  if (options?.height) {
    imageBuilder = imageBuilder.height(options.height);
  }

  if (options?.quality) {
    imageBuilder = imageBuilder.quality(options.quality);
  } else {
    imageBuilder = imageBuilder.quality(85); // Default quality
  }

  if (options?.fit) {
    imageBuilder = imageBuilder.fit(options.fit);
  } else {
    imageBuilder = imageBuilder.fit('max'); // Default to max (responsive)
  }

  return imageBuilder;
}

/**
 * Generate responsive srcSet for images
 * @param image Sanity image
 * @param widths Array of widths to generate
 */
export function getSrcSet(image: SanityImageSource, widths: number[] = [640, 1024, 1920]) {
  return widths
    .map((width) => `${urlFor(image, { width }).url()} ${width}w`)
    .join(', ');
}

/**
 * Get image dimensions from Sanity metadata
 * @param image Sanity image object
 */
export function getImageDimensions(image: any) {
  const metadata = image?.asset?.metadata;
  return {
    width: metadata?.dimensions?.width || 1200,
    height: metadata?.dimensions?.height || 630,
    aspectRatio: metadata?.dimensions
      ? metadata.dimensions.width / metadata.dimensions.height
      : 16 / 9,
  };
}

/**
 * Generate blur placeholder for images
 * @param image Sanity image source
 */
export function getBlurDataURL(image: SanityImageSource): string {
  return urlFor(image, { width: 20, quality: 20 }).url();
}

/**
 * Get optimized image props for Next.js Image component
 * @param image Sanity image with alt text
 * @param options Size and quality options
 */
export function getImageProps(
  image: SanityImage,
  options?: {
    width?: number;
    height?: number;
    quality?: number;
  }
) {
  const dimensions = getImageDimensions(image);

  return {
    src: urlFor(image, options).url(),
    alt: image.alt || '',
    width: options?.width || dimensions.width,
    height: options?.height || dimensions.height,
    blurDataURL: getBlurDataURL(image),
    placeholder: 'blur' as const,
  };
}
