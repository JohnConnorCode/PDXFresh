import { Metadata } from 'next';
import Image from 'next/image';
import { Section } from '@/components/Section';
import { FadeIn, StaggerContainer } from '@/components/animations';

export const metadata: Metadata = {
  title: 'Wholesale & Partners | Portland Fresh',
  description: 'Partner with Portland Fresh for wholesale sauces, pestos, and salsa. Retail jars, food-service trays, office stock, and event catering.',
};

// Hardcoded partner types
const partnerTypes = [
  {
    emoji: '🏪',
    title: 'Retail Stores',
    description: 'Grocery stores, specialty food shops, and markets looking to stock fresh, local sauces.',
  },
  {
    emoji: '🍽️',
    title: 'Restaurants & Cafés',
    description: 'Kitchens that want consistent, high-quality sauces without the prep work.',
  },
  {
    emoji: '🏢',
    title: 'Offices & Studios',
    description: 'Workplaces that stock their fridges with healthy, delicious options for the team.',
  },
];

// Hardcoded programs
const programs = [
  {
    title: 'Retail Jars & Containers',
    description: 'Stock our sauces on your shelves. We provide point-of-sale materials, sampling support, and flexible reorder schedules.',
    options: [
      { name: '7oz Jars', description: 'Perfect for individual sales. Case of 12.' },
      { name: '12oz Jars', description: 'Family size. Case of 6.' },
    ],
    note: 'Minimum first order: 2 cases\nReorders: No minimum, weekly delivery available',
  },
  {
    title: 'Food Service Trays',
    description: 'For kitchens that go through sauce quickly. Large-format containers designed for commercial use.',
    options: [
      { name: '32oz Deli Container', description: 'Fits standard refrigeration. Easy pour spout.' },
      { name: '1 Gallon Bucket', description: 'For high-volume kitchens. Reusable food-grade bucket.' },
    ],
    note: 'Volume pricing available\nCustom blends for 5+ gallon orders',
  },
  {
    title: 'Office Fridge Stock',
    description: 'We deliver weekly to offices across Portland. Keep your team fed with rotating sauce selections.',
    options: [
      { name: 'Starter Pack', description: '6 jars/week. Great for small teams.' },
      { name: 'Team Pack', description: '12 jars/week. For sauce-loving offices.' },
    ],
    note: 'Free delivery for Portland offices\nBilling monthly or per delivery',
  },
  {
    title: 'Catering & Events',
    description: 'Sauce bars, grazing boards, and bulk orders for weddings, corporate events, and pop-up dinners.',
    options: [
      { name: 'Sauce Bar', description: 'We set up 4-6 sauces with pairings and signage.' },
      { name: 'Bulk Order', description: 'Large-format containers for your kitchen to plate.' },
    ],
    note: 'Custom menus available\nBook 2+ weeks in advance',
  },
];

// Hardcoded benefits
const benefits = [
  {
    title: 'Made Fresh Weekly',
    description: 'Unlike shelf-stable alternatives, our sauces are made within 48 hours of delivery. Your customers taste the difference.',
  },
  {
    title: 'Local & Traceable',
    description: 'Every batch is dated and traceable to the farms we source from. Great for farm-to-table positioning.',
  },
  {
    title: 'Flexible Ordering',
    description: 'No long-term contracts. Order what you need, when you need it. Scale up or down seasonally.',
  },
  {
    title: 'Marketing Support',
    description: 'We provide shelf talkers, sampling kits, and social media content to help you sell.',
  },
];

