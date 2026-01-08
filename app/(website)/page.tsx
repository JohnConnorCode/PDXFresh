import Image from 'next/image';
import Link from 'next/link';
import { Section } from '@/components/Section';
import { BlendsGrid } from '@/components/BlendsGrid';
import { FadeIn, StaggerContainer, ParallaxElement } from '@/components/animations';
import { NewsletterForm } from '@/components/NewsletterForm';
import { VideoHero } from '@/components/VideoHero';
import { getAllProducts } from '@/lib/supabase/queries/products';
import { logger } from '@/lib/logger';

export const revalidate = 60;

// Hero content
const heroContent = {
  vimeoId: '335489274',
  heading: 'Dips & Sauces Made Fresh in Portland',
  subheading: 'Weekly batches of pesto, salsa, chimichurri, and zhug using organic produce from Oregon farms.',
  ctaText: 'Shop Sauces',
  ctaLink: '/blends',
  fallbackImage: '/portland-fresh-new-1.jpg',
  mobileImage: '/portland-fresh-new-2.jpg',
};

const sliderHighlights = [
  {
    title: 'Harvest-to-Jar in 48 Hours',
    body: 'We source basil, peppers, and aromatics from Portland growers and turn them into sauces while they are at peak flavor.',
  },
  {
    title: 'Neighborhood Delivery',
    body: 'Thursday pickups at our Buckman kitchen plus bike and electric-van delivery to SE, NE, and inner SW.',
  },
  {
    title: 'Seasonal Rotations',
    body: 'Menus change with the markets. Expect new pestos, salsa flights, and collaborations that sell out fast.',
  },
];

const valueProps = [
  {
    title: 'Farm Fresh Ingredients',
    body: 'We partner with local Oregon farms to bring you the freshest basil, peppers, and produce for our small-batch sauces.',
    image: '/portland-fresh-new-7.jpg',
  },
  {
    title: 'Made Weekly',
    body: 'Every batch is crafted fresh in our Buckman kitchen. No preservatives, no sitting on shelves for months.',
    image: '/portland-fresh-new-8.jpg',
  },
  {
    title: 'Portland Proud',
    body: 'From sourcing to delivery, we keep it local. Find us at New Seasons, farmers markets, and neighborhood drop-offs.',
    image: '/portland-fresh-new-9.jpg',
  },
];

const processSteps = [
  {
    title: 'Source Fresh',
    body: 'Every week starts with a trip to local farms and markets. We pick produce at peak ripeness for maximum flavor.',
    image: '/portland-fresh-new-7.jpg',
  },
  {
    title: 'Blend Small Batches',
    body: 'Our recipes are crafted by hand in small quantities. Quality over quantity, every single time.',
    image: '/portland-fresh-new-8.jpg',
  },
  {
    title: 'Deliver Fresh',
    body: 'From kitchen to your table within 48 hours. Pickup at our kitchen or neighborhood delivery across Portland.',
    image: '/portland-fresh-new-9.jpg',
  },
];

async function getProducts() {
  try {
    return await getAllProducts();
  } catch (error) {
    logger.error('Error fetching products:', error);
    return [];
  }
}

