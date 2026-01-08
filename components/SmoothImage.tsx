'use client';

import { useState } from 'react';
import Image from 'next/image';
import clsx from 'clsx';

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
  placeholderClassName?: string;
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
  placeholderClassName = '',
  objectPosition,
}: SmoothImageProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      {/* Placeholder */}
      <div
        className={clsx(
          'absolute inset-0 bg-gray-100 transition-opacity duration-500',
          loaded ? 'opacity-0' : 'opacity-100',
          placeholderClassName
        )}
      />
      {/* Actual image */}
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
        className={clsx(
          'transition-opacity duration-500',
          loaded ? 'opacity-100' : 'opacity-0',
          className
        )}
        onLoad={() => setLoaded(true)}
      />
    </>
  );
}
