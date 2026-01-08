import { Metadata } from 'next';
import Link from 'next/link';
import { Section } from '@/components/Section';
import { FadeIn, StaggerContainer, FloatingElement } from '@/components/animations';
import { SmoothImage } from '@/components/SmoothImage';

export const metadata: Metadata = {
  title: 'Subscriptions | Portland Fresh',
  description: 'Subscribe to weekly or bi-weekly sauce drops. Priority access to limited releases, 15% savings, and free delivery.',
};

// Hardcoded subscription content
const howSteps = [
  {
    stepNumber: 1,
    title: 'Pick Your Frequency',
    description: 'Choose weekly or bi-weekly delivery based on how fast you go through our sauces.',
  },
  {
    stepNumber: 2,
    title: 'Build Your Box',
    description: 'Select your favorite sauces or let us surprise you with seasonal picks and new releases.',
  },
  {
    stepNumber: 3,
    title: 'We Deliver Fresh',
    description: 'Your sauces arrive every Thursday or Friday, made within 48 hours of delivery.',
  },
];

const perks = [
  {
    title: '15% Off Every Order',
    description: 'Subscribers save on every jar, every week. The more you order, the more you save.',
  },
  {
    title: 'Free Delivery',
    description: 'No delivery fees, ever. We bring fresh sauces right to your door across Portland.',
  },
  {
    title: 'First Access to Limited Runs',
    description: 'Chef collabs and seasonal specials sell out fast. Subscribers get first dibs before public release.',
  },
  {
    title: 'Skip or Pause Anytime',
    description: 'Going on vacation? Fridge too full? Skip a week or pause your subscription with one click.',
  },
  {
    title: 'Swap Flavors Freely',
    description: 'Change your selections each week. Try new sauces or stick with your favorites—it\'s up to you.',
  },
  {
    title: 'Exclusive Subscriber Events',
    description: 'Join kitchen tours, tasting nights, and meet-the-farmer events just for subscribers.',
  },
];

const plans = [
  {
    name: 'Weekly Drop',
    description: 'Fresh sauces delivered every Thursday. Perfect for households that cook daily.',
    isPopular: true,
    priceItems: [
      { size: '2 Jars/Week', price: '$22/week' },
      { size: '4 Jars/Week', price: '$40/week' },
      { size: '6 Jars/Week', price: '$55/week' },
    ],
    buttonText: 'Coming Soon',
  },
  {
    name: 'Bi-Weekly Drop',
    description: 'Delivery every other Thursday. Great for smaller households or sauce sippers.',
    isPopular: false,
    priceItems: [
      { size: '3 Jars', price: '$30/delivery' },
      { size: '5 Jars', price: '$48/delivery' },
      { size: '8 Jars', price: '$72/delivery' },
    ],
    buttonText: 'Coming Soon',
  },
];

const stepColors = ['bg-accent-yellow', 'bg-accent-primary text-white', 'bg-accent-green'];

