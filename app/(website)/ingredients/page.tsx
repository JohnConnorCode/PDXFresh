import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Section } from '@/components/Section';
import { FadeIn, StaggerContainer } from '@/components/animations';

export const metadata: Metadata = {
  title: 'Ingredients & Sourcing | Portland Fresh',
  description: 'Transparent sourcing from Oregon farms. Organic produce, olive oil, fresh citrus—no fillers or preservatives.',
};

// Hardcoded ingredient categories
const ingredientCategories = [
  {
    categoryName: 'Fresh Produce',
    color: 'text-accent-green',
    ingredients: ['Basil', 'Cilantro', 'Parsley', 'Jalapeños', 'Serranos', 'Tomatoes', 'Tomatillos', 'Garlic', 'Shallots', 'Lemons', 'Limes'],
  },
  {
    categoryName: 'Nuts & Seeds',
    color: 'text-accent-yellow',
    ingredients: ['Hazelnuts', 'Pine Nuts', 'Cashews', 'Pecans', 'Pumpkin Seeds'],
  },
  {
    categoryName: 'Oils & Acids',
    color: 'text-accent-primary',
    ingredients: ['Extra Virgin Olive Oil', 'Raw Apple Cider Vinegar', 'Fresh Lemon Juice', 'Fresh Lime Juice'],
  },
  {
    categoryName: 'Cheese & Seasonings',
    color: 'text-accent-green',
    ingredients: ['Parmigiano-Reggiano', 'Pecorino Romano', 'Sea Salt', 'Black Pepper', 'Cumin', 'Coriander'],
  },
];

// Hardcoded sourcing standards
const standards = [
  {
    title: 'Organic First',
    description: 'We prioritize certified organic produce. When organic isn\'t available locally, we choose spray-free from farmers we trust.',
    image: '/portland-fresh-new-7.jpg',
  },
  {
    title: 'Local When Possible',
    description: 'Basil from Sauvie Island, peppers from the Willamette Valley, hazelnuts from Oregon orchards. We source within 100 miles whenever the season allows.',
    image: '/portland-fresh-new-8.jpg',
  },
  {
    title: 'No Seed Oils',
    description: 'We use extra virgin olive oil exclusively. No canola, soybean, or vegetable oils. Ever.',
    image: '/portland-fresh-new-9.jpg',
  },
  {
    title: 'Fresh, Not Frozen',
    description: 'Our ingredients never see a freezer. We buy what we need for each week\'s batch and use it within days.',
    image: '/portland-fresh-new-11.jpg',
  },
];

const borderColors = ['border-accent-yellow', 'border-accent-primary', 'border-accent-green', 'border-accent-yellow'];

