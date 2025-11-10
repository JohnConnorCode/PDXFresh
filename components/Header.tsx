'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { urlFor } from '@/lib/image';

interface HeaderProps {
  siteSettings?: any;
  navigation?: any;
  ctaLabel?: string;
}

export function Header({ siteSettings, navigation, ctaLabel }: HeaderProps) {
  const pathname = usePathname();
  const primaryLinks = navigation?.primaryLinks || [];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            {siteSettings?.logo ? (
              <div className="relative w-8 h-8">
                <Image
                  src={urlFor(siteSettings.logo).url()}
                  alt={siteSettings.title || 'Long Life'}
                  fill
                  className="object-contain"
                />
              </div>
            ) : (
              <span className="text-xl font-heading font-bold">
                {siteSettings?.title || 'Long Life'}
              </span>
            )}
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {primaryLinks.map((link: any) => {
              const href = link.reference?.slug?.current
                ? `/${link.reference.slug.current}`
                : link.externalUrl;
              const isActive = pathname === href || pathname.startsWith(href);

              return (
                <Link
                  key={link.title}
                  href={href || '#'}
                  target={link.newTab ? '_blank' : undefined}
                  rel={link.newTab ? 'noreferrer' : undefined}
                  className={clsx(
                    'text-sm font-medium transition-colors',
                    isActive ? 'text-accent-red' : 'text-gray-700 hover:text-black'
                  )}
                >
                  {link.title}
                </Link>
              );
            })}
          </nav>

          {/* CTA Button */}
          <button className="ml-auto md:ml-0 px-4 py-2 rounded-md bg-accent-red text-white text-sm font-medium hover:opacity-90 transition-opacity">
            {ctaLabel || 'Reserve'}
          </button>
        </div>
      </div>
    </header>
  );
}