export default function SubscriptionsPage() {
  return (
    <>
      {/* Hero */}
      <Section className="py-24 relative overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <SmoothImage
            src="/portland-fresh-new-4.jpg"
            alt="Subscriptions"
            fill
            className="object-cover scale-110 animate-ken-burns"
            priority
            quality={90}
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-accent-cream/90 via-accent-yellow/70 to-accent-green/60" />
        </div>

        {/* Organic background shapes */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent-yellow/30 rounded-full blur-3xl -translate-y-1/3 translate-x-1/3 z-[1]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent-green/30 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3 z-[1]" />

        <div className="relative z-10 max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <FadeIn direction="up" delay={0.1}>
              <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-md">
                <svg className="w-5 h-5 text-accent-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm font-semibold text-gray-700">Never miss a drop</span>
              </div>
            </FadeIn>
            <FadeIn direction="up" delay={0.2}>
              <h1 className="font-heading text-5xl sm:text-6xl md:text-7xl font-bold mb-6 leading-tight text-gray-900">
                Subscriptions
              </h1>
            </FadeIn>
            <FadeIn direction="up" delay={0.3}>
              <p className="text-2xl sm:text-3xl text-accent-primary font-semibold mb-6">
                Fresh Sauces, Delivered Weekly
              </p>
            </FadeIn>
            <FadeIn direction="up" delay={0.4}>
              <p className="text-xl text-gray-700 leading-relaxed max-w-3xl mx-auto">
                Subscribe and save 15% on every order. Get priority access to limited releases, free delivery,
                and the freshest sauces in Portland—made within 48 hours of arriving at your door.
              </p>
            </FadeIn>
          </div>

          {/* Visual benefit badges */}
          <FadeIn direction="up" delay={0.5}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              {[
                { icon: '💰', text: 'Save 15%' },
                { icon: '🎯', text: 'Priority Access' },
                { icon: '📦', text: 'Free Delivery' },
                { icon: '⚡', text: 'Skip Anytime' },
              ].map((badge, idx) => (
                <div
                  key={idx}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 border-transparent hover:border-accent-yellow"
                >
                  <div className="text-4xl mb-2">{badge.icon}</div>
                  <p className="font-semibold text-gray-900">{badge.text}</p>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </Section>

      {/* How It Works */}
      <Section className="bg-white">
        <div className="max-w-5xl mx-auto">
          <FadeIn direction="up" className="text-center mb-16">
            <h2 className="font-heading text-4xl sm:text-5xl font-bold mb-4 leading-tight">
              How It Works
            </h2>
            <div className="w-24 h-1 bg-accent-primary mx-auto mt-6" />
          </FadeIn>
          <StaggerContainer staggerDelay={0.15} className="grid md:grid-cols-3 gap-8">
            {howSteps.map((step, idx) => (
              <div key={step.stepNumber} className="text-center group">
                <FloatingElement yOffset={8} duration={4 + idx}>
                  <div className={`relative w-20 h-20 ${stepColors[idx % stepColors.length]} rounded-2xl flex items-center justify-center text-3xl font-bold mx-auto mb-6 shadow-lg group-hover:shadow-2xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                    {step.stepNumber}
                    {/* Connecting arrow for desktop */}
                    {idx < howSteps.length - 1 && (
                      <div className="hidden md:block absolute left-full top-1/2 -translate-y-1/2 w-8">
                        <svg className="w-full h-6 text-accent-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </div>
                    )}
                  </div>
                </FloatingElement>
                <h3 className="font-heading text-2xl font-bold mb-3 text-gray-900">
                  {step.title}
                </h3>
                <p className="text-lg text-gray-600 leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </StaggerContainer>
        </div>
      </Section>

      {/* Member Perks */}
      <Section className="bg-gradient-to-b from-accent-cream/30 to-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent-yellow/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent-green/10 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-4xl mx-auto">
          <FadeIn direction="up" className="text-center mb-12">
            <h2 className="font-heading text-4xl sm:text-5xl font-bold mb-4 leading-tight">
              Member Perks
            </h2>
            <p className="text-xl text-gray-600">Exclusive benefits for subscribers</p>
          </FadeIn>
          <StaggerContainer staggerDelay={0.1} className="grid md:grid-cols-2 gap-6">
            {perks.map((perk) => (
              <div
                key={perk.title}
                className="group flex items-start gap-4 p-6 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border-2 border-transparent hover:border-accent-yellow"
              >
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-accent-yellow to-accent-green rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-md group-hover:scale-110 transition-transform duration-300">
                  ✓
                </div>
                <div>
                  <h3 className="font-heading text-xl font-bold mb-2 text-gray-900">
                    {perk.title}
                  </h3>
                  <p className="text-base text-gray-600 leading-relaxed">
                    {perk.description}
                  </p>
                </div>
              </div>
            ))}
          </StaggerContainer>
        </div>
      </Section>

      {/* Pricing */}
      <Section className="bg-white">
        <div className="max-w-5xl mx-auto">
          <FadeIn direction="up" className="text-center mb-12">
            <h2 className="font-heading text-4xl sm:text-5xl font-bold mb-4 leading-tight">
              Subscription Plans
            </h2>
            <p className="text-xl text-gray-600">Choose the frequency that works for you</p>
          </FadeIn>
          <StaggerContainer staggerDelay={0.15} className="grid md:grid-cols-2 gap-8">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative bg-white rounded-2xl p-8 transition-all duration-300 hover:-translate-y-2 ${
                  plan.isPopular
                    ? 'border-4 border-accent-primary shadow-2xl scale-105'
                    : 'border-2 border-gray-200 shadow-lg hover:border-accent-primary hover:shadow-2xl'
                }`}
              >
                {plan.isPopular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-2 bg-accent-primary text-white text-sm font-bold rounded-full shadow-lg">
                    MOST POPULAR
                  </div>
                )}
                <h3 className="font-heading text-3xl font-bold mb-3 text-gray-900">
                  {plan.name}
                </h3>
                <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                  {plan.description}
                </p>
                <div className="space-y-3 mb-8 p-6 bg-gradient-to-br from-accent-yellow/10 to-accent-green/10 rounded-xl border-2 border-accent-yellow/20">
                  {plan.priceItems.map((item, itemIdx) => (
                    <div key={itemIdx} className="flex justify-between items-center text-lg">
                      <span className="font-medium text-gray-700">{item.size}</span>
                      <span className="font-bold text-accent-primary text-xl">{item.price}</span>
                    </div>
                  ))}
                </div>
                <button
                  disabled
                  className={`w-full px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 shadow-lg ${
                    plan.isPopular
                      ? 'bg-gray-400 text-white cursor-not-allowed'
                      : 'bg-gray-400 text-white cursor-not-allowed'
                  }`}
                >
                  {plan.buttonText}
                </button>
              </div>
            ))}
          </StaggerContainer>
          <FadeIn direction="up" delay={0.3} className="text-center mt-10">
            <p className="text-base text-gray-500 max-w-2xl mx-auto">
              Subscriptions are launching soon! Sign up for our newsletter to be the first to know when we go live.
            </p>
          </FadeIn>
        </div>
      </Section>

      {/* CTA */}
      <Section className="bg-gradient-to-b from-white to-accent-cream/30 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gradient-to-r from-accent-yellow/20 to-accent-green/20 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <FadeIn direction="up">
            <h2 className="font-heading text-4xl sm:text-5xl font-bold mb-6 leading-tight">
              Ready to Subscribe?
            </h2>
            <p className="text-xl text-gray-700 leading-relaxed mb-10 max-w-2xl mx-auto">
              Join our waitlist to get early access when subscriptions launch. We'll send you a discount code as a thank-you for your patience.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/#newsletter"
                className="w-full sm:w-auto px-8 py-4 bg-accent-primary text-white rounded-full font-semibold text-lg hover:opacity-90 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Join the Waitlist
              </Link>
              <Link
                href="/blends"
                className="w-full sm:w-auto px-8 py-4 border-2 border-accent-primary text-accent-primary rounded-full font-semibold text-lg hover:bg-accent-primary hover:text-white transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Shop Now
              </Link>
            </div>
          </FadeIn>
        </div>
      </Section>
    </>
  );
}
