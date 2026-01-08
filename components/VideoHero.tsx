'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface VideoHeroProps {
  vimeoId: string;
  heading: string;
  subheading: string;
  ctaText: string;
  ctaLink: string;
  fallbackImage: string;
  mobileImage?: string;
}

export function VideoHero({
  vimeoId,
  heading,
  subheading,
  ctaText,
  ctaLink,
  fallbackImage,
  mobileImage,
}: VideoHeroProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Mark as loaded after a short delay for smooth transition
    const timer = setTimeout(() => setIsLoaded(true), 500);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Video Background - Desktop Only */}
      <div className="absolute inset-0 hidden md:block">
        <div
          className={`absolute inset-0 transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
          style={{ padding: '56.25% 0 0 0', position: 'relative' }}
        >
          <iframe
            src={`https://player.vimeo.com/video/${vimeoId}?background=1&autoplay=1&loop=1&byline=0&title=0&muted=1&quality=1080p`}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: '177.78vh', // 16:9 aspect ratio
              height: '100vh',
              minWidth: '100%',
              minHeight: '56.25vw', // 16:9 aspect ratio
              transform: 'translate(-50%, -50%)',
            }}
            frameBorder="0"
            allow="autoplay; fullscreen"
            allowFullScreen
            title="Portland Fresh Background Video"
          />
        </div>
        {/* Fallback image while video loads */}
        <div className={`absolute inset-0 transition-opacity duration-1000 ${isLoaded ? 'opacity-0' : 'opacity-100'}`}>
          <Image
            src={fallbackImage}
            alt={heading}
            fill
            className="object-cover"
            priority
            quality={90}
          />
        </div>
      </div>

      {/* Mobile Image Background */}
      <div className="absolute inset-0 md:hidden">
        <Image
          src={mobileImage || fallbackImage}
          alt={heading}
          fill
          className="object-cover"
          priority
          quality={90}
        />
      </div>

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/40 z-10" />

      {/* Content */}
      <div className="relative z-20 h-full flex items-start pt-36 sm:pt-44 md:items-center md:pt-0">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 w-full">
          <div className="max-w-4xl">
            {/* Heading */}
            <h1 className="font-heading text-5xl sm:text-6xl md:text-6xl lg:text-[6.5rem] font-bold text-white mb-4 sm:mb-6 md:mb-6 leading-[1.1] animate-fade-in-up">
              {heading}
            </h1>
            {/* Subheading */}
            <p className="text-lg sm:text-xl md:text-xl lg:text-2xl text-white/90 mb-6 sm:mb-8 md:mb-10 leading-relaxed max-w-3xl animate-fade-in-up animation-delay-200">
              {subheading}
            </p>
            {/* CTA */}
            <div className="animate-fade-in-up animation-delay-400">
              <Link
                href={ctaLink}
                className="inline-block px-6 py-3 sm:px-8 sm:py-4 md:px-10 md:py-5 bg-accent-primary text-white text-sm sm:text-base md:text-lg font-semibold rounded-full hover:bg-accent-primary/90 transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-accent-primary/50"
              >
                {ctaText}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 animate-bounce hidden sm:block">
        <svg
          className="w-6 h-6 text-white/75"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </div>

      {/* Portland Fresh badge */}
      <div className="absolute bottom-6 right-6 hidden md:flex flex-col gap-1 rounded-2xl border border-white/60 bg-white/80 px-5 py-3 text-right text-sm text-gray-700 shadow-xl backdrop-blur-lg z-30">
        <span className="uppercase text-xs tracking-[0.3em] text-accent-primary">Portland Fresh</span>
        <span className="font-heading text-lg text-gray-900">Seasonal drops weekly</span>
        <span className="text-xs text-gray-500">Claim containers before they sell out</span>
      </div>
    </div>
  );
}
