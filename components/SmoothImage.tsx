import Image from 'next/image';

// Generic subtle blur placeholder - warm neutral tone matching brand
const DEFAULT_BLUR_DATA_URL =
  'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAAUH/8QAIhAAAgEDAwUBAAAAAAAAAAAAAQIDAAQRBRIhBhMxQVFh/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAZEQACAwEAAAAAAAAAAAAAAAABAgADESH/2gAMAwEAAhEDEEA/AKWm6Rp11ptvNNZW0kjxKzs0YJYkAkn+1NKUrRFAUACs5k7n/9k=';

interface SmoothImageProps {
  src: string;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  sizes?: string;
  priority?: boolean;
  quality?: number;
  className?: string;
  objectPosition?: string;
  blurDataURL?: string;
}

export function SmoothImage({
  src,
  alt,
  fill,
  width,
  height,
  sizes,
  priority,
  quality,
  className = '',
  objectPosition,
  blurDataURL,
}: SmoothImageProps) {
  return (
    <Image
      src={src}
      alt={alt}
      fill={fill}
      width={!fill ? width : undefined}
      height={!fill ? height : undefined}
      sizes={sizes}
      priority={priority}
      quality={quality}
      style={objectPosition ? { objectPosition } : undefined}
      className={className}
      placeholder="blur"
      blurDataURL={blurDataURL || DEFAULT_BLUR_DATA_URL}
    />
  );
}