export default function WholesalePage() {
  return (
    <>
      {/* Hero */}
      <Section className="py-24 relative overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <Image
            src="/portland-fresh-new-2.jpg"
            alt="Wholesale"
            fill
            className="object-cover scale-110 animate-ken-burns"
            priority
            quality={90}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-accent-cream/90 via-accent-yellow/70 to-accent-green/60" />
        </div>

        {/* Organic background shapes */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent-yellow/30 rounded-full blur-3xl -translate-y-1/3 translate-x-1/3 z-[1]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent-green/30 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3 z-[1]" />

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <FadeIn direction="up" delay={0.1}>
            <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-md">
              <svg className="w-5 h-5 text-accent-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span className="text-sm font-semibold text-gray-700">Business Partnerships</span>
            </div>
          </FadeIn>
          <FadeIn direction="up" delay={0.2}>
            <h1 className="font-heading text-5xl sm:text-6xl md:text-7xl font-bold mb-6 leading-tight text-gray-900">
              Wholesale & Partners
            </h1>
          </FadeIn>
          <FadeIn direction="up" delay={0.3}>
            <p className="text-2xl sm:text-3xl text-accent-primary font-semibold mb-6">
              Fresh Sauces for Your Business
            </p>
          </FadeIn>
          <FadeIn direction="up" delay={0.4}>
            <p className="text-xl text-gray-700 leading-relaxed max-w-3xl mx-auto">
              Partner with Portland Fresh to bring fresh, local sauces to your customers, team, or guests.
              Flexible programs for retail, food service, offices, and events.
            </p>
          </FadeIn>
        </div>
      </Section>

      {/* Who We Work With */}
      <Section className="bg-white">
        <div className="max-w-5xl mx-auto">
          <FadeIn direction="up" className="text-center mb-16">
            <h2 className="font-heading text-4xl sm:text-5xl font-bold mb-4 leading-tight">
              Who We Work With
            </h2>
            <div className="w-24 h-1 bg-accent-primary mx-auto mt-6" />
          </FadeIn>
          <StaggerContainer staggerDelay={0.15} className="grid md:grid-cols-3 gap-8">
            {partnerTypes.map((partner) => (
              <div
                key={partner.title}
                className="group text-center p-8 bg-gradient-to-br from-white to-accent-cream/30 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 border-transparent hover:border-accent-yellow"
              >
                <div className="text-6xl mb-6 transform group-hover:scale-110 transition-transform duration-300">
                  {partner.emoji}
                </div>
                <h3 className="font-heading text-2xl font-bold mb-3 text-gray-900">
                  {partner.title}
                </h3>
                <p className="text-base text-gray-600 leading-relaxed">
                  {partner.description}
                </p>
              </div>
            ))}
          </StaggerContainer>
        </div>
      </Section>

      {/* Programs */}
      <Section className="bg-gradient-to-b from-accent-cream/30 to-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent-green/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent-yellow/10 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-5xl mx-auto">
          <FadeIn direction="up" className="text-center mb-12">
            <h2 className="font-heading text-4xl sm:text-5xl font-bold mb-4 leading-tight">
              Wholesale Programs
            </h2>
            <p className="text-xl text-gray-600">Flexible options for every business</p>
          </FadeIn>

          <StaggerContainer staggerDelay={0.1} className="space-y-6">
            {programs.map((program) => (
              <div key={program.title} className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border-2 border-transparent hover:border-accent-green">
                <h3 className="font-heading text-3xl font-bold mb-4 text-gray-900">
                  {program.title}
                </h3>
                <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                  {program.description}
                </p>
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  {program.options.map((option) => (
                    <div
                      key={option.name}
                      className="border-2 border-gray-200 rounded-xl p-5 hover:border-accent-yellow transition-colors bg-gradient-to-br from-white to-accent-cream/20"
                    >
                      <p className="font-heading font-bold text-lg mb-2 text-gray-900">
                        {option.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        {option.description}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="border-l-4 border-accent-green pl-6 py-2 bg-gradient-to-r from-accent-yellow/10 to-transparent">
                  {program.note.split('\n').map((line, lineIdx) => (
                    <p key={lineIdx} className={lineIdx === 0 ? 'text-sm font-bold text-gray-900' : 'text-sm text-gray-600'}>
                      {line}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </StaggerContainer>
        </div>
      </Section>

      {/* Why Partner With Us */}
      <Section className="bg-white">
        <div className="max-w-4xl mx-auto">
          <FadeIn direction="up" className="text-center mb-12">
            <h2 className="font-heading text-4xl sm:text-5xl font-bold mb-4 leading-tight">
              Why Partner With Portland Fresh
            </h2>
            <p className="text-xl text-gray-600">Built for businesses that care</p>
          </FadeIn>
          <StaggerContainer staggerDelay={0.1} className="grid md:grid-cols-2 gap-6">
            {benefits.map((benefit) => (
              <div
                key={benefit.title}
                className="group flex items-start gap-4 p-6 bg-gradient-to-br from-white to-accent-cream/30 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border-2 border-transparent hover:border-accent-yellow"
              >
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-accent-yellow to-accent-green rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-md group-hover:scale-110 transition-transform duration-300">
                  ✓
                </div>
                <div>
                  <h3 className="font-heading text-xl font-bold mb-2 text-gray-900">
                    {benefit.title}
                  </h3>
                  <p className="text-base text-gray-600 leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              </div>
            ))}
          </StaggerContainer>
        </div>
      </Section>

      {/* Application CTA */}
      <Section className="bg-gradient-to-b from-white to-accent-cream/30 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-gradient-to-r from-accent-yellow/20 to-accent-green/20 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <FadeIn direction="up">
            <h2 className="font-heading text-4xl sm:text-5xl font-bold mb-6 leading-tight">
              Ready to Partner?
            </h2>
            <p className="text-xl text-gray-700 leading-relaxed mb-8">
              Tell us about your business and we'll put together a custom proposal. Most partners are set up within a week.
            </p>
            <a
              href="mailto:hello@pdxfreshfoods.com?subject=Wholesale Partnership Inquiry"
              className="inline-block px-8 py-4 bg-accent-primary text-white rounded-full font-semibold text-lg hover:opacity-90 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Contact Us About Wholesale
            </a>
            <p className="text-sm text-gray-500 mt-6">
              We respond to all inquiries within 24 hours.
            </p>
          </FadeIn>
        </div>
      </Section>
    </>
  );
}
