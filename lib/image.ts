import imageUrlBuilder from '@sanity/image-url';
import { client } from './sanity.client';

const builder = imageUrlBuilder(client);

export function urlFor(source: any) {
  return builder.image(source);
}

export function getSrcSet(image: any, widths: number[] = [640, 1024, 1920]) {
  return widths
    .map((width) => `${urlFor(image).width(width).url()} ${width}w`)
    .join(', ');
}

export function getImageDimensions(image: any) {
  const metadata = image?.asset?.metadata;
  return {
    width: metadata?.dimensions?.width || 1200,
    height: metadata?.dimensions?.height || 630,
  };
}
