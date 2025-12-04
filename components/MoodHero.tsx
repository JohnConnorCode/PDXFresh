import { FadeIn } from '@/components/animations';

export function MoodHero() {
  return (
    <section className="relative min-h-[50vh] md:min-h-[60vh] bg-black flex items-center justify-center overflow-hidden">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-950 to-black" />

      {/* Subtle organic accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-accent-primary/5 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <FadeIn direction="up" delay={0.1}>
          <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight tracking-tight">
            WHAT MOOD ARE YOU FEELING?
          </h1>
        </FadeIn>
        <FadeIn direction="up" delay={0.2}>
          <p className="text-lg sm:text-xl md:text-2xl text-white/70 leading-relaxed max-w-2xl mx-auto">
            Choose your state. Each Bomb is engineered to activate a different version of you.
          </p>
        </FadeIn>
      </div>
    </section>
  );
}
