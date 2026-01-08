import { Metadata } from 'next';
import { Section } from '@/components/Section';
import { FadeIn } from '@/components/animations/FadeIn';
import { SmoothImage } from '@/components/SmoothImage';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'How We Make It | Portland Fresh',
  description: 'From farm to jar in 48 hours. Learn how Portland Fresh sources, blends, and delivers fresh sauces every week.',
};

// Hardcoded process steps - sauce-focused content
const processSteps = [
  {
    title: 'Source from Local Farms',
    body: 'Every week starts with a trip to Sauvie Island farms and the Portland Farmers Market. We pick basil, peppers, tomatoes, and aromatics at peak ripeness—no cold storage, no long-haul shipping.',
    image: '/portland-fresh-new-7.jpg',
  },
  {
    title: 'Prep & Roast',
    body: 'Back at our Buckman kitchen, ingredients get washed, trimmed, and prepped by hand. Peppers are fire-roasted for depth. Garlic is peeled fresh. Nothing comes from a jar or a freezer.',
    image: '/portland-fresh-new-8.jpg',
  },
  {
    title: 'Blend in Small Batches',
    body: 'We blend each sauce in small runs—never more than 10 gallons at a time. This ensures consistent flavor and texture. Every batch is tasted before it gets packed.',
    image: '/portland-fresh-new-9.jpg',
  },
  {
    title: 'Pack & Deliver Fresh',
    body: 'Sauces are portioned into reusable glass jars, labeled, and chilled. Within 48 hours of blending, they\'re on their way to New Seasons, farmers markets, or your doorstep via bike or electric van.',
    image: '/portland-fresh-new-11.jpg',
  },
];

// Why it matters cards
const whyCards = [
  {
    title: 'Peak Flavor',
    description: 'Produce used within days of harvest means brighter, more vibrant sauces than anything shelf-stable.',
  },
  {
    title: 'No Preservatives',
    description: 'We don\'t need citric acid or sodium benzoate when sauces are made and eaten within a week.',
  },
  {
    title: 'Real Ingredients',
    description: 'Olive oil instead of canola. Fresh citrus instead of concentrates. You can taste the difference.',
  },
];

const gradients = [
  'from-accent-yellow/30 to-accent-yellow/10',
  'from-accent-primary/30 to-accent-primary/10',
  'from-accent-green/30 to-accent-green/10',
];

export default function HowWeMakeItPage() {
  return (
    <>
      {/* Hero */}
      <Section className="py-24 relative overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          {/* Desktop Image */}
          <div className="hidden md:block absolute inset-0">
            <SmoothImage
              src="/portland-fresh-new-11.jpg"
              alt="How We Make It"
              fill
              className="object-cover scale-110 animate-ken-burns"
              objectPosition="top center"
              priority
              quality={90}
              sizes="100vw"
            />
          </div>
          {/* Mobile Image */}
          <div className="md:hidden absolute inset-0">
            <SmoothImage
              src="/portland-fresh-new-12.jpg"
              alt="How We Make It"
              fill
              className="object-cover scale-110 animate-ken-burns"
              objectPosition="top center"
              priority
              quality={90}
              sizes="100vw"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-accent-primary/50 to-accent-green/40" />
        </div>

        {/* Organic overlays for depth */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent-yellow/10 rounded-full blur-3xl -translate-y-1/3 translate-x-1/3 z-[1]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent-green/10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3 z-[1]" />

        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <FadeIn direction="up" delay={0.2}>
            <h1 className="font-heading text-5xl sm:text-6xl font-bold mb-6 text-white leading-tight">
              How We Make It
            </h1>
          </FadeIn>
          <FadeIn direction="up" delay={0.4}>
            <p className="text-xl text-white/90 leading-relaxed">
              From farm to jar in 48 hours. Fire-roasted, blended fresh, and packed in reusable containers—no shortcuts.
            </p>
          </FadeIn>
        </div>
      </Section>

      {/* Process Steps */}
      <Section className="bg-white">
        <div className="max-w-6xl mx-auto">
          <FadeIn direction="up" className="text-center mb-12">
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              The Process
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Every jar of Portland Fresh sauce follows the same careful process—from sourcing to your table.
            </p>
          </FadeIn>

          <div className="grid md:grid-cols-2 gap-8">
            {processSteps.map((step, idx) => (
              <FadeIn key={step.title} direction="up" delay={idx * 0.1}>
                <div className="group relative bg-gradient-to-br from-gray-50 to-white rounded-2xl overflow-hidden border-2 border-gray-100 hover:border-accent-primary/30 transition-all duration-500 hover:shadow-xl">
                  {/* Step Image */}
                  <div className="relative h-64 overflow-hidden">
                    <SmoothImage
                      src={step.image}
                      alt={step.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    {/* Step number badge */}
                    <div className="absolute top-4 left-4 w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-lg">
                      <span className="font-heading text-xl font-bold text-accent-primary">
                        {idx + 1}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="font-heading text-2xl font-bold mb-3 text-gray-900">
                      {step.title}
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      {step.body}
                    </p>
                  </div>

                  {/* Decorative corner accent */}
                  <div className={`absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tl ${gradients[idx % 3]} rounded-tl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </Section>

      {/* Why It Matters */}
      <Section className="bg-gradient-to-b from-accent-cream/30 to-white">
        <div className="max-w-6xl mx-auto">
          <FadeIn direction="up">
            <h2 className="font-heading text-4xl font-bold mb-12 text-center text-gray-900">
              Why Fresh Matters
            </h2>
          </FadeIn>
          <div className="grid md:grid-cols-3 gap-6">
            {whyCards.map((card, idx) => (
              <FadeIn key={card.title} direction="up" delay={idx * 0.1}>
                <div className="group relative bg-white p-8 rounded-2xl border-2 border-gray-100 hover:border-accent-primary/30 transition-all duration-500 hover:shadow-xl hover:-translate-y-1">
                  {/* Icon */}
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br ${gradients[idx % 3]} mb-4`}>
                    <svg className="w-6 h-6 text-accent-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>

                  <h3 className="font-heading text-xl font-bold mb-3 text-gray-900">
                    {card.title}
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {card.description}
                  </p>

                  {/* Bottom accent line */}
                  <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${gradients[idx % 3]} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 rounded-b-2xl`} />
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </Section>

      {/* Batch Commitment */}
      <Section className="bg-white">
        <FadeIn direction="up">
          <div className="max-w-3xl mx-auto text-center">
            <div className="relative inline-block">
              <h2 className="font-heading text-4xl sm:text-5xl font-bold mb-6 text-gray-900">
                Our Fresh Guarantee
              </h2>
              {/* Decorative underline */}
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-accent-yellow via-accent-primary to-accent-green rounded-full" />
            </div>

            <p className="text-xl text-gray-700 leading-relaxed mb-10 mt-10">
              Every sauce is made within 48 hours of delivery. If it doesn't taste fresh, we'll replace it—no questions asked.
              That's the Portland Fresh promise.
            </p>

            <div className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-accent-primary to-accent-green text-white rounded-full font-bold text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Made Fresh Every Week
            </div>
          </div>
        </FadeIn>
      </Section>

      {/* Responsible Language */}
      <Section className="bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white border-l-4 border-accent-primary p-6 rounded-r-lg shadow-sm">
            <p className="text-sm text-gray-600 leading-relaxed italic">
              Portland Fresh sauces are made in a commercial kitchen that also processes nuts, dairy, and gluten.
              Please check individual product labels for specific allergen information. Our sauces are perishable
              and should be refrigerated and consumed within 7 days of opening.
            </p>
          </div>
        </div>
      </Section>
    </>
  );
}
