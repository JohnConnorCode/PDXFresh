import { logger } from "@/lib/logger";
import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { client } from '@/lib/sanity.client';
import { aboutPageQuery } from '@/lib/sanity.queries';
import { Section } from '@/components/Section';
import { urlFor } from '@/lib/image';
import { FadeIn, StaggerContainer, FloatingElement } from '@/components/animations';

export const revalidate = 60;

async function getAboutPage() {
  try {
    return await client.fetch(aboutPageQuery);
  } catch (error) {
    logger.error('Error fetching about page:', error);
    return null;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const aboutPage = await getAboutPage();

  return {
    title: aboutPage?.seo?.metaTitle || 'About Us | Portland Fresh',
    description: aboutPage?.seo?.metaDescription || 'Portland Fresh is Portland’s sauce house—handmade pestos, salsa, zhug, and chimichurri crafted weekly from organic produce.',
  };
}

// Mood data for the cards
const moods = [
  { name: 'RESET', color: '#ef4444', description: 'Natural energy + circulation' },
  { name: 'CLEANSE', color: '#22c55e', description: 'Detox + gut health' },
  { name: 'RISE', color: '#eab308', description: 'Immunity + mood boost' },
  { name: 'BALANCE', color: '#3b82f6', description: 'Blood sugar stability' },
];

export default async function AboutPage() {
  const aboutPage = await getAboutPage();

  const teamMembers = aboutPage?.teamMembers;
  const values = aboutPage?.values;

  return (
    <>
      {/* Hero - Dark & Premium */}
      <section className="relative bg-black text-white py-20 sm:py-28 md:py-36 overflow-hidden">
        {/* Ambient gradients */}
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-gradient-to-br from-green-500/10 via-transparent to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-gradient-to-tl from-yellow-500/10 via-transparent to-transparent rounded-full blur-3xl" />

        <div className="relative z-10 max-w-4xl mx-auto px-5 sm:px-6 text-center">
          <FadeIn direction="up" delay={0.1}>
            <p className="text-xs sm:text-sm font-medium uppercase tracking-[0.3em] text-white/40 mb-4">
              About Portland Fresh
            </p>
          </FadeIn>
          <FadeIn direction="up" delay={0.2}>
            <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-[1.1] tracking-tight">
              Sauces rooted in
              <br />
              <span className="bg-gradient-to-r from-green-400 via-yellow-400 to-green-400 bg-clip-text text-transparent">
                Portland kitchens
              </span>
            </h1>
          </FadeIn>
          <FadeIn direction="up" delay={0.3}>
            <p className="text-lg sm:text-xl text-white/70 leading-relaxed max-w-2xl mx-auto">
              Stew Joseph grew up in a family of chefs, sharpened his palate alongside his dad, and after a detour in craft beer returned
              to the table with Portland Fresh. Our sauces marry excellent flavor, healthy ingredients, and a deep connection to the city we serve.
            </p>
          </FadeIn>
          <FadeIn direction="up" delay={0.35}>
            <p className="text-lg sm:text-xl text-white/60 leading-relaxed max-w-2xl mx-auto">
              Food should nourish bodies, minds, and communities—and still taste incredible. That’s why we source organic produce as locally as possible,
              rely on olive oil, lemon, lime, and raw apple cider vinegar, and build distribution that keeps our jars accessible to every neighborhood.
            </p>
          </FadeIn>
        </div>
      </section>

      <Section className="bg-white">
        <div className="max-w-5xl mx-auto space-y-8">
          <FadeIn direction="up" className="text-center">
            <p className="text-sm uppercase tracking-[0.3em] text-gray-400">Our origin</p>
            <h2 className="font-heading text-4xl font-bold text-gray-900 mb-4">From family kitchens to Portland Fresh</h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              Long before our official opening in 2018, Stew was learning to coax flavor out of simple ingredients in his family’s kitchen.
              The transition from craft beer to sauce-making was natural: both require patience, process, and obsession with community.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              Today, Portland Fresh is built around a core set of values—flavor, health, and equitable access. Smart sourcing,
              high-efficiency production, and a strong local support network mean our dips and sauces are stocked at New Seasons, neighborhood markets,
              and farmers markets across Portland.
            </p>
          </FadeIn>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: 'Food with purpose',
                description:
                  'We believe food should serve your body, your mind, and your neighborhood. Flavor and nourishment are equal priorities.',
              },
              {
                title: 'Only the good stuff',
                description:
                  'Organic produce, olive oil, citrus, and raw apple cider vinegar—no sugar, preservatives, or fillers. Fresh every week.',
              },
              {
                title: 'Community-first access',
                description:
                  'High-efficiency production and local partnerships keep Portland Fresh within reach of every neighborhood.',
              },
            ].map((value) => (
              <FadeIn key={value.title} direction="up" className="bg-gray-50 border border-gray-200 rounded-2xl p-6 shadow-sm">
                <h3 className="font-heading text-xl mb-2 text-gray-900">{value.title}</h3>
                <p className="text-sm text-gray-600">{value.description}</p>
              </FadeIn>
            ))}
          </div>
        </div>
      </Section>

      {/* Vending Machine Feature */}
      <section className="relative bg-gradient-to-b from-black via-gray-950 to-gray-900 py-16 sm:py-24">
        <div className="max-w-6xl mx-auto px-5 sm:px-6">
          <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
            {/* Image */}
            <FadeIn direction="right" delay={0.2}>
              <div className="relative aspect-[3/4] max-w-md mx-auto md:mx-0 rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src="/portland-fresh-new-10.jpg"
                  alt="Stew Joseph preparing sauces in the Portland Fresh kitchen"
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              </div>
            </FadeIn>

            {/* Content */}
            <FadeIn direction="left" delay={0.3}>
              <div className="text-white">
                <p className="text-xs sm:text-sm font-medium uppercase tracking-[0.2em] text-green-400 mb-3">
                  The Vision
                </p>
                <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold mb-6 leading-tight">
                  Choose Your Mode
                </h2>
                <p className="text-white/70 text-lg leading-relaxed mb-6">
                  We&apos;re building kitchen experiences centered around flavor-first sauces. Instead of defaulting to shelf-stable containers, you choose how you want dinner to taste and Portland Fresh delivers the sauce designed for that moment.
                </p>
                <p className="text-white/70 text-lg leading-relaxed">
                  Real condiments shouldn&apos;t be rare—they should be the default. Imagine grabbing a sauce and instantly knowing it was blended from farms you drive past every week.
                </p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Mood Grid */}
      <section className="bg-gray-900 py-16 sm:py-20">
        <div className="max-w-5xl mx-auto px-5 sm:px-6">
          <FadeIn direction="up">
            <div className="text-center mb-12">
              <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white mb-4">
                Four Styles. Endless Dishes.
              </h2>
              <p className="text-white/60 text-lg max-w-xl mx-auto">
                Each sauce is engineered for a specific cooking moment—pasta night, taco bars, grilled veg, or brunch boards.
              </p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {moods.map((mood, idx) => (
              <FadeIn key={mood.name} direction="up" delay={0.1 + idx * 0.1}>
                <div className="relative bg-white/5 rounded-xl p-5 sm:p-6 border border-white/10 hover:border-white/20 transition-all duration-300 hover:bg-white/[0.08]">
                  <div
                    className="w-3 h-3 rounded-full mb-4"
                    style={{ backgroundColor: mood.color }}
                  />
                  <h3
                    className="font-heading text-xl sm:text-2xl font-bold mb-2"
                    style={{ color: mood.color }}
                  >
                    {mood.name}
                  </h3>
                  <p className="text-white/50 text-sm">{mood.description}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="bg-black py-20 sm:py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 via-transparent to-yellow-500/5" />
        <div className="relative z-10 max-w-4xl mx-auto px-5 sm:px-6 text-center">
          <FadeIn direction="up">
            <p className="text-xs sm:text-sm font-medium uppercase tracking-[0.3em] text-white/40 mb-6">
              Our Mission
            </p>
            <h2 className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight">
              To make wellness
              <br />
              <span className="text-white/60">effortless.</span>
            </h2>
            <p className="text-2xl sm:text-3xl text-white/40 mt-8 font-medium">
              Anytime. Anywhere.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Bridge Statement */}
      <Section className="bg-gradient-to-br from-accent-cream via-white to-accent-yellow/20">
        <div className="max-w-4xl mx-auto text-center">
          <FadeIn direction="up">
            <p className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold text-gray-800 leading-relaxed">
              Portland Fresh is building the bridge between convenience and well-being.
            </p>
          </FadeIn>
        </div>
      </Section>

      {/* Team */}
      {teamMembers && teamMembers.length > 0 && (
        <Section className="bg-gradient-to-b from-white via-accent-cream/30 to-white">
          <div className="max-w-5xl mx-auto">
            <FadeIn direction="up" className="text-center mb-16">
              <h2 className="font-heading text-4xl sm:text-5xl font-bold mb-4">
                The Team
              </h2>
              <p className="text-xl text-gray-600">The humans behind Portland Fresh</p>
            </FadeIn>
            <StaggerContainer staggerDelay={0.2} className="grid md:grid-cols-3 gap-12">
              {teamMembers.map((member: any) => (
                <div key={member._id} className="text-center group">
                  <FloatingElement yOffset={10} duration={5}>
                    {member.image ? (
                      <div className="relative w-48 h-48 mx-auto mb-6 rounded-full overflow-hidden shadow-xl group-hover:shadow-2xl transition-shadow duration-300 border-4 border-accent-yellow">
                        <Image
                          src={urlFor(member.image).url()}
                          alt={member.name}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                    ) : (
                      <div className="w-48 h-48 bg-gradient-to-br from-accent-yellow/30 to-accent-green/30 rounded-full mx-auto mb-6 flex items-center justify-center text-gray-400 shadow-xl border-4 border-accent-yellow">
                        <span className="text-6xl">👤</span>
                      </div>
                    )}
                  </FloatingElement>
                  <h3 className="font-heading text-2xl font-bold mb-2">{member.name}</h3>
                  {member.role && (
                    <p className="text-accent-primary font-semibold mb-4">{member.role}</p>
                  )}
                  {member.bio && (
                    <p className="text-gray-600 leading-relaxed">{member.bio}</p>
                  )}
                </div>
              ))}
            </StaggerContainer>
          </div>
        </Section>
      )}

      {/* Values */}
      {values && values.length > 0 && (
        <Section className="bg-gradient-to-br from-accent-yellow/20 via-accent-green/10 to-accent-cream/30 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-72 h-72 bg-accent-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent-yellow/10 rounded-full blur-3xl" />

          <div className="relative z-10 max-w-5xl mx-auto">
            <FadeIn direction="up" className="text-center mb-16">
              <h2 className="font-heading text-4xl sm:text-5xl font-bold mb-4">
                What We Stand For
              </h2>
              <div className="w-24 h-1 bg-accent-primary mx-auto mt-6" />
            </FadeIn>
            <StaggerContainer staggerDelay={0.15} className="grid md:grid-cols-3 gap-8">
              {values.map((value: any, idx: number) => (
                <div
                  key={idx}
                  className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 text-center border-2 border-transparent hover:border-accent-yellow"
                >
                  {value.emoji && (
                    <div className="text-6xl mb-6 transform group-hover:scale-110 transition-transform duration-300">
                      {value.emoji}
                    </div>
                  )}
                  <h3 className="font-heading text-xl font-bold mb-4 text-gray-900">
                    {value.title}
                  </h3>
                  <p className="text-base text-gray-600 leading-relaxed">
                    {value.description}
                  </p>
                </div>
              ))}
            </StaggerContainer>
          </div>
        </Section>
      )}

      {/* CTA */}
      <Section className="bg-gradient-to-b from-white to-accent-cream/30 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gradient-to-r from-accent-yellow/20 to-accent-green/20 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <FadeIn direction="up" delay={0.1}>
            <h2 className="font-heading text-4xl sm:text-5xl font-bold mb-6 leading-tight">
              Ready to feel the difference?
            </h2>
            <p className="text-xl text-gray-700 leading-relaxed mb-10 max-w-2xl mx-auto">
              Discover the sauce that matches your menu and finish every dish the way Portland cooks intended.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/blends"
                className="w-full sm:w-auto px-8 py-4 bg-accent-primary text-white rounded-full font-semibold text-lg hover:opacity-90 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Explore Our Sauces
              </Link>
              <Link
                href="/contact"
                className="w-full sm:w-auto px-8 py-4 border-2 border-accent-primary text-accent-primary rounded-full font-semibold text-lg hover:bg-accent-primary hover:text-white transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Get In Touch
              </Link>
            </div>
          </FadeIn>
        </div>
      </Section>

      {/* Contact */}
      <Section className="bg-white">
        <div className="max-w-2xl mx-auto text-center">
          <FadeIn direction="up">
            <h3 className="font-heading text-2xl font-bold mb-4">Questions?</h3>
            <p className="text-lg text-gray-600 mb-4">
              We&apos;d love to hear from you.
            </p>
            <a
              href="mailto:mikemontoya@montoyacapital.org"
              className="text-accent-primary hover:underline font-medium text-lg"
            >
              mikemontoya@montoyacapital.org
            </a>
          </FadeIn>
        </div>
      </Section>
    </>
  );
}
