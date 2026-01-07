'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

interface AnimatedLogoProps {
  className?: string;
  logoUrl?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  variant?: 'header' | 'footer';
}

export function AnimatedLogo({
  className = '',
  logoUrl,
  size = 'md',
  showText = true,
  variant = 'header',
}: AnimatedLogoProps) {
  // Size configurations
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
  };

  // Animation variants for the logo image
  const logoVariants = {
    hidden: {
      scale: 0,
      opacity: 0,
      rotate: -180,
    },
    visible: {
      scale: 1,
      opacity: 1,
      rotate: 0,
      transition: {
        type: 'spring' as const,
        stiffness: 200,
        damping: 20,
        duration: 0.6,
      },
    },
  };

  const primaryTextVariants = {
    hidden: {
      opacity: 0,
      x: -20,
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        delay: 0.3,
        duration: 0.4,
        ease: 'easeOut' as const,
      },
    },
  };

  const secondaryTextVariants = {
    hidden: {
      opacity: 0,
      x: -20,
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        delay: 0.5,
        duration: 0.4,
        ease: 'easeOut' as const,
      },
    },
  };

  const containerClasses = variant === 'header'
    ? 'flex items-center gap-1 group'
    : 'flex items-center gap-2';

  const DefaultMark = () => (
    <svg viewBox="0 0 64 64" className="w-full h-full" aria-hidden="true">
      <defs>
        <linearGradient id="pf-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1f5b4c" />
          <stop offset="50%" stopColor="#2f8f72" />
          <stop offset="100%" stopColor="#f2a93b" />
        </linearGradient>
      </defs>
      <circle cx="32" cy="32" r="30" fill="url(#pf-gradient)" opacity="0.95" />
      <path
        d="M20 38c3.5 4.2 8 7.5 12 7.5s8.5-3.3 12-7.5c3.5-4.1 5-8.3 5-11.5 0-2.8-1-4.5-2.6-5.7-1.4-1.1-3.2-1.7-5.2-1.7-6 0-7.4 5.1-9.2 10.8-1.8-5.7-3.2-10.8-9.2-10.8-2 0-3.8 0.6-5.2 1.7C20 22 19 23.7 19 26.5c0 3.2 1.5 7.4 5 11.5Z"
        fill="#fdf1da"
        opacity="0.9"
      />
      <path
        d="M25 23c-1.5 0-2.7 0.4-3.7 1.2-1.1 0.9-1.6 2.3-1.6 4.3 0 4.5 4 10 8 12.5"
        stroke="#1f5b4c"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.4"
      />
      <path
        d="M39 23c1.5 0 2.7 0.4 3.7 1.2 1.1 0.9 1.6 2.3 1.6 4.3 0 4.5-4 10-8 12.5"
        stroke="#1f5b4c"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.4"
      />
      <path
        d="M32 14v16"
        stroke="#fdf1da"
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.9"
      />
      <path
        d="M27 20c1.5-2.5 3-3.7 5-3.7s3.5 1.2 5 3.7"
        stroke="#fdf1da"
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.6"
      />
    </svg>
  );

  return (
    <div className={`${containerClasses} ${className}`}>
      {/* Animated Logo Image */}
      <motion.div
        className={`relative ${sizeClasses[size]}`}
        initial="hidden"
        animate="visible"
        variants={logoVariants}
        whileHover={{
          scale: 1.1,
          rotate: 12,
          transition: { duration: 0.3 },
        }}
      >
        <div className="relative w-full h-full text-accent-primary transition-all duration-300 flex items-center justify-center rounded-full overflow-hidden shadow-lg shadow-accent-primary/20">
          {logoUrl ? (
            <Image
              src={logoUrl}
              alt="Portland Fresh Logo"
              fill
              className="object-contain"
              style={{ top: '-3px' }}
              priority
            />
          ) : (
            <DefaultMark />
          )}
        </div>
      </motion.div>

      {/* Animated Text */}
      {showText && (
        <span className={`font-heading font-bold ${textSizeClasses[size]}`}>
          <motion.span
            className="transition-colors group-hover:text-accent-primary"
            initial="hidden"
            animate="visible"
            variants={primaryTextVariants}
            style={{ display: 'inline-block' }}
          >
            Portland&nbsp;
          </motion.span>
          <motion.span
            className="text-accent-primary"
            initial="hidden"
            animate="visible"
            variants={secondaryTextVariants}
            style={{ display: 'inline-block' }}
          >
            Fresh
          </motion.span>
        </span>
      )}
    </div>
  );
}
