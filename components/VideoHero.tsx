'use client';

import { useState, useEffect, useRef } from 'react';
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
  const [videoReady, setVideoReady] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Check if we're on desktop (only run video logic on desktop)
  useEffect(() => {
    const checkDesktop = () => setIsDesktop(window.innerWidth >= 768);
    checkDesktop();
    window.addEventListener('resize', checkDesktop);
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

  useEffect(() => {
    // Only listen for video events on desktop
    if (!isDesktop) return;

    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== 'https://player.vimeo.com') return;
      try {
        const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
        if (data.event === 'ready' || data.method === 'play') {
          // Short delay to ensure video has started rendering
          setTimeout(() => setVideoReady(true), 300);
        }
      } catch {
        // Ignore parse errors
      }
    };

    window.addEventListener('message', handleMessage);

    // Shorter fallback: 2 seconds instead of 4
    const fallbackTimer = setTimeout(() => {
      setVideoReady(true);
    }, 2000);

    return () => {
      window.removeEventListener('message', handleMessage);
      clearTimeout(fallbackTimer);
    };
  }, [isDesktop]);

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Base Layer: Fallback Image - ALWAYS visible, never fades */}
      <div className="absolute inset-0 z-[0]">
        {/* Desktop image */}
        <div className="hidden md:block absolute inset-0">
          <Image
            src={fallbackImage}
            alt={heading}
            fill
            className="object-cover"
            priority
            quality={90}
            sizes="100vw"
          />
        </div>
        {/* Mobile image - completely static, no transitions */}
        <div className="md:hidden absolute inset-0">
          <Image
            src={mobileImage || fallbackImage}
            alt={heading}
            fill
            className="object-cover"
            priority
            quality={90}
            sizes="100vw"
          />
        </div>
      </div>

      {/* Video Layer - Desktop Only, fades IN over image when ready */}
      {isDesktop && (
        <div
          className={`absolute inset-0 z-[1] transition-opacity duration-1000 ease-out ${
            videoReady ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <iframe
            ref={iframeRef}
            src={`https://player.vimeo.com/video/${vimeoId}?background=1&autoplay=1&loop=1&byline=0&title=0&muted=1&quality=1080p`}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: '177.78vh',
              height: '100vh',
              minWidth: '100%',
              minHeight: '56.25vw',
              transform: 'translate(-50%, -50%)',
            }}
            frameBorder="0"
            allow="autoplay; fullscreen"
            allowFullScreen
            title="Portland Fresh Background Video"
          />
        </div>
      )}

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
                className="inline-block px-6 py-3 sm:px-8 sm:py-4 md:px-10 md:py-5 bg-accent-primary text-white text-sm sm:text-base md:text-lg font-semibold rounded-lg hover:bg-accent-primary/90 transition-colors shadow-lg"
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
