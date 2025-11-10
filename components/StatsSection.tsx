'use client';

import { FadeIn } from './animations';
import { CountUp } from './animations/CountUp';

interface Stat {
  label: string;
  value: number;
  suffix?: string;
  prefix?: string;
}

interface StatsSectionProps {
  stats: Stat[];
  className?: string;
}

export function StatsSection({ stats, className = '' }: StatsSectionProps) {
  if (!stats || stats.length === 0) return null;

  return (
    <FadeIn direction="up" className={className}>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {stats.map((stat, index) => (
          <div key={index} className="text-center">
            <div className="text-4xl sm:text-5xl font-bold font-heading text-accent-primary mb-2">
              <CountUp
                value={stat.value}
                duration={2.5}
                prefix={stat.prefix}
                suffix={stat.suffix}
              />
            </div>
            <p className="text-sm sm:text-base text-muted font-medium">{stat.label}</p>
          </div>
        ))}
      </div>
    </FadeIn>
  );
}
