import Link from 'next/link';
import { FadeIn, StaggerContainer } from '@/components/animations';

interface MoodCard {
  mood: string;
  tagline: string;
  ingredients: string;
  purpose: string;
  color: string;
  bgGradient: string;
  borderColor: string;
  accentColor: string;
  slug: string;
}

const moods: MoodCard[] = [
  {
    mood: 'RESET',
    tagline: 'Circulate. Awaken. Power up.',
    ingredients: 'Beet, Strawberry, Carrot, Papaya, Red Apple',
    purpose: 'Natural energy + circulation support',
    color: '#ef4444', // red-500
    bgGradient: 'from-red-600/20 via-red-500/10 to-transparent',
    borderColor: 'border-red-500/50',
    accentColor: 'bg-red-500',
    slug: 'red-bomb',
  },
  {
    mood: 'CLEANSE',
    tagline: 'Flush out. Hydrate. Rebuild your gut.',
    ingredients: 'Spinach, Cucumber, Celery, Romaine, Green Apple',
    purpose: 'Detox, hydration, gut health',
    color: '#22c55e', // green-500
    bgGradient: 'from-green-600/20 via-green-500/10 to-transparent',
    borderColor: 'border-green-500/50',
    accentColor: 'bg-green-500',
    slug: 'green-bomb',
  },
  {
    mood: 'RISE',
    tagline: 'Uplift. Strengthen. Light up your day.',
    ingredients: 'Mango, Orange, Ginger, Guava, Pineapple',
    purpose: 'Immunity + mood elevation',
    color: '#eab308', // yellow-500
    bgGradient: 'from-yellow-500/20 via-yellow-400/10 to-transparent',
    borderColor: 'border-yellow-500/50',
    accentColor: 'bg-yellow-500',
    slug: 'yellow-bomb',
  },
  {
    mood: 'BALANCE',
    tagline: 'Stabilize. Center. Stay steady.',
    ingredients: 'Nopal, Spinach, Cucumber, Aloe Vera, Asparagus',
    purpose: 'Blood sugar balance + metabolic stability',
    color: '#3b82f6', // blue-500
    bgGradient: 'from-blue-600/20 via-blue-500/10 to-transparent',
    borderColor: 'border-blue-500/50',
    accentColor: 'bg-blue-500',
    slug: 'blue-bomb',
  },
];

export function MoodGrid() {
  return (
    <section className="bg-black py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <StaggerContainer staggerDelay={0.1} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {moods.map((mood, idx) => (
            <FadeIn key={mood.mood} direction="up" delay={idx * 0.1}>
              <Link
                href={`/blends/${mood.slug}`}
                className={`group relative block overflow-hidden rounded-2xl border ${mood.borderColor} bg-gray-950 hover:border-opacity-100 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl`}
              >
                {/* Background gradient */}
                <div className={`absolute inset-0 bg-gradient-to-b ${mood.bgGradient} opacity-50 group-hover:opacity-80 transition-opacity duration-500`} />

                {/* Content */}
                <div className="relative z-10 p-6 md:p-8 min-h-[320px] flex flex-col">
                  {/* Mood badge */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-3 h-3 rounded-full ${mood.accentColor}`} />
                    <span className="text-xs font-semibold uppercase tracking-widest text-white/60">
                      Mood
                    </span>
                  </div>

                  {/* Mood name */}
                  <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-3 tracking-tight">
                    {mood.mood}
                  </h2>

                  {/* Tagline */}
                  <p className="text-white/80 text-sm md:text-base mb-6 italic">
                    {mood.tagline}
                  </p>

                  {/* Details */}
                  <div className="mt-auto space-y-4">
                    <div>
                      <span className="text-xs font-semibold uppercase tracking-wider text-white/40 block mb-1">
                        Ingredients
                      </span>
                      <p className="text-white/70 text-sm leading-relaxed">
                        {mood.ingredients}
                      </p>
                    </div>

                    <div>
                      <span className="text-xs font-semibold uppercase tracking-wider text-white/40 block mb-1">
                        Purpose
                      </span>
                      <p className="text-white/70 text-sm">
                        {mood.purpose}
                      </p>
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="mt-6 pt-4 border-t border-white/10">
                    <span className={`inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wide group-hover:gap-3 transition-all duration-300`} style={{ color: mood.color }}>
                      Reserve Batch
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </span>
                  </div>
                </div>

                {/* Hover glow effect */}
                <div
                  className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-40 h-40 rounded-full blur-3xl opacity-0 group-hover:opacity-30 transition-opacity duration-500"
                  style={{ backgroundColor: mood.color }}
                />
              </Link>
            </FadeIn>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
