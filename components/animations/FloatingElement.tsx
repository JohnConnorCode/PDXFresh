'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface FloatingElementProps {
  children: ReactNode;
  duration?: number;
  yOffset?: number;
  delay?: number;
  className?: string;
}

export function FloatingElement({
  children,
  duration = 3,
  yOffset = 10,
  delay = 0,
  className = '',
}: FloatingElementProps) {
  return (
    <motion.div
      animate={{
        y: [-yOffset, yOffset, -yOffset],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: 'easeInOut',
        delay,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
