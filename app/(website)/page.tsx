import Link from 'next/link';
import { Section } from '@/components/Section';
import { BlendsGrid } from '@/components/BlendsGrid';
import { FadeIn, StaggerContainer, ParallaxElement } from '@/components/animations';
import { NewsletterForm } from '@/components/NewsletterForm';
import { VideoHero } from '@/components/VideoHero';
import { getAllProducts } from '@/lib/supabase/queries/products';
import { logger } from '@/lib/logger';
import { Link2, Gift, Coins } from 'lucide-react';
import { SmoothImage } from '@/components/SmoothImage';

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

      {/* Value Props */}
      <Section className="bg-gradient-to-br from-accent-cream via-white to-accent-yellow/20">
        <StaggerContainer staggerDelay={0.15} className="grid md:grid-cols-3 gap-8">
          {valueProps.map((prop, idx) => {
            const borderColors = ['border-accent-yellow', 'border-accent-green', 'border-accent-primary'];

            return (
              <div
                key={idx}
                className={`group relative overflow-hidden rounded-2xl min-h-[300px] sm:min-h-[400px] flex items-end border-2 sm:border-4 ${borderColors[idx % 3]} hover:shadow-lg transition-shadow duration-300`}
              >
                {/* Background Image */}
                <div className="absolute inset-0">
                  <SmoothImage
                    src={prop.image}
                    alt={prop.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />

                {/* Content */}
                <div className="relative z-10 p-6 sm:p-8 text-white">
                  <h3 className="font-heading text-2xl sm:text-3xl font-bold mb-3 sm:mb-4 leading-tight">
                    {prop.title}
                  </h3>
                  <p className="text-white/90 text-base sm:text-lg leading-relaxed">
                    {prop.body}
                  </p>
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
                className="px-6 py-3 bg-accent-primary text-white rounded-lg font-semibold hover:bg-accent-primary/90 transition-colors inline-block"
              >
                Shop All Sauces
              </Link>
            </div>
          </div>
        </Section>
      )}

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
                          <SmoothImage
                            src={step.image}
                            alt={step.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 50vw"
                            quality={85}
                          />
                        </div>
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
                  <div className={`absolute ${positions[idx]} ${zIndexClasses[idx]} rounded-3xl shadow-2xl border-4 border-white overflow-hidden`}>
                    <SmoothImage
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
      <Section className="py-20 bg-gray-50">
        <FadeIn>
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-heading text-4xl md:text-5xl font-bold mb-6">
              Spread the Word. Taste Rewards.
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Refer friends to Portland Fresh and earn exclusive rewards. Get 15% off for every friend who makes their first purchase.
            </p>

            <div className="grid md:grid-cols-3 gap-6 mb-10">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="w-12 h-12 rounded-full bg-accent-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Link2 className="w-6 h-6 text-accent-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Share Your Link</h3>
                <p className="text-sm text-gray-600">Get your unique referral link and share it with friends</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="w-12 h-12 rounded-full bg-accent-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Gift className="w-6 h-6 text-accent-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">They Get 10% Off</h3>
                <p className="text-sm text-gray-600">Friends receive a welcome discount on their first order</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="w-12 h-12 rounded-full bg-accent-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Coins className="w-6 h-6 text-accent-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">You Get 15% Credit</h3>
                <p className="text-sm text-gray-600">Earn rewards after their first purchase</p>
              </div>
            </div>

            <Link
              href="/referral"
              className="inline-block px-8 py-4 bg-accent-primary text-white font-semibold rounded-lg hover:bg-accent-primary/90 transition-colors"
            >
              Learn More About Referrals
            </Link>
          </div>
        </FadeIn>
      </Section>
    </>
  );
}