export default function IngredientsPage() {
  return (
    <>
      {/* Hero */}
      <Section className="py-24 relative overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <Image
            src="/portland-fresh-new-6.jpg"
            alt="Ingredients & Sourcing"
            fill
            className="object-cover scale-110 animate-ken-burns"
            priority
            quality={90}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-accent-primary/80 via-accent-green/70 to-accent-yellow/60" />
        </div>

        {/* Organic overlays for depth */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent-yellow/20 rounded-full blur-3xl -translate-y-1/3 translate-x-1/3 z-[1]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent-green/20 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3 z-[1]" />

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <FadeIn direction="up" delay={0.1}>
            <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-md">
              <svg className="w-5 h-5 text-accent-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm font-semibold text-accent-primary">From farm to jar</span>
            </div>
          </FadeIn>
          <FadeIn direction="up" delay={0.2}>
            <h1 className="font-heading text-5xl sm:text-6xl md:text-7xl font-bold mb-6 leading-tight text-white drop-shadow-lg">
              Ingredients & Sourcing
            </h1>
          </FadeIn>
          <FadeIn direction="up" delay={0.3}>
            <p className="text-xl sm:text-2xl text-white/95 leading-relaxed max-w-3xl mx-auto drop-shadow-md">
              Real ingredients from trusted growers. No preservatives, no fillers, no shortcuts.
            </p>
          </FadeIn>
        </div>
      </Section>

      {/* Philosophy */}
      <Section className="bg-white">
        <div className="max-w-4xl mx-auto">
          <FadeIn direction="up">
            <h2 className="font-heading text-4xl sm:text-5xl font-bold mb-8 text-center leading-tight">
              Our Sourcing Philosophy
            </h2>
            <p className="text-xl text-gray-600 leading-relaxed mb-6 text-center max-w-3xl mx-auto">
              We believe what goes in the jar matters as much as how it tastes.
            </p>
            <div className="prose prose-lg prose-headings:font-heading prose-headings:font-bold prose-p:text-gray-700 prose-p:text-lg prose-p:leading-relaxed max-w-none text-center">
              <p>
                Portland Fresh started because we couldn't find sauces made the way we'd make them at home—with real olive oil,
                fresh citrus, and produce you could trace back to a farm. So we built relationships with local growers and
                committed to transparency in everything we make.
              </p>
              <p>
                Every jar is batch-dated. Every ingredient is listed. If you want to know where your basil came from, just ask.
              </p>
            </div>
          </FadeIn>
        </div>
      </Section>

      {/* Our Standards */}
      <Section className="bg-gradient-to-b from-accent-cream/30 to-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent-green/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent-yellow/10 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-6xl mx-auto">
          <FadeIn direction="up" className="text-center mb-12">
            <h2 className="font-heading text-4xl sm:text-5xl font-bold mb-4 leading-tight">
              Our Standards
            </h2>
            <p className="text-xl text-gray-600">Every ingredient meets these criteria</p>
          </FadeIn>
          <StaggerContainer staggerDelay={0.1} className="grid md:grid-cols-2 gap-8">
            {standards.map((standard, idx) => (
              <div
                key={standard.title}
                className={`group relative overflow-hidden rounded-2xl min-h-[300px] flex items-end transition-all duration-500 hover:scale-105 hover:shadow-2xl border-4 ${borderColors[idx % borderColors.length]} cursor-pointer`}
              >
                <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-110">
                  <Image
                    src={standard.image}
                    alt={standard.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />

                {/* Certification badge */}
                <div className="absolute top-6 right-6 w-16 h-16 rounded-full bg-accent-yellow flex items-center justify-center shadow-lg z-10 group-hover:scale-110 transition-transform">
                  <svg className="w-8 h-8 text-accent-primary" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>

                <div className="relative z-10 p-8 w-full">
                  <h3 className="font-heading text-3xl font-bold mb-4 text-white">
                    {standard.title}
                  </h3>
                  <p className="text-white/90 leading-relaxed">
                    {standard.description}
                  </p>
                </div>
              </div>
            ))}
          </StaggerContainer>
        </div>
      </Section>

      {/* Ingredient Spotlight */}
      <Section className="bg-white">
        <div className="max-w-5xl mx-auto">
          <FadeIn direction="up" className="text-center mb-12">
            <h2 className="font-heading text-4xl sm:text-5xl font-bold mb-4 leading-tight">
              What Goes Into Our Sauces
            </h2>
            <p className="text-xl text-gray-600">Real ingredients, nothing artificial</p>
          </FadeIn>

          <StaggerContainer staggerDelay={0.1} className="space-y-12">
            {ingredientCategories.map((category) => (
              <div key={category.categoryName}>
                <h3 className={`font-heading text-3xl font-bold mb-6 ${category.color}`}>
                  {category.categoryName}
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {category.ingredients.map((ingredient) => (
                    <div
                      key={ingredient}
                      className="group border-2 border-gray-200 rounded-2xl p-5 text-center hover:border-accent-yellow hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-white to-accent-cream/20"
                    >
                      <p className="font-heading font-bold text-lg text-gray-900 group-hover:text-accent-primary transition-colors">
                        {ingredient}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </StaggerContainer>

          <FadeIn direction="up" delay={0.3} className="mt-12">
            <div className="p-8 bg-gradient-to-br from-accent-yellow/10 to-accent-green/10 rounded-2xl text-center border-2 border-accent-yellow/30">
              <p className="text-lg text-gray-700 leading-relaxed">
                <strong className="text-accent-primary">That's it.</strong> No gums, no emulsifiers, no "natural flavors." Just real food that you can pronounce and recognize.
              </p>
            </div>
          </FadeIn>
        </div>
      </Section>

      {/* Farm Partners */}
      <Section className="bg-gradient-to-b from-white to-accent-cream/30 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-gradient-to-r from-accent-yellow/20 to-accent-green/20 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <FadeIn direction="up">
            <h2 className="font-heading text-4xl sm:text-5xl font-bold mb-6 leading-tight">
              Work With Us
            </h2>
            <p className="text-xl text-gray-700 leading-relaxed mb-8">
              Are you a local farm growing herbs, peppers, or produce? We're always looking for new partners who share our standards.
            </p>
            <Link
              href="mailto:hello@pdxfreshfoods.com?subject=Farm Partnership Inquiry"
              className="inline-block px-8 py-4 bg-accent-primary text-white rounded-full font-semibold text-lg hover:opacity-90 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Get In Touch
            </Link>
          </FadeIn>
        </div>
      </Section>

      {/* Transparency Note */}
      <Section className="bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <FadeIn direction="up">
            <div className="bg-gradient-to-br from-accent-yellow/10 to-accent-green/10 p-12 rounded-2xl border-2 border-accent-yellow/30">
              <h2 className="font-heading text-3xl font-bold mb-4">
                Full Transparency
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-8">
                Every jar is batch-dated and traceable. Want to know exactly where your pesto basil came from?
                Email us with your batch number and we'll tell you the farm, the harvest date, and the weather that week.
              </p>
              <a
                href="mailto:hello@pdxfreshfoods.com"
                className="inline-block px-8 py-4 bg-accent-primary text-white rounded-full font-semibold text-lg hover:opacity-90 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Ask About Your Batch
              </a>
            </div>
          </FadeIn>
        </div>
      </Section>
    </>
  );
}