export default async function Home() {
  const allProducts = await getProducts();

  return (
    <>
      {/* Video Hero */}
      <VideoHero
        vimeoId={heroContent.vimeoId}
        heading={heroContent.heading}
        subheading={heroContent.subheading}
        ctaText={heroContent.ctaText}
        ctaLink={heroContent.ctaLink}
        fallbackImage={heroContent.fallbackImage}
        mobileImage={heroContent.mobileImage}
      />

      {/* Intro Section */}
      <Section className="-mt-12 sm:-mt-16 relative z-10 rounded-t-[2rem] sm:rounded-t-[3rem] bg-gradient-to-b from-white via-accent-cream/70 to-white shadow-xl shadow-accent-cream/50">
        <FadeIn direction="up" className="text-center max-w-3xl mx-auto mb-10">
          <p className="uppercase text-xs tracking-[0.4em] text-gray-500 mb-3">Rooted in the northwest</p>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Hand-harvested. Small-batch blended.
          </h2>
          <p className="text-base sm:text-lg text-gray-700">
            Portland Fresh is a sauce kitchen making pestos, salsa, chimichurri, and spreads for Portland tables.
          </p>
        </FadeIn>
        <div className="grid gap-6 md:grid-cols-3">
          {sliderHighlights.map((highlight, idx) => (
            <FadeIn
              key={highlight.title}
              direction="up"
              delay={idx * 0.1}
              className="rounded-2xl border border-white/70 bg-white/80 p-6 shadow-lg shadow-accent-cream/40 backdrop-blur-md"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-accent-primary/10 text-accent-primary font-semibold">
                {idx + 1}
              </div>
              <h3 className="font-heading text-xl text-gray-900 mb-2">{highlight.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{highlight.body}</p>
            </FadeIn>
          ))}
        </div>
      </Section>

      {/* Our Story */}
      <Section className="bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <FadeIn direction="up" className="space-y-6">
            <p className="text-sm uppercase tracking-[0.3em] text-gray-400">Our Story</p>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-gray-900">
              Crafting sauces for Portland since 2018
            </h2>
            <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
              The journey of Portland Fresh started long before our official launch in 2018. Owner Stew Joseph grew up in a
              family of chefs and sharpened his palate at an early age with his father. After a stint in the craft beer world,
              he followed a new dream—channeling that love of flavor, fresh ingredients, and community into a sauce kitchen for
              Portland, Oregon.
            </p>
            <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
              We believe food should do more than taste good—it should be real. No preservatives, no fillers, just flavor. That's why
              every batch uses organic produce sourced as locally as possible, olive oil instead of seed oils, and real citrus plus
              vinegar in place of sugar or shelf-stable shortcuts.
            </p>
            <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
              Our sauces are made in Buckman, delivered across the city, and stocked at New Seasons and Portland farmers markets. Fresh every
              week, crafted for everyone.
            </p>
          </FadeIn>

          <div className="grid md:grid-cols-5 gap-4 mt-12">
            {[
              'Made from local ingredients',
              'Prepared in Portland, Oregon',
              'Fresh every week',
              'Find us at New Seasons & markets',
              'Dips and sauces made fresh right here',
            ].map((badge) => (
              <FadeIn key={badge} direction="up" className="bg-gray-50 border border-gray-200 rounded-2xl px-4 py-6 shadow-sm">
                <p className="text-sm font-semibold text-gray-800">{badge}</p>
              </FadeIn>
            ))}
          </div>
        </div>
      </Section>

      {/* Kitchen Gallery */}
      <Section className="bg-white">
        <div className="max-w-6xl mx-auto">
          <FadeIn direction="up" className="text-center mb-10">
            <p className="text-sm uppercase tracking-[0.3em] text-gray-400">Inside the kitchen</p>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-gray-900">Fresh Batch Every Week</h2>
            <p className="text-base sm:text-lg text-gray-600">
              Every jar is blended, chilled, and packed by hand in our Buckman kitchen. Here's a look at the process.
            </p>
          </FadeIn>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { src: '/portland-fresh-new-7.jpg', alt: 'Fresh produce being prepped at Portland Fresh' },
              { src: '/portland-fresh-new-8.jpg', alt: 'Sauce being blended in the Portland Fresh kitchen' },
              { src: '/portland-fresh-new-9.jpg', alt: 'Finished sauces being portioned by hand' },
            ].map((image, idx) => (
              <FadeIn key={image.src} direction="up" delay={idx * 0.1}>
                <div className="relative h-72 rounded-3xl overflow-hidden shadow-xl">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                    priority={idx === 0}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </Section>

      {/* Value Props */}
      <Section className="bg-gradient-to-br from-accent-cream via-white to-accent-yellow/20">
        <StaggerContainer staggerDelay={0.15} className="grid md:grid-cols-3 gap-8">
          {valueProps.map((prop, idx) => {
            const borderColors = ['border-accent-yellow', 'border-accent-green', 'border-accent-primary'];

            return (
              <div
                key={idx}
                className={`group relative overflow-hidden rounded-2xl min-h-[300px] sm:min-h-[400px] flex items-end transition-all duration-500 hover:scale-105 hover:shadow-2xl border-2 sm:border-4 ${borderColors[idx % 3]} cursor-pointer`}
                style={{
                  transform: 'perspective(1000px)',
                }}
              >
                {/* Background Image */}
                <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-110">
                  <Image
                    src={prop.image}
                    alt={prop.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent group-hover:from-black/95 transition-all duration-500" />

                {/* Content */}
                <div className="relative z-10 p-6 sm:p-8 text-white transform transition-transform duration-500 group-hover:translate-y-0">
                  <h3 className="font-heading text-2xl sm:text-3xl font-bold mb-3 sm:mb-4 leading-tight">
                    {prop.title}
                  </h3>
                  <p className="text-white/90 text-base sm:text-lg leading-relaxed">
                    {prop.body}
                  </p>
                </div>

                {/* Decorative corner element */}
                <div className="absolute top-4 right-4 w-12 h-12 rounded-full bg-accent-yellow/20 backdrop-blur-sm flex items-center justify-center transition-all duration-500 group-hover:scale-125 group-hover:rotate-12">
                  <div className="w-6 h-6 rounded-full bg-accent-yellow" />
                </div>
              </div>
            );
          })}
        </StaggerContainer>
      </Section>

      {/* Our Sauces - All Products */}
      {allProducts && allProducts.length > 0 && (
        <Section className="bg-gradient-to-b from-white via-accent-green/10 to-white relative overflow-hidden">
          {/* Decorative organic shapes */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-accent-yellow/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent-green/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

          <div className="relative z-10">
            <FadeIn direction="up" className="text-center mb-12">
              <h2 className="font-heading text-4xl font-bold mb-4 leading-tight-90">
                Our Sauces
              </h2>
              <p className="text-lg text-muted">
                Small-batch pestos, salsas, chimichurri, and more. Made fresh weekly.
              </p>
            </FadeIn>
            <BlendsGrid blends={allProducts} showFilters={false} maxColumns={3} maxItems={12} />
            <div className="text-center mt-12">
              <p className="text-muted mb-4">
                Available in 7oz, 8oz, and 12oz jars
              </p>
              <p className="text-sm text-muted mb-6">
                Local pickup & delivery across Portland
              </p>
              <Link
                href="/blends"
                className="px-6 py-3 bg-accent-primary text-white rounded-full font-semibold hover:opacity-90 transition-opacity inline-block"
              >
                Shop All Sauces
              </Link>
            </div>
          </div>
        </Section>
      )}

      {/* Stats Section */}
      <Section className="bg-accent-primary text-white relative overflow-hidden">
        {/* Organic pattern overlay */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 border-2 border-accent-yellow rounded-full" />
          <div className="absolute bottom-10 right-10 w-80 h-80 border-2 border-accent-green rounded-full" />
        </div>

        <div className="relative z-10">
          <FadeIn direction="up" className="text-center mb-12">
            <h2 className="font-heading text-4xl font-bold text-white leading-tight-90">
              By the Numbers
            </h2>
          </FadeIn>
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {[
              { label: 'Portland Kitchens', value: '2,500+' },
              { label: 'Weekly Batches', value: '50+' },
              { label: 'Years Crafting', value: '6' },
              { label: 'Jars Filled', value: '100K+' },
            ].map((stat, idx) => (
              <FadeIn key={stat.label} direction="up" delay={idx * 0.1}>
                <div className="text-4xl font-heading font-bold mb-2">{stat.value}</div>
                <div className="text-white/80">{stat.label}</div>
              </FadeIn>
            ))}
          </div>
        </div>
      </Section>

      {/* Process */}
      <Section className="bg-accent-green/20 relative overflow-hidden !py-12 sm:!py-16">
        {/* Decorative organic shapes */}
        <div className="absolute top-20 right-0 w-96 h-96 bg-white/30 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-0 w-96 h-96 bg-accent-green/30 rounded-full blur-3xl" />

        <div className="relative z-10">
          <FadeIn direction="up" className="text-center mb-8">
            <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-3 leading-tight-90">
              How We Make It
            </h2>
            <p className="text-base sm:text-lg text-gray-700 max-w-2xl mx-auto leading-relaxed">
              From farm to jar in 48 hours. Here's how we keep it fresh.
            </p>
          </FadeIn>

          <div className="space-y-8 sm:space-y-10">
            {processSteps.map((step, idx) => {
              const isEven = idx % 2 === 0;
              const gradients = [
                'from-accent-yellow/20 to-accent-green/20',
                'from-accent-green/20 to-accent-primary/20',
                'from-accent-primary/20 to-accent-yellow/20',
              ];

              return (
                <div key={idx} className="relative">
                  <div className={`grid md:grid-cols-2 gap-6 items-center ${!isEven ? 'md:grid-flow-dense' : ''}`}>
                    {/* Content Side */}
                    <FadeIn
                      direction={isEven ? 'right' : 'left'}
                      delay={0.1}
                      className={`${!isEven ? 'md:col-start-2' : ''} relative z-10`}
                    >
                      <div className="space-y-3">
                        {/* Step Number Badge */}
                        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r ${gradients[idx % 3]} backdrop-blur-sm border-2 border-white shadow-md`}>
                          <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center">
                            <span className="font-heading text-base font-bold text-accent-primary">
                              {idx + 1}
                            </span>
                          </div>
                          <span className="font-semibold text-gray-800 text-xs uppercase tracking-wide">
                            Step {idx + 1}
                          </span>
                        </div>

                        {/* Title */}
                        <h3 className="font-heading text-xl sm:text-2xl font-bold text-gray-900 leading-tight">
                          {step.title}
                        </h3>

                        {/* Body */}
                        <p className="text-gray-700 leading-relaxed">
                          {step.body}
                        </p>

                        {/* Decorative line */}
                        <div className={`w-16 h-0.5 bg-gradient-to-r ${gradients[idx % 3]} rounded-full`} />
                      </div>
                    </FadeIn>

                    {/* Image Side with Parallax */}
                    <ParallaxElement speed={isEven ? 0.3 : -0.3}>
                      <FadeIn
                        direction={isEven ? 'left' : 'right'}
                        delay={0.2}
                        className="relative group"
                      >
                        {/* Main Image Container */}
                        <div className="relative h-[200px] sm:h-[240px] md:h-[280px] rounded-2xl overflow-hidden shadow-xl border-4 border-white">
                          <Image
                            src={step.image}
                            alt={step.title}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                            sizes="(max-width: 768px) 100vw, 50vw"
                            loading="eager"
                            quality={85}
                          />
                          {/* Gradient overlay on hover */}
                          <div className={`absolute inset-0 bg-gradient-to-br ${gradients[idx % 3]} opacity-0 group-hover:opacity-30 transition-opacity duration-500`} />
                        </div>

                        {/* Floating decorative element */}
                        <div className={`absolute ${isEven ? '-right-4 -bottom-4' : '-left-4 -bottom-4'} w-20 h-20 bg-gradient-to-br ${gradients[idx % 3]} rounded-full blur-xl opacity-60 group-hover:opacity-80 transition-opacity duration-500`} />
                      </FadeIn>
                    </ParallaxElement>
                  </div>

                  {/* Connecting line to next step */}
                  {idx < processSteps.length - 1 && (
                    <div className="hidden md:block absolute left-1/2 -translate-x-1/2 -bottom-16 z-0">
                      <div className="w-1 h-16 bg-gradient-to-b from-accent-primary/30 to-transparent" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </Section>

      {/* Community/Newsletter */}
      <Section className="bg-gradient-to-br from-accent-yellow/40 via-accent-green/20 to-accent-primary/30 relative min-h-[700px] overflow-hidden" id="newsletter">
        {/* Enhanced organic background shapes */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-accent-yellow/40 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-accent-green/40 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

        <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
          {/* Left Side - Content & Form */}
          <FadeIn direction="right" className="space-y-6">
            <div>
              <h2 className="font-heading text-4xl md:text-5xl font-bold mb-4 leading-tight">
                Get the Dispatch
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                Thursday menus, pickup windows, and collabs in your inbox before they hit Instagram. We share the farm stories, not spam.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed mt-2">
                Stay a step ahead on seasonal drops and members-only tastings.
              </p>
            </div>

            {/* Newsletter Form */}
            <div className="space-y-3">
              <NewsletterForm />
              <p className="text-sm text-gray-600">
                No spam. Just seasonal intel and first dibs.
              </p>
            </div>
          </FadeIn>

          {/* Right Side - Product Imagery */}
          <div className="relative h-[500px] hidden md:block">
            {[
              { src: '/portland-fresh-new-10.jpg', alt: 'Sauvie Basil Pesto tasting flight' },
              { src: '/portland-fresh-new-11.jpg', alt: 'Fire-roasted salsa prep at Portland Fresh' },
              { src: '/portland-fresh-new-12.jpg', alt: 'Neighborhood drop-off of sauces and pestos' },
            ].map((image, idx) => {
              const speeds = [0.7, 0.9, 1.1];
              const positions = [
                'top-32 left-1/2 -translate-x-1/2 w-56 h-80',
                'top-20 right-8 w-48 h-72',
                'top-44 left-4 w-44 h-64',
              ];
              const zIndexClasses = ['z-50', 'z-40', 'z-30'];

              return (
                <ParallaxElement key={idx} speed={speeds[idx]}>
                  <div className={`absolute ${positions[idx]} ${zIndexClasses[idx]} rounded-3xl shadow-2xl border-4 border-white overflow-hidden transform hover:scale-105 transition-transform duration-300`}>
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 0px, 250px"
                      priority={idx === 0}
                    />
                  </div>
                </ParallaxElement>
              );
            })}
          </div>
        </div>
      </Section>

      {/* Referral Program Section */}
      <Section className="py-20 bg-gradient-to-br from-accent-primary/5 to-accent-secondary/5">
        <FadeIn>
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-heading text-4xl md:text-5xl font-bold mb-6">
              Spread the Word. Taste Rewards.
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Refer friends to Portland Fresh and earn exclusive rewards. Get 15% off for every friend who makes their first purchase.
            </p>

            <div className="grid md:grid-cols-3 gap-6 mb-10">
              <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="text-3xl mb-3">🔗</div>
                <h3 className="font-semibold text-lg mb-2">Share Your Link</h3>
                <p className="text-sm text-gray-600">Get your unique referral link and share it with friends</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="text-3xl mb-3">🎁</div>
                <h3 className="font-semibold text-lg mb-2">They Get 10% Off</h3>
                <p className="text-sm text-gray-600">Friends receive a welcome discount on their first order</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="text-3xl mb-3">💰</div>
                <h3 className="font-semibold text-lg mb-2">You Get 15% Credit</h3>
                <p className="text-sm text-gray-600">Earn rewards after their first purchase</p>
              </div>
            </div>

            <Link
              href="/referral"
              className="inline-block px-8 py-4 bg-accent-primary text-white font-semibold rounded-full hover:bg-accent-dark transition-all shadow-lg hover:shadow-xl"
            >
              Learn More About Referrals
            </Link>
          </div>
        </FadeIn>
      </Section>
    </>
  );
}
