'use client';

import Image from 'next/image';

interface AnimatedLogoProps {
  className?: string;
  logoUrl?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'header' | 'footer';
}

export function AnimatedLogo({
  className = '',
  logoUrl,
  size = 'md',
  variant: _variant = 'header',
}: AnimatedLogoProps) {
  // Size configurations - proper aspect ratio for horizontal wordmark (600x316 = ~1.9:1)
  const sizeClasses = {
    sm: 'h-8',
    md: 'h-10',
    lg: 'h-12',
  };

  const widthMap = {
    sm: 152,
    md: 190,
    lg: 228,
  };

  const heightMap = {
    sm: 32,
    md: 40,
    lg: 48,
  };

  const logoSrc = logoUrl || '/LogoPNG-e1590165207190-600x316.png';

  return (
    <div className={`flex items-center ${className}`}>
      <Image
        src={logoSrc}
        alt="Portland Fresh"
        width={widthMap[size]}
        height={heightMap[size]}
        className={`${sizeClasses[size]} w-auto object-contain`}
        priority
      />
    </div>
  );
}
