'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Section } from '@/components/Section';
import { FadeIn } from '@/components/animations';
import { Play } from 'lucide-react';
import { urlFor } from '@/lib/image';

interface VideoSectionProps {
  heading?: string;
  subheading?: string;
  videoUrl: string;
  thumbnail?: {
    asset: any;
    alt?: string;
  };
  caption?: string;
  aspectRatio?: string;
  maxWidth?: string;
  backgroundColor?: string;
}

const bgColorMap: Record<string, string> = {
  white: 'bg-white',
  'accent-cream': 'bg-accent-cream',
  'gray-900': 'bg-gray-900',
};

const textColorMap: Record<string, string> = {
  white: 'text-gray-900',
  'accent-cream': 'text-gray-900',
  'gray-900': 'text-white',
};

function getVideoId(url: string): { type: 'youtube' | 'vimeo'; id: string } | null {
  // YouTube patterns
  const youtubeMatch = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  if (youtubeMatch) {
    return { type: 'youtube', id: youtubeMatch[1] };
  }

  // Vimeo patterns
  const vimeoMatch = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeoMatch) {
    return { type: 'vimeo', id: vimeoMatch[1] };
  }

  return null;
}

function getYouTubeThumbnail(videoId: string): string {
  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
}

export function VideoSectionComponent({
  heading,
  subheading,
  videoUrl,
  thumbnail,
  caption,
  aspectRatio = '16/9',
  maxWidth = 'max-w-5xl',
  backgroundColor = 'white',
}: VideoSectionProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const bgClass = bgColorMap[backgroundColor] || 'bg-white';
  const textClass = textColorMap[backgroundColor] || 'text-gray-900';

  const videoInfo = getVideoId(videoUrl);
  if (!videoInfo) return null;

  const thumbnailUrl = thumbnail?.asset
    ? urlFor(thumbnail).width(1280).height(720).url()
    : videoInfo.type === 'youtube'
      ? getYouTubeThumbnail(videoInfo.id)
      : undefined;

  const embedUrl =
    videoInfo.type === 'youtube'
      ? `https://www.youtube.com/embed/${videoInfo.id}?autoplay=1`
      : `https://player.vimeo.com/video/${videoInfo.id}?autoplay=1`;

  const aspectRatioClass = {
    '16/9': 'aspect-video',
    '4/3': 'aspect-[4/3]',
    '1/1': 'aspect-square',
    '9/16': 'aspect-[9/16]',
  }[aspectRatio] || 'aspect-video';

  return (
    <Section className={bgClass}>
      <div className={`${maxWidth} mx-auto`}>
        {(heading || subheading) && (
          <FadeIn direction="up" className="text-center mb-10">
            {heading && (
              <h2 className={`font-heading text-4xl font-bold mb-4 ${textClass}`}>
                {heading}
              </h2>
            )}
            {subheading && (
              <p
                className={`text-lg ${
                  backgroundColor === 'gray-900' ? 'text-gray-300' : 'text-gray-600'
                }`}
              >
                {subheading}
              </p>
            )}
          </FadeIn>
        )}

        <FadeIn direction="up" delay={0.1}>
          <div
            className={`relative ${aspectRatioClass} rounded-xl overflow-hidden shadow-xl`}
          >
            {!isPlaying ? (
              <button
                onClick={() => setIsPlaying(true)}
                className="absolute inset-0 group cursor-pointer"
              >
                {thumbnailUrl && (
                  <Image
                    src={thumbnailUrl}
                    alt={thumbnail?.alt || heading || 'Video thumbnail'}
                    fill
                    className="object-cover"
                  />
                )}
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Play className="w-8 h-8 text-accent-primary ml-1" />
                  </div>
                </div>
              </button>
            ) : (
              <iframe
                src={embedUrl}
                className="absolute inset-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            )}
          </div>
        </FadeIn>

        {caption && (
          <FadeIn direction="up" delay={0.2}>
            <p
              className={`text-center mt-4 text-sm ${
                backgroundColor === 'gray-900' ? 'text-gray-400' : 'text-gray-500'
              }`}
            >
              {caption}
            </p>
          </FadeIn>
        )}
      </div>
    </Section>
  );
}
