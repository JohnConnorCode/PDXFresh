import Image from 'next/image';

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
}: SmoothImageProps) {
  // Priority images load fast - no placeholder needed
  // Non-priority images: let Next.js handle loading naturally
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
    />
  );
}
